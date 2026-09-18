import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Check if valid production Supabase environment variables are provided
export const isSupabaseConfigured: boolean = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl.startsWith('https://') &&
  !rawUrl.includes('xyzmedtraceapp') &&
  !rawUrl.includes('your-supabase-project') &&
  rawKey !== 'your-supabase-anon-key' &&
  rawKey !== 'YOUR_SUPABASE_PUBLISHABLE_KEY' &&
  rawKey !== 'YOUR_SUPABASE_ANON_KEY'
);

// Fallback dummy credentials when Supabase project is not yet connected
const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://demo-medtrace.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-anon-key';

// Initialize Supabase client
// When unconfigured, autoRefreshToken and persistSession are set to false
// to prevent background network polling loops to invalid URLs that hang app startup.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured,
  },
});
