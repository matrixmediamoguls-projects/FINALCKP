import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://jmlqrqrikpukxxbstuoe.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8DEj5ynJmj7Aj2CbfghWNQ_4XmX9-wA";

const SUPABASE_URL =
  import.meta.env.VITE_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_APP_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export function validateSupabaseConfiguration() {
  const issues = [];
  try {
    const parsedUrl = new URL(SUPABASE_URL);
    if (parsedUrl.protocol !== "https:" || !parsedUrl.hostname.endsWith(".supabase.co")) {
      issues.push("Supabase URL must be an HTTPS *.supabase.co endpoint.");
    }
  } catch {
    issues.push("Supabase URL is missing or invalid.");
  }

  if (!SUPABASE_ANON_KEY || (!SUPABASE_ANON_KEY.startsWith("sb_publishable_") && SUPABASE_ANON_KEY.split(".").length !== 3)) {
    issues.push("Supabase publishable/anon key is missing or invalid.");
  }

  return {
    isValid: issues.length === 0,
    issues,
    usesBundledFallback: !import.meta.env.VITE_APP_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL,
  };
}

let client = null;

export function getSupabaseClient() {
  const configuration = validateSupabaseConfiguration();
  if (!configuration.isValid) {
    console.error("Supabase configuration error:", configuration.issues.join(" "));
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
