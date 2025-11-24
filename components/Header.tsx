
import React, { useState } from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, BriefcaseIcon, ElegantToolIcon, SparklesIcon, WalletIcon } from './icons';

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        {/* Logo Section - Compact on Mobile */}
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          onClick={() => onNavigate('home')}
        >
          <div className="relative">
             {/* Borrão Azul Escuro para fundo claro */}
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-700 to-slate-900 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
             <ElegantToolIcon className="relative h-8 w-8 md:h-9 md:w-9 text-orange-500 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="hidden md:block text-2xl font-extrabold tracking-tight text-slate-800">
            Tião<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">Service</span>
          </span>
        </div>
        
        <nav className="flex items-center gap-2 md:gap-4">
          {currentUser ? (
            <div className="relative flex items-center gap-2 md:gap-4">
                {/* Wallet Button - Always visible now, smaller on mobile */}
                <button 
                    id="header-wallet-btn"
                    onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} 
                    className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold text-slate-700 hover:text-orange-600 bg-white/80 hover:bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all border border-slate-100 shadow-sm hover:shadow-md"
                >
                    <WalletIcon className="w-4 h-4 md:w-5 md:h-5 text-orange-500"/>
                    <span className="whitespace-nowrap">TC$ {(currentUser.walletBalanceTC || 0).toFixed(2)}</span>
                </button>
                
                {/* Profile Button */}
                <button 
                    id="header-profile-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="flex items-center gap-2 pl-1 pr-0 py-1 rounded-full hover:bg-slate-100/50 transition-colors"
                >
                    <span className="hidden lg:block font-bold text-slate-700 truncate max-w-[100px]">{currentUser.nickname || currentUser.name}</span>
                    <img 
                      src={currentUser.imageUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`} 
                      alt={currentUser.name} 
                      className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-orange-500/20"
                    />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                <div className="absolute right-0 top-full mt-4 w-72 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl py-3 animate-fade-in-down border border-white/50 overflow-hidden ring-1 ring-black/5 z-50">
                  <div className="px-6 py-4 border-b border-slate-100/50 mb-2 bg-slate-50/50">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conta Conectada</p>
                     <p className="font-bold text-slate-800 truncate text-lg">{currentUser.name}</p>
                     <p className="text-sm text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="px-2 space-y-1">
                      <a onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer font-medium transition-colors">
                        <UserCircleIcon className="w-5 h-5 text-slate-400" /> Meu Perfil
                      </a>
                      <a onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="flex sm:hidden items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer font-medium transition-colors">
                        <WalletIcon className="w-5 h-5 text-green-500" /> Carteira (TC$ {(currentUser.walletBalanceTC || 0).toFixed(2)})
                      </a>
                      <a onClick={() => { onNavigate('aiHelp'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer font-medium transition-colors">
                        <SparklesIcon className="w-5 h-5 text-purple-500" /> MIAjuda (IA)
                      </a>
                      {currentUser.role === 'professional' && (
                        <a onClick={() => { onNavigate('opportunities'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer font-medium transition-colors">
                            <BriefcaseIcon className="w-5 h-5 text-blue-500" /> Oportunidades
                        </a>
                      )}
                      {currentUser.role === 'admin' && (
                        <a onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer font-medium transition-colors">
                        <Cog6ToothIcon className="w-5 h-5 text-slate-400" /> Painel Admin
                        </a>
                      )}
                  </div>
                  <div className="border-t border-slate-100 my-2"></div>
                  <div className="px-2">
                      <a onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer font-bold transition-colors">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Sair da conta
                      </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={onLogin} 
                className="font-bold text-sm md:text-base text-slate-600 hover:text-orange-500 transition-colors px-2 py-2"
              >
                Entrar
              </button>
              <AnimatedButton 
                onClick={onSignup}
                className="!px-4 !py-2 !text-xs md:!px-8 md:!py-3.5 md:!text-base whitespace-nowrap"
              >
                Cadastre-se
              </AnimatedButton>
            </div>
          )}
        </nav>
      </div>
       <style>{`
          @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
    </header>
  );
};
