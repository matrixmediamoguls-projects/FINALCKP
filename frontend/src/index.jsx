
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "@/context/AuthContext";
import { AudioProvider } from "@/context/audioprovider";

import "@/index.css";
import App from "@/App";

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

void import("@/services/supabase/client").then(({ validateSupabaseConfiguration }) => {
  const supabaseConfiguration = validateSupabaseConfiguration();
  if (!supabaseConfiguration.isValid) {
    console.error("Invalid Supabase configuration:", supabaseConfiguration.issues);
  }
});
