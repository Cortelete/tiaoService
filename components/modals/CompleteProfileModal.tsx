
import React, { useState } from 'react';
import type { User } from '../../types';
import { serviceCategories } from '../../constants';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface CompleteProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>(user);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, pricing: { description: value } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, isProfileComplete: true } as User);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          {/* Cannot close this modal until profile is complete */}
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Complete seu Perfil</h2>
          <p className="text-center text-gray-600 mt-2">Precisamos de mais algumas informações para ativar sua conta.</p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="text-sm font-bold text-gray-600 block mb-1">Nome Completo</label>
                    <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"/>
                </div>
                 <div>
                    <label htmlFor="phone" className="text-sm font-bold text-gray-600 block mb-1">Telefone</label>
                    <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"/>
                </div>
            </div>
             <div>
                <label htmlFor="location" className="text-sm font-bold text-gray-600 block mb-1">Sua Cidade e Bairro</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>

            {/* Professional-only Fields */}
            {user.role === 'professional' && (
                <div className="p-4 bg-orange-50 rounded-lg space-y-4 mt-4 border-t-2 border-orange-200 pt-6">
                    <h3 className="font-bold text-lg text-orange-700">Informações Profissionais</h3>
                     <div>
                        <label htmlFor="bio" className="text-sm font-bold text-gray-600 block mb-1">Biografia Curta</label>
                        <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows={3} className="w-full p-3 text-gray-700 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Fale um pouco sobre seu trabalho..."></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="pricing" className="text-sm font-bold text-gray-600 block mb-1">Política de Preços</label>
                            <input type="text" name="pricing" value={formData.pricing?.description || ''} onChange={handlePricingChange} className="w-full p-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: A partir de R$100"/>
                        </div>
                        <div>
                           <label htmlFor="imageUrl" className="text-sm font-bold text-gray-600 block mb-1">URL da sua Foto de Perfil</label>
                           <input type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="https://exemplo.com/foto.jpg"/>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="pt-4">
                <AnimatedButton onClick={() => {}} className="w-full !py-3 text-lg">
                    Salvar e Continuar
                </AnimatedButton>
            </div>
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