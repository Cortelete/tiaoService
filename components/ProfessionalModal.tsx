
import React, { useEffect } from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { StarIcon, MapPinIcon, XMarkIcon, CurrencyDollarIcon } from './icons';

interface ProfessionalModalProps {
  professional: User;
  onClose: () => void;
  onRequestService: (professional: User) => void;
}

export const ProfessionalModal: React.FC<ProfessionalModalProps> = ({ professional, onClose, onRequestService }) => {
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            aria-label="Fechar modal"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
            <img 
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-200" 
              src={professional.imageUrl || 'https://picsum.photos/seed/placeholder/300/300'} 
              alt={professional.name} 
            />
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <h2 className="text-3xl font-extrabold text-gray-800">{professional.name}</h2>
              <p className="text-xl font-semibold text-blue-600">{professional.service}</p>
              <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 font-bold text-gray-700">{(professional.rating || 0).toFixed(1)}</span>
                <span className="ml-2 text-sm">({professional.reviewsCount || 0} avaliações)</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-500">
                <MapPinIcon className="w-5 h-5" />
                <span className="ml-2 text-sm">{professional.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mt-4">Sobre o Profissional</h3>
          <p className="mt-2 text-gray-600">{professional.bio || 'Nenhuma biografia fornecida.'}</p>

          {professional.pricing && (
            <>
              <h3 className="text-lg font-bold text-gray-800 mt-6">Preços</h3>
              <div className="mt-2 bg-orange-50 p-4 rounded-lg flex items-center border border-orange-200">
                <CurrencyDollarIcon className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <p className="ml-3 text-gray-700 font-semibold">{professional.pricing.description}</p>
              </div>
            </>
          )}

          <h3 className="text-lg font-bold text-gray-800 mt-6">Avaliações de Clientes</h3>
          <div className="mt-4 space-y-4">
            {professional.reviews && professional.reviews.length > 0 ? professional.reviews.map(review => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-700">{review.author}</p>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400" />)}
                    {[...Array(5 - review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-gray-300" />)}
                  </div>
                </div>
                <p className="mt-1 text-gray-600 italic">"{review.comment}"</p>
              </div>
            )) : (
              <p className="text-gray-500 italic">Este profissional ainda não possui avaliações.</p>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-b-2xl sticky bottom-0">
          <AnimatedButton onClick={() => onRequestService(professional)} className="w-full text-lg">
            Solicitar Serviço
          </AnimatedButton>
        </div>
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