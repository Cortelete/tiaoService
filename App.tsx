import React, { useState, useCallback } from 'react';
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
import type { User, UserCredentials, UserStatus, ServiceRequest, ServiceRequestStatus, JobPost, ActiveModal, AiHelpResponse } from './types';
import { serviceCategories, users as initialUsers, serviceRequests as initialServiceRequests, jobPosts as initialJobPosts } from './constants';

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

  const handleSelectCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setView('professionals');
  }, []);

  const handleGoHome = useCallback(() => {
    setActiveCategory(null);
    setView('home');
  }, []);
  
  const handleViewProfessional = useCallback((professional: User) => {
    setSelectedProfessional(professional);
  }, []);

  const handleCloseModals = useCallback(() => {
    setActiveModal(null);
    setSelectedProfessional(null);
    setEditingUser(null);
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

  const handleSignup = useCallback((newUser: Omit<User, 'id' | 'isProfileComplete'>): boolean => {
    const createdUser: User = { 
      ...newUser, 
      id: Date.now(),
      isProfileComplete: false,
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
    setView('home');
  }, []);

  const handleCreateServiceRequest = useCallback((professional: User) => {
    if (!currentUser) {
      setSelectedProfessional(null);
      setActiveModal('login');
      return;
    }
    const newRequest: ServiceRequest = {
        id: Date.now(),
        clientId: currentUser.id,
        professionalId: professional.id,
        serviceName: professional.service || 'Serviço Geral',
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
    setServiceRequests(prev => [newRequest, ...prev]);
    setSelectedProfessional(null);
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
      setView('admin');
      setActiveCategory(null);
    }
  }, [currentUser]);
  
  const handleNavigateToProfile = useCallback(() => {
      if (currentUser) {
          setView('profile');
          setActiveCategory(null);
      }
  }, [currentUser]);

  const handleNavigateToOpportunities = useCallback(() => {
      if (currentUser?.role === 'professional') {
          setView('opportunities');
          setActiveCategory(null);
      }
  }, [currentUser]);

  const handleNavigateToAiHelp = useCallback(() => {
    if (currentUser) {
      setView('ai-help');
      setActiveCategory(null);
    } else {
      setActiveModal('login');
    }
  }, [currentUser]);

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
    if (user && user.serviceChangeRequest) {
      handleUpdateUser({ ...user, service: user.serviceChangeRequest, serviceChangeRequest: undefined });
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
               />;
      case 'admin':
        return <AdminPage 
                    users={allUsers}
                    onUpdateUserStatus={handleAdminUpdateUserStatus}
                    onDeleteUser={handleAdminDeleteUser}
                    onEditUser={(user) => { setEditingUser(user); setActiveModal('editUser'); }}
                    onApproveChange={handleAdminApproveServiceChange}
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
                 />;
      case 'professionals':
        return activeCategory ? (
            <FindProfessionalsPage 
              category={activeCategory} 
              onViewProfessional={handleViewProfessional}
              professionals={allUsers.filter(u => u.role === 'professional' && u.status === 'approved')}
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
          onRequestService={handleCreateServiceRequest}
        />
      )}
      {activeModal === 'login' && <LoginModal onClose={handleCloseModals} onLogin={handleLogin} onSwitchToSignup={() => setActiveModal('signup')} />}
      {activeModal === 'signup' && <SignupModal onClose={handleCloseModals} onSignup={handleSignup} onSwitchToLogin={() => setActiveModal('login')} />}
      {activeModal === 'pendingApproval' && <PendingApprovalModal onClose={handleCloseModals} />}
      {activeModal === 'confirmation' && <ConfirmationModal onClose={handleCloseModals} />}
      {activeModal === 'completeProfile' && currentUser && <CompleteProfileModal user={currentUser} onClose={handleCloseModals} onSave={handleUpdateUser} />}
      {activeModal === 'editUser' && editingUser && <EditUserModal user={editingUser} onClose={handleCloseModals} onSave={handleUpdateUser} />}
      {activeModal === 'cta' && <CtaModal onClose={handleCloseModals} onSubmit={handleCtaSubmit} />}
    </div>
  );
};

export default App;