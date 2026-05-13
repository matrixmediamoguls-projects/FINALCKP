import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export function getSupabaseConfig() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_APP_SUPABASE_URL || '',
    key: import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_APP_SUPABASE_ANON_KEY || '',
  };
}

export function getSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  if (!cachedClient) {
    cachedClient = createClient(url, key);
  }

  return cachedClient;
}

export const supabase = getSupabaseClient();
