
import React, { useState } from 'react';
import type { User, ServiceCategory } from '../../types';
import { ServiceCategoryCard } from '../ServiceCategoryCard';
import { SparklesIcon } from '../icons';
import { VoiceInput } from '../VoiceInput';

interface HomePageProps {
  onSelectCategory: (category: string) => void;
  categories: ServiceCategory[];
  currentUser: User | null;
  onAiSearch: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectCategory, categories, currentUser, onAiSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        onAiSearch(searchQuery);
    }
  };

  const handleVoiceTranscript = (text: string) => {
      setSearchQuery(text);
      // Optional: auto-submit on voice result? Let's keep it manual for user confirmation
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
        O serviço que você precisa,
      </h1>
      <h2 className="mt-2 md:mt-4 text-3xl md:text-5xl font-bold animated-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
        na palma da sua mão.
      </h2>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
        Encontre os melhores profissionais locais de forma rápida, segura e com a confiança que só o TiãoService oferece.
      </p>

      {/* AI Search Bar - Only for logged users */}
      {currentUser && (
        <div className="mt-10 max-w-3xl mx-auto px-4 animate-fade-in-up">
            <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative flex items-center bg-white rounded-full shadow-xl border border-gray-100 p-1 md:p-2 gap-2">
                    <div className="pl-3 md:pl-4 text-orange-500">
                        <SparklesIcon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ex: Minha pia está vazando..." 
                        className="flex-grow p-2 md:p-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base md:text-lg min-w-0"
                    />
                    
                    <VoiceInput onTranscript={handleVoiceTranscript} className="mr-1"/>

                    <button 
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95 whitespace-nowrap text-sm md:text-base flex items-center gap-1"
                    >
                        MIAjuda ✨
                    </button>
                </div>
            </form>
            <p className="mt-3 text-xs md:text-sm text-gray-500">
                ✨ Descreva seu problema e a <b>Mia</b> encontrará a solução ideal.
            </p>
        </div>
      )}

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-700">Explore por categoria</h3>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <ServiceCategoryCard 
              key={category.name} 
              category={category} 
              onClick={() => onSelectCategory(category.name)} 
            />
          ))}
        </div>
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
