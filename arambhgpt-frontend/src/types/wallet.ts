export interface WalletBalance {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: 'recharge' | 'consultation' | 'refund';
  consultationType?: 'chat' | 'voice' | 'video';
  professionalId?: string;
  professionalName?: string;
  sessionId?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface RechargeOption {
  amount: number;
  bonus: number;
  popular?: boolean;
}

export interface ConsultationRates {
  chat: number;    // per minute
  voice: number;   // per minute
  video: number;   // per minute
}

export interface ActiveSession {
  id: string;
  userId: string;
  professionalId: string;
  type: 'chat' | 'voice' | 'video';
  startTime: string;
  rate: number;
  totalCost: number;
  status: 'active' | 'paused' | 'ended';
}