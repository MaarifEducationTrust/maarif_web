import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isMockAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMockAuth, setIsMockAuth] = useState<boolean>(!isSupabaseConfigured);

  useEffect(() => {
    if (isSupabaseConfigured) {
      setIsMockAuth(false);
      // Check initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminRole(session.user.id);
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminRole(session.user.id);
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Mock Auth for offline / local preview mode
      setIsMockAuth(true);
      const mockLogged = localStorage.getItem('madrasa_mock_admin') === 'true';
      if (mockLogged) {
        setUser({
          id: 'mock-admin-id',
          email: 'admin@madrasa.org',
          app_metadata: {},
          user_metadata: { full_name: 'Institutional Administrator' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User);
        setIsAdmin(true);
      }
      setIsLoading(false);
    }
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!error && data && data.role === 'admin') {
        setIsAdmin(true);
      } else {
        // If no explicit row yet, check if there are zero admin_profiles (initial setup phase)
        const { count } = await supabase
          .from('admin_profiles')
          .select('*', { count: 'exact', head: true });
        if (count === 0) {
          setIsAdmin(true); // First administrator
        } else {
          setIsAdmin(false);
        }
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser(data.user);
          setSession(data.session);
          await checkAdminRole(data.user.id);
          return { success: true };
        }
        return { success: false, error: 'Login failed' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Unexpected login error' };
      }
    } else {
      // Offline / Mock login for local demo
      if (email.trim() && pass.trim()) {
        localStorage.setItem('madrasa_mock_admin', 'true');
        setUser({
          id: 'mock-admin-id',
          email,
          app_metadata: {},
          user_metadata: { full_name: 'Administrator' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User);
        setIsAdmin(true);
        return { success: true };
      }
      return { success: false, error: 'Please enter an email and password' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('madrasa_mock_admin');
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, login, logout, isMockAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
