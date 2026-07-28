
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

const scheduleAnalytics = () => {
  const start = () => {
    void import("@/services/analytics").then(({ startAnalytics }) => startAnalytics());
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 4000 });
  } else {
    window.setTimeout(start, 2000);
  }
};

if (document.readyState === "complete") {
  scheduleAnalytics();
} else {
  window.addEventListener("load", scheduleAnalytics, { once: true });
}

void import("@/services/supabase/client").then(({ validateSupabaseConfiguration }) => {
  const supabaseConfiguration = validateSupabaseConfiguration();
  if (!supabaseConfiguration.isValid) {
    console.error("Invalid Supabase configuration:", supabaseConfiguration.issues);
  }
});
