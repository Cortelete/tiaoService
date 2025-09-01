
import React from 'react';

// Fix: Added a 'disabled' prop to the component's interface to allow it to be disabled.
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
      // Fix: Passed the 'disabled' prop to the underlying button element.
      disabled={disabled}
      // Fix: Updated class names to conditionally apply disabled styles and hover effects.
      className={`px-4 py-2 md:px-6 md:py-2.5 bg-orange-500 text-white font-bold rounded-lg shadow-md active:scale-95 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600 hover:scale-105'}`}
    >
      {children}
    </button>
  );
};
