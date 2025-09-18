import React, { useState } from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, BriefcaseIcon, WrenchScrewdriverIcon, SparklesIcon, WalletIcon } from './icons';

interface HeaderProps {
  currentUser: User | null;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'profile' | 'admin' | 'opportunities' | 'aiHelp') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogin, onSignup, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <WrenchScrewdriverIcon className="h-8 w-8 text-orange-500 transform -rotate-45" />
          <span className="text-2xl font-bold text-gray-800">Tião<span className="text-blue-600">Service</span></span>
        </div>
        <nav>
          {currentUser ? (
            <div className="relative">
                <div className="flex items-center gap-4">
                    <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-500">
                        <WalletIcon className="w-5 h-5"/>
                        <span>TC$ {(currentUser.walletBalanceTC || 0).toFixed(2)}</span>
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2">
                        <img 
                          src={currentUser.imageUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`} 
                          alt={currentUser.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-400"
                        />
                         <span className="hidden md:block font-semibold text-gray-700">{currentUser.nickname || currentUser.name}</span>
                    </button>
                </div>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 animate-fade-in-down">
                  <a onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <UserCircleIcon className="w-5 h-5" /> Meu Perfil
                  </a>
                  <a onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="flex sm:hidden items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <WalletIcon className="w-5 h-5" /> Carteira (TC$ {(currentUser.walletBalanceTC || 0).toFixed(2)})
                  </a>
                   <a onClick={() => { onNavigate('aiHelp'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <SparklesIcon className="w-5 h-5" /> Ajuda com IA
                  </a>
                  {currentUser.role === 'professional' && (
                     <a onClick={() => { onNavigate('opportunities'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <BriefcaseIcon className="w-5 h-5" /> Oportunidades
                    </a>
                  )}
                  {currentUser.role === 'admin' && (
                    <a onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Cog6ToothIcon className="w-5 h-5" /> Painel Admin
                    </a>
                  )}
                  <div className="border-t my-2"></div>
                  <a onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" /> Sair
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={onLogin} className="font-bold text-gray-600 hover:text-orange-500 transition-colors">
                Entrar
              </button>
              <AnimatedButton onClick={onSignup}>
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