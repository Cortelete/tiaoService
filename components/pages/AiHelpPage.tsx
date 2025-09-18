
import React, { useState, useMemo } from 'react';
import type { User, AiHelpResponse } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { SparklesIcon, ShieldCheckIcon } from '../icons';
import { ProfessionalCard } from '../ProfessionalCard';
// Fix: Import BackButton to enable back navigation.
import { BackButton } from '../BackButton';

interface AiHelpPageProps {
  onAiHelpRequest: (problemDescription: string) => Promise<AiHelpResponse>;
  professionals: User[];
  onViewProfessional: (professional: User) => void;
  // Fix: Add onBack prop to handle navigation.
  onBack: () => void;
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

// Fix: Destructure onBack prop to use it.
export const AiHelpPage: React.FC<AiHelpPageProps> = ({ onAiHelpRequest, professionals, onViewProfessional, onBack }) => {
  const [problem, setProblem] = useState('');
  const [aiResponse, setAiResponse] = useState<AiHelpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const recommendedProfessional = useMemo(() => {
    if (!aiResponse?.recommend_professional || !aiResponse.recommended_category) {
      return null;
    }
    const categoryProfessionals = professionals
      // Fix: Property 'service' does not exist on type 'User'. Changed to 'services' and used .includes() to check if the category is in the array.
      .filter(p => p.services?.includes(aiResponse.recommended_category!))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    return categoryProfessionals.length > 0 ? categoryProfessionals[0] : null;
  }, [aiResponse, professionals]);

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
    <div className="max-w-4xl mx-auto">
      {/* Fix: Add BackButton for navigation. */}
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

      <div className="mt-10">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
        {aiResponse && (
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Análise da IA do Tião</h2>
            
            {aiResponse.is_diy && aiResponse.solution_steps && (
              <div>
                <h3 className="text-xl font-semibold text-green-700">Solução "Faça Você Mesmo":</h3>
                <ol className="mt-3 list-decimal list-inside space-y-2 text-gray-700">
                  {aiResponse.solution_steps.map(step => <li key={step.step}><strong>Passo {step.step}:</strong> {step.description}</li>)}
                </ol>
              </div>
            )}

            {aiResponse.recommend_professional && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-orange-700">Recomendação de Profissional:</h3>
                    <p className="mt-2 text-gray-700">{aiResponse.professional_reasoning}</p>
                    {recommendedProfessional ? (
                        <div className="mt-6">
                             <div className="flex items-center gap-2 mb-4">
                                <SparklesIcon className="w-6 h-6 text-orange-500" />
                                <h4 className="text-lg font-bold">A IA Recomenda:</h4>
                            </div>
                            <div className="max-w-sm mx-auto">
                                <ProfessionalCard professional={recommendedProfessional} onViewDetails={() => onViewProfessional(recommendedProfessional)} />
                            </div>
                        </div>
                    ) : (
                        <p className="mt-4 text-center bg-yellow-50 p-4 rounded-lg text-yellow-800">
                            Não encontramos um profissional de "{aiResponse.recommended_category}" com nota alta no momento, mas você pode procurar na nossa lista!
                        </p>
                    )}
                </div>
            )}
            
            {aiResponse.disclaimer && (
                <div className="mt-8 p-4 bg-gray-100 border-l-4 border-gray-400 text-gray-600 rounded-r-lg flex items-start gap-3">
                    <ShieldCheckIcon className="w-8 h-8 flex-shrink-0 text-gray-500"/>
                    <div>
                        <h4 className="font-bold">Aviso de Segurança</h4>
                        <p className="text-sm">{aiResponse.disclaimer}</p>
                    </div>
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
