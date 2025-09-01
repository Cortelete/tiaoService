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

  // Common fields
  phone: string;
  location: string;
  
  // Professional-specific fields
  service?: string;
  cpfCnpj?: string;
  bio?: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
  pricing?: Pricing;
  availability?: Record<string, string>;
  serviceChangeRequest?: string; // Holds new service name for admin approval
}

// Fix: Changed comma to pipe to create a union type for the keys.
export type UserCredentials = Pick<User, 'email' | 'password'>;

// Service Request Management
export type ServiceRequestStatus = 'pending' | 'accepted' | 'completed' | 'declined' | 'cancelled';

export interface ServiceRequest {
  id: number;
  clientId: number;
  professionalId: number;
  serviceName: string;
  status: ServiceRequestStatus;
  createdAt: string;
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

export type ActiveModal = 'login' | 'signup' | 'pendingApproval' | 'completeProfile' | 'editUser' | 'confirmation' | 'cta' | null;
export type View = 'home' | 'professionals' | 'admin' | 'profile' | 'opportunities' | 'ai-help';
