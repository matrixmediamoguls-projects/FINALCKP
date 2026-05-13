import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const WHEEL_COLORS = [
  '#00FF88', '#FF3366', '#FFD700', '#00CCFF',
  '#FF6633', '#CC33FF', '#33FF99', '#FF0066',
  '#FFAA00', '#3399FF', '#FF3399', '#66FF33',
];

const SpinWheel = () => {
  const { user } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [bonusTracks, setBonusTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinsAvailable, setSpinsAvailable] = useState(0);

  const fetchSpins = useCallback(async () => {
    try {
      const res = await axios.get('/spins');
      setSpinsAvailable(res.data.spins_available || 0);
    } catch (e) {
      // Admin gets unlimited
      if (user?.is_admin) setSpinsAvailable(99);
    }
  }, [user?.is_admin]);

  const fetchBonusTracks = useCallback(async () => {
    try {
      const res = await axios.get('/tracks');
      const bonus = (res.data.tracks || []).filter(t => t.type === 'bonus').slice(0, 12);
      // Pad to 12 if less
      while (bonus.length < 12) {
        bonus.push({ track_id: `placeholder_${bonus.length}`, name: `Bonus ${bonus.length + 1}`, type: 'bonus', act: 0, locked: true });
      }
      setBonusTracks(bonus);
    } catch (e) {
      // Fallback
      const fallback = Array.from({ length: 12 }, (_, i) => ({
        track_id: `bonus_${i}`, name: `Bonus Track ${i + 1}`, type: 'bonus', act: 0, locked: true
      }));
      setBonusTracks(fallback);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBonusTracks();
    fetchSpins();
  }, [fetchBonusTracks, fetchSpins]);

  const segmentAngle = 360 / 12;

  const spinWheel = useCallback(async () => {
    if (spinning || bonusTracks.length === 0) return;
    if (spinsAvailable <= 0 && !user?.is_admin) return;

    // Consume a spin on the backend
    if (!user?.is_admin) {
      try {
        const res = await axios.post('/spins/use');
        setSpinsAvailable(res.data.spins_available);
      } catch (e) { return; }
    }

    setSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.random() * 5;
    const targetIndex = Math.floor(Math.random() * 12);
    const targetAngle = 360 - (targetIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = rotation + (extraSpins * 360) + targetAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult({ ...bonusTracks[targetIndex], index: targetIndex });
    }, 4500);
  }, [spinning, rotation, segmentAngle, bonusTracks, spinsAvailable, user]);

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase' }}>Loading The Wheel...</div>
    </div>
  );

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
          Balanced Elementals · Bonus System
        </div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(20px,3vw,32px)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--white)' }}>
          The Wheel of Transmissions
        </div>
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 14, color: 'var(--muted)', marginTop: 6, maxWidth: 440 }}>
          12 bonus transmissions. Each unlocked through your journey. Spin to discover what awaits.
        </div>
      </div>

      {/* Wheel */}
      <div style={{ position: 'relative', width: 440, height: 440, maxWidth: '78vw', maxHeight: '78vw', margin: '0 auto 28px', flexShrink: 0 }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
          width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent',
          borderTop: '24px solid #FFD700', filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.7))'
        }} />

        {/* Outer glow ring */}
        <div style={{
          position: 'absolute', inset: -6, borderRadius: '50%',
          background: 'conic-gradient(#00FF88, #FF3366, #FFD700, #00CCFF, #FF6633, #CC33FF, #33FF99, #FF0066, #FFAA00, #3399FF, #FF3399, #66FF33, #00FF88)',
          opacity: 0.15, filter: 'blur(8px)'
        }} />

        <svg
          viewBox="0 0 440 440"
          data-testid="spin-wheel"
          style={{
            width: '100%', height: '100%', borderRadius: '50%',
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.6))'
          }}
        >
          {/* Background circle */}
          <circle cx="220" cy="220" r="218" fill="var(--void)" stroke="var(--border2)" strokeWidth="2" />

          {bonusTracks.map((track, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 220 + 210 * Math.cos(startRad);
            const y1 = 220 + 210 * Math.sin(startRad);
            const x2 = 220 + 210 * Math.cos(endRad);
            const y2 = 220 + 210 * Math.sin(endRad);

            const midAngle = startAngle + segmentAngle / 2;
            const midRad = (midAngle * Math.PI) / 180;
            const textX = 220 + 145 * Math.cos(midRad);
            const textY = 220 + 145 * Math.sin(midRad);
            const numX = 220 + 185 * Math.cos(midRad);
            const numY = 220 + 185 * Math.sin(midRad);

            const color = WHEEL_COLORS[i % 12];

            return (
              <g key={track.track_id}>
                <path
                  d={`M220,220 L${x1},${y1} A210,210 0 0,1 ${x2},${y2} Z`}
                  fill={`${color}11`}
                  stroke={`${color}44`}
                  strokeWidth="1"
                />
                {/* Segment number */}
                <text x={numX} y={numY} textAnchor="middle" dominantBaseline="middle"
                  transform={`rotate(${midAngle}, ${numX}, ${numY})`}
                  style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, fill: `${color}88`, letterSpacing: '0.1em' }}>
                  {String(i + 1).padStart(2, '0')}
                </text>
                {/* Track name */}
                <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle"
                  transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                  style={{ fontFamily: "'Cinzel',serif", fontSize: 8, fill: color, fontWeight: 600, letterSpacing: '0.04em' }}>
                  {track.name.length > 16 ? track.name.slice(0, 14) + '..' : track.name}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx="220" cy="220" r="44" fill="var(--void)" stroke="#FFD70066" strokeWidth="2" />
          <circle cx="220" cy="220" r="38" fill="var(--surface)" stroke="#FFD70033" strokeWidth="1" />
          <text x="220" y="215" textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fill: '#FFD700', letterSpacing: '0.1em', fontWeight: 600 }}>
            BALANCED
          </text>
          <text x="220" y="228" textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, fill: 'var(--muted)', letterSpacing: '0.25em' }}>
            ELEMENTALS
          </text>
        </svg>
      </div>

      {/* Spin Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          data-testid="spin-btn"
          onClick={spinWheel}
          disabled={spinning || (spinsAvailable <= 0 && !user?.is_admin)}
          style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: '0.5em',
            textTransform: 'uppercase', padding: '16px 56px',
            border: '2px solid #FFD700', background: spinning ? 'rgba(255,215,0,0.06)' : 'transparent',
            color: (spinsAvailable <= 0 && !user?.is_admin) ? 'var(--muted)' : '#FFD700',
            cursor: spinning || (spinsAvailable <= 0 && !user?.is_admin) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: !spinning && !result && spinsAvailable > 0 ? '0 0 20px rgba(255,215,0,0.15)' : 'none',
            opacity: (spinsAvailable <= 0 && !user?.is_admin) ? 0.4 : 1
          }}
        >
          {spinning ? 'Spinning...' : spinsAvailable > 0 || user?.is_admin ? 'Spin The Wheel' : 'No Spins Available'}
        </button>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em', color: 'var(--muted)', marginTop: 8 }}>
          {user?.is_admin ? 'Admin · Unlimited spins' : `${spinsAvailable} spin${spinsAvailable !== 1 ? 's' : ''} available · Complete an Act to earn more`}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div data-testid="wheel-result" style={{
          marginTop: 24, width: '100%', maxWidth: 480,
          background: 'var(--panel)', border: `1px solid var(--border)`,
          borderLeft: `3px solid ${WHEEL_COLORS[result.index % 12]}`,
          padding: '20px 24px', animation: 'fadeUp 0.4s ease both'
        }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: WHEEL_COLORS[result.index % 12], marginBottom: 6 }}>
            Transmission #{String(result.index + 1).padStart(2, '0')} · Bonus Track
          </div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: 'var(--white)', marginBottom: 8, letterSpacing: '0.06em' }}>
            {result.name}
          </div>
          <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 16 }}>
            The Wheel has spoken. This transmission is yours to explore.
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => { setResult(null); }} style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '8px 16px', border: '1px solid #FFD700', background: 'transparent', color: '#FFD700', cursor: 'pointer'
            }}>
              Spin Again
            </button>
            <button data-testid="enter-track" style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '8px 16px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer'
            }}>
              Explore Transmission &#x2192;
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>Share</span>
              <button data-testid="wheel-share-x" onClick={() => {
                const text = `The Wheel spoke: "${result.name}" — Balanced Elementals`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=550,height=420');
              }} style={shareStyle}>X</button>
              <button data-testid="wheel-share-fb" onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`The Wheel spoke: "${result.name}"`)}`, '_blank', 'width=550,height=420');
              }} style={shareStyle}>FB</button>
              <button data-testid="wheel-share-copy" onClick={() => {
                navigator.clipboard.writeText(`The Wheel spoke: "${result.name}" — Balanced Elementals\n${window.location.href}`);
                alert('Copied to clipboard!');
              }} style={shareStyle}>&#x2398;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;

const shareStyle = {
  fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.1em',
  padding: '3px 8px', border: '1px solid var(--border2)', background: 'transparent',
  color: 'var(--muted)', cursor: 'pointer'
};
