import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const PaywallModal = ({ isOpen, onClose }) => {
  const { checkAuth } = useAuth();
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const origin = window.location.origin;
      const res = await axios.post('/payments/checkout', { origin_url: origin });
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setPurchasing(false);
    }
  };

  const handleLicenseSubmit = async () => {
    setLicenseError('');
    try {
      await axios.post('/license/validate', { license_key: licenseKey });
      await checkAuth();
      onClose();
    } catch (err) {
      setLicenseError(err.response?.data?.detail || 'Invalid license key');
    }
  };

  return (
    <div
      data-testid="paywall-modal"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(6,6,4,0.97)', animation: 'fadeUp 0.4s ease'
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxWidth: '90vw', background: 'var(--surface)', border: '1px solid var(--border)'
      }}>
        {/* Head */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 600, color: 'var(--white)', marginBottom: 8, letterSpacing: '0.06em' }}>
            Unlock Full System Access
          </div>
          <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 15, color: 'var(--muted)', lineHeight: 1.55 }}>
            Choose your path to unlock Acts III & beyond
          </div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase' }}>
            Musiq Matrix presents: Chroma Key Protocol
          </div>
        </div>

        {/* Tiers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, padding: 16 }}>
          {/* Lifetime License */}
          <div style={{
            background: 'var(--panel)', border: '1px solid var(--act)', padding: '16px 14px',
            textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
              fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em',
              textTransform: 'uppercase', padding: '3px 10px', background: 'var(--act)', color: 'var(--void)'
            }}>
              Recommended
            </div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 5, letterSpacing: '0.08em', marginTop: 8 }}>
              Protocol License
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 18, color: 'var(--act)', marginBottom: 8 }}>
              $29.99
            </div>
            <ul style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.9, textAlign: 'left', listStyle: 'none' }}>
              {['Lifetime access', 'All 3 Acts unlocked', 'Full audio bank', 'Social sharing', 'Journal system'].map(item => (
                <li key={item} style={{ paddingLeft: 12, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontSize: 7, top: 4, color: 'var(--act)' }}>&#x25C7;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Album Key */}
          <div style={{
            background: 'var(--panel)', border: '1px solid var(--border)', padding: '16px 14px',
            textAlign: 'center', transition: 'all 0.2s'
          }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 5, letterSpacing: '0.08em', marginTop: 8 }}>
              Album Access Key
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 14, color: 'var(--gold)', marginBottom: 8 }}>
              Included with Album
            </div>
            <ul style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.9, textAlign: 'left', listStyle: 'none' }}>
              {['Purchase Reclamation ($17.99)', 'Receive access key', 'Enter key below', 'Full protocol access'].map(item => (
                <li key={item} style={{ paddingLeft: 12, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, fontSize: 7, top: 4, color: 'var(--gold)' }}>&#x25C7;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Purchase CTA */}
        <div style={{ padding: '0 16px 16px' }}>
          <button
            data-testid="purchase-btn"
            onClick={handlePurchase}
            disabled={purchasing}
            style={{
              width: '100%', fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.4em',
              textTransform: 'uppercase', padding: 13, border: '1px solid var(--act)',
              background: 'transparent', color: 'var(--act)', cursor: purchasing ? 'wait' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {purchasing ? 'Redirecting...' : 'Purchase Protocol License — $29.99 \u2192'}
          </button>
        </div>

        {/* License Key Input */}
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            Or enter your album access key
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              data-testid="license-key-input"
              value={licenseKey}
              onChange={e => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="ENTER ACCESS KEY"
              style={{
                flex: 1, background: 'var(--panel)', border: licenseError ? '1px solid var(--r3)' : '1px solid var(--border)',
                padding: '7px 10px', fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
                color: 'var(--white)', outline: 'none', letterSpacing: '0.15em'
              }}
            />
            <button
              data-testid="apply-key-btn"
              onClick={handleLicenseSubmit}
              disabled={!licenseKey.trim()}
              style={{
                width: 80, background: 'transparent', border: '1px solid var(--gold)',
                color: 'var(--gold)', cursor: licenseKey.trim() ? 'pointer' : 'not-allowed',
                fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}
            >
              Apply
            </button>
          </div>
          {licenseError && (
            <div data-testid="license-error" style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'var(--r3)', marginTop: 6, letterSpacing: '0.1em' }}>
              {licenseError}
            </div>
          )}
        </div>

        {/* Dismiss */}
        <div style={{ textAlign: 'center', padding: '8px 16px 16px' }}>
          <span
            data-testid="dismiss-paywall"
            onClick={onClose}
            style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em',
              color: 'var(--muted)', cursor: 'pointer'
            }}
          >
            Continue with Free Access
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
