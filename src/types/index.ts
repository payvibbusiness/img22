export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium';
  scansUsed: number;
  maxScans: number;
  isAdmin: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  originalText: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversionResult {
  text: string;
  confidence?: number;
}

export interface AppSettings {
  geminiApiKey: string;
}