
import React from 'react';
import type { ServiceCategory } from '../../types';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onClick: () => void;
}

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category, onClick }) => {
  const Icon = category.icon;
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center group"
    >
      <div className="bg-orange-100 p-4 rounded-full transition-colors duration-300 group-hover:bg-orange-200">
        <Icon className="h-8 w-8 text-orange-600 transition-colors duration-300 group-hover:text-orange-700" />
      </div>
      <h4 className="mt-4 font-bold text-gray-700 text-center">{category.name}</h4>
    </div>
  );
};