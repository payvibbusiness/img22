// Re-export types from supabase lib for backward compatibility
export type { UserProfile as User, Document, ApiKey as AppSettings } from '../lib/supabase';

export interface ConversionResult {
  text: string;
  confidence?: number;
}