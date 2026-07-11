import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://jmlqrqrikpukxxbstuoe.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8DEj5ynJmj7Aj2CbfghWNQ_4XmX9-wA";

const SUPABASE_URL =
  import.meta.env.VITE_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_APP_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

let client = null;

export function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase env vars not set - auth disabled");
    return null;
  }
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
