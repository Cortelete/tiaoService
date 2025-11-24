
import React from 'react';
import type { FeatureContent } from '../../types';
import { XMarkIcon } from '../icons';

interface FeatureModalProps {
  content: FeatureContent;
  onClose: () => void;
}

export const FeatureModal: React.FC<FeatureModalProps> = ({ content, onClose }) => {
  const Icon = content.icon;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-zoom relative overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10">
            <XMarkIcon className="w-8 h-8" />
        </button>

        <div className="pt-16 pb-8 px-8 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl p-6 -mt-8 mb-6 border border-gray-100 flex flex-col items-center text-center">
                 <div className="p-4 bg-orange-50 rounded-full mb-4">
                    <Icon className="w-12 h-12 text-orange-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
            </div>
            
            <p className="text-gray-600 text-center text-lg leading-relaxed">
                {content.description}
            </p>
            
             <div className="mt-8">
                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all"
                >
                    Entendi
                </button>
            </div>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-zoom {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-zoom {
            animation: fade-in-zoom 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
