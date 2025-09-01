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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, pricing: { description: value } }));
  };
  
  const handleServiceToggle = (toggledService: string) => {
    const currentServices = formData.servicesChangeRequest ?? formData.services ?? [];
    const newServices = currentServices.includes(toggledService)
        ? currentServices.filter(s => s !== toggledService)
        : [...currentServices, toggledService];

    if (isAdminEditing) {
        setFormData(prev => ({ ...prev, services: newServices, servicesChangeRequest: undefined }));
    } else {
        // For professionals, any change goes into servicesChangeRequest
        setFormData(prev => ({ ...prev, servicesChangeRequest: newServices }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, isProfileComplete: true });
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const servicesForSelection = formData.servicesChangeRequest ?? formData.services ?? [];

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
        
        {/* Address Fields */}
        <div className="space-y-4 pt-4 border-t mt-4">
             <h3 className="text-md font-bold text-gray-700">Seu Endereço</h3>
             <div>
                <label htmlFor="street" className="text-sm font-bold text-gray-600 block mb-1">Rua e Número</label>
                <input type="text" id="street" name="street" value={formData.street || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: Av. Brasil, 123"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="neighborhood" className="text-sm font-bold text-gray-600 block mb-1">Bairro</label>
                    <input type="text" id="neighborhood" name="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: Copacabana"/>
                </div>
                <div>
                    <label htmlFor="city" className="text-sm font-bold text-gray-600 block mb-1">Cidade</label>
                    <input type="text" id="city" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: Rio de Janeiro"/>
                </div>
            </div>
            <div>
                <label htmlFor="state" className="text-sm font-bold text-gray-600 block mb-1">Estado (UF)</label>
                <input type="text" id="state" name="state" value={formData.state || ''} onChange={handleInputChange} className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ex: RJ"/>
            </div>
        </div>

        {user.role === 'professional' && (
            <div className="p-4 bg-orange-50 rounded-lg space-y-4 mt-4 border-t-2 border-orange-200 pt-6">
                <h3 className="font-bold text-lg text-orange-700">Informações Profissionais</h3>
                <div>
                    <label className="text-sm font-bold text-gray-600 block">Área(s) de Atuação</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {serviceCategories.map(cat => (
                        <button
                          type="button"
                          key={cat.name}
                          onClick={() => handleServiceToggle(cat.name)}
                          className={`p-2 text-sm rounded-lg border-2 transition-colors text-center font-medium ${servicesForSelection.includes(cat.name) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                    {formData.servicesChangeRequest && (
                        <p className="text-xs text-yellow-700 mt-2 p-2 bg-yellow-100 rounded-md">Sua solicitação para alterar suas especialidades está pendente de aprovação.</p>
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