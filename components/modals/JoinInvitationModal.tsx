
import React from 'react';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon, SparklesIcon, UserGroupIcon } from '../icons';

interface JoinInvitationModalProps {
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export const JoinInvitationModal: React.FC<JoinInvitationModalProps> = ({ onClose, onLogin, onSignup }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-yellow-500/30 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 opacity-5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="p-8 relative z-10 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-gray-800 to-black border border-yellow-500/30 mb-6 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
             <SparklesIcon className="w-10 h-10 text-yellow-400" />
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Acesso Exclusivo
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Para solicitar os melhores profissionais do mercado e garantir a qualidade TiãoService, você precisa fazer parte do nosso clube.
          </p>

          <div className="space-y-4">
            <button 
                onClick={onSignup}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1 transition-all duration-300"
            >
                Quero fazer parte agora
            </button>
            
            <button 
                onClick={onLogin}
                className="w-full py-4 bg-transparent border border-gray-600 text-gray-300 font-semibold text-lg rounded-xl hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-all duration-300"
            >
                Já possuo conta
            </button>
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-2 text-xs text-gray-500">
             <UserGroupIcon className="w-4 h-4" />
             <span>Mais de 10.000 serviços realizados este mês.</span>
          </div>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px); scale(0.9); }
            100% { opacity: 1; transform: translateY(0); scale(1); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
    </div>
  );
};
