
import React, { useState } from 'react';
import type { User, ServiceRequest } from '../../types';
import { UserProfileForm } from '../UserProfileForm';
import { BackButton } from '../BackButton';
import { WalletPage } from './WalletPage';
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
  onExchange: () => void; // Added prop
}

const ServiceRequestCard: React.FC<{ request: ServiceRequest, viewer: User, users: User[], onPay: (request: ServiceRequest) => void }> = ({ request, viewer, users, onPay }) => {
    // ... (Existing ServiceRequestCard code remains unchanged)
    const isViewerClient = viewer.id === request.clientId;
    const otherPartyId = isViewerClient ? request.professionalId : request.clientId;
    const otherParty = users.find(u => u.id === otherPartyId);

    const statusStyles: Record<ServiceRequest['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        accepted: 'bg-blue-100 text-blue-800 border-blue-200',
        declined: 'bg-red-100 text-red-800 border-red-200',
        completed: 'bg-slate-100 text-slate-800 border-slate-200',
        awaiting_payment: 'bg-orange-100 text-orange-800 animate-pulse border-orange-200',
        paid: 'bg-emerald-100 text-emerald-800 border-emerald-200'
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
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:border-orange-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">{request.service}</h3>
                     <p className="text-sm font-medium text-slate-500 mt-1">
                        {isViewerClient ? `Profissional: ${otherParty.name}` : `Cliente: ${otherParty.name}`}
                    </p>
                </div>
                <span className={`px-4 py-1.5 text-xs font-extrabold rounded-full border uppercase tracking-wider ${statusStyles[request.status]}`}>
                    {statusText[request.status]}
                </span>
            </div>
            
             <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                <p className="text-slate-600 text-sm italic">"{request.description}"</p>
             </div>
             
             <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                <div>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Solicitado em</p>
                     <p className="text-slate-700 font-medium">{new Date(request.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Valor Total</p>
                    <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">TC$ {request.price?.toFixed(2)}</p>
                </div>
            </div>

            {isViewerClient && request.status === 'awaiting_payment' && (
                <button onClick={() => onPay(request)} className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold text-lg px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1">
                    Pagar Agora
                </button>
            )}
        </div>
    );
};


export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSave, onBack, serviceRequests, users, onPayForService, onAddFunds, onWithdraw, onExchange }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'wallet'>('dashboard');

  const TabButton: React.FC<{ tabName: 'dashboard' | 'profile' | 'wallet', label: string, icon: React.FC<any>}> = ({ tabName, label, icon: Icon }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center justify-center gap-2 px-8 py-5 font-bold text-sm transition-all relative flex-1
            ${activeTab === tabName ? 'text-orange-600 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
    >
        <Icon className={`w-5 h-5 ${activeTab === tabName ? 'text-orange-500' : 'text-slate-400'}`} />
        {label}
        {activeTab === tabName && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-full"></span>
        )}
    </button>
  );

  return (
    <div>
      <BackButton onClick={onBack} />
       <div className="relative max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 sm:p-10 mb-8 border border-white/50 relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between relative z-10 gap-6">
                <div className="flex items-center gap-6">
                     <div className="relative">
                        <img 
                            src={user.imageUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                            alt={user.name} 
                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-slate-50"
                        />
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                     </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-1">{user.nickname || user.name}</h1>
                        <p className="text-slate-500 font-medium text-lg mb-3">{user.email}</p>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-600 uppercase tracking-widest border border-slate-200">
                            {user.role === 'professional' ? 'Profissional Certificado' : 'Cliente Vip'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <button className="p-4 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all shadow-sm border border-slate-100 relative group">
                        <BellIcon className="w-7 h-7"/>
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                     </button>
                </div>
            </div>
        </div>

        {/* Tabs & Content Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white/60">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
                <TabButton tabName="dashboard" label="Painel Geral" icon={ClipboardDocumentListIcon} />
                <TabButton tabName="profile" label="Editar Perfil" icon={UserCircleIcon} />
                <TabButton tabName="wallet" label="Minha Carteira" icon={WalletIcon} />
            </div>

            {/* Content Area */}
            <div className="p-8 sm:p-12 min-h-[500px] bg-white">
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Solicitações Recentes</h2>
                            <button className="text-sm font-bold text-orange-500 hover:text-orange-600">Ver todas</button>
                        </div>
                        {serviceRequests.length > 0 ? (
                            <div className="grid gap-6">
                                {serviceRequests.map(req => (
                                    <ServiceRequestCard key={req.id} request={req} viewer={user} users={users} onPay={onPayForService}/>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-slate-100 border-dashed flex flex-col items-center">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                    <ClipboardDocumentListIcon className="w-10 h-10 text-slate-300"/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">Nenhuma solicitação</h3>
                                <p className="text-slate-500 font-medium">Você ainda não tem serviços ativos.</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'profile' && <div className="animate-fade-in-up"><UserProfileForm user={user} onSave={onSave} /></div>}
                {activeTab === 'wallet' && <div className="animate-fade-in-up"><WalletPage user={user} onAddFunds={onAddFunds} onWithdraw={onWithdraw} onExchange={onExchange} /></div>}
            </div>
        </div>
      </div>
      <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.4s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
