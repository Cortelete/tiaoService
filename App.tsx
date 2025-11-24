
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { FindProfessionalsPage } from './components/pages/FindProfessionalsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AdminPage } from './components/pages/AdminPage';
import { OpportunitiesPage } from './components/pages/OpportunitiesPage';
import { AiHelpPage } from './components/pages/AiHelpPage';
import { LoginModal } from './components/modals/LoginModal';
import { SignupModal } from './components/modals/SignupModal';
import { CompleteProfileModal } from './components/modals/CompleteProfileModal';
import { EditUserModal } from './components/modals/EditUserModal';
import { PendingApprovalModal } from './components/modals/PendingApprovalModal';
import { ProfessionalModal } from './components/ProfessionalModal';
import { ServiceRequestModal } from './components/modals/ServiceRequestModal';
import { ChatModal } from './components/modals/ChatModal';
import { CtaModal } from './components/modals/CtaModal';
import { AddFundsModal } from './components/modals/AddFundsModal';
import { WithdrawModal } from './components/modals/WithdrawModal';
import { ExchangeModal } from './components/modals/ExchangeModal';
import { ServicePaymentModal } from './components/modals/ServicePaymentModal';
import { EmergencyChatModal } from './components/modals/EmergencyChatModal';
import { JoinInvitationModal } from './components/modals/JoinInvitationModal';
import { FeatureModal } from './components/modals/FeatureModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { OnboardingTour, TourStep } from './components/OnboardingTour';

import { mockUsers, mockServiceRequests, serviceCategories } from './constants';
import type { User, ServiceRequest, UserCredentials, AiHelpResponse, UserStatus, FeatureContent, ChatMessage, ActiveModal } from './types';
import { GoogleGenAI } from "@google/genai";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const App = () => {
  // State
  const [currentPage, setCurrentPage] = useState<'home' | 'professionals' | 'profile' | 'admin' | 'opportunities' | 'aiHelp'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [featureContent, setFeatureContent] = useState<FeatureContent | null>(null);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // AI Help State
  const [aiQuery, setAiQuery] = useState('');
  const [emergencyMessages, setEmergencyMessages] = useState<ChatMessage[]>([]);

  // Payment State
  const [serviceToPay, setServiceToPay] = useState<ServiceRequest | null>(null);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Tour Steps Configuration
  const clientTourSteps: TourStep[] = [
      {
          title: "Bem-vindo ao TiãoService! ✨",
          content: "Olá! Eu sou a Mia, sua assistente virtual. Vou te mostrar como encontrar os melhores serviços da cidade em poucos segundos."
      },
      {
          targetId: "home-search-bar",
          title: "MIAjuda Inteligente",
          content: "Aqui é onde a mágica acontece. Não sabe qual profissional chamar? Apenas descreva seu problema (ex: 'vazamento na pia') e eu encontrarei a solução ideal para você."
      },
      {
          targetId: "home-categories",
          title: "Explore Categorias",
          content: "Prefere navegar? Aqui você encontra nossos especialistas divididos por área, todos verificados e avaliados."
      },
      {
          targetId: "header-wallet-btn",
          title: "Sua Carteira Digital",
          content: "Aqui você gerencia seus TiãoCoins (TC$). Lembre-se: pagar com nossa moeda garante 5% de desconto em qualquer serviço!"
      },
      {
          targetId: "header-profile-btn",
          title: "Seu Espaço",
          content: "Acesse seu perfil para ver suas solicitações, editar seus dados e acompanhar o status dos serviços. Aproveite a experiência TiãoService!"
      }
  ];

  const professionalTourSteps: TourStep[] = [
      {
          title: "Bem-vindo, Parceiro! 🛠️",
          content: "Olá! Eu sou a Mia. Estou aqui para ajudar você a turbinar seus ganhos no TiãoService."
      },
      {
          targetId: "header-wallet-btn",
          title: "Seus Ganhos",
          content: "Acompanhe seu saldo em tempo real aqui. Você recebe em TiãoCoins ou Reais e pode sacar para sua conta bancária quando quiser."
      },
      {
          targetId: "header-profile-btn",
          title: "Menu Completo",
          content: "Clique aqui para acessar as 'Oportunidades' (novos serviços), editar seu perfil profissional e ver suas avaliações."
      },
      {
          title: "Tudo Pronto!",
          content: "Mantenha seu perfil atualizado e fique atento às notificações. Bons negócios!"
      }
  ];

  const handleTourComplete = () => {
      if (currentUser) {
          const updatedUser = { ...currentUser, hasSeenOnboarding: true };
          setCurrentUser(updatedUser);
          // In a real app, we would make an API call here to persist this state
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      }
      setShowOnboarding(false);
  };

  const handleLogin = (credentials: UserCredentials) => {
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
        if (user.status === 'blocked') {
             return { success: false, message: 'Sua conta está bloqueada. Contate o suporte.' };
        }
        setCurrentUser(user);
        setActiveModal(null);
        if (!user.isProfileComplete) {
            setActiveModal('completeProfile');
        } else if (user.hasSeenOnboarding === false) {
             // Trigger onboarding if user hasn't seen it
             setTimeout(() => setShowOnboarding(true), 500);
        }
        return { success: true };
    }
    return { success: false };
  };

  const handleSignup = (newUser: any) => {
      const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const user: User = { 
          ...newUser, 
          id, 
          isProfileComplete: false, 
          status: newUser.role === 'professional' ? 'pending' : 'approved',
          regionId: 1, // Default region
          transactions: [],
          hasSeenOnboarding: false // New users haven't seen the tour
      };
      setUsers([...users, user]);
      setCurrentUser(user);
      setActiveModal('completeProfile');
      return true;
  };

  const handleCompleteProfile = (updatedUser: User) => {
      handleUpdateUser(updatedUser);
      if(updatedUser.role === 'professional' && updatedUser.status === 'pending') {
          setActiveModal('pendingApproval');
      } else {
          // If profile is complete and not pending, show onboarding
          setShowOnboarding(true);
      }
  };

  const handleUpdateUser = (updatedUser: User) => {
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setCurrentPage('home');
      setActiveModal(null);
      setShowOnboarding(false);
  };

  const handleAiHelpRequest = async (problemDescription: string): Promise<AiHelpResponse> => {
        try {
            const model = "gemini-2.5-flash"; // Basic text task
            const prompt = `
            Você é a Mia, assistente virtual do TiãoService.
            Analise o seguinte problema relatado pelo usuário: "${problemDescription}"

            Responda APENAS com um objeto JSON válido (sem markdown, sem \`\`\`json) com o seguinte formato:
            {
                "is_emergency": boolean, // Se envolve risco à vida ou propriedade imediato (fogo, vazamento gás, crime)
                "is_diy": boolean, // Se pode ser resolvido facilmente pelo usuário leigo
                "solution_steps": [{"step": 1, "description": "..."}], // Passos se for DIY, caso contrário vazio
                "recommend_professional": boolean, // Se precisa de um profissional
                "recommended_categories": string[], // Lista de categorias de serviço do app (ex: Encanador, Eletricista) que resolvem isso. Use as categorias: ${serviceCategories.map(c => c.name).join(', ')}.
                "professional_reasoning": string, // Por que contratar um profissional (curto)
                "disclaimer": string // Aviso de segurança se aplicável
            }
            `;

            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
            });
            
            const text = response.text;
            // Basic cleanup if model adds markdown blocks
            const jsonStr = text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error("AI Error", error);
            throw error;
        }
  };
  
  const handleEmergencyDetected = async (text: string) => {
      // 1. Clear previous or set initial state
      setEmergencyMessages([]);
      setActiveModal('emergencyChat');
      
      // 2. Add user's initial message to chat
      const userMsg: ChatMessage = { 
          senderId: currentUser?.id || 0, 
          text: text, 
          timestamp: new Date().toISOString() 
      };
      setEmergencyMessages([userMsg]);
      setIsSendingMessage(true);

      try {
          // 3. Generate immediate AI guidance
          const response = await ai.models.generateContent({
               model: "gemini-2.5-flash",
               contents: `
                Você é a Mia, assistente de emergência do TiãoService.
                O usuário relatou: "${text}".
                
                Seu objetivo: Acalmar e dar a primeira instrução de segurança CRÍTICA.
                Se for saúde/clínico (infarto, desmaio), instrua a ligar para o SAMU (192).
                Se for trauma/acidente/fogo (batida, queda, incêndio), instrua a ligar para Bombeiros/Siate (193).
                Se for crime, Polícia (190).
                
                Seja curta, humana e empática. Não faça listas longas agora.
               `,
           });

           const aiMsg: ChatMessage = { 
               senderId: -1, 
               text: response.text || "Estou aqui com você. Por favor, mantenha a calma. Se houver risco imediato à vida, ligue para os serviços de emergência nos botões acima.", 
               timestamp: new Date().toISOString() 
           };
           setEmergencyMessages(prev => [...prev, aiMsg]);
      } catch (e) {
          console.error(e);
      } finally {
          setIsSendingMessage(false);
      }
  };

  const handleEmergencyMessage = async (text: string) => {
       const newMsg: ChatMessage = { senderId: currentUser?.id || 0, text, timestamp: new Date().toISOString() };
       setEmergencyMessages(prev => [...prev, newMsg]);
       setIsSendingMessage(true);
       
       try {
           const response = await ai.models.generateContent({
               model: "gemini-2.5-flash",
               contents: `
               Você é a Mia, IA de suporte a emergências.
               Histórico recente: O usuário está em uma situação de possível emergência.
               Mensagem atual do usuário: "${text}".
               
               Aja com calma, empatia e objetividade.
               1. Acolha o sentimento.
               2. Dê uma instrução clara do que fazer (ou não fazer) enquanto a ajuda não chega.
               3. Reforce qual número ligar se a situação piorar (192, 193, 190).
               `,
           });
           
           const aiMsg: ChatMessage = { senderId: -1, text: response.text || '', timestamp: new Date().toISOString() };
           setEmergencyMessages(prev => [...prev, aiMsg]);
       } catch (e) {
           console.error(e);
       } finally {
           setIsSendingMessage(false);
       }
  };

  // Wallet Logic
  const handleAddFunds = (amount: number, currency: 'BRL' | 'TC') => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser };
      
      if (currency === 'TC') {
          updatedUser.walletBalanceTC = (updatedUser.walletBalanceTC || 0) + amount;
          updatedUser.transactions = [...(updatedUser.transactions || []), {
              id: Date.now().toString(),
              type: 'deposit',
              amountTC: amount,
              description: 'Compra de TiãoCoins',
              timestamp: new Date().toISOString()
          }];
      } else {
          const fee = amount * 0.02;
          const finalAmount = amount - fee;
          updatedUser.walletBalanceBRL = (updatedUser.walletBalanceBRL || 0) + finalAmount;
          updatedUser.transactions = [...(updatedUser.transactions || []), {
              id: Date.now().toString(),
              type: 'deposit',
              amountBRL: finalAmount,
              description: `Depósito BRL (Taxa R$ ${fee.toFixed(2)})`,
              timestamp: new Date().toISOString()
          }];
      }
      handleUpdateUser(updatedUser);
      setActiveModal(null);
  };

  const handleWithdraw = (amountTC: number, fee: number) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser };
      updatedUser.walletBalanceTC = (updatedUser.walletBalanceTC || 0) - amountTC;
      
      updatedUser.transactions = [...(updatedUser.transactions || []), {
          id: Date.now().toString(),
          type: 'withdrawal',
          amountTC: -amountTC,
          description: `Saque (Taxa TC$ ${fee.toFixed(2)})`,
          timestamp: new Date().toISOString()
      }];
      handleUpdateUser(updatedUser);
      setActiveModal(null);
  };

  const handleExchange = (from: 'BRL' | 'TC', amount: number) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser };
      
      if (from === 'BRL') {
          updatedUser.walletBalanceBRL = (updatedUser.walletBalanceBRL || 0) - amount;
          updatedUser.walletBalanceTC = (updatedUser.walletBalanceTC || 0) + amount; // 1:1
          updatedUser.transactions = [...(updatedUser.transactions || []), {
              id: Date.now().toString(),
              type: 'exchange',
              amountBRL: -amount,
              amountTC: amount,
              description: 'Conversão R$ para TC$',
              timestamp: new Date().toISOString()
          }];
      } else {
           updatedUser.walletBalanceTC = (updatedUser.walletBalanceTC || 0) - amount;
           const receive = amount * 0.98; // 2% fee
           updatedUser.walletBalanceBRL = (updatedUser.walletBalanceBRL || 0) + receive;
           updatedUser.transactions = [...(updatedUser.transactions || []), {
              id: Date.now().toString(),
              type: 'exchange',
              amountTC: -amount,
              amountBRL: receive,
              description: 'Conversão TC$ para R$',
              timestamp: new Date().toISOString()
          }];
      }
      handleUpdateUser(updatedUser);
      setActiveModal(null);
  };

  const handlePayForService = (amountTC: number) => {
      if (!currentUser || !serviceToPay) return;
      
      // Update Client (Payer)
      const updatedClient = { ...currentUser };
      updatedClient.walletBalanceTC = (updatedClient.walletBalanceTC || 0) - amountTC;
      updatedClient.transactions = [...(updatedClient.transactions || []), {
          id: Date.now().toString() + 'c',
          type: 'payment_sent',
          amountTC: -amountTC,
          description: `Pagamento: ${serviceToPay.service}`,
          timestamp: new Date().toISOString(),
          toUserId: serviceToPay.professionalId
      }];
      
      // Update Professional (Receiver)
      const professional = users.find(u => u.id === serviceToPay.professionalId);
      if (professional) {
          const updatedProf = { ...professional };
          updatedProf.walletBalanceTC = (updatedProf.walletBalanceTC || 0) + amountTC;
          updatedProf.transactions = [...(updatedProf.transactions || []), {
              id: Date.now().toString() + 'p',
              type: 'payment_received',
              amountTC: amountTC,
              description: `Recebimento: ${serviceToPay.service}`,
              timestamp: new Date().toISOString(),
              fromUserId: currentUser.id
          }];
          setUsers(users.map(u => u.id === updatedProf.id ? updatedProf : (u.id === updatedClient.id ? updatedClient : u)));
      } else {
          setUsers(users.map(u => u.id === updatedClient.id ? updatedClient : u));
      }
      
      setCurrentUser(updatedClient);
      
      // Update Service Request Status
      setServiceRequests(prev => prev.map(req => req.id === serviceToPay.id ? { ...req, status: 'paid' } : req));
      
      setActiveModal(null);
      setServiceToPay(null);
  };

    const handlePayForServiceBRL = (amountBRL: number) => {
      if (!currentUser || !serviceToPay) return;
      
      // Update Client (Payer)
      const updatedClient = { ...currentUser };
      updatedClient.walletBalanceBRL = (updatedClient.walletBalanceBRL || 0) - amountBRL;
      updatedClient.transactions = [...(updatedClient.transactions || []), {
          id: Date.now().toString() + 'c',
          type: 'payment_sent',
          amountBRL: -amountBRL,
          description: `Pagamento: ${serviceToPay.service}`,
          timestamp: new Date().toISOString(),
          toUserId: serviceToPay.professionalId
      }];
      
      const basePrice = serviceToPay.price || 0;

      const professional = users.find(u => u.id === serviceToPay.professionalId);
      if (professional) {
          const updatedProf = { ...professional };
          updatedProf.walletBalanceBRL = (updatedProf.walletBalanceBRL || 0) + basePrice;
          updatedProf.transactions = [...(updatedProf.transactions || []), {
              id: Date.now().toString() + 'p',
              type: 'payment_received',
              amountBRL: basePrice,
              description: `Recebimento: ${serviceToPay.service}`,
              timestamp: new Date().toISOString(),
              fromUserId: currentUser.id
          }];
          setUsers(users.map(u => u.id === updatedProf.id ? updatedProf : (u.id === updatedClient.id ? updatedClient : u)));
      } else {
          setUsers(users.map(u => u.id === updatedClient.id ? updatedClient : u));
      }
      
      setCurrentUser(updatedClient);
      
      setServiceRequests(prev => prev.map(req => req.id === serviceToPay.id ? { ...req, status: 'paid' } : req));
      
      setActiveModal(null);
      setServiceToPay(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage 
                  categories={serviceCategories} 
                  onSelectCategory={(cat) => { setSelectedCategory(cat); setCurrentPage('professionals'); }}
                  currentUser={currentUser}
                  onAiSearch={(query) => { setAiQuery(query); setCurrentPage('aiHelp'); }}
                  onShowFeature={(content) => { setFeatureContent(content); setActiveModal('featureDetails'); }}
                  onJoinInvitation={() => setActiveModal('joinInvitation')}
                  professionals={users.filter(u => u.role === 'professional' && u.status === 'approved')}
                  onViewProfessional={(prof) => { setSelectedProfessional(prof); setActiveModal('professional'); }}
               />;
      case 'professionals':
        return <FindProfessionalsPage 
                  category={selectedCategory} 
                  professionals={users.filter(u => u.role === 'professional' && u.status === 'approved')} 
                  currentUser={currentUser}
                  onViewProfessional={(prof) => { setSelectedProfessional(prof); setActiveModal('professional'); }}
                  onBack={() => setCurrentPage('home')}
               />;
      case 'profile':
        if (!currentUser) {
            setCurrentPage('home');
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
                    onExchange={() => setActiveModal('exchange')}
                />;
      case 'admin':
        if (currentUser?.role !== 'admin') return null;
        return <AdminPage 
                  users={users} 
                  onUpdateUserStatus={(uid, status) => setUsers(users.map(u => u.id === uid ? { ...u, status } : u))}
                  onDeleteUser={(uid) => setUsers(users.filter(u => u.id !== uid))}
                  onEditUser={(u) => { setSelectedProfessional(u); setActiveModal('editUser'); }}
                  onApproveServiceChange={(uid) => {
                      setUsers(users.map(u => {
                          if (u.id === uid && u.servicesChangeRequest) {
                              return { ...u, services: u.servicesChangeRequest, servicesChangeRequest: undefined };
                          }
                          return u;
                      }));
                  }}
                  onApproveProfileChange={(uid) => {
                       setUsers(users.map(u => {
                          if (u.id === uid && u.profileChangeRequest) {
                              return { ...u, ...u.profileChangeRequest, profileChangeRequest: undefined };
                          }
                          return u;
                      }));
                  }}
                  onBack={() => setCurrentPage('home')}
               />;
      case 'opportunities':
        if (!currentUser) return null;
        return <OpportunitiesPage 
            currentUser={currentUser} 
            jobPosts={[]}
            users={users}
            onBack={() => setCurrentPage('home')}
        />;
      case 'aiHelp':
        return <AiHelpPage 
            professionals={users.filter(u => u.role === 'professional' && u.status === 'approved')}
            onAiHelpRequest={handleAiHelpRequest}
            onViewProfessional={(prof) => { setSelectedProfessional(prof); setActiveModal('professional'); }}
            onBack={() => setCurrentPage('home')}
            initialQuery={aiQuery}
            onEmergencyDetected={handleEmergencyDetected}
        />;
      default:
        return null;
    }
  };
  
  useEffect(() => {
      if (!currentUser && (currentPage === 'profile' || currentPage === 'opportunities' || currentPage === 'admin')) {
          setCurrentPage('home');
      }
  }, [currentUser, currentPage]);

  const isLandingPage = !currentUser && currentPage === 'home';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header 
        currentUser={currentUser} 
        onLogin={() => setActiveModal('login')} 
        onSignup={() => setActiveModal('signup')} 
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
      />
      
      {/* Onboarding Tour */}
      {showOnboarding && currentUser && (
          <OnboardingTour 
            steps={currentUser.role === 'professional' ? professionalTourSteps : clientTourSteps}
            onComplete={handleTourComplete}
            onSkip={handleTourComplete}
          />
      )}
      
      {/* Remove padding-bottom when on landing page to remove white gap */}
      <main className={isLandingPage ? "w-full" : "container mx-auto px-4 py-8 pb-32"}>
        {renderPage()}
      </main>
      
      {/* Remove margin-top when on landing page so footer connects with dark home page background */}
      <Footer className={isLandingPage ? "" : "mt-12"} />

      {activeModal === 'login' && <LoginModal onClose={() => setActiveModal(null)} onLogin={handleLogin} onSwitchToSignup={() => setActiveModal('signup')} />}
      {activeModal === 'signup' && <SignupModal onClose={() => setActiveModal(null)} onSignup={handleSignup} onSwitchToLogin={() => setActiveModal('login')} />}
      {activeModal === 'completeProfile' && currentUser && <CompleteProfileModal user={currentUser} onClose={() => setActiveModal(null)} onSave={handleCompleteProfile} />}
      {activeModal === 'pendingApproval' && <PendingApprovalModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'professional' && selectedProfessional && (
        <ProfessionalModal 
            professional={selectedProfessional} 
            currentUser={currentUser}
            onClose={() => setActiveModal(null)} 
            onStartChat={() => {
                if(!currentUser) { setActiveModal('login'); return; }
                setActiveModal('chat');
                setChatMessages([{ senderId: selectedProfessional.id, text: `Olá ${currentUser.name}! Como posso ajudar com ${selectedProfessional.services?.[0]}?`, timestamp: new Date().toISOString() }]);
            }}
            onRequestService={(service) => {
                if(!currentUser) { setActiveModal('login'); return; }
                setSelectedService(service);
                setActiveModal('serviceRequest');
            }}
        />
      )}
      {activeModal === 'chat' && currentUser && selectedProfessional && (
          <ChatModal 
            currentUser={currentUser}
            professional={selectedProfessional}
            messages={chatMessages}
            onClose={() => setActiveModal(null)}
            onSendMessage={(text) => {
                setChatMessages([...chatMessages, { senderId: currentUser.id, text, timestamp: new Date().toISOString() }]);
                setIsSendingMessage(true);
                setTimeout(() => {
                    setChatMessages(prev => [...prev, { senderId: selectedProfessional.id, text: "Obrigado pelo contato! Responderei em breve.", timestamp: new Date().toISOString() }]);
                    setIsSendingMessage(false);
                }, 1500);
            }}
            isSending={isSendingMessage}
          />
      )}
      {activeModal === 'serviceRequest' && selectedProfessional && currentUser && (
          <ServiceRequestModal 
            professional={selectedProfessional}
            service={selectedService}
            onClose={() => setActiveModal(null)}
            onSubmit={(data) => {
                const newRequest: ServiceRequest = {
                    id: Date.now(),
                    clientId: currentUser.id,
                    professionalId: selectedProfessional.id,
                    service: selectedService,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    ...data
                };
                setServiceRequests([...serviceRequests, newRequest]);
                setActiveModal('confirmation');
            }}
          />
      )}
      {activeModal === 'confirmation' && <ConfirmationModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'editUser' && selectedProfessional && (
          <EditUserModal 
             user={selectedProfessional}
             onClose={() => setActiveModal(null)}
             onSave={handleUpdateUser}
          />
      )}
      {activeModal === 'cta' && <CtaModal onClose={() => setActiveModal(null)} onSubmit={(name) => alert(`Olá ${name}, obrigado pelo interesse!`)} />}
      
      {activeModal === 'addFunds' && <AddFundsModal onClose={() => setActiveModal(null)} onAddFunds={handleAddFunds} />}
      {activeModal === 'withdraw' && currentUser && <WithdrawModal onClose={() => setActiveModal(null)} onWithdraw={handleWithdraw} currentBalanceTC={currentUser.walletBalanceTC || 0} />}
      {activeModal === 'exchange' && currentUser && <ExchangeModal onClose={() => setActiveModal(null)} onExchange={handleExchange} balanceTC={currentUser.walletBalanceTC || 0} balanceBRL={currentUser.walletBalanceBRL || 0} />}
      {activeModal === 'servicePayment' && currentUser && serviceToPay && (
          <ServicePaymentModal 
             onClose={() => setActiveModal(null)}
             request={serviceToPay}
             client={currentUser}
             professional={users.find(u => u.id === serviceToPay.professionalId)!}
             onPayWithTiaoCoin={handlePayForService}
             onPayWithBRL={handlePayForServiceBRL}
             onAddFunds={() => setActiveModal('addFunds')}
          />
      )}
      
      {activeModal === 'emergencyChat' && (
          <EmergencyChatModal 
             messages={emergencyMessages}
             onClose={() => setActiveModal(null)}
             onSendMessage={handleEmergencyMessage}
             isSending={isSendingMessage}
          />
      )}
      
      {activeModal === 'joinInvitation' && (
          <JoinInvitationModal onClose={() => setActiveModal(null)} onLogin={() => setActiveModal('login')} onSignup={() => setActiveModal('signup')} />
      )}
      
      {activeModal === 'featureDetails' && featureContent && (
          <FeatureModal content={featureContent} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};
