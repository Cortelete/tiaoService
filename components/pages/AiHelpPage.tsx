
import React, { useState, useMemo, useEffect } from 'react';
import type { User, AiHelpResponse } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { SparklesIcon, ShieldCheckIcon, MapPinIcon, BriefcaseIcon } from '../icons';
import { ProfessionalCard } from '../ProfessionalCard';
import { BackButton } from '../BackButton';

interface AiHelpPageProps {
  onAiHelpRequest: (problemDescription: string) => Promise<AiHelpResponse>;
  professionals: User[];
  onViewProfessional: (professional: User) => void;
  onBack: () => void;
  initialQuery?: string;
}

// Helper function to calculate distance (duplicated from FindProfessionalsPage for isolation)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

// Helper to extract numeric price from description string
function extractPrice(description?: string): number {
    if (!description) return 99999;
    const match = description.match(/\d+/);
    return match ? parseInt(match[0], 10) : 99999;
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center gap-3 text-lg font-semibold text-gray-600">
        <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Analisando seu problema...
    </div>
);

export const AiHelpPage: React.FC<AiHelpPageProps> = ({ onAiHelpRequest, professionals, onViewProfessional, onBack, initialQuery }) => {
  const [problem, setProblem] = useState('');
  const [aiResponse, setAiResponse] = useState<AiHelpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (initialQuery) {
        setProblem(initialQuery);
    }
  }, [initialQuery]);

  // Request location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Geo permission denied or error", error)
      );
    }
  }, []);


  const recommendedProfessionals = useMemo(() => {
    if (!aiResponse?.recommend_professional || !aiResponse.recommended_category) {
      return [];
    }

    const targetCategory = aiResponse.recommended_category;

    // 1. STRICT FILTER: Only consider professionals who perform the specific service.
    // This ensures relevance is the primary factor.
    let relevantProfessionals = professionals
      .filter(p => p.services?.includes(targetCategory));

    // Calculate distances for the relevant subset
    const professionalsWithDistance = relevantProfessionals.map(p => {
         if (userLocation && p.latitude && p.longitude) {
            return { ...p, distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude) };
         }
         return p;
    });

    if (professionalsWithDistance.length === 0) return [];

    // Strategy: Pick 3 distinct professionals FROM THE RELEVANT SUBSET
    // 1. Best Rated
    // 2. Best Price (lowest number in string)
    // 3. Nearest (if location available)

    const results: { type: string, color: string, data: any }[] = [];
    const usedIds = new Set<number>();

    // 1. Best Rated (Strictly relevant)
    const sortedByRating = [...professionalsWithDistance].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const bestRated = sortedByRating[0];
    if (bestRated) {
        results.push({ type: '🏆 Melhor Avaliação', color: 'bg-yellow-500', data: bestRated });
        usedIds.add(bestRated.id);
    }

    // 2. Best Price (Strictly relevant, exclude already selected)
    const sortedByPrice = [...professionalsWithDistance]
        .filter(p => !usedIds.has(p.id))
        .sort((a, b) => extractPrice(a.pricing?.description) - extractPrice(b.pricing?.description));
    
    const bestPrice = sortedByPrice[0];
    if (bestPrice) {
         results.push({ type: '💰 Melhor Preço', color: 'bg-green-600', data: bestPrice });
         usedIds.add(bestPrice.id);
    }

    // 3. Nearest (Strictly relevant, exclude already selected) - Only if we have location
    if (userLocation) {
        const sortedByDist = [...professionalsWithDistance]
             .filter(p => !usedIds.has(p.id) && (p as any).distance !== undefined)
             .sort((a: any, b: any) => a.distance - b.distance);
        
        const nearest = sortedByDist[0];
        if (nearest) {
            results.push({ type: '📍 Mais Perto', color: 'bg-blue-500', data: nearest });
            usedIds.add(nearest.id);
        }
    } else {
        // Fallback: If no location, or "Nearest" was already picked by Best Rated/Price, 
        // pick the next best rated relevant pro.
        const nextBest = sortedByRating.find(p => !usedIds.has(p.id));
        if (nextBest) {
             results.push({ type: '🌟 Recomendado', color: 'bg-orange-500', data: nextBest });
             usedIds.add(nextBest.id);
        }
    }

    return results;

  }, [aiResponse, professionals, userLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setAiResponse(null);

    try {
      const response = await onAiHelpRequest(problem);
      setAiResponse(response);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao consultar a IA. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton onClick={onBack} />
      <div className="text-center">
        <div className="flex justify-center items-center gap-3">
          <SparklesIcon className="w-10 h-10 text-orange-500" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            IA me Ajuda
          </h1>
        </div>
        <p className="mt-4 text-lg text-gray-600">
          Descreva seu problema e nossa inteligência artificial irá te ajudar a encontrar uma solução ou o profissional certo para o trabalho.
        </p>
         {!userLocation && (
            <p className="mt-2 text-sm text-orange-600 flex justify-center items-center gap-1">
                <MapPinIcon className="w-4 h-4"/>
                Ative a localização do navegador para ver profissionais próximos!
            </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-10 bg-white p-6 rounded-2xl shadow-lg">
        <label htmlFor="problem-description" className="text-lg font-bold text-gray-700 block mb-2">Qual é o seu problema?</label>
        <textarea
          id="problem-description"
          rows={5}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full p-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          placeholder="Ex: Minha pia da cozinha está entupida e a água não desce de jeito nenhum."
          disabled={isLoading}
        />
        <div className="mt-4 text-right">
          <AnimatedButton onClick={() => {}} className="!px-8 !py-3 text-lg" disabled={isLoading}>
            {isLoading ? 'Analisando...' : 'Obter Ajuda'}
          </AnimatedButton>
        </div>
      </form>

      <div className="mt-10 pb-10">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
        {aiResponse && (
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Análise da IA do Tião</h2>
            
            {/* Safety Disclaimer */}
            {aiResponse.disclaimer && (
                <div className="mb-6 p-4 bg-gray-100 border-l-4 border-gray-400 text-gray-600 rounded-r-lg flex items-start gap-3">
                    <ShieldCheckIcon className="w-8 h-8 flex-shrink-0 text-gray-500"/>
                    <div>
                        <h4 className="font-bold">Aviso de Segurança</h4>
                        <p className="text-sm">{aiResponse.disclaimer}</p>
                    </div>
                </div>
            )}
            
            {aiResponse.is_diy && aiResponse.solution_steps && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-green-700">Solução "Faça Você Mesmo":</h3>
                <ol className="mt-3 list-decimal list-inside space-y-2 text-gray-700 bg-green-50 p-4 rounded-lg">
                  {aiResponse.solution_steps.map(step => <li key={step.step}><strong>Passo {step.step}:</strong> {step.description}</li>)}
                </ol>
              </div>
            )}

            {aiResponse.recommend_professional && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-xl font-semibold text-orange-700 mb-2">Recomendação de Profissional:</h3>
                    <p className="mb-6 text-gray-700 italic">"{aiResponse.professional_reasoning}"</p>
                    
                    {recommendedProfessionals.length > 0 ? (
                        <div>
                             <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <SparklesIcon className="w-6 h-6 text-orange-500" />
                                    <h4 className="text-lg font-bold text-gray-800">Melhores opções para você:</h4>
                                </div>
                                <span className="hidden sm:block text-gray-400">|</span>
                                <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                                    <BriefcaseIcon className="w-4 h-4" />
                                    Categoria: <span className="text-orange-600">{aiResponse.recommended_category}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendedProfessionals.map((item, idx) => (
                                    <ProfessionalCard 
                                        key={item.data.id} 
                                        professional={item.data} 
                                        distance={(item.data as any).distance}
                                        highlightBadge={item.type}
                                        highlightColor={item.color}
                                        onViewDetails={() => onViewProfessional(item.data)} 
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-center bg-yellow-50 p-4 rounded-lg text-yellow-800">
                            A IA recomendou um profissional de <strong>{aiResponse.recommended_category}</strong>, mas não encontramos ninguém com esse perfil exato disponível na sua região ou lista de testes no momento.
                        </p>
                    )}
                </div>
            )}
          </div>
        )}
      </div>
       <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
