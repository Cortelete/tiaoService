
import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 md:px-6 md:py-2.5 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 active:scale-95 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 ${className}`}
    >
      {children}
    </button>
  );
};