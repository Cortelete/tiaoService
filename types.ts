
import React from 'react';

export type UserRole = 'client' | 'professional' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked';
export type ServicePeriod = 'Manhã' | 'Tarde' | 'Noite';
export type TransactionType = 'deposit' | 'withdrawal' | 'payment_sent' | 'payment_received' | 'bonus' | 'exchange';
export type ActiveModal = 'login' | 'signup' | 'professional' | 'chat' | 'pendingApproval' | 'completeProfile' | 'editUser' | 'serviceRequest' | 'confirmation' | 'cta' | 'addFunds' | 'withdraw' | 'servicePayment' | 'emergencyChat' | 'joinInvitation' | 'featureDetails' | 'exchange';


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
    amountTC?: number; // Amount in TiãoCoins
    amountBRL?: number; // Amount in BRL
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
  hasSeenOnboarding?: boolean; // New field for onboarding tour
  
  // Geolocation
  latitude?: number;
  longitude?: number;
  
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
  walletBalanceBRL?: number; // Real (BRL) balance
  transactions?: Transaction[];
}

export interface UserCredentials {
  email: string;
  password?: string;
}

export interface ChatMessage {
  senderId: number; // 0 usually denotes AI in specific contexts, or user ID
  text: string;
  timestamp: string;
  isAi?: boolean; // Helper for UI
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
    is_emergency: boolean;
    is_diy: boolean;
    solution_steps: { step: number; description: string }[];
    recommend_professional: boolean;
    recommended_categories: string[]; // Changed from single string to array
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

export interface FeatureContent {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
