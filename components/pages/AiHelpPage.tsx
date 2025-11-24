
import React, { useState, useMemo, useEffect } from 'react';
import type { User, AiHelpResponse } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { SparklesIcon, ShieldCheckIcon, MapPinIcon, BriefcaseIcon } from '../icons';
import { ProfessionalCard } from '../ProfessionalCard';
import { BackButton } from '../BackButton';
import { VoiceInput } from '../VoiceInput';

interface AiHelpPageProps {
  onAiHelpRequest: (problemDescription: string) => Promise<AiHelpResponse>;
  professionals: User[];
  onViewProfessional: (professional: User) => void;
  onBack: () => void;
  initialQuery?: string;
  onEmergencyDetected: (initialText: string) => void;
}

// Helper function to calculate distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; 
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; 
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

function extractPrice(description?: string): number {
    if (!description) return 99999;
    const match = description.match(/\d+/);
    return match ? parseInt(match[0], 10) : 99999;
}

const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center gap-6 py-16">
        <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-xl animate-pulse opacity-60"></div>
             <div className="relative bg-white p-4 rounded-full shadow-2xl">
                 <svg className="animate-spin h-12 w-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </div>
        </div>
        <p className="text-xl font-bold text-slate-700 animate-pulse tracking-wide">A Mia está analisando...</p>
    </div>
);

export const AiHelpPage: React.FC<AiHelpPageProps> = ({ onAiHelpRequest, professionals, onViewProfessional, onBack, initialQuery, onEmergencyDetected }) => {
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
    if (!aiResponse?.recommend_professional || !aiResponse.recommended_categories || aiResponse.recommended_categories.length === 0) {
      return [];
    }

    const targetCategories = aiResponse.recommended_categories;

    let relevantProfessionals = professionals.filter(p => 
        p.services?.some(service => targetCategories.includes(service))
    );

    const professionalsWithDistance = relevantProfessionals.map(p => {
         if (userLocation && p.latitude && p.longitude) {
            return { ...p, distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude) };
         }
         return p;
    });

    if (professionalsWithDistance.length === 0) return [];

    const results: { type: string, color: string, data: any }[] = [];
    const usedIds = new Set<number>();

    const sortedByRating = [...professionalsWithDistance].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const bestRated = sortedByRating[0];
    if (bestRated) {
        results.push({ type: '🏆 Melhor Avaliação', color: 'bg-yellow-500', data: bestRated });
        usedIds.add(bestRated.id);
    }

    const sortedByPrice = [...professionalsWithDistance]
        .filter(p => !usedIds.has(p.id))
        .sort((a, b) => extractPrice(a.pricing?.description) - extractPrice(b.pricing?.description));
    
    const bestPrice = sortedByPrice[0];
    if (bestPrice) {
         results.push({ type: '💰 Melhor Preço', color: 'bg-emerald-600', data: bestPrice });
         usedIds.add(bestPrice.id);
    }

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
      if (response.is_emergency) {
          onEmergencyDetected(problem);
      }
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
      <div className="text-center mb-12">
        <div className="inline-flex justify-center items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg shadow-orange-500/10 mb-6 border border-white">
          <SparklesIcon className="w-6 h-6 text-orange-500" />
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
            MIAjuda
          </h1>
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Como podemos te <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">ajudar hoje?</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Descreva seu problema. Nossa IA encontrará a solução ideal.
        </p>
         {!userLocation && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-bold shadow-sm">
                <MapPinIcon className="w-4 h-4 text-orange-500"/>
                Ative a localização para recomendações precisas
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/60 relative max-w-4xl mx-auto z-10">
        <div className="relative">
            <textarea
                id="problem-description"
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full p-8 text-xl text-slate-700 bg-slate-50 rounded-[2rem] focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all placeholder-slate-400 resize-none font-medium"
                placeholder="Ex: Minha pia da cozinha está entupida e a água não desce..."
                disabled={isLoading}
            />
            
            <div className="flex justify-between items-center px-6 py-4">
                 <div className="flex items-center gap-2">
                    <VoiceInput onTranscript={(text) => setProblem(prev => prev + (prev ? ' ' : '') + text)} disabled={isLoading} className="!w-12 !h-12 !bg-slate-100 hover:!bg-orange-100 !text-slate-600 hover:!text-orange-600"/>
                 </div>
                 <AnimatedButton onClick={() => {}} className="!px-10 !py-4 !rounded-full !text-lg shadow-orange-500/30" disabled={isLoading}>
                    {isLoading ? 'Analisando...' : 'Obter Ajuda ✨'}
                </AnimatedButton>
            </div>
        </div>
      </form>

      <div className="mt-16 pb-12">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-center text-red-600 bg-red-50 p-6 rounded-2xl border border-red-100 font-medium">{error}</p>}
        {aiResponse && (
          <div className={`bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 animate-fade-in-up border border-slate-100 ${aiResponse.is_emergency ? 'ring-4 ring-red-500/20 border-red-500' : ''}`}>
            
             {aiResponse.is_emergency && (
                 <div className="mb-10 bg-red-50 border border-red-200 text-red-800 p-8 rounded-3xl shadow-sm">
                     <div className="flex items-center gap-4 mb-4">
                         <div className="p-3 bg-white rounded-full shadow-md"><ShieldCheckIcon className="w-10 h-10 text-red-600" /></div>
                         <h3 className="text-3xl font-extrabold tracking-tight">Possível Emergência</h3>
                     </div>
                     <p className="font-medium mb-8 text-lg opacity-90">Situações de risco exigem ação imediata. Use os canais oficiais abaixo:</p>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                         <a href="tel:193" className="bg-white border-2 border-transparent hover:border-red-200 text-red-700 font-bold py-6 px-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-md transform hover:-translate-y-1 block group">
                            <span className="text-4xl block mb-2 font-extrabold">193</span>Bombeiros<br/>
                            <span className="text-xs font-normal opacity-70 group-hover:text-white uppercase tracking-wider">Incêndio/Resgate</span>
                         </a>
                         <a href="tel:192" className="bg-white border-2 border-transparent hover:border-red-200 text-red-700 font-bold py-6 px-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-md transform hover:-translate-y-1 block group">
                             <span className="text-4xl block mb-2 font-extrabold">192</span>SAMU<br/>
                             <span className="text-xs font-normal opacity-70 group-hover:text-white uppercase tracking-wider">Ambulância</span>
                         </a>
                         <a href="tel:190" className="bg-white border-2 border-transparent hover:border-red-200 text-red-700 font-bold py-6 px-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-md transform hover:-translate-y-1 block group">
                             <span className="text-4xl block mb-2 font-extrabold">190</span>Polícia<br/>
                             <span className="text-xs font-normal opacity-70 group-hover:text-white uppercase tracking-wider">Crime/Risco</span>
                         </a>
                         <a href="tel:197" className="bg-white border-2 border-transparent hover:border-red-200 text-red-700 font-bold py-6 px-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-md transform hover:-translate-y-1 block group">
                             <span className="text-4xl block mb-2 font-extrabold">197</span>Civil<br/>
                             <span className="text-xs font-normal opacity-70 group-hover:text-white uppercase tracking-wider">Denúncias</span>
                         </a>
                     </div>
                 </div>
             )}

            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-100 rounded-xl">
                    <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Análise Inteligente</h2>
            </div>
            
            {aiResponse.disclaimer && (
                <div className={`mb-10 p-6 border-l-4 rounded-r-2xl flex items-start gap-5 shadow-sm ${aiResponse.is_emergency ? 'bg-red-50 border-red-500 text-red-900' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                    <ShieldCheckIcon className={`w-6 h-6 flex-shrink-0 mt-1 ${aiResponse.is_emergency ? 'text-red-600' : 'text-slate-500'}`}/>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Nota Importante</h4>
                        <p className="text-base leading-relaxed opacity-90">{aiResponse.disclaimer}</p>
                    </div>
                </div>
            )}
            
            {aiResponse.is_diy && aiResponse.solution_steps && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
                    <span className="text-2xl">🛠️</span> Solução "Faça Você Mesmo"
                </h3>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8">
                    <ol className="space-y-6">
                    {aiResponse.solution_steps.map((step, idx) => (
                        <li key={step.step} className="flex gap-5">
                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 font-extrabold flex items-center justify-center text-lg shadow-sm">{step.step}</span>
                            <p className="text-slate-700 mt-1.5 text-lg leading-relaxed">{step.description}</p>
                        </li>
                    ))}
                    </ol>
                </div>
              </div>
            )}

            {aiResponse.recommend_professional && (
                <div className="mt-10 border-t border-slate-100 pt-10">
                    <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl border border-orange-100/50 mb-10 shadow-sm">
                         <h3 className="text-xl font-bold text-orange-900 mb-3">Por que contratar um profissional?</h3>
                         <p className="text-slate-700 leading-relaxed italic text-lg opacity-80">"{aiResponse.professional_reasoning}"</p>
                    </div>
                    
                    {recommendedProfessionals.length > 0 ? (
                        <div>
                             <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                                <div>
                                    <h4 className="text-3xl font-extrabold text-slate-800 tracking-tight">Profissionais Recomendados</h4>
                                    <p className="text-slate-500 mt-1 font-medium">Selecionados com base na sua necessidade.</p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-full text-sm font-bold text-slate-600 border border-slate-200">
                                    <BriefcaseIcon className="w-5 h-5" />
                                    Categorias: <span className="text-slate-900">{aiResponse.recommended_categories.join(', ')}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className="mt-4 text-center bg-slate-50 p-10 rounded-3xl border border-slate-200 border-dashed">
                             <p className="text-slate-500 mb-2 font-medium">Ops, não encontramos ninguém exatamente agora.</p>
                             <p className="text-slate-800 font-bold text-lg">
                                A IA recomendou profissionais de <span className="text-orange-600">{aiResponse.recommended_categories.join(' ou ')}</span>.
                            </p>
                        </div>
                    )}
                </div>
            )}
          </div>
        )}
      </div>
       <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
    </div>
  );
};
