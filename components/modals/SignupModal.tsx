
import React, { useState } from 'react';
import type { User, UserRole } from '../../types';
import { serviceCategories } from '../../constants';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface SignupModalProps {
  onClose: () => void;
  onSignup: (newUser: Omit<User, 'id' | 'isProfileComplete'>) => boolean;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState(serviceCategories[0].name);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const baseFields = name && email && password && phone && location;
    const professionalFields = role === 'professional' ? service && cpfCnpj : true;
    
    if (!baseFields || !professionalFields) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    const userData: Omit<User, 'id' | 'isProfileComplete'> = { name, email, password, role, phone, location };
    if (role === 'professional') {
      userData.service = service;
      userData.cpfCnpj = cpfCnpj;
    }

    onSignup(userData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" aria-label="Fechar modal">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Criar Conta</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center text-sm">{error}</p>}
          
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-2">Tipo de Conta</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setRole('client')} className={`w-full p-3 rounded-lg font-bold transition-colors ${role === 'client' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                Sou Cliente
              </button>
              <button type="button" onClick={() => setRole('professional')} className={`w-full p-3 rounded-lg font-bold transition-colors ${role === 'professional' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                Sou Profissional
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-bold text-gray-600 block mb-1">Nome Completo</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Seu nome"/>
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-bold text-gray-600 block mb-1">Telefone</label>
              <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="(XX) XXXXX-XXXX"/>
            </div>
          </div>

          <div>
              <label htmlFor="location" className="text-sm font-bold text-gray-600 block mb-1">Sua Cidade e Bairro</label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: Copacabana, Rio de Janeiro"/>
          </div>

           {role === 'professional' && (
            <div className="p-4 bg-orange-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="service" className="text-sm font-bold text-gray-600 block mb-1">Área de Atuação</label>
                  <select id="service" value={service} onChange={(e) => setService(e.target.value)} className="w-full p-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {serviceCategories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="cpfCnpj" className="text-sm font-bold text-gray-600 block mb-1">CPF ou CNPJ</label>
                  <input type="text" id="cpfCnpj" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} className="w-full p-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Seu documento"/>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="signup-email" className="text-sm font-bold text-gray-600 block mb-1">Email</label>
              <input type="email" id="signup-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="seu@email.com"/>
            </div>
            <div>
              <label htmlFor="signup-password"  className="text-sm font-bold text-gray-600 block mb-1">Senha</label>
              <input type="password" id="signup-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="••••••••"/>
            </div>
          </div>

          <AnimatedButton onClick={() => {}} className="w-full !py-3 text-lg">
            Cadastrar
          </AnimatedButton>
          <p className="text-center text-sm text-gray-600">
            Já possui uma conta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-bold text-blue-600 hover:underline">
              Faça login
            </button>
          </p>
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