import React from 'react';

export type UserRole = 'client' | 'professional' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked';
export type ServicePeriod = 'Manhã' | 'Tarde' | 'Noite';
export type TransactionType = 'deposit' | 'withdrawal' | 'payment_sent' | 'payment_received' | 'bonus';
export type ActiveModal = 'login' | 'signup' | 'professional' | 'chat' | 'pendingApproval' | 'completeProfile' | 'editUser' | 'serviceRequest' | 'confirmation' | 'cta' | 'addFunds' | 'withdraw' | 'servicePayment';


export interface ServiceCategory {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface UserPricing {
    description: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    amountTC: number; // Amount in TiãoCoins
    brlAmount?: number; // Optional: corresponding BRL amount for deposits/withdrawals
    description: string;
    timestamp: string;
    fromUserId?: number;
    toUserId?: number;
}

export interface User {
  id: number;
  email: string;
  password?: string; // Optional for security reasons on frontend
  name:string;
  nickname?: string;
  role: UserRole;
  phone: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  regionId: number;
  isProfileComplete: boolean;
  status?: UserStatus;
  
  // Professional-specific fields
  services?: string[];
  cpfCnpj?: string;
  bio?: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  pricing?: UserPricing;
  servicesChangeRequest?: string[];
  profileChangeRequest?: Partial<User>;
  walletBalanceTC?: number; // TiãoCoin balance
  transactions?: Transaction[];
}

export interface UserCredentials {
  email: string;
  password?: string;
}

export interface ChatMessage {
  senderId: number;
  text: string;
  timestamp: string;
}

export interface JobPost {
    id: number;
    clientId: number;
    // Fix: Changed 'serviceCategory' to 'service' to make this type compatible with ServiceRequest.
    service: string;
    description: string;
    createdAt: string;
}

export interface AiHelpResponse {
    is_diy: boolean;
    solution_steps: { step: number; description: string }[];
    recommend_professional: boolean;
    recommended_category: string | null;
    professional_reasoning: string;
    disclaimer: string;
}

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

export interface ServiceRequest extends ServiceRequestFormData {
    id: number;
    clientId: number;
    professionalId: number;
    service: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed' | 'awaiting_payment' | 'paid';
    createdAt: string;
    price?: number;
}
