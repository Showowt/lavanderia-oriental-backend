import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks for demo mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
  );
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (extend as needed)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: 'owner' | 'admin' | 'manager' | 'staff';
          branch_id: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      customers: {
        Row: {
          id: string;
          phone: string;
          name: string | null;
          email: string | null;
          total_orders: number;
          is_vip: boolean;
          created_at: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          customer_id: string;
          status: 'ai_active' | 'human_active' | 'resolved' | 'escalated' | 'waiting';
          ai_handled: boolean;
          message_count: number;
          created_at: string;
          updated_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          content: string;
          direction: 'inbound' | 'outbound';
          sender: 'customer' | 'ai' | 'human';
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          status: string;
          total_amount: number;
          created_at: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          city: string;
          status: string;
          is_active: boolean;
        };
      };
      escalations: {
        Row: {
          id: string;
          conversation_id: string;
          customer_id: string;
          reason: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status: 'pending' | 'in_progress' | 'resolved';
          created_at: string;
        };
      };
    };
  };
}

export default supabase;
