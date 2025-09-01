import React, { useState } from 'react';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface CtaModalProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const CtaModal: React.FC<CtaModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }
    setError('');
    onSubmit(name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" aria-label="Fechar modal">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-center">
            <span className="animated-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              Fale Comigo!
            </span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <p className="text-center text-gray-600">Para personalizar sua mensagem, me diga seu nome:</p>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <div>
            <label htmlFor="cta-name" className="sr-only">Seu nome</label>
            <input 
              type="text" 
              id="cta-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Digite seu nome aqui"
              autoFocus
            />
          </div>
          <AnimatedButton onClick={() => {}} className="w-full !py-3 text-lg">
            Enviar para o WhatsApp 🚀
          </AnimatedButton>
        </form>
      </div>
       <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
