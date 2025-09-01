
import React from 'react';
import { AnimatedButton } from '../AnimatedButton';
import { ShieldCheckIcon } from '../icons';

interface PendingApprovalModalProps {
  onClose: () => void;
}

export const PendingApprovalModal: React.FC<PendingApprovalModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up text-center p-8" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto bg-orange-100 rounded-full h-20 w-20 flex items-center justify-center">
            <ShieldCheckIcon className="h-12 w-12 text-orange-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mt-6">Cadastro em Análise</h2>
        <p className="text-gray-600 mt-4">
            Obrigado por se cadastrar! Para garantir a segurança e qualidade da nossa plataforma, seu perfil de profissional foi enviado para análise.
        </p>
        <p className="text-gray-600 mt-2">
            Você será notificado por email assim que seu cadastro for aprovado.
        </p>
        <div className="mt-8">
            <AnimatedButton onClick={onClose} className="w-full !py-3 text-lg">
                Entendido
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