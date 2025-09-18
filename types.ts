import React from 'react';

export interface ServiceCategory {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Pricing {
  description: string;
}

export type UserRole = 'client' | 'professional' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status?: UserStatus;
  isProfileComplete: boolean;
  nickname?: string;
  bio?: string;

  // Common fields
  phone: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  regionId: number; // For proximity searches
  
  // Professional-specific fields
  services?: string[];
  cpfCnpj?: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;

  reviews?: Review[];
  pricing?: Pricing;
  availability?: Record<string, string>;
  servicesChangeRequest?: string[]; // Holds new services for admin approval
  profileChangeRequest?: Partial<Pick<User, 'name' | 'nickname' | 'phone' | 'street' | 'neighborhood' | 'city' | 'state' | 'cpfCnpj' | 'bio' | 'imageUrl' | 'pricing'>>;
}

export type UserCredentials = Pick<User, 'email' | 'password'>;

// Service Request Management
export type ServiceRequestStatus = 'pending' | 'accepted' | 'completed' | 'declined' | 'cancelled';
export type ServicePeriod = 'Manhã' | 'Tarde' | 'Noite';

export interface ServiceRequest {
  id: number;
  clientId: number;
  professionalId: number;
  serviceName: string;
  status: ServiceRequestStatus;
  createdAt: string;
  preferredDate?: string;
  preferredPeriod?: ServicePeriod;
  details?: {
    description: string;
    [key: string]: string; // For dynamic fields
  };
}

// Client Job Postings
export interface JobPost {
    id: number;
    clientId: number;
    serviceCategory: string;
    description: string;
    createdAt: string;
}

// AI Help Response
export interface AiHelpResponse {
    is_diy: boolean;
    solution_steps: { step: number; description: string }[];
    recommend_professional: boolean;
    recommended_category: string | null;
    professional_reasoning: string;
    disclaimer: string;
}

// Chat
export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    text: string;
    timestamp: string;
}

// Dynamic Form Generation for Service Request
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'select' | 'textarea';
    placeholder?: string;
    options?: string[];
}

export interface ServiceRequestFormData {
    preferredDate: string;
    preferredPeriod: ServicePeriod;
    description: string;
    dynamicFields: Record<string, string>;
}

export type ActiveModal = 'login' | 'signup' | 'pendingApproval' | 'completeProfile' | 'editUser' | 'confirmation' | 'cta' | 'serviceRequest' | null;
export type View = 'home' | 'professionals' | 'admin' | 'profile' | 'opportunities' | 'ai-help';