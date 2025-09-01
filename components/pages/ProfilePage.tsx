

import React, { useState, useMemo } from 'react';
import type { User, ServiceRequest, ServiceRequestStatus, JobPost } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { UserProfileForm } from '../UserProfileForm';
import { UsersIcon, TrashIcon } from '../icons';
import { serviceCategories } from '../../constants';
// Fix: Import the BackButton component to resolve the 'Cannot find name' error.
import { BackButton } from '../BackButton';

interface ProfilePageProps {
  currentUser: User;
  users: User[];
  serviceRequests: ServiceRequest[];
  jobPosts: JobPost[];
  onUpdateRequestStatus: (requestId: number, status: ServiceRequestStatus) => void;
  onUpdateUser: (updatedUser: User) => void;
  onAddJobPost: (post: Omit<JobPost, 'id' | 'createdAt' | 'clientId'>) => void;
  onDeleteJobPost: (postId: number) => void;
  onBack: () => void;
}

// Helper to format date
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

// Status Badge Component
const StatusBadge = ({ status }: { status: ServiceRequestStatus }) => {
    const statusStyles: Record<ServiceRequestStatus, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        declined: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
    };
    const statusText: Record<ServiceRequestStatus, string> = {
        pending: 'Pendente',
        accepted: 'Aceito',
        completed: 'Concluído',
        declined: 'Recusado',
        cancelled: 'Cancelado',
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status]}`}>{statusText[status]}</span>
};

// Client Profile View
const ClientProfile: React.FC<{ 
    client: User, 
    requests: ServiceRequest[], 
    users: User[], 
    jobPosts: JobPost[],
    onAddJobPost: (post: Omit<JobPost, 'id' | 'createdAt' | 'clientId'>) => void;
    onDeleteJobPost: (postId: number) => void;
}> = ({ client, requests, users, jobPosts, onAddJobPost, onDeleteJobPost }) => {
  const myRequests = requests.filter(r => r.clientId === client.id);
  const myJobPosts = jobPosts.filter(p => p.clientId === client.id);

  const [newPostCategory, setNewPostCategory] = useState(serviceCategories[0].name);
  const [newPostDescription, setNewPostDescription] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPostDescription.trim()) return;
      onAddJobPost({ serviceCategory: newPostCategory, description: newPostDescription });
      setNewPostDescription('');
  };

  return (
    <div className="space-y-12">
        <div>
            <h2 className="text-3xl font-bold text-gray-800">Minhas Solicitações</h2>
            <div className="mt-6 bg-white p-6 rounded-xl shadow-lg space-y-4">
                {myRequests.length > 0 ? myRequests.map(req => {
                    const professional = users.find(u => u.id === req.professionalId);
                    return (
                        <div key={req.id} className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <p className="font-bold text-lg text-blue-600">{req.serviceName}</p>
                                <p className="text-sm text-gray-600">Solicitado para: <span className="font-semibold">{professional?.name || 'Profissional não encontrado'}</span></p>
                                <p className="text-xs text-gray-500 mt-1">Em: {formatDate(req.createdAt)}</p>
                            </div>
                            <StatusBadge status={req.status} />
                        </div>
                    )
                }) : <p className="text-gray-500 italic">Você ainda não fez nenhuma solicitação de serviço.</p>}
            </div>
        </div>

        <div>
            <h2 className="text-3xl font-bold text-gray-800">Publicar uma Necessidade de Serviço</h2>
            <p className="text-gray-600 mt-2">Descreva o que você precisa e deixe os profissionais encontrarem você.</p>
            <form onSubmit={handlePostSubmit} className="mt-6 bg-white p-6 rounded-xl shadow-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                         <label htmlFor="serviceCategory" className="text-sm font-bold text-gray-600 block mb-1">Categoria</label>
                         <select id="serviceCategory" value={newPostCategory} onChange={(e) => setNewPostCategory(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                           {serviceCategories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                         </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="text-sm font-bold text-gray-600 block mb-1">Descrição do Serviço</label>
                        <textarea 
                            id="description" 
                            value={newPostDescription}
                            onChange={(e) => setNewPostDescription(e.target.value)}
                            rows={3} 
                            className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" 
                            placeholder="Ex: Preciso instalar um chuveiro novo e consertar um vazamento na pia da cozinha."></textarea>
                    </div>
                </div>
                <div className="text-right">
                    <AnimatedButton onClick={() => {}}>Publicar</AnimatedButton>
                </div>
            </form>

            <h3 className="text-2xl font-bold text-gray-700 mt-8">Serviços Publicados</h3>
             <div className="mt-4 bg-white p-6 rounded-xl shadow-lg space-y-4">
                {myJobPosts.length > 0 ? myJobPosts.map(post => (
                    <div key={post.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-start gap-4">
                       <div>
                           <p className="font-semibold text-blue-600">{post.serviceCategory}</p>
                           <p className="text-gray-700 mt-1">{post.description}</p>
                           <p className="text-xs text-gray-500 mt-2">Publicado em: {formatDate(post.createdAt)}</p>
                       </div>
                       <button onClick={() => onDeleteJobPost(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                           <TrashIcon className="w-5 h-5"/>
                       </button>
                    </div>
                )) : <p className="text-gray-500 italic">Você não tem nenhum serviço publicado no momento.</p>}
             </div>
        </div>
    </div>
  );
};

// Professional Dashboard View
const ProfessionalDashboard: React.FC<{ professional: User, requests: ServiceRequest[], users: User[], onUpdateStatus: (id: number, status: ServiceRequestStatus) => void, onUpdateUser: (user:User) => void }> = ({ professional, requests, users, onUpdateStatus, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState<'requests' | 'ongoing' | 'history' | 'clients' | 'edit'>('requests');
    const myRequests = requests.filter(r => r.professionalId === professional.id);

    const pendingRequests = useMemo(() => myRequests.filter(r => r.status === 'pending'), [myRequests]);
    const ongoingRequests = useMemo(() => myRequests.filter(r => r.status === 'accepted'), [myRequests]);
    const completedRequests = useMemo(() => myRequests.filter(r => r.status === 'completed'), [myRequests]);
    const totalCompleted = completedRequests.length;

    const uniqueClients = useMemo(() => {
        const clientIds = new Set(myRequests.map(req => req.clientId));
        return users.filter(user => clientIds.has(user.id));
    }, [myRequests, users]);

    const renderRequests = (reqs: ServiceRequest[], actions: 'pending' | 'ongoing' | 'none') => (
         <div className="space-y-4">
            {reqs.length > 0 ? reqs.map(req => {
                const client = users.find(u => u.id === req.clientId);
                return (
                    <div key={req.id} className="p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <p className="font-bold text-lg text-blue-600">{req.serviceName}</p>
                            <p className="text-sm text-gray-600">Cliente: <span className="font-semibold">{client?.name || 'Cliente desconhecido'}</span></p>
                            <p className="text-xs text-gray-500 mt-1">Solicitado em: {formatDate(req.createdAt)}</p>
                        </div>
                        <div className="flex gap-2">
                            {actions === 'pending' && <>
                                <AnimatedButton onClick={() => onUpdateStatus(req.id, 'accepted')} className="!px-4 !py-2 !text-sm !bg-green-500 hover:!bg-green-600">Aceitar</AnimatedButton>
                                <AnimatedButton onClick={() => onUpdateStatus(req.id, 'declined')} className="!px-4 !py-2 !text-sm !bg-red-500 hover:!bg-red-600">Recusar</AnimatedButton>
                            </>}
                             {actions === 'ongoing' && <>
                                <AnimatedButton onClick={() => onUpdateStatus(req.id, 'completed')} className="!px-4 !py-2 !text-sm">Marcar como Concluído</AnimatedButton>
                            </>}
                        </div>
                    </div>
                )
            }) : <p className="text-gray-500 italic text-center py-8">Nenhum serviço aqui.</p>}
        </div>
    );

    const tabs = [
        { id: 'requests', label: `Novas Solicitações (${pendingRequests.length})`, icon: null },
        { id: 'ongoing', label: 'Em Andamento', icon: null },
        { id: 'history', label: 'Histórico', icon: null },
        { id: 'clients', label: 'Meus Clientes', icon: UsersIcon },
        { id: 'edit', label: 'Editar Perfil', icon: null },
    ];

    return (
        <div>
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-lg font-semibold text-gray-600">Sua Nota Média</p>
                    <p className="text-5xl font-extrabold text-orange-500 mt-2">{(professional.rating || 0).toFixed(1)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-lg font-semibold text-gray-600">Serviços Concluídos</p>
                    <p className="text-5xl font-extrabold text-orange-500 mt-2">{totalCompleted}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 bg-white p-2 rounded-xl shadow-md flex flex-wrap items-center gap-2">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2 ${activeTab === tab.id ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-orange-100'}`}>
                        {tab.icon && <tab.icon className="w-5 h-5"/>}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-100 p-6 rounded-xl">
                {activeTab === 'requests' && renderRequests(pendingRequests, 'pending')}
                {activeTab === 'ongoing' && renderRequests(ongoingRequests, 'ongoing')}
                {activeTab === 'history' && renderRequests(completedRequests, 'none')}
                {activeTab === 'clients' && (
                    <div className="space-y-4">
                        {uniqueClients.length > 0 ? (
                            uniqueClients.map(client => (
                                <div key={client.id} className="p-4 bg-white rounded-lg shadow-md">
                                    <p className="font-bold text-lg text-gray-800">{client.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">Localização: <span className="font-semibold">{client.neighborhood}, {client.city}</span></p>
                                    <p className="text-sm text-gray-600">Telefone: <span className="font-semibold">{client.phone}</span></p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic text-center py-8">Sua lista de clientes aparecerá aqui assim que você concluir os serviços.</p>
                        )}
                    </div>
                )}
                {activeTab === 'edit' && <UserProfileForm user={professional} onSave={onUpdateUser} />}
            </div>
        </div>
    );
};


export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, users, serviceRequests, jobPosts, onUpdateRequestStatus, onUpdateUser, onAddJobPost, onDeleteJobPost, onBack }) => {
  return (
    <div>
      <BackButton onClick={onBack} />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Olá, <span className="animated-gradient bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">{currentUser.name.split(' ')[0]}</span>!
        </h1>
        <p className="text-lg text-gray-600 mt-2">Bem-vindo(a) ao seu painel.</p>
      </div>

      {currentUser.role === 'professional' ? (
        <ProfessionalDashboard 
            professional={currentUser} 
            requests={serviceRequests}
            users={users}
            onUpdateStatus={onUpdateRequestStatus}
            onUpdateUser={onUpdateUser}
        />
      ) : (
        <ClientProfile 
            client={currentUser} 
            requests={serviceRequests}
            users={users}
            jobPosts={jobPosts}
            onAddJobPost={onAddJobPost}
            onDeleteJobPost={onDeleteJobPost}
        />
      )}
    </div>
  );
};