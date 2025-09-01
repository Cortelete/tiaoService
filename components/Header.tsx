
import React from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { UserCircleIcon, BriefcaseIcon } from './icons';

interface HeaderProps {
  onGoHome: () => void;
  user: User | null;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onLogout: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToProfile: () => void;
  onNavigateToOpportunities: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onGoHome, onOpenLogin, onOpenSignup, onLogout, onNavigateToAdmin, onNavigateToProfile, onNavigateToOpportunities }) => {
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
            <>
              {user.role === 'admin' && (
                <button onClick={onNavigateToAdmin} className="hidden md:block text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium">
                  Painel Admin
                </button>
              )}
              {user.role === 'professional' && (
                 <button onClick={onNavigateToOpportunities} className="hidden md:flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium">
                   <BriefcaseIcon className="w-5 h-5" />
                   Oportunidades
                </button>
              )}
               <button onClick={onNavigateToProfile} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors flex items-center gap-2">
                 <UserCircleIcon className="w-6 h-6"/>
                 <span className="hidden md:block font-medium">Meu Perfil</span>
               </button>
              <span className="hidden lg:block font-medium text-gray-700">Olá, {user.name.split(' ')[0]}!</span>
              <AnimatedButton onClick={onLogout}>
                Sair
              </AnimatedButton>
            </>
          ) : (
            <>
              <button onClick={onOpenLogin} className="hidden md:block text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium">
                Entrar
              </button>
              <AnimatedButton onClick={onOpenSignup}>
                Cadastre-se
              </AnimatedButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};