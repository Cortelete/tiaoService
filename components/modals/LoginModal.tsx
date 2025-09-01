import React, { useState } from 'react';
import type { UserCredentials } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (credentials: UserCredentials) => { success: boolean, message?: string };
  onSwitchToSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsSubmitting(true);
    const result = onLogin({ email, password });
    
    if (result.success) {
      setSuccess('Login realizado com sucesso!');
      setTimeout(() => {
        // The modal only closes itself if the parent component (App.tsx)
        // didn't already switch to a different modal (like completeProfile).
        // Since this timeout runs after the parent state update, this check
        // is implicitly handled. If this modal is still open, we close it.
        onClose();
      }, 1500);
    } else {
      setError(result.message || 'Email ou senha inválidos.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={isSubmitting ? undefined : onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" aria-label="Fechar modal" disabled={isSubmitting}>
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Entrar</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
          {success && <p className="bg-green-100 text-green-800 p-3 rounded-lg text-center">{success}</p>}
          <fieldset disabled={isSubmitting} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-600 block mb-2">Email</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password"  className="text-sm font-bold text-gray-600 block mb-2">Senha</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
            <AnimatedButton onClick={() => {}} className="w-full !py-3 text-lg">
              {isSubmitting ? (success ? 'Sucesso!' : 'Entrando...') : 'Entrar'}
            </AnimatedButton>
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button type="button" onClick={onSwitchToSignup} className="font-bold text-blue-600 hover:underline">
                Cadastre-se
              </button>
            </p>
          </fieldset>
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