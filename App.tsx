
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { User, ServiceCategory, ChatMessage, UserCredentials, AiHelpResponse, UserStatus, ServiceRequest, ServiceRequestFormData, ActiveModal, Transaction, JobPost } from './types';
import { serviceCategories, mockUsers, mockServiceRequests } from './constants';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { FindProfessionalsPage } from './components/pages/FindProfessionalsPage';
import { ProfessionalModal } from './components/ProfessionalModal';
import { LoginModal } from './components/modals/LoginModal';
import { SignupModal } from './components/modals/SignupModal';
import { ChatModal } from './components/modals/ChatModal';
import { AdminPage } from './components/pages/AdminPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { PendingApprovalModal } from './components/modals/PendingApprovalModal';
import { CompleteProfileModal } from './components/modals/CompleteProfileModal';
import { EditUserModal } from './components/modals/EditUserModal';
import { OpportunitiesPage } from './components/pages/OpportunitiesPage';
import { AiHelpPage } from './components/pages/AiHelpPage';
import { ServiceRequestModal } from './components/modals/ServiceRequestModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { CtaModal } from './components/modals/CtaModal';
import { AddFundsModal } from './components/modals/AddFundsModal';
import { WithdrawModal } from './components/modals/WithdrawModal';
import { ServicePaymentModal } from './components/modals/ServicePaymentModal';


type Page = 'home' | 'findProfessionals' | 'profile' | 'admin' | 'opportunities' | 'aiHelp';

// Ensure the API_KEY is available. In a real app, you'd have a fallback or error message.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(null);
  
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);

  // New state for payment flow
  const [serviceToPay, setServiceToPay] = useState<ServiceRequest | null>(null);
  
  const handleLogin = (credentials: UserCredentials): { success: boolean, message?: string } => {
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      if(user.status === 'blocked') {
        return { success: false, message: 'Sua conta está bloqueada.' };
      }
      setCurrentUser(user);
      if (!user.isProfileComplete) {
        setActiveModal('completeProfile');
      } else if (user.role === 'professional' && user.status === 'pending') {
        setActiveModal('pendingApproval');
      } else {
        setActiveModal(null);
      }
      return { success: true };
    }
    return { success: false, message: 'Email ou senha inválidos.' };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleSignup = (newUser: Omit<User, 'id' | 'isProfileComplete' | 'regionId' | 'transactions'>): boolean => {
    if (users.some(u => u.email === newUser.email)) {
      alert('Este email já está em uso.');
      return false;
    }
    const user: User = {
      ...newUser,
      id: Date.now(),
      isProfileComplete: newUser.role === 'client',
      regionId: Math.ceil(Math.random() * 3), // Assign a random region
      status: newUser.role === 'professional' ? 'pending' : 'approved',
      rating: newUser.role === 'professional' ? 5.0 : undefined,
      reviewsCount: newUser.role === 'professional' ? 1 : undefined,
      walletBalanceTC: 0,
      transactions: [],
    };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);

    if (user.role === 'professional') {
        setActiveModal('pendingApproval');
    } else {
        setActiveModal(null);
    }
    return true;
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('findProfessionals');
  };

  const handleViewProfessional = (professional: User) => {
    setSelectedProfessional(professional);
    setActiveModal('professional');
  };
  
  const handleStartChat = () => {
      if (selectedProfessional) {
          setActiveModal('chat');
      }
  };

  const handleSendMessage = async (text: string) => {
      if (!currentUser || !selectedProfessional) return;
      
      const chatId = [currentUser.id, selectedProfessional.id].sort().join('-');
      const newMessage: ChatMessage = { senderId: currentUser.id, text, timestamp: new Date().toISOString() };
      
      setChatHistory(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), newMessage]
      }));

      setIsSendingMessage(true);

      // Simulate AI response
      try {
        const prompt = `Você é ${selectedProfessional.name}, um profissional de ${selectedProfessional.services?.join(', ')}. O cliente ${currentUser.name} disse: "${text}". Responda de forma prestativa, profissional e amigável.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const aiText = response.text;
        
        const aiMessage: ChatMessage = { senderId: selectedProfessional.id, text: aiText, timestamp: new Date().toISOString() };
        setChatHistory(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), aiMessage]
        }));

      } catch (error) {
          console.error("Error calling Gemini API:", error);
          const errorMessage: ChatMessage = { senderId: selectedProfessional.id, text: "Desculpe, estou com problemas para responder agora. Tente novamente mais tarde.", timestamp: new Date().toISOString() };
          setChatHistory(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), errorMessage]
          }));
      } finally {
        setIsSendingMessage(false);
      }
  };
  
  const handleUpdateUser = (updatedUser: User) => {
      const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u)
      setUsers(newUsers);
      if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
  };
  
  const handleUpdateUserStatus = (userId: number, status: UserStatus) => {
      setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
  };
  
  const handleDeleteUser = (userId: number) => {
      if (currentUser?.id === userId) {
          handleLogout();
      }
      setUsers(users.filter(u => u.id !== userId));
  };
  
  const handleApproveServiceChange = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId && u.servicesChangeRequest) {
        return { ...u, services: u.servicesChangeRequest, servicesChangeRequest: undefined };
      }
      return u;
    }));
  };

  const handleApproveProfileChange = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId && u.profileChangeRequest) {
        return { ...u, ...u.profileChangeRequest, profileChangeRequest: undefined };
      }
      return u;
    }));
  };
  
  const handleAiHelpRequest = async (problemDescription: string): Promise<AiHelpResponse> => {
      const prompt = `
        Um usuário da plataforma "TiãoService" descreveu o seguinte problema: "${problemDescription}".
        Analise o problema e retorne um JSON com a seguinte estrutura:
        {
          "is_diy": boolean,
          "solution_steps": [{ "step": number, "description": "string" }],
          "recommend_professional": boolean,
          "recommended_category": "string",
          "professional_reasoning": "string",
          "disclaimer": "string"
        }
        Seja conciso. A categoria deve ser uma das seguintes: ${serviceCategories.map(c => c.name).join(', ')}.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              is_diy: { type: Type.BOOLEAN },
              solution_steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { step: { type: Type.INTEGER }, description: { type: Type.STRING } }
                }
              },
              recommend_professional: { type: Type.BOOLEAN },
              recommended_category: { type: Type.STRING },
              professional_reasoning: { type: Type.STRING },
              disclaimer: { type: Type.STRING }
            }
          }
        }
      });
      
      const jsonText = response.text.trim();
      return JSON.parse(jsonText);
  };
  
  const handleOpenServiceRequestModal = (service: string) => {
      setActiveModal('serviceRequest');
  };

  const handleSubmitServiceRequest = (formData: ServiceRequestFormData) => {
    if (!currentUser || !selectedProfessional) return;
    const newRequest: ServiceRequest = {
        id: Date.now(),
        clientId: currentUser.id,
        professionalId: selectedProfessional.id,
        service: selectedProfessional.services ? selectedProfessional.services[0] : 'Serviço',
        status: 'pending',
        ...formData,
        createdAt: new Date().toISOString(),
        price: Math.floor(Math.random() * (300 - 50 + 1)) + 50 // Mock price
    };
    setServiceRequests(prev => [...prev, newRequest]);
    setActiveModal('confirmation');
  };

  // --- FINANCIAL HANDLERS ---
  const handleAddFunds = (amountBRL: number, bonusTC: number) => {
    if (!currentUser) return;
    const newBalance = (currentUser.walletBalanceTC || 0) + amountBRL + bonusTC;
    const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'deposit',
        amountTC: amountBRL + bonusTC,
        brlAmount: amountBRL,
        description: `Depósito de R$ ${amountBRL.toFixed(2)}`,
        timestamp: new Date().toISOString(),
    };
    if (bonusTC > 0) {
        const bonusTransaction: Transaction = {
            id: `tx_${Date.now()}_bonus`,
            type: 'bonus',
            amountTC: bonusTC,
            description: `Bônus de TC$ ${bonusTC.toFixed(2)}`,
            timestamp: new Date().toISOString(),
        };
        newTransaction.description += ` + Bônus`;
        const updatedUser = { ...currentUser, walletBalanceTC: newBalance, transactions: [...(currentUser.transactions || []), newTransaction, bonusTransaction] };
        handleUpdateUser(updatedUser);
    } else {
        const updatedUser = { ...currentUser, walletBalanceTC: newBalance, transactions: [...(currentUser.transactions || []), newTransaction] };
        handleUpdateUser(updatedUser);
    }
    setActiveModal(null);
  };

  const handleWithdraw = (amountTC: number, feeTC: number) => {
    if (!currentUser) return;
    const newBalance = (currentUser.walletBalanceTC || 0) - amountTC;
    const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'withdrawal',
        amountTC: amountTC,
        brlAmount: amountTC - feeTC,
        description: `Saque de R$ ${(amountTC - feeTC).toFixed(2)}`,
        timestamp: new Date().toISOString(),
    };
     const updatedUser = { ...currentUser, walletBalanceTC: newBalance, transactions: [...(currentUser.transactions || []), newTransaction] };
     handleUpdateUser(updatedUser);
     setActiveModal(null);
  };

  const handleServicePayment = (paymentType: 'tiaoCoin' | 'card', cost: number) => {
    if (!currentUser || !serviceToPay) return;

    const professional = users.find(u => u.id === serviceToPay.professionalId);
    if (!professional) return;
    
    let clientUpdate = { ...currentUser };
    let profUpdate = { ...professional };

    if (paymentType === 'tiaoCoin') {
        clientUpdate.walletBalanceTC = (clientUpdate.walletBalanceTC || 0) - cost;
        profUpdate.walletBalanceTC = (profUpdate.walletBalanceTC || 0) + cost;

        const clientTx: Transaction = { id: `tx_pay_${Date.now()}`, type: 'payment_sent', amountTC: cost, description: `Pagamento para ${professional.name}`, timestamp: new Date().toISOString() };
        const profTx: Transaction = { id: `tx_rec_${Date.now()}`, type: 'payment_received', amountTC: cost, description: `Pagamento de ${currentUser.name}`, timestamp: new Date().toISOString() };
        
        clientUpdate.transactions = [...(clientUpdate.transactions || []), clientTx];
        profUpdate.transactions = [...(profUpdate.transactions || []), profTx];

    } else { // 'card'
        // No balance change, just record the transaction for the pro
        profUpdate.walletBalanceTC = (profUpdate.walletBalanceTC || 0) + (serviceToPay.price || 0); // Pro gets base price
        const profTx: Transaction = { id: `tx_rec_${Date.now()}`, type: 'payment_received', amountTC: serviceToPay.price || 0, description: `Pagamento de ${currentUser.name} (Cartão)`, timestamp: new Date().toISOString() };
        profUpdate.transactions = [...(profUpdate.transactions || []), profTx];
    }
    
    // Update users
    const newUsers = users.map(u => {
        if (u.id === clientUpdate.id) return clientUpdate;
        if (u.id === profUpdate.id) return profUpdate;
        return u;
    });
    setUsers(newUsers);
    setCurrentUser(clientUpdate);
    
    // Update service request
    setServiceRequests(serviceRequests.map(r => r.id === serviceToPay.id ? { ...r, status: 'paid' } : r));
    
    // Close modals
    setServiceToPay(null);
    setActiveModal(null);
  };


  const professionals = users.filter(u => u.role === 'professional' && u.status === 'approved');
  const chatId = currentUser && selectedProfessional ? [currentUser.id, selectedProfessional.id].sort().join('-') : '';
  const currentChatMessages = chatHistory[chatId] || [];

  const renderPage = () => {
    switch (currentPage) {
      case 'findProfessionals':
        return <FindProfessionalsPage 
                  category={selectedCategory!} 
                  onViewProfessional={handleViewProfessional}
                  professionals={professionals}
                  currentUser={currentUser}
                  onBack={() => setCurrentPage('home')}
                />;
      case 'profile':
        if (!currentUser) {
            // This should not happen if logic is correct, but as a fallback:
            setCurrentPage('home');
            // Fix: Add a return statement to avoid rendering anything further.
            return null;
        }
        return <ProfilePage 
                    user={currentUser} 
                    onSave={handleUpdateUser} 
                    onBack={() => setCurrentPage('home')} 
                    serviceRequests={serviceRequests.filter(r => r.clientId === currentUser.id || r.professionalId === currentUser.id)} 
                    users={users}
                    onPayForService={(req) => { setServiceToPay(req); setActiveModal('servicePayment'); }}
                    onAddFunds={() => setActiveModal('addFunds')}
                    onWithdraw={() => setActiveModal('withdraw')}
                />;
      case 'admin':
        return <AdminPage 
                users={users} 
                onUpdateUserStatus={handleUpdateUserStatus}
                onDeleteUser={handleDeleteUser}
                onEditUser={(user) => { setSelectedProfessional(user); setActiveModal('editUser')}}
                onApproveServiceChange={handleApproveServiceChange}
                onApproveProfileChange={handleApproveProfileChange}
                onBack={() => setCurrentPage('home')}
               />;
      case 'opportunities':
        // Fix: The 'jobPosts' prop for OpportunitiesPage expects an array of JobPost objects.
        // The mockServiceRequests array is of type ServiceRequest[], which is not directly assignable.
        // To fix this, we can make the JobPost type compatible with ServiceRequest in types.ts
        // and update OpportunitiesPage to use the 'service' property instead of 'serviceCategory'.
        return <OpportunitiesPage currentUser={currentUser!} jobPosts={mockServiceRequests} users={users} onBack={() => setCurrentPage('home')} />;
      case 'aiHelp':
        return <AiHelpPage 
                  onAiHelpRequest={handleAiHelpRequest} 
                  professionals={professionals} 
                  onViewProfessional={handleViewProfessional} 
                  onBack={() => setCurrentPage('home')}
                />;
      case 'home':
      default:
        return <HomePage onSelectCategory={handleSelectCategory} categories={serviceCategories} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header 
        currentUser={currentUser} 
        onLogin={() => setActiveModal('login')} 
        onSignup={() => setActiveModal('signup')}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderPage()}
      </main>
      <Footer />

      {/* Modals */}
      {activeModal === 'professional' && selectedProfessional && (
        <ProfessionalModal 
          professional={selectedProfessional} 
          currentUser={currentUser}
          onClose={() => setActiveModal(null)} 
          onStartChat={handleStartChat}
          // Fix: The prop 'onOpenRequestModal' does not exist on ProfessionalModalProps. Renamed to 'onRequestService' to match the component's definition.
          onRequestService={handleOpenServiceRequestModal}
        />
      )}
      {activeModal === 'login' && (
        <LoginModal 
          onClose={() => setActiveModal(null)}
          onLogin={handleLogin}
          onSwitchToSignup={() => setActiveModal('signup')}
        />
      )}
      {activeModal === 'signup' && (
        <SignupModal
          onClose={() => setActiveModal(null)}
          onSignup={handleSignup}
          onSwitchToLogin={() => setActiveModal('login')}
        />
      )}
      {activeModal === 'chat' && currentUser && selectedProfessional && (
          <ChatModal
              currentUser={currentUser}
              professional={selectedProfessional}
              messages={currentChatMessages}
              onClose={() => setActiveModal(null)}
              onSendMessage={handleSendMessage}
              isSending={isSendingMessage}
          />
      )}
      {activeModal === 'pendingApproval' && <PendingApprovalModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'completeProfile' && currentUser && (
          <CompleteProfileModal 
            user={currentUser} 
            onClose={() => setActiveModal(null)} 
            onSave={(updatedUser) => {
                handleUpdateUser(updatedUser);
                if (updatedUser.role === 'professional' && updatedUser.status === 'pending') {
                    setActiveModal('pendingApproval');
                } else {
                    setActiveModal(null);
                }
            }}
          />
      )}
       {activeModal === 'editUser' && selectedProfessional && (
        <EditUserModal 
          user={selectedProfessional} 
          onClose={() => setActiveModal(null)} 
          onSave={handleUpdateUser}
        />
      )}
      {activeModal === 'serviceRequest' && selectedProfessional && (
        <ServiceRequestModal
            professional={selectedProfessional}
            service={selectedProfessional.services ? selectedProfessional.services[0] : ''}
            onClose={() => setActiveModal(null)}
            onSubmit={handleSubmitServiceRequest}
        />
      )}
       {activeModal === 'confirmation' && <ConfirmationModal onClose={() => setActiveModal(null)} />}
       {activeModal === 'cta' && (
        <CtaModal 
          onClose={() => setActiveModal(null)} 
          onSubmit={(name) => {
            const message = encodeURIComponent(`Olá, meu nome é ${name} e vim pelo site TiãoService!`);
            window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
            setActiveModal(null);
          }} 
        />
      )}
      {activeModal === 'addFunds' && (
        <AddFundsModal onClose={() => setActiveModal(null)} onAddFunds={handleAddFunds} />
      )}
      {activeModal === 'withdraw' && currentUser && (
        <WithdrawModal 
            onClose={() => setActiveModal(null)} 
            onWithdraw={handleWithdraw}
            currentBalanceTC={currentUser.walletBalanceTC || 0}
        />
      )}
      {activeModal === 'servicePayment' && currentUser && serviceToPay && (
        <ServicePaymentModal 
            onClose={() => { setServiceToPay(null); setActiveModal(null); }}
            onPayWithTiaoCoin={(cost) => handleServicePayment('tiaoCoin', cost)}
            onPayWithCard={(cost) => handleServicePayment('card', cost)}
            request={serviceToPay}
            client={currentUser}
            professional={users.find(u => u.id === serviceToPay.professionalId)!}
        />
      )}
    </div>
  );
};
