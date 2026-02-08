import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'manager' | 'staff';
  branchId?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for when Supabase is not configured
const DEMO_USER: AuthUser = {
  id: 'demo-user-id',
  email: 'admin@lavanderia.sv',
  name: 'Administrador',
  role: 'admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured - running in demo mode');
      // Auto-login with demo user for development
      setUser(DEMO_USER);
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, branch_id, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to basic user info from auth
        const authUser = session?.user;
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.email?.split('@')[0] || 'User',
            role: 'staff',
          });
        }
      } else if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name || data.email.split('@')[0],
          role: data.role,
          branchId: data.branch_id || undefined,
          avatarUrl: data.avatar_url || undefined,
        });
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      setIsDemoMode(false);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const signInDemo = () => {
    setUser(DEMO_USER);
    setIsDemoMode(true);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isDemoMode,
    signIn,
    signOut,
    signInDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route component
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Array<'owner' | 'admin' | 'manager' | 'staff'>;
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Will be handled by App.tsx routing
    return null;
  }

  // Check role-based access
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
