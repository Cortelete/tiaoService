import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { UserCircleIcon, BriefcaseIcon, SparklesIcon } from './icons';

interface HeaderProps {
  onGoHome: () => void;
  user: User | null;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onLogout: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToProfile: () => void;
  onNavigateToOpportunities: () => void;
  onNavigateToAiHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onGoHome, onOpenLogin, onOpenSignup, onLogout, onNavigateToAdmin, onNavigateToProfile, onNavigateToOpportunities, onNavigateToAiHelp }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="text-3xl md:text-4xl font-extrabold cursor-pointer"
          onClick={onGoHome}
        >
          <span className="animated-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            TiãoService
          </span>
        </div>
        <nav className="flex items-center space-x-2 md:space-x-4">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
               <button onClick={onNavigateToAiHelp} title="IA me Ajuda" className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium p-2 rounded-lg hover:bg-orange-50">
                  <SparklesIcon className="w-6 h-6 md:w-5 md:h-5 text-orange-500" />
                  <span className="hidden md:inline">IA me Ajuda</span>
               </button>
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className="p-1 text-gray-500 hover:text-orange-600 rounded-full transition-colors flex items-center gap-2 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                   <img src={user.imageUrl || 'https://i.pravatar.cc/150?u=' + user.id} alt={user.name} className="w-9 h-9 rounded-full object-cover"/>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 animate-fade-in-down">
                     <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">Olá, {user.nickname || user.name.split(' ')[0]}!</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                     </div>
                     <div className="my-1"></div>
                    <button onClick={() => handleLinkClick(onNavigateToProfile)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition-colors flex items-center gap-3">
                      <UserCircleIcon className="w-5 h-5" /> Meu Perfil
                    </button>
                     {user.role === 'professional' && (
                      <button onClick={() => handleLinkClick(onNavigateToOpportunities)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition-colors flex items-center gap-3">
                        <BriefcaseIcon className="w-5 h-5" /> Oportunidades
                      </button>
                     )}
                    {user.role === 'admin' && (
                       <button onClick={() => handleLinkClick(onNavigateToAdmin)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition-colors">
                          Painel Admin
                       </button>
                    )}
                    <div className="my-2 border-t border-gray-100"></div>
                    <button onClick={() => handleLinkClick(onLogout)} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition-colors">
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 md:space-x-4">
              <button onClick={onOpenLogin} className="text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium px-4 py-2">
                Entrar
              </button>
              <AnimatedButton onClick={onOpenSignup}>
                Cadastre-se
              </AnimatedButton>
            </div>
          )}
        </nav>
      </div>
       <style>{`
          @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
          }
        `}</style>
    </header>
  );
};