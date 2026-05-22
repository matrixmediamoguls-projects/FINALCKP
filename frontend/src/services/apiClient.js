import axios from 'axios';
import { getSupabaseClient } from './supabase/client';

const rawBackendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://127.0.0.1:5000';
const apiBaseUrl = `${rawBackendUrl.replace(/\/+$/, '')}/api`;

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true;

let authInterceptorId = null;
let responseInterceptorId = null;

export function configureApiClient() {
  if (authInterceptorId === null) {
    authInterceptorId = axios.interceptors.request.use(async (config) => {
      const supabase = getSupabaseClient();

      if (supabase) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    });
  }

  if (responseInterceptorId === null) {
    responseInterceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
        return Promise.reject(error);
      },
    );
  }

  return axios;
}

const apiClient = configureApiClient();

export default apiClient;
