
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "@/context/AuthContext";
import { AudioProvider } from "@/context/audioprovider";

import "@/index.css";
import App from "@/App";
import { validateSupabaseConfiguration } from "@/services/supabase/client";

const supabaseConfiguration = validateSupabaseConfiguration();
if (!supabaseConfiguration.isValid) {
  console.error("Application startup blocked by invalid Supabase configuration:", supabaseConfiguration.issues);
}

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
      }
    >
      <AuthProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
