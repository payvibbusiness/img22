import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getUserProfile, UserProfile, signIn, signOut, signUp } from '../lib/supabase';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Set a minimal profile to prevent infinite loading
        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          subscription_type: 'free',
          scans_used: 0,
          max_scans: 1,
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Set a minimal profile to prevent infinite loading
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || null,
            subscription_type: 'free',
            scans_used: 0,
            max_scans: 1,
            is_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Set a minimal profile to prevent infinite loading
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || null,
            subscription_type: 'free',
            scans_used: 0,
            max_scans: 1,
            is_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
      
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        return { error: error.message };
      }
      
      if (data.user) {
        try {
          const userProfile = await getUserProfile(data.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Set a minimal profile to prevent infinite loading
          setProfile({
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || null,
            subscription_type: 'free',
            scans_used: 0,
            max_scans: 1,
            is_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await signUp(email, password, fullName);
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      login, 
      register, 
      logout, 
      isLoading, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};