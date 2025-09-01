import React, { useMemo } from 'react';
import type { User, JobPost } from '../../types';
import { JobPostCard } from '../JobPostCard';
import { BriefcaseIcon } from '../icons';
// Fix: Import BackButton to enable back navigation.
import { BackButton } from '../BackButton';

interface OpportunitiesPageProps {
  currentUser: User;
  jobPosts: JobPost[];
  users: User[];
  // Fix: Add onBack prop to handle navigation.
  onBack: () => void;
}

// Fix: Destructure onBack prop to use it.
export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ currentUser, jobPosts, users, onBack }) => {

  const relevantJobPosts = useMemo(() => {
    if (!currentUser.services) return [];
    return jobPosts.filter(post => currentUser.services?.includes(post.serviceCategory));
  }, [jobPosts, currentUser.services]);

  return (
    <div>
      {/* Fix: Add BackButton for navigation. */}
      <BackButton onClick={onBack} />
      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-3">
             <BriefcaseIcon className="w-10 h-10 text-orange-500"/>
             <h1 className="text-3xl md:text-4xl font-bold">
                Mural de Oportunidades
             </h1>
        </div>
        <p className="text-gray-600 mt-2">
            Encontre clientes que precisam dos seus serviços de <span className="font-bold text-orange-600">{currentUser.services?.join(', ')}</span>.
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
              Não há clientes procurando por serviços em suas áreas de atuação no momento. Volte mais tarde!
            </p>
        </div>
      )}
    </div>
  );
};
