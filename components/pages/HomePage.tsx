
import React, { useState } from 'react';
import type { User, ServiceCategory, FeatureContent } from '../../types';
import { ServiceCategoryCard } from '../ServiceCategoryCard';
import { SparklesIcon, ShieldCheckIcon, BoltIcon, StarIcon, ChevronRightIcon } from '../icons';
import { VoiceInput } from '../VoiceInput';

interface HomePageProps {
  onSelectCategory: (category: string) => void;
  categories: ServiceCategory[];
  currentUser: User | null;
  onAiSearch: (query: string) => void;
  onShowFeature: (feature: FeatureContent) => void;
  onJoinInvitation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectCategory, categories, currentUser, onAiSearch, onShowFeature, onJoinInvitation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        onAiSearch(searchQuery);
    }
  };

  const handleVoiceTranscript = (text: string) => {
      setSearchQuery(text);
  };
  
  // -- LOGGED IN VIEW (Classic / Functional) --
  if (currentUser) {
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

          {/* AI Search Bar */}
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
  }

  // -- LANDING PAGE VIEW (Luxurious / Guest) --
  // Selecting 3 specific categories for the preview
  const showcaseCategories = categories.filter(c => ['Marceneiro', 'Eletricista', 'Diarista'].includes(c.name));

  const features: FeatureContent[] = [
      { 
          title: "Segurança Impecável", 
          description: "Todos os profissionais passam por um rigoroso processo de verificação de antecedentes e qualificação. Sua paz de espírito é nossa prioridade absoluta.", 
          icon: ShieldCheckIcon 
      },
      { 
          title: "Atendimento Express", 
          description: "Nossa tecnologia de geolocalização conecta você ao especialista disponível mais próximo em segundos. O tempo é o seu bem mais precioso.", 
          icon: BoltIcon 
      },
      { 
          title: "Qualidade Premium", 
          description: "Sistema de avaliação transparente e garantia de serviço. Só trabalhamos com quem realmente entrega excelência.", 
          icon: StarIcon 
      }
  ];

  return (
    <div className="relative -mt-8 md:-mt-12 -mx-4 md:mx-0 overflow-hidden">
        {/* Dark Premium Background */}
        <div className="absolute inset-0 bg-slate-900 z-0">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="relative z-10 px-4 py-20 md:py-32 flex flex-col items-center text-center">
            
            {/* Hero Section */}
            <div className="animate-fade-in-up">
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-orange-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
                    A Nova Era de Serviços
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
                    Excelência ao <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-200">seu alcance.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                    Conectamos você à elite dos profissionais de serviço. 
                    <br className="hidden md:block" /> Uma experiência fluida, segura e transformadora para sua casa ou empresa.
                </p>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={onJoinInvitation}
                        className="px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Começar Agora
                    </button>
                    <button 
                         onClick={() => onShowFeature(features[0])}
                         className="px-8 py-4 bg-transparent border border-white/30 text-white font-semibold text-lg rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                    >
                        Conhecer o Padrão
                    </button>
                </div>
            </div>

            {/* Interactive Feature Pills */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                        <button 
                            key={idx}
                            onClick={() => onShowFeature(feature)}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-500 text-left backdrop-blur-md"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Icon className="w-6 h-6 text-orange-400" />
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Clique para saber mais</p>
                        </button>
                    )
                })}
            </div>

            {/* Curated Categories Preview */}
            <div className="mt-32 w-full max-w-6xl">
                <div className="flex items-end justify-between mb-10 px-4">
                    <div className="text-left">
                        <h3 className="text-3xl font-bold text-white">Curadoria de Serviços</h3>
                        <p className="text-gray-400 mt-2">Uma pequena amostra do que oferecemos.</p>
                    </div>
                     <button onClick={onJoinInvitation} className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors">
                        Ver tudo <ChevronRightIcon className="w-4 h-4"/>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {showcaseCategories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <div 
                                key={cat.name}
                                onClick={onJoinInvitation}
                                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/60 to-transparent z-10"></div>
                                {/* Placeholder Backgrounds based on category */}
                                <div className={`absolute inset-0 bg-slate-700 transition-transform duration-700 group-hover:scale-110 ${
                                    cat.name === 'Marceneiro' ? "bg-[url('https://images.unsplash.com/photo-1601058268499-e52658b8bb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')]" :
                                    cat.name === 'Eletricista' ? "bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')]" :
                                    "bg-[url('https://images.unsplash.com/photo-1581578731117-104f885d32b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')]"
                                } bg-cover bg-center`}></div>
                                
                                <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                    <div className="flex items-center gap-3 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="p-2 bg-orange-500 rounded-lg">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-white">{cat.name}</h4>
                                    </div>
                                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                                        Clique para desbloquear o acesso aos melhores {cat.name}s da região.
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
        <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
