import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { FindProfessionalsPage } from './components/pages/FindProfessionalsPage';
import { AdminPage } from './components/pages/AdminPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { OpportunitiesPage } from './components/pages/OpportunitiesPage';
import { AiHelpPage } from './components/pages/AiHelpPage';
import { ProfessionalModal } from './components/ProfessionalModal';
import { LoginModal } from './components/modals/LoginModal';
import { SignupModal } from './components/modals/SignupModal';
import { PendingApprovalModal } from './components/modals/PendingApprovalModal';
import { CompleteProfileModal } from './components/modals/CompleteProfileModal';
import { EditUserModal } from './components/modals/EditUserModal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { CtaModal } from './components/modals/CtaModal';
import { ChatModal } from './components/modals/ChatModal';
import type { User, UserCredentials, UserStatus, ServiceRequest, ServiceRequestStatus, JobPost, ActiveModal, AiHelpResponse, ChatMessage } from './types';
import { serviceCategories, users as initialUsers, serviceRequests as initialServiceRequests, jobPosts as initialJobPosts, initialChatMessages } from './constants';

type View = 'home' | 'professionals' | 'admin' | 'profile' | 'opportunities' | 'ai-help';

// This should be handled by the execution environment.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(initialServiceRequests);
  const [jobPosts, setJobPosts] = useState<JobPost[]>(initialJobPosts);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [view, setView] = useState<View>('home');
  const [navigationHistory, setNavigationHistory] = useState<View[]>(['home']);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [activeChatProfessional, setActiveChatProfessional] = useState<User | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const navigateTo = useCallback((newView: View) => {
    setNavigationHistory(prev => [...prev, newView]);
    setView(newView);
  }, []);

  const handleBack = useCallback(() => {
    if (navigationHistory.length <= 1) return;
    const newHistory = [...navigationHistory];
    newHistory.pop();
    setNavigationHistory(newHistory);
    setView(newHistory[newHistory.length - 1]);
  }, [navigationHistory]);

  const handleSelectCategory = useCallback((category: string) => {
    setActiveCategory(category);
    navigateTo('professionals');
  }, [navigateTo]);

  const handleGoHome = useCallback(() => {
    setActiveCategory(null);
    setNavigationHistory(['home']);
    setView('home');
  }, []);
  
  const handleViewProfessional = useCallback((professional: User) => {
    setSelectedProfessional(professional);
  }, []);

  const handleCloseModals = useCallback(() => {
    setActiveModal(null);
    setSelectedProfessional(null);
    setEditingUser(null);
    setActiveChatProfessional(null); // Close chat as well
  }, []);

  const handleLogin = useCallback((credentials: UserCredentials): { success: boolean, message?: string } => {
    const user = allUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      if (user.role === 'professional' && user.status === 'pending') {
        setActiveModal('pendingApproval');
        return { success: true };
      }
      if (user.status === 'blocked') {
        return { success: false, message: 'Sua conta está bloqueada. Entre em contato com o suporte.' };
      }
      setCurrentUser(user);
      
      if (!user.isProfileComplete) {
        setActiveModal('completeProfile');
      }
      // Do not close modal here, let the modal component handle it to show a success message.
      return { success: true };
    }
    return { success: false, message: 'Email ou senha inválidos.' };
  }, [allUsers]);

  const handleUpdateUser = useCallback((updatedUser: User) => {
    setAllUsers(prevUsers => {
        const index = prevUsers.findIndex(u => u.id === updatedUser.id);
        if (index === -1) return prevUsers;
        const newUsers = [...prevUsers];
        newUsers[index] = updatedUser;
        return newUsers;
    });
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  }, [currentUser]);

  const handleSignup = useCallback((newUser: Omit<User, 'id' | 'isProfileComplete' | 'regionId'>): boolean => {
    // Simple logic to assign regionId based on city. In a real app, this would be more complex.
    const cityRegionMap: { [key: string]: number } = {
        'rio de janeiro': 1,
        'são paulo': 2,
        'belo horizonte': 3,
        'salvador': 4,
        'porto alegre': 5,
        'curitiba': 6,
        'recife': 7,
        'fortaleza': 8,
        'brasília': 9,
    };
    const regionId = cityRegionMap[newUser.city.toLowerCase()] || 10; // Default region 10

    const createdUser: User = { 
      ...newUser, 
      id: Date.now(),
      isProfileComplete: false,
      regionId,
      ...(newUser.role === 'professional' && { status: 'pending' })
    };
    
    setAllUsers(prev => [...prev, createdUser]);
    
    if (createdUser.role === 'professional') {
      setActiveModal('pendingApproval');
    } else {
      setCurrentUser(createdUser);
      setActiveModal('completeProfile');
    }
    return true;
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    handleGoHome();
  }, [handleGoHome]);

  const handleCreateServiceRequest = useCallback((professional: User, serviceName: string) => {
    if (!currentUser) {
      setSelectedProfessional(null);
      setActiveModal('login');
      return;
    }
    const newRequest: ServiceRequest = {
        id: Date.now(),
        clientId: currentUser.id,
        professionalId: professional.id,
        serviceName,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
    setServiceRequests(prev => [newRequest, ...prev]);
    setSelectedProfessional(null);
    setActiveChatProfessional(null); // Close chat if open
    setActiveModal('confirmation');
  }, [currentUser]);

  const handleUpdateServiceRequestStatus = useCallback((requestId: number, status: ServiceRequestStatus) => {
      setServiceRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
  }, []);

  const handleAddJobPost = useCallback((post: Omit<JobPost, 'id' | 'createdAt' | 'clientId'>) => {
      if (!currentUser) return;
      const newPost: JobPost = {
          ...post,
          id: Date.now(),
          clientId: currentUser.id,
          createdAt: new Date().toISOString(),
      };
      setJobPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const handleDeleteJobPost = useCallback((postId: number) => {
      setJobPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const handleNavigateToAdmin = useCallback(() => {
    if (currentUser?.role === 'admin') {
      navigateTo('admin');
      setActiveCategory(null);
    }
  }, [currentUser, navigateTo]);
  
  const handleNavigateToProfile = useCallback(() => {
      if (currentUser) {
          navigateTo('profile');
          setActiveCategory(null);
      }
  }, [currentUser, navigateTo]);

  const handleNavigateToOpportunities = useCallback(() => {
      if (currentUser?.role === 'professional') {
          navigateTo('opportunities');
          setActiveCategory(null);
      }
  }, [currentUser, navigateTo]);

  const handleNavigateToAiHelp = useCallback(() => {
    if (currentUser) {
      navigateTo('ai-help');
      setActiveCategory(null);
    } else {
      setActiveModal('login');
    }
  }, [currentUser, navigateTo]);

  const handleCtaSubmit = useCallback((name: string) => {
    const phone = '5541988710303';
    const clientName = "TiãoService"; // Could be dynamic in a real app
    const message = `Olá! Meu nome é ${name}. Vi o link do site ${clientName} e quero um site igual!`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    handleCloseModals();
  }, [handleCloseModals]);
  
  const handleAdminUpdateUserStatus = useCallback((userId: number, status: UserStatus) => {
    const user = allUsers.find(u => u.id === userId);
    if(user) handleUpdateUser({ ...user, status });
  }, [allUsers, handleUpdateUser]);
  
  const handleAdminDeleteUser = useCallback((userId: number) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const handleAdminApproveServiceChange = useCallback((userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (user && user.servicesChangeRequest) {
      handleUpdateUser({ ...user, services: user.servicesChangeRequest, servicesChangeRequest: undefined });
    }
  }, [allUsers, handleUpdateUser]);
  
  const handleAiHelpRequest = useCallback(async (problemDescription: string): Promise<AiHelpResponse> => {
    const categories = serviceCategories.map(c => c.name).join(', ');
    const systemInstruction = "Você é um assistente prestativo chamado 'IA do Tião', especialista em problemas domésticos e de tecnologia. Seu objetivo é ajudar os usuários do aplicativo TiãoService. Forneça respostas claras, seguras e úteis em português do Brasil.";
    const contents = `Analise o seguinte problema do usuário: "${problemDescription}".

1. Se o problema for simples e seguro para o usuário resolver sozinho (DIY), forneça uma solução passo a passo.
2. Se o problema for complexo, perigoso (envolvendo eletricidade principal, gás, estruturas) ou exigir ferramentas especializadas, recomende a contratação de um profissional.
3. Se você recomendar um profissional, você DEVE identificar a categoria de serviço mais apropriada da seguinte lista: ${categories}.
4. Responda estritamente no formato JSON definido.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        is_diy: { type: Type.BOOLEAN, description: 'O problema pode ser resolvido pelo próprio usuário?' },
        solution_steps: {
          type: Type.ARRAY,
          description: 'Passos para resolver o problema, se for DIY.',
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.INTEGER },
              description: { type: Type.STRING }
            }
          }
        },
        recommend_professional: { type: Type.BOOLEAN, description: 'É recomendado chamar um profissional?' },
        recommended_category: { type: Type.STRING, description: 'Se recomendar um profissional, qual a categoria?' },
        professional_reasoning: { type: Type.STRING, description: 'Motivo pelo qual um profissional é recomendado.' },
        disclaimer: { type: Type.STRING, description: 'Um aviso de segurança.' },
      },
      propertyOrdering: ["is_diy", "solution_steps", "recommend_professional", "recommended_category", "professional_reasoning", "disclaimer"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    return JSON.parse(response.text.trim()) as AiHelpResponse;
  }, []);

  const handleStartChat = useCallback((professional: User) => {
    if (!currentUser) {
        setActiveModal('login');
        return;
    }
    // Close other modals before opening chat
    setSelectedProfessional(null); 
    setActiveChatProfessional(professional);
  }, [currentUser]);

  const handleSendMessage = useCallback(async (text: string) => {
      if (!currentUser || !activeChatProfessional || isSendingMessage) return;

      const userMessage: ChatMessage = {
          id: Date.now(),
          senderId: currentUser.id,
          receiverId: activeChatProfessional.id,
          text,
          timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setIsSendingMessage(true);

      // Simulate AI Professional Reply
      const conversationHistory = chatMessages
          .filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatProfessional.id) || (m.senderId === activeChatProfessional.id && m.receiverId === currentUser.id))
          .map(m => `${m.senderId === currentUser.id ? 'Cliente' : 'Você'}: ${m.text}`)
          .join('\n');

      const systemInstruction = `Você é ${activeChatProfessional.name}, um profissional de ${activeChatProfessional.services?.join(', ')} no app TiãoService. Responda ao cliente de forma amigável, profissional e concisa em português do Brasil.`;
      const contents = `Esta é a nossa conversa até agora:\n${conversationHistory}\n\nO cliente disse: "${text}"\n\nSua Resposta:`;
      
      try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
                systemInstruction,
                thinkingConfig: { thinkingBudget: 0 } // low latency for chat
            },
        });

        const aiMessage: ChatMessage = {
            id: Date.now() + 1,
            senderId: activeChatProfessional.id,
            receiverId: currentUser.id,
            text: response.text,
            timestamp: new Date().toISOString()
        };
        // Artificial delay for realism
        setTimeout(() => {
            setChatMessages(prev => [...prev, aiMessage]);
            setIsSendingMessage(false);
        }, 800);

      } catch (error) {
        console.error("AI Error:", error);
        const errorMessage: ChatMessage = {
            id: Date.now() + 1,
            senderId: activeChatProfessional.id,
            receiverId: currentUser.id,
            text: "Desculpe, estou com um problema no meu sistema. Poderia repetir?",
            timestamp: new Date().toISOString()
        };
         setTimeout(() => {
            setChatMessages(prev => [...prev, errorMessage]);
            setIsSendingMessage(false);
        }, 800);
      }

  }, [currentUser, activeChatProfessional, chatMessages, isSendingMessage]);

  const messagesForActiveChat = useMemo(() => {
      if (!currentUser || !activeChatProfessional) return [];
      return chatMessages.filter(m => 
          (m.senderId === currentUser.id && m.receiverId === activeChatProfessional.id) ||
          (m.senderId === activeChatProfessional.id && m.receiverId === currentUser.id)
      );
  }, [chatMessages, currentUser, activeChatProfessional]);

  const renderContent = () => {
    switch(view) {
      case 'ai-help':
        if (!currentUser) {
            handleGoHome();
            return null;
        }
        return <AiHelpPage 
                onAiHelpRequest={handleAiHelpRequest} 
                professionals={allUsers.filter(u => u.role === 'professional' && u.status === 'approved')}
                onViewProfessional={handleViewProfessional}
                onBack={handleBack}
               />;
      case 'admin':
        return <AdminPage 
                    users={allUsers}
                    onUpdateUserStatus={handleAdminUpdateUserStatus}
                    onDeleteUser={handleAdminDeleteUser}
                    onEditUser={(user) => { setEditingUser(user); setActiveModal('editUser'); }}
                    onApproveChange={handleAdminApproveServiceChange}
                    onBack={handleBack}
                />;
      case 'profile':
        if (!currentUser) {
            handleGoHome();
            return null;
        }
        return <ProfilePage 
                    currentUser={currentUser} 
                    users={allUsers}
                    serviceRequests={serviceRequests}
                    jobPosts={jobPosts}
                    onUpdateRequestStatus={handleUpdateServiceRequestStatus}
                    onUpdateUser={handleUpdateUser}
                    onAddJobPost={handleAddJobPost}
                    onDeleteJobPost={handleDeleteJobPost}
                    onBack={handleBack}
                />
      case 'opportunities':
          if (!currentUser || currentUser.role !== 'professional') {
              handleGoHome();
              return null;
          }
          return <OpportunitiesPage
                    currentUser={currentUser}
                    jobPosts={jobPosts}
                    users={allUsers}
                    onBack={handleBack}
                 />;
      case 'professionals':
        return activeCategory ? (
            <FindProfessionalsPage 
              category={activeCategory} 
              onViewProfessional={handleViewProfessional}
              professionals={allUsers.filter(u => u.role === 'professional' && u.status === 'approved')}
              currentUser={currentUser}
              onBack={handleBack}
            />
          ) : <HomePage onSelectCategory={handleSelectCategory} categories={serviceCategories} />;
      case 'home':
      default:
        return <HomePage onSelectCategory={handleSelectCategory} categories={serviceCategories} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <Header 
        user={currentUser}
        onGoHome={handleGoHome} 
        onOpenLogin={() => setActiveModal('login')}
        onOpenSignup={() => setActiveModal('signup')}
        onLogout={handleLogout}
        onNavigateToAdmin={handleNavigateToAdmin}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToOpportunities={handleNavigateToOpportunities}
        onNavigateToAiHelp={handleNavigateToAiHelp}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>
      <Footer onOpenCtaModal={() => setActiveModal('cta')} />
      
      {/* Modals */}
      {selectedProfessional && (
        <ProfessionalModal 
          professional={selectedProfessional} 
          onClose={handleCloseModals}
          onRequestService={(professional, service) => handleCreateServiceRequest(professional, service)}
          onStartChat={handleStartChat}
        />
      )}
      {activeModal === 'login' && <LoginModal onClose={handleCloseModals} onLogin={handleLogin} onSwitchToSignup={() => setActiveModal('signup')} />}
      {activeModal === 'signup' && <SignupModal onClose={handleCloseModals} onSignup={handleSignup} onSwitchToLogin={() => setActiveModal('login')} />}
      {activeModal === 'pendingApproval' && <PendingApprovalModal onClose={handleCloseModals} />}
      {activeModal === 'confirmation' && <ConfirmationModal onClose={handleCloseModals} />}
      {activeModal === 'completeProfile' && currentUser && <CompleteProfileModal user={currentUser} onClose={handleCloseModals} onSave={handleUpdateUser} />}
      {activeModal === 'editUser' && editingUser && <EditUserModal user={editingUser} onClose={handleCloseModals} onSave={handleUpdateUser} />}
      {activeModal === 'cta' && <CtaModal onClose={handleCloseModals} onSubmit={handleCtaSubmit} />}
      {currentUser && activeChatProfessional && (
          <ChatModal
            currentUser={currentUser}
            professional={activeChatProfessional}
            messages={messagesForActiveChat}
            onClose={handleCloseModals}
            onSendMessage={handleSendMessage}
            isSending={isSendingMessage}
          />
      )}
    </div>
  );
};

export default App;