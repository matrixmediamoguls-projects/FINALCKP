import { useEffect, useRef, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M18 9a9 9 0 10-10.406 8.892V11.61H5.309V9h2.285V7.017c0-2.256 1.344-3.502 3.4-3.502.984 0 2.014.175 2.014.175v2.215h-1.135c-1.118 0-1.467.694-1.467 1.406V9h2.496l-.399 2.61H10.41v6.282A9.003 9.003 0 0018 9z" fill="#1877F2"/>
  </svg>
);

const useFacebookSDK = () => {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const appId = process.env.REACT_APP_FACEBOOK_APP_ID;
    if (!appId || initialized.current) return;
    initialized.current = true;

    window.fbAsyncInit = () => {
      window.FB.init({ appId, cookie: true, xfbml: false, version: 'v19.0' });
      setReady(true);
    };

    if (!document.getElementById('facebook-jssdk')) {
      const s = document.createElement('script');
      s.id = 'facebook-jssdk';
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(s);
    } else if (window.FB) {
      setReady(true);
    }
  }, []);

  return ready;
};

const SocialAuthButtons = ({ onSocialLogin, disabled }) => {
  const fbReady = useFacebookSDK();
  const [googlePending, setGooglePending] = useState(false);
  const [fbPending, setFbPending] = useState(false);

  const googleConfigured = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);
  const fbConfigured = Boolean(process.env.REACT_APP_FACEBOOK_APP_ID);

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tok) => {
      try {
        setGooglePending(true);
        await onSocialLogin('google', tok.access_token);
      } finally {
        setGooglePending(false);
      }
    },
    onError: () => setGooglePending(false),
  });

  const handleFacebook = () => {
    if (!fbReady || !window.FB) return;
    setFbPending(true);
    window.FB.login(
      (res) => {
        if (res.authResponse) {
          onSocialLogin('facebook', res.authResponse.accessToken).finally(() =>
            setFbPending(false)
          );
        } else {
          setFbPending(false);
        }
      },
      { scope: 'email,public_profile' }
    );
  };

  if (!googleConfigured && !fbConfigured) return null;

  const btnClass =
    'flex h-12 w-full items-center justify-center gap-3 border border-[#2a2a2e] bg-[#121214] text-sm tracking-[0.04em] text-[#e4e4e7] transition-all duration-200 hover:border-[#52525b] hover:bg-[#18181b] disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-[#2a2a2e]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#52525b]">or</span>
        <div className="flex-1 border-t border-[#2a2a2e]" />
      </div>

      {googleConfigured && (
        <button
          type="button"
          onClick={() => handleGoogle()}
          disabled={disabled || googlePending}
          className={btnClass}
        >
          <GoogleIcon />
          {googlePending ? 'Connecting…' : 'Continue with Google'}
        </button>
      )}

      {fbConfigured && (
        <button
          type="button"
          onClick={handleFacebook}
          disabled={disabled || fbPending || !fbReady}
          className={btnClass}
        >
          <FacebookIcon />
          {fbPending ? 'Connecting…' : 'Continue with Facebook'}
        </button>
      )}
    </div>
  );
};

export default SocialAuthButtons;
