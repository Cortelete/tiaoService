import React, { useState } from 'react';
import type { User, UserRole } from '../../types';
import { serviceCategories } from '../../constants';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface SignupModalProps {
  onClose: () => void;
  onSignup: (newUser: Omit<User, 'id' | 'isProfileComplete' | 'regionId'>) => boolean;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [error, setError] = useState('');

  const handleServiceToggle = (toggledService: string) => {
    setServices(prev => 
        prev.includes(toggledService) 
        ? prev.filter(s => s !== toggledService)
        : [...prev, toggledService]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const baseFields = name && email && password && phone && street && neighborhood && city && state;
    const professionalFields = role === 'professional' ? services.length > 0 && cpfCnpj : true;
    
    if (!baseFields || !professionalFields) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    const userData: Omit<User, 'id' | 'isProfileComplete' | 'regionId'> = { 
      name, email, password, role, phone, street, neighborhood, city, state 
    };
    if (role === 'professional') {
      userData.services = services;
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
          
          {/* Address Fields */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
             <h3 className="text-md font-bold text-gray-700">Seu Endereço</h3>
             <div>
                <label htmlFor="street" className="text-sm font-bold text-gray-600 block mb-1">Rua e Número</label>
                <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full p-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: Av. Brasil, 123"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="neighborhood" className="text-sm font-bold text-gray-600 block mb-1">Bairro</label>
                    <input type="text" id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full p-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: Copacabana"/>
                </div>
                <div>
                    <label htmlFor="state" className="text-sm font-bold text-gray-600 block mb-1">Estado</label>
                    <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} className="w-full p-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: RJ"/>
                </div>
            </div>
             <div>
                <label htmlFor="city" className="text-sm font-bold text-gray-600 block mb-1">Cidade</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: Rio de Janeiro"/>
            </div>
          </div>


           {role === 'professional' && (
            <div className="p-4 bg-orange-50 rounded-lg space-y-4">
              <div>
                <label htmlFor="cpfCnpj" className="text-sm font-bold text-gray-600 block mb-1">CPF ou CNPJ</label>
                <input type="text" id="cpfCnpj" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} className="w-full p-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Seu documento"/>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-600 block">Área(s) de Atuação</label>
                 <p className="text-xs text-gray-500 mb-2">Selecione uma ou mais opções.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceCategories.map(cat => (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() => handleServiceToggle(cat.name)}
                      className={`p-2 text-sm rounded-lg border-2 transition-colors text-center font-medium ${services.includes(cat.name) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
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