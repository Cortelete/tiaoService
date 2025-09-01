import React from 'react';
import type { User } from '../../types';
import { AnimatedButton } from './AnimatedButton';
import { StarIcon, MapPinIcon, CurrencyDollarIcon } from './icons';

interface ProfessionalCardProps {
  professional: User;
  onViewDetails: () => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col">
      <img className="w-full h-48 object-cover" src={professional.imageUrl || 'https://picsum.photos/seed/placeholder/300/300'} alt={professional.name} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800">{professional.name}</h3>
        <p className="text-blue-600 font-semibold mt-1">{professional.services?.join(' • ') || 'Nenhum serviço'}</p>
        
        <div className="flex items-center mt-3 text-gray-600">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <span className="ml-1 font-bold text-gray-700">{(professional.rating || 0).toFixed(1)}</span>
          <span className="ml-2 text-sm">({professional.reviewsCount || 0} avaliações)</span>
        </div>
        
        <div className="flex items-center mt-2 text-gray-500">
          <MapPinIcon className="w-5 h-5" />
          <span className="ml-2 text-sm">{professional.neighborhood}, {professional.city}</span>
        </div>

        {professional.pricing && (
          <div className="flex items-center mt-2 text-gray-500">
            <CurrencyDollarIcon className="w-5 h-5" />
            <span className="ml-2 text-sm font-semibold text-gray-600">{professional.pricing.description}</span>
          </div>
        )}
        
        <p className="mt-4 text-gray-600 text-sm flex-grow">
            {professional.bio && (professional.bio.length > 80 ? `${professional.bio.substring(0, 80)}...` : professional.bio)}
        </p>

        <div className="mt-6">
          <AnimatedButton onClick={onViewDetails} className="w-full">
            Ver Perfil
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};