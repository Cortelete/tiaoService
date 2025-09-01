import React from 'react';
import type { User, UserStatus } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { PencilSquareIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '../icons';
import { BackButton } from '../BackButton';

interface AdminPageProps {
  users: User[];
  onUpdateUserStatus: (userId: number, status: UserStatus) => void;
  onDeleteUser: (userId: number) => void;
  onEditUser: (user: User) => void;
  onApproveChange: (userId: number) => void;
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ users, onUpdateUserStatus, onDeleteUser, onEditUser, onApproveChange, onBack }) => {
  const pendingProfessionals = users.filter(u => u.role === 'professional' && u.status === 'pending');
  const serviceChangeRequests = users.filter(u => u.role === 'professional' && u.servicesChangeRequest && u.servicesChangeRequest.length > 0);
  const otherUsers = users.filter(u => u.role !== 'admin');

  const getStatusBadge = (status?: UserStatus) => {
    switch (status) {
      case 'approved': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Aprovado</span>;
      case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pendente</span>;
      case 'blocked': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Bloqueado</span>;
      default: return null;
    }
  };

  const UserRow = ({ user }: { user: User }) => (
    <div className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
            <p className="font-semibold text-gray-800">{user.name}</p>
            {getStatusBadge(user.status)}
        </div>
        <p className="text-sm text-gray-500">{user.email} | <span className="font-medium text-gray-600">{user.role === 'professional' ? 'Profissional' : 'Cliente'}</span></p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
         {user.status !== 'pending' && (
            <button onClick={() => onEditUser(user)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><PencilSquareIcon className="w-5 h-5"/></button>
         )}
         {user.status === 'blocked'
            ? <button onClick={() => onUpdateUserStatus(user.id, 'approved')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors"><LockOpenIcon className="w-5 h-5"/></button>
            : <button onClick={() => onUpdateUserStatus(user.id, 'blocked')} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors"><LockClosedIcon className="w-5 h-5"/></button>
         }
         <button onClick={() => { if(window.confirm(`Tem certeza que deseja remover ${user.name}?`)) onDeleteUser(user.id)}} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"><TrashIcon className="w-5 h-5"/></button>
      </div>
    </div>
  );

  return (
    <div>
      <BackButton onClick={onBack} />
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Painel Administrativo
      </h1>

      {/* Actionable Items Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Pending Approvals */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Aprovações Pendentes ({pendingProfessionals.length})</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {pendingProfessionals.length > 0 ? pendingProfessionals.map(user => (
              <div key={user.id} className="p-3 bg-white rounded-lg flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.services?.join(', ')}</p>
                </div>
                <AnimatedButton onClick={() => onUpdateUserStatus(user.id, 'approved')} className="!px-3 !py-1.5 text-sm">Aprovar</AnimatedButton>
              </div>
            )) : <p className="text-yellow-700 italic">Nenhuma aprovação pendente.</p>}
          </div>
        </div>
        {/* Service Change Requests */}
         <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Mudanças de Serviço ({serviceChangeRequests.length})</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
             {serviceChangeRequests.length > 0 ? serviceChangeRequests.map(user => (
              <div key={user.id} className="p-3 bg-white rounded-lg flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.services?.join(', ')} → <span className="font-bold text-blue-600">{user.servicesChangeRequest?.join(', ')}</span></p>
                </div>
                <AnimatedButton onClick={() => onApproveChange(user.id)} className="!bg-blue-500 hover:!bg-blue-600 !px-3 !py-1.5 text-sm">Aprovar Mudança</AnimatedButton>
              </div>
            )) : <p className="text-blue-700 italic">Nenhuma solicitação.</p>}
          </div>
        </div>
      </div>
      
      {/* All Users List */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Gerenciar Usuários ({otherUsers.length})</h2>
        <div className="space-y-3">
          {otherUsers.map(user => <UserRow key={user.id} user={user} />)}
        </div>
      </div>
    </div>
  );
};