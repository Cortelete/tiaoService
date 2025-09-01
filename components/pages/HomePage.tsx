
import React from 'react';
import type { ServiceCategory } from '../../types';
import { ServiceCategoryCard } from '../ServiceCategoryCard';

interface HomePageProps {
  onSelectCategory: (category: string) => void;
  categories: ServiceCategory[];
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectCategory, categories }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
        O serviço que você precisa,
      </h1>
      <h2 className="mt-2 md:mt-4 text-3xl md:text-5xl font-bold animated-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
        na palma da sua mão.
      </h2>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
        Encontre os melhores profissionais locais de forma rápida, segura e com a confiança que só o TiãoService oferece.
      </p>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-700">Explore por categoria</h3>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <ServiceCategoryCard 
              key={category.name} 
              category={category} 
              onClick={() => onSelectCategory(category.name)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};