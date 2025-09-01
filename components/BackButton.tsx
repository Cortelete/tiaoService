import React from 'react';
import { ArrowLeftIcon } from './icons';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-semibold mb-6 transition-colors duration-300 group"
      aria-label="Voltar para a página anterior"
    >
      <ArrowLeftIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
      Voltar
    </button>
  );
};
