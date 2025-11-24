
import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3.5 
        bg-gradient-to-r from-orange-500 to-orange-400 
        hover:to-orange-500 
        text-white font-bold text-base tracking-wide
        rounded-2xl 
        shadow-lg shadow-orange-500/30 
        hover:shadow-xl hover:shadow-orange-500/50 
        active:scale-[0.98] 
        transform transition-all duration-300 ease-out 
        focus:outline-none focus:ring-4 focus:ring-orange-500/20 
        border border-orange-400/20
        ${className} 
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1'}
      `}
    >
      {children}
    </button>
  );
};
