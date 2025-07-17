import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_type: 'free' | 'premium';
  scans_used: number;
  max_scans: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  service_name: string;
  api_key: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  original_text: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScanLog {
  id: string;
  user_id: string;
  document_id: string | null;
  success: boolean;
  error_message: string | null;
  processing_time: number | null;
  created_at: string;
}

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// User profile helpers
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

// API key management (admin only)
export const getApiKeys = async (): Promise<ApiKey[]> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching API keys:', error);
    return [];
  }
  
  return data || [];
};

export const createApiKey = async (serviceName: string, apiKey: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      service_name: serviceName,
      api_key: apiKey,
      created_by: user?.id,
    })
    .select()
    .single();
  
  return { data, error };
};

export const updateApiKey = async (id: string, updates: Partial<ApiKey>) => {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteApiKey = async (id: string) => {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Document management
export const getUserDocuments = async (userId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
  
  return data || [];
};

export const createDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single();
  
  return { data, error };
};

export const deleteDocument = async (id: string) => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Scan management
export const canUserScan = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('can_user_scan', {
    user_uuid: userId
  });
  
  if (error) {
    console.error('Error checking scan limit:', error);
    return false;
  }
  
  return data;
};

export const incrementScanCount = async (userId: string) => {
  const { error } = await supabase.rpc('increment_scan_count', {
    user_uuid: userId
  });
  
  return { error };
};

export const logScan = async (log: Omit<ScanLog, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('scan_logs')
    .insert(log)
    .select()
    .single();
  
  return { data, error };
};

// Get active Gemini API key
export const getActiveGeminiKey = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('api_key')
    .eq('service_name', 'gemini')
    .eq('is_active', true)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data.api_key;
};