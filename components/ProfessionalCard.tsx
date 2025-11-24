
import React from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { StarIcon, MapPinIcon } from './icons';

interface ProfessionalCardProps {
  professional: User;
  onViewDetails: () => void;
  distance?: number; // Distance in km
  highlightBadge?: string;
  highlightColor?: string;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onViewDetails, distance, highlightBadge, highlightColor = 'bg-orange-500' }) => {
  return (
    <div className={`
        bg-white rounded-[2rem] overflow-hidden 
        shadow-xl shadow-slate-200/50 
        hover:shadow-2xl hover:shadow-slate-300/60 
        transform transition-all duration-500 hover:-translate-y-2 
        flex flex-col relative border border-slate-100 group
        ${highlightBadge ? 'ring-2 ring-offset-4 ring-' + highlightColor.replace('bg-', '') : ''}
    `}>
      
      {/* Highlight Badge */}
      {highlightBadge && (
        <div className={`absolute top-5 left-5 ${highlightColor} text-white text-[10px] font-extrabold px-4 py-2 rounded-full shadow-xl shadow-black/10 z-20 uppercase tracking-widest backdrop-blur-md bg-opacity-90`}>
            {highlightBadge}
        </div>
      )}

      {/* Distance Badge */}
      {distance !== undefined && (
          <div className="absolute top-5 right-5 bg-white/80 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1 border border-white/50">
              <MapPinIcon className="w-3 h-3 text-emerald-500" />
              {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
          </div>
      )}
      
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
        <img 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            src={professional.imageUrl || 'https://picsum.photos/seed/placeholder/300/300'} 
            alt={professional.name} 
        />
        <div className="absolute bottom-6 left-6 z-20 text-white">
             <div className="flex items-center gap-2 mb-2">
                 <div className="flex items-center bg-white/20 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                    <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="ml-1 font-bold text-sm">{(professional.rating || 0).toFixed(1)}</span>
                 </div>
                 <span className="text-white/80 text-xs font-medium bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                     {professional.reviewsCount} avaliações
                 </span>
             </div>
            <h3 className="text-2xl font-extrabold tracking-tight leading-tight">{professional.name}</h3>
            <p className="text-white/90 text-sm font-medium mt-1">{professional.services?.join(' • ') || 'Nenhum serviço'}</p>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center text-slate-500 text-sm font-medium">
                <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                {professional.neighborhood}, {professional.city}
            </div>
            {professional.pricing && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    {professional.pricing.description}
                </div>
            )}
        </div>
        
        <p className="text-slate-600 text-sm flex-grow leading-relaxed line-clamp-3 mb-8">
            {professional.bio}
        </p>

        <div className="mt-auto">
          <AnimatedButton onClick={onViewDetails} className="w-full !rounded-xl !py-4 shadow-orange-500/20">
            Ver Perfil Completo
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
