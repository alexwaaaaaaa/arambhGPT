// Authentication related types

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  created_at: string;
  updated_at?: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  city: string;
  country: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (userData: SignUpData) => Promise<void>;
  signIn: (credentials: SignInData) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}