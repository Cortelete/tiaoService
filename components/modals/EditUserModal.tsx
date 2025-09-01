import React from 'react';
import type { User } from '../../types';
import { XMarkIcon } from '../icons';
import { UserProfileForm } from '../UserProfileForm';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  
  const handleSaveAndClose = (updatedUser: User) => {
    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" aria-label="Fechar modal">
                <XMarkIcon className="w-8 h-8" />
            </button>
            <h2 className="text-3xl font-extrabold text-center text-gray-800">Editar Usuário</h2>
            <p className="text-center text-gray-600 mt-2">{user.email}</p>
        </div>
        <div className="px-8 pb-8">
            <UserProfileForm user={user} onSave={handleSaveAndClose} isAdminEditing={true}/>
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