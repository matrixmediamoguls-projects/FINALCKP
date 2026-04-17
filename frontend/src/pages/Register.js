import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeSlash, GoogleLogo, Fingerprint } from '@phosphor-icons/react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Access codes do not match');
      return;
    }

    if (password.length < 6) {
      setError('Access code must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-chroma-gold mb-6">
            <Fingerprint size={32} className="text-chroma-gold" weight="thin" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-chroma-text-primary tracking-tight uppercase">
            Initialize Access
          </h1>
          <p className="mono-label mt-2">Seeker Registration</p>
        </div>

        {/* Register Form */}
        <div className="card-cyber p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-chroma-fire/10 border border-chroma-fire/30 text-chroma-fire text-sm p-3 font-mono">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="mono-label">Seeker Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your identity"
                required
                data-testid="register-name-input"
                className="bg-chroma-surface border-chroma-border-default text-chroma-text-primary placeholder:text-chroma-text-muted rounded-none focus:border-chroma-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="mono-label">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seeker@protocol.io"
                required
                data-testid="register-email-input"
                className="bg-chroma-surface border-chroma-border-default text-chroma-text-primary placeholder:text-chroma-text-muted rounded-none focus:border-chroma-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="mono-label">Access Code</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create access code"
                  required
                  data-testid="register-password-input"
                  className="bg-chroma-surface border-chroma-border-default text-chroma-text-primary placeholder:text-chroma-text-muted rounded-none focus:border-chroma-gold pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-chroma-text-muted hover:text-chroma-gold transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="mono-label">Confirm Access Code</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm access code"
                required
                data-testid="register-confirm-password-input"
                className="bg-chroma-surface border-chroma-border-default text-chroma-text-primary placeholder:text-chroma-text-muted rounded-none focus:border-chroma-gold"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              data-testid="register-submit-btn"
              className="w-full btn-gold h-12"
            >
              {loading ? 'INITIALIZING...' : 'BEGIN PROTOCOL'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-chroma-border-default"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-chroma-card px-4 mono-label">OR</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={loginWithGoogle}
            data-testid="google-register-btn"
            className="w-full bg-chroma-surface border border-chroma-border-default text-chroma-text-primary hover:border-chroma-gold hover:text-chroma-gold transition-all duration-300 h-12 rounded-none font-mono text-xs uppercase tracking-[0.15em]"
          >
            <GoogleLogo size={20} weight="bold" className="mr-3" />
            Continue with Google
          </Button>

          <p className="text-center text-chroma-text-secondary text-sm mt-8">
            Already a Seeker?{' '}
            <Link
              to="/login"
              className="text-chroma-gold hover:underline"
              data-testid="login-link"
            >
              Access Protocol
            </Link>
          </p>
        </div>

        <p className="text-center text-chroma-text-muted text-xs mt-8 font-mono">
          THE CHROMA KEY PROTOCOL // MUSIQ MATRIX
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
