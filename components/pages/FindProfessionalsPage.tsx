
import React, { useMemo } from 'react';
import type { User } from '../../types';
import { ProfessionalCard } from '../ProfessionalCard';

interface FindProfessionalsPageProps {
  category: string;
  onViewProfessional: (professional: User) => void;
  professionals: User[];
}

export const FindProfessionalsPage: React.FC<FindProfessionalsPageProps> = ({ category, onViewProfessional, professionals }) => {
  
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(p => p.service === category);
  }, [category, professionals]);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Profissionais de <span className="text-orange-500">{category}</span>
      </h1>
      <p className="text-center text-gray-600 mb-10">Encontramos os melhores para você!</p>
      
      {filteredProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessionals.map(prof => (
            <ProfessionalCard 
              key={prof.id} 
              professional={prof} 
              onViewDetails={() => onViewProfessional(prof)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700">Nenhum profissional encontrado</h3>
            <p className="mt-2 text-gray-500">
              Ainda não temos profissionais de <span className="font-semibold">{category}</span> nesta região. Tente outra categoria ou volte mais tarde!
            </p>
        </div>
      )}
    </div>
  );
};