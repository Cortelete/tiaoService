
import React from 'react';
import type { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { XMarkIcon, StarIcon, MapPinIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon, CurrencyDollarIcon } from './icons';

interface ProfessionalModalProps {
  professional: User;
  currentUser: User | null;
  onClose: () => void;
  onStartChat: () => void;
  onRequestService: (service: string) => void;
}

export const ProfessionalModal: React.FC<ProfessionalModalProps> = ({ professional, currentUser, onClose, onStartChat, onRequestService }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" aria-label="Fechar modal">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>
        
        <div className="p-8 pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img className="w-32 h-32 rounded-full object-cover border-4 border-orange-200" src={professional.imageUrl || 'https://picsum.photos/seed/placeholder/300/300'} alt={professional.name} />
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-800">{professional.name}</h2>
                    <p className="text-blue-600 font-semibold mt-1 text-lg">{professional.services?.join(' • ')}</p>
                    <div className="flex items-center justify-center sm:justify-start mt-3 text-gray-600">
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 font-bold text-gray-700">{(professional.rating || 0).toFixed(1)}</span>
                      <span className="ml-2 text-sm">({professional.reviewsCount || 0} avaliações)</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-500">
                      <MapPinIcon className="w-5 h-5" />
                      <span className="ml-2 text-sm">{professional.neighborhood}, {professional.city}</span>
                    </div>
                     {professional.pricing && (
                      <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-500">
                        <CurrencyDollarIcon className="w-5 h-5" />
                        <span className="ml-2 text-sm font-semibold text-gray-600">{professional.pricing.description}</span>
                      </div>
                    )}
                </div>
            </div>
            
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-700">Sobre mim</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{professional.bio || 'Nenhuma biografia disponível.'}</p>
            </div>
            
             <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-700 mb-3">Serviços Oferecidos</h3>
                <div className="flex flex-wrap gap-3">
                    {professional.services?.map(service => (
                        <div key={service} className="bg-orange-100 text-orange-800 font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                             <CalendarDaysIcon className="w-5 h-5"/>
                             <span>{service}</span>
                             <button onClick={() => onRequestService(service)} className="ml-2 text-xs bg-orange-500 text-white rounded-full px-2 py-0.5 hover:bg-orange-600">Solicitar</button>
                        </div>
                    ))}
                </div>
            </div>
            
            {currentUser?.id !== professional.id && (
                <div className="mt-10 border-t pt-6">
                  <AnimatedButton onClick={onStartChat} className="w-full !py-3 text-lg flex items-center justify-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-6 h-6"/>
                    Iniciar Conversa
                  </AnimatedButton>
                </div>
            )}
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
