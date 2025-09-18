import React, { useState } from 'react';
import type { User, ServiceRequest } from '../../types';
import { UserProfileForm } from '../UserProfileForm';
import { BackButton } from '../BackButton';
import { WalletPage } from './WalletPage';
// Fix: Added missing icon imports for BellIcon and ClipboardDocumentListIcon, and re-ordered them alphabetically.
import { BellIcon, ClipboardDocumentListIcon, UserCircleIcon, WalletIcon } from '../icons';


interface ProfilePageProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack: () => void;
  serviceRequests: ServiceRequest[];
  users: User[];
  onPayForService: (serviceRequest: ServiceRequest) => void;
  onAddFunds: () => void;
  onWithdraw: () => void;
}

const ServiceRequestCard: React.FC<{ request: ServiceRequest, viewer: User, users: User[], onPay: (request: ServiceRequest) => void }> = ({ request, viewer, users, onPay }) => {
    const isViewerClient = viewer.id === request.clientId;
    const otherPartyId = isViewerClient ? request.professionalId : request.clientId;
    const otherParty = users.find(u => u.id === otherPartyId);

    const statusStyles: Record<ServiceRequest['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-blue-100 text-blue-800',
        declined: 'bg-red-100 text-red-800',
        completed: 'bg-gray-100 text-gray-800',
        awaiting_payment: 'bg-orange-100 text-orange-800 animate-pulse',
        paid: 'bg-green-100 text-green-800'
    };
    
    const statusText: Record<ServiceRequest['status'], string> = {
        pending: 'Pendente',
        accepted: 'Aceito',
        declined: 'Recusado',
        completed: 'Concluído',
        awaiting_payment: 'Aguardando Pagamento',
        paid: 'Pago'
    };

    if (!otherParty) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-800">{request.service}</p>
                     <p className="text-sm text-gray-600">
                        {isViewerClient ? `Profissional: ${otherParty.name}` : `Cliente: ${otherParty.name}`}
                    </p>
                     <p className="text-xs text-gray-500 mt-1">
                        Data: {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[request.status]}`}>
                    {statusText[request.status]}
                </span>
            </div>
             <div className="mt-4 border-t pt-3 flex justify-between items-center">
                <p className="text-gray-800 font-bold text-lg">
                    Valor: <span className="text-green-600">TC$ {request.price?.toFixed(2)}</span>
                </p>
                {isViewerClient && request.status === 'awaiting_payment' && (
                    <button onClick={() => onPay(request)} className="bg-orange-500 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        Pagar Agora
                    </button>
                )}
            </div>
        </div>
    );
};


export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSave, onBack, serviceRequests, users, onPayForService, onAddFunds, onWithdraw }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'wallet'>('dashboard');

  const TabButton: React.FC<{ tabName: 'dashboard' | 'profile' | 'wallet', label: string, icon: React.FC<any>}> = ({ tabName, label, icon: Icon }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm rounded-t-lg border-b-4 transition-colors w-full
            ${activeTab === tabName ? 'text-orange-600 border-orange-500' : 'text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-800'}`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
  );

  return (
    <div>
      <BackButton onClick={onBack} />
       <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="flex items-center gap-4">
                 <img 
                    src={user.imageUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-300"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{user.nickname || user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                 <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors">
                    <BellIcon className="w-6 h-6"/>
                 </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 bg-white rounded-t-lg shadow-md">
            <TabButton tabName="dashboard" label="Painel" icon={ClipboardDocumentListIcon} />
            <TabButton tabName="profile" label="Meu Perfil" icon={UserCircleIcon} />
            <TabButton tabName="wallet" label="Carteira" icon={WalletIcon} />
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 p-6 rounded-b-xl shadow-inner min-h-[400px]">
            {activeTab === 'dashboard' && (
                 <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Minhas Solicitações</h2>
                    {serviceRequests.length > 0 ? (
                        <div className="space-y-4">
                            {serviceRequests.map(req => (
                                <ServiceRequestCard key={req.id} request={req} viewer={user} users={users} onPay={onPayForService}/>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-center py-8">Nenhuma solicitação encontrada.</p>
                    )}
                </div>
            )}
            {activeTab === 'profile' && <UserProfileForm user={user} onSave={onSave} />}
            {activeTab === 'wallet' && <WalletPage user={user} onAddFunds={onAddFunds} onWithdraw={onWithdraw} />}
        </div>
      </div>
    </div>
  );
};
