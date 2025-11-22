
import React from 'react';
// Fix: Corrected the import path for types.
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { StarIcon, MapPinIcon, CurrencyDollarIcon } from './icons';

interface ProfessionalCardProps {
  professional: User;
  onViewDetails: () => void;
  distance?: number; // Distance in km
  highlightBadge?: string;
  highlightColor?: string;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onViewDetails, distance, highlightBadge, highlightColor = 'bg-orange-500' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col relative ${highlightBadge ? 'ring-2 ring-offset-2 ring-' + highlightColor.replace('bg-', '') : ''}`}>
      
      {/* Highlight Badge (Best Rate, Best Price, etc) */}
      {highlightBadge && (
        <div className={`absolute top-0 left-0 ${highlightColor} text-white text-xs font-bold px-4 py-1 rounded-br-lg shadow-md z-20 uppercase tracking-wider`}>
            {highlightBadge}
        </div>
      )}

      {/* Distance Badge */}
      {distance !== undefined && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />
              {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
          </div>
      )}
      
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
          <MapPinIcon className="w-5 h-5 flex-shrink-0" />
          <span className="ml-2 text-sm truncate">{professional.neighborhood}, {professional.city}</span>
        </div>

        {professional.pricing && (
          <div className="flex items-center mt-2 text-gray-500">
            <CurrencyDollarIcon className="w-5 h-5 flex-shrink-0" />
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
