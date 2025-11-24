
import React from 'react';
import type { ServiceCategory } from '../types';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onClick: () => void;
}

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category, onClick }) => {
  const Icon = category.icon;
  return (
    <div
      onClick={onClick}
      className="
        bg-white p-8 
        rounded-3xl 
        shadow-xl shadow-slate-200/40 
        hover:shadow-2xl hover:shadow-orange-500/10 
        border border-white/50 
        hover:border-orange-100 
        hover:-translate-y-2 
        transform transition-all duration-500 ease-out 
        cursor-pointer 
        flex flex-col items-center justify-center 
        group relative overflow-hidden
      "
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="bg-slate-50 p-5 rounded-2xl transition-all duration-500 group-hover:bg-orange-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-orange-600/50 relative z-10">
        <Icon className="h-8 w-8 text-slate-500 transition-colors duration-500 group-hover:text-white" />
      </div>
      <h4 className="mt-6 font-extrabold text-slate-700 text-center group-hover:text-orange-600 transition-colors duration-300 relative z-10">
          {category.name}
      </h4>
    </div>
  );
};
