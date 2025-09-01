import React, { useMemo } from 'react';
import type { User, JobPost } from '../../types';
import { JobPostCard } from '../JobPostCard';
import { BriefcaseIcon } from '../icons';

interface OpportunitiesPageProps {
  currentUser: User;
  jobPosts: JobPost[];
  users: User[];
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ currentUser, jobPosts, users }) => {

  const relevantJobPosts = useMemo(() => {
    return jobPosts.filter(post => post.serviceCategory === currentUser.service);
  }, [jobPosts, currentUser.service]);

  return (
    <div>
      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-3">
             <BriefcaseIcon className="w-10 h-10 text-orange-500"/>
             <h1 className="text-3xl md:text-4xl font-bold">
                Mural de Oportunidades
             </h1>
        </div>
        <p className="text-gray-600 mt-2">
            Encontre clientes que precisam dos seus serviços de <span className="font-bold text-orange-600">{currentUser.service}</span>.
        </p>
      </div>
      
      {relevantJobPosts.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {relevantJobPosts.map(post => {
              const client = users.find(u => u.id === post.clientId);
              if (!client) return null;
              return <JobPostCard key={post.id} post={post} client={client} />
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-700">Nenhuma oportunidade encontrada</h3>
            <p className="mt-2 text-gray-500">
              Não há clientes procurando por serviços de <span className="font-semibold">{currentUser.service}</span> no momento. Volte mais tarde!
            </p>
        </div>
      )}
    </div>
  );
};