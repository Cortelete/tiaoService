
import React, { useState } from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { serviceCategories } from '../constants';

interface UserProfileFormProps {
  user: User;
  onSave: (updatedUser: User) => void;
  isAdminEditing?: boolean; // Optional prop to slightly change behavior/text
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ user, onSave, isAdminEditing = false }) => {
  const [formData, setFormData] = useState<User>(user);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, pricing: { description: value } }));
  };
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newService = e.target.value;
      if (!isAdminEditing && user.role === 'professional' && user.service !== newService) {
        // Professionals requesting a change need admin approval
        setFormData(prev => ({...prev, serviceChangeRequest: newService}));
      } else {
        // Admins can change it directly
        setFormData(prev => ({ ...prev, service: newService, serviceChangeRequest: undefined }));
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, isProfileComplete: true });
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-inner">
        {showConfirmation && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-semibold">
                Perfil atualizado com sucesso!
            </div>
        )}
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

        {user.role === 'professional' && (
            <div className="p-4 bg-orange-50 rounded-lg space-y-4 mt-4 border-t-2 border-orange-200 pt-6">
                <h3 className="font-bold text-lg text-orange-700">Informações Profissionais</h3>
                <div>
                    <label htmlFor="service" className="text-sm font-bold text-gray-600 block mb-1">Área de Atuação</label>
                    <select name="service" value={formData.serviceChangeRequest || formData.service} onChange={handleServiceChange} className="w-full p-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                      {serviceCategories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                    {formData.serviceChangeRequest && (
                        <p className="text-xs text-yellow-700 mt-1">Sua solicitação para mudar para "{formData.serviceChangeRequest}" está pendente de aprovação.</p>
                    )}
                </div>
                <div>
                    <label htmlFor="bio" className="text-sm font-bold text-gray-600 block mb-1">Biografia</label>
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
                Salvar Alterações
            </AnimatedButton>
        </div>
    </form>
  );
};