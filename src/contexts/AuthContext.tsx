import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authListenerRef = useRef<any>(null);

  // Optimized sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Extract and store JWT token for API calls
      if (data.session?.access_token) {
        localStorage.setItem('authToken', data.session.access_token);
        console.log('✅ JWT token stored for API calls');
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to sign in' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized sign up function
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Extract and store JWT token for API calls if session exists
      if (data.session?.access_token) {
        localStorage.setItem('authToken', data.session.access_token);
        console.log('✅ JWT token stored for API calls');
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to sign up' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear JWT token from storage
      localStorage.removeItem('authToken');
      console.log('✅ JWT token cleared from storage');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized password reset function
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to reset password' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized auth state listener with cleanup
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        // Store JWT token if session exists
        if (session?.access_token) {
          localStorage.setItem('authToken', session.access_token);
          console.log('✅ Initial JWT token stored');
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener with debouncing
    authListenerRef.current = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Debounce auth state changes to prevent excessive re-renders
        setTimeout(() => {
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Handle JWT token storage based on auth state
          if (session?.access_token) {
            localStorage.setItem('authToken', session.access_token);
            console.log('✅ JWT token updated from auth state change');
          } else {
            localStorage.removeItem('authToken');
            console.log('✅ JWT token removed - user signed out');
          }
        }, 100);
      }
    );

    return () => {
      if (authListenerRef.current) {
        authListenerRef.current.data?.subscription?.unsubscribe();
      }
    };
  }, []);

  // Highly optimized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }), [
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};