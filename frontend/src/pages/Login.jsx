import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AUTH_BACKGROUND_VIDEO =
  'https://media.chromakeyprotocol.com/video/user_auth_background.mp4';

const panelShadow = '0 0 42px rgba(0, 255, 0, 0.78)';

const inputClass =
  'w-full rounded-md border border-[#334155] bg-[#e2e8f0] px-5 py-4 font-mono text-sm font-bold text-[#0f172a] outline-none transition-colors placeholder:text-[#0f172a]/60 focus:border-[#00ff00] focus:ring-2 focus:ring-[#00ff00]/35';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();

  const getAuthErrorMessage = (err, fallback) =>
    err?.response?.data?.detail || err?.message || fallback;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const googleConfigured = Boolean(import.meta.env.VITE_APP_GOOGLE_CLIENT_ID);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (token) => {
      setError('');
      setGooglePending(true);

      try {
        await socialLogin('google', token.access_token);
        navigate('/');
      } catch (err) {
        setError(getAuthErrorMessage(err, 'Google sign-in failed'));
      } finally {
        setGooglePending(false);
      }
    },
    onError: () => setGooglePending(false),
  });

  return (
    <main className="relative isolate h-screen overflow-y-auto overflow-x-hidden bg-[#0a0e17] text-[#e2e8f0]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
        <video
          src={AUTH_BACKGROUND_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-10 bg-black/45" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-y-0 left-0 z-10 w-8 bg-[#00ff00]/50 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-y-0 right-0 z-10 w-8 bg-[#00ff00]/50 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none fixed right-[min(28vw,356px)] top-12 z-10 hidden h-px w-[320px] bg-[#00ff00]/20 lg:block" aria-hidden="true" />
      <div className="pointer-events-none fixed bottom-16 right-[min(28vw,356px)] z-10 hidden h-px w-[320px] bg-[#00ff00]/20 lg:block" aria-hidden="true" />

      <section className="relative z-20 flex min-h-full items-center justify-center px-5 py-10 sm:px-8 lg:justify-end lg:px-24 lg:py-16">
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full max-w-[440px] border border-[#00ff00]/20 bg-[#0b1020] px-6 py-8 sm:px-10 sm:py-10"
          style={{ boxShadow: panelShadow }}
        >
          <div className="mb-8 flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#00ff00]/40 bg-[#10172a] text-[#00ff00]">
                <Fingerprint size={22} strokeWidth={1.9} />
              </div>
              <div className="flex min-w-0 flex-col gap-1 font-mono">
                <div className="text-xs font-bold tracking-[0.28em] text-[#00ff00]">
                  SECURE NODE
                </div>
                <div className="text-xs font-bold tracking-[0.18em] text-[#e2e8f0]/50">
                  Authorization Channel
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#00ff00] shadow-[0_0_14px_rgba(0,255,0,0.9)]" />
              <div className="font-mono text-xs font-bold tracking-[0.22em] text-[#00ff00]">
                LIVE
              </div>
            </div>
          </div>

          <div className="mb-10 border border-[#00ff00]/20 bg-[#10172a]/60 px-5 py-7 sm:px-6">
            <h1 className="mb-2 font-['Space_Grotesk'] text-4xl font-bold uppercase leading-tight tracking-[0.16em] text-[#e2e8f0]">
              CHROMA KEY
            </h1>
            <div className="mb-6 font-mono text-lg font-bold text-[#e2e8f0]/70">
              Protocol Access
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#00ff00]/20" />
              <div className="shrink-0 font-mono text-xs font-bold tracking-[0.24em] text-[#00ff00]">
                ENCRYPTED SESSION
              </div>
              <div className="h-px flex-1 bg-[#00ff00]/20" />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 border border-[#ff5a34]/45 bg-[#ff5a34]/10 px-4 py-3 font-mono text-sm font-semibold text-[#ff8b4d]">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-7">
              <label className="flex w-full flex-col gap-3">
                <span className="font-mono text-base font-bold tracking-wide text-[#e2e8f0]/80">
                  Email Address
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="musiqmatrix@gmail.com"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </label>

              <label className="flex w-full flex-col gap-3">
                <span className="font-mono text-base font-bold tracking-wide text-[#e2e8f0]/80">
                  Password
                </span>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className={`${inputClass} pr-14`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#0f172a]/65 transition-colors hover:text-[#0f172a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff00]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full border border-[#00ff00]/20 bg-[#10172a] px-5 py-4 font-mono text-xl font-bold tracking-[0.08em] text-[#00ff00] transition-colors hover:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'ACCESSING...' : 'ACCESS PROTOCOL'}
            </button>
          </form>

          {googleConfigured && (
            <>
              <div className="my-8 flex w-full items-center gap-4">
                <div className="h-px flex-1 bg-[#00ff00]/20" />
                <div className="font-mono text-xs font-bold tracking-[0.36em] text-[#e2e8f0]/35">
                  OR
                </div>
                <div className="h-px flex-1 bg-[#00ff00]/20" />
              </div>

              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={loading || googlePending}
                className="flex w-full items-center justify-center gap-4 border border-[#334155] bg-[#0a0e17]/60 px-5 py-4 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2e8f0] font-mono text-base font-bold text-[#0a0e17]">
                  G
                </span>
                <span className="font-mono text-lg font-bold text-[#e2e8f0]/80">
                  {googlePending ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>
            </>
          )}

          <Link
            to="/register"
            className="mt-9 block text-center font-mono text-lg font-bold text-[#e2e8f0]/70 transition-colors hover:text-white"
          >
            New to the Protocol? Initialize Access
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default Login;
