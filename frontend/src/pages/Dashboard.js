import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ── Elemental act definitions ─────────────────────────────────────────────────
const actData = [
  {
    num: 1, roman: 'I', element: 'Earth', title: 'The Fractured Veil',
    principle: 'Awareness · Recognition · Naming what was hidden.',
    glyph: '⊕', bgSymbol: '◈',
    neon: '#00FF66', glow: 'rgba(0,255,102,0.35)', border: 'rgba(0,255,102,0.55)',
    rgb: '0,255,102',
    steps: ['Recognize the fracture', 'Name the pattern', 'Begin excavation', 'Engage The Seeker', 'Declare your finding'],
  },
  {
    num: 2, roman: 'II', element: 'Fire', title: 'Reclamation',
    principle: 'Reclamation · 30 Keys · Sovereignty.',
    glyph: '△', bgSymbol: '▽',
    neon: '#FF4500', glow: 'rgba(255,69,0,0.35)', border: 'rgba(255,69,0,0.55)',
    rgb: '255,69,0',
    steps: ['Enter the fire', 'Burn what is not essential', 'Reclaim your power', 'Engage The Seeker', 'Declare sovereignty'],
  },
  {
    num: 3, roman: 'III', element: 'Water', title: 'The Reflection Chamber',
    principle: 'Reflection · Shadow Work · The Mirror.',
    glyph: '≋', bgSymbol: '〰',
    neon: '#00E5FF', glow: 'rgba(0,229,255,0.35)', border: 'rgba(0,229,255,0.55)',
    rgb: '0,229,255',
    steps: ['Enter the mirror', 'Face the shadow', 'Document what you see', 'Engage The Seeker', 'Declare your clarity'],
  },
  {
    num: 4, roman: 'IV', element: 'Air', title: 'The Crucible Code',
    principle: 'Integration · Equilibrium · Grace.',
    glyph: '✦', bgSymbol: '✧',
    neon: '#FFCC00', glow: 'rgba(255,204,0,0.35)', border: 'rgba(255,204,0,0.55)',
    rgb: '255,204,0',
    steps: ['Integration begins', 'Hold all of it', 'Build from overflow', 'Engage The Seeker', 'Declare wholeness'],
  },
];

const seekerEchoes = {
  1: "The Seeker, too, began here — feeling the weight of energies that didn't belong to him. His first act of power was not transformation. It was recognition. Naming the fracture is not defeat. It is the first sovereign act.",
  2: "The Seeker's ignition came when he recognized the difference between compassion and sacrifice. Reclamation is not selfishness. It is the prerequisite for every act of genuine service that follows.",
  3: "The Seeker walked naked into every storm because he had stopped pretending the storms weren't real. Learning to find his own face in the mirror was the most dangerous work he ever did. It is also the most necessary work you will do.",
  4: "The Seeker reached Stage Four not by becoming untouchable, but by becoming spacious. True sovereignty is not the absence of burden — it is the presence of grace.",
};

// ── Animated elemental background ────────────────────────────────────────────
const ElementalBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Large drifting elemental symbols
    const symbols = [];
    const defs = [
      { sym: '⊕', color: '#00FF66' },
      { sym: '△', color: '#FF4500' },
      { sym: '≋', color: '#00E5FF' },
      { sym: '✦', color: '#FFCC00' },
      { sym: '◈', color: '#00FF66' },
      { sym: '▽', color: '#FF4500' },
    ];
    for (let i = 0; i < 22; i++) {
      const d = defs[i % defs.length];
      symbols.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.14 - 0.04,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.006,
        size: 14 + Math.random() * 24,
        color: d.color,
        sym: d.sym,
        alpha: 0.04 + Math.random() * 0.09,
        phase: Math.random() * Math.PI * 2,
        phaseV: 0.004 + Math.random() * 0.008,
      });
    }

    // Fine ambient particles
    const particles = [];
    const pCols = ['#00FF66', '#FF4500', '#00E5FF', '#FFCC00'];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.3 + Math.random() * 1.1,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.04 - Math.random() * 0.1,
        color: pCols[Math.floor(Math.random() * 4)],
        alpha: 0.08 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        phaseV: 0.005 + Math.random() * 0.009,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.011)';
      ctx.lineWidth = 0.5;
      const gs = 72;
      for (let x = 0; x < canvas.width; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Drifting large symbols
      symbols.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        s.rot += s.rotV;
        s.phase += s.phaseV;
        const a = s.alpha * (0.55 + 0.45 * Math.sin(s.phase));

        if (s.x < -50) s.x = canvas.width + 50;
        if (s.x > canvas.width + 50) s.x = -50;
        if (s.y < -50) s.y = canvas.height + 50;
        if (s.y > canvas.height + 50) s.y = -50;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = a;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = s.color;
        ctx.font = `${s.size}px 'Share Tech Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.sym, 0, 0);
        ctx.restore();
      });

      // Fine particles with glow halos
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.phase += p.phaseV;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.phase));

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < -4) p.y = canvas.height + 4;
        if (p.y > canvas.height + 4) p.y = -4;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 9);
        const hex2 = Math.round(a * 0.7 * 255).toString(16).padStart(2, '0');
        grad.addColorStop(0, `${p.color}${hex2}`);
        grad.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 9, 0, Math.PI * 2);
        ctx.fill();

        const hex3 = Math.round(a * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = `${p.color}${hex3}`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
};

// ── Frosted glass Act card ────────────────────────────────────────────────────
const ActCard = ({ act, status, isActive, onEnter, onImmersion }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const needsUnlock = status === 'Locked' || status === 'Sealed';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -7,
      y: ((e.clientX - cx) / (rect.width / 2)) * 7,
    });
  };

  return (
    <div
      ref={cardRef}
      data-testid={`act-card-${act.num}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{ perspective: '1000px', cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 340,
        padding: '20px 16px 16px',
        background: hovered
          ? `linear-gradient(150deg, rgba(${act.rgb},0.16) 0%, rgba(4,5,8,0.82) 100%)`
          : `linear-gradient(150deg, rgba(${act.rgb},0.07) 0%, rgba(4,5,8,0.88) 100%)`,
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: `1px solid ${hovered ? act.border : 'rgba(255,255,255,0.07)'}`,
        borderTop: `2px solid ${act.neon}`,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)${hovered ? ' translateZ(14px) scale(1.025)' : ''}`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s, background 0.3s',
        boxShadow: hovered
          ? `0 24px 64px ${act.glow}, 0 0 0 1px ${act.border}, inset 0 1px 0 rgba(255,255,255,0.07)`
          : `0 4px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.03)`,
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}>

        {/* Top radial shimmer on hover */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% -10%, rgba(${act.rgb},0.18) 0%, transparent 55%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s',
        }} />

        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 7, right: 7, width: 10, height: 10, borderTop: `1px solid ${act.neon}60`, borderRight: `1px solid ${act.neon}60`, opacity: hovered ? 1 : 0.25, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', bottom: 7, left: 7, width: 10, height: 10, borderBottom: `1px solid ${act.neon}60`, borderLeft: `1px solid ${act.neon}60`, opacity: hovered ? 1 : 0.25, transition: 'opacity 0.3s' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
          <span style={{
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase',
            color: act.neon,
            textShadow: hovered ? `0 0 12px ${act.neon}` : 'none',
            transition: 'text-shadow 0.3s',
          }}>
            ACT {act.roman}
          </span>
          <span style={{
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: 8, letterSpacing: '0.14em',
            padding: '3px 8px',
            border: `1px solid ${isActive ? act.neon : 'rgba(255,255,255,0.1)'}`,
            color: isActive ? act.neon : status === 'Complete' ? act.neon : 'rgba(255,255,255,0.3)',
            background: isActive ? `rgba(${act.rgb},0.12)` : 'transparent',
            boxShadow: isActive ? `0 0 10px ${act.glow}` : 'none',
          }}>
            {status}
          </span>
        </div>

        {/* Glyph */}
        <div style={{
          fontSize: 44, lineHeight: 1, marginBottom: 10,
          color: act.neon,
          filter: `drop-shadow(0 0 ${hovered ? 22 : 9}px ${act.neon})`,
          transition: 'filter 0.3s',
          transform: 'translateZ(22px)',
          userSelect: 'none',
        }}>
          {act.glyph}
        </div>

        {/* Element label */}
        <div style={{
          fontFamily: "'Share Tech Mono',monospace",
          fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase',
          color: `rgba(${act.rgb},0.55)`,
          marginBottom: 8,
        }}>
          {act.element}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 14, fontWeight: 700, lineHeight: 1.25,
          color: '#fff',
          textShadow: hovered ? `0 0 20px rgba(${act.rgb},0.45)` : 'none',
          transition: 'text-shadow 0.3s',
          marginBottom: 7,
        }}>
          {act.title}
        </div>

        {/* Principle */}
        <div style={{
          fontFamily: "'IM Fell English',serif",
          fontStyle: 'italic', fontSize: 11, lineHeight: 1.65,
          color: 'rgba(232,228,216,0.48)',
          marginBottom: 14, flexGrow: 1,
        }}>
          {act.principle}
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
          {act.steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 8, letterSpacing: '0.08em',
              color: i === 0 && isActive ? act.neon : 'rgba(255,255,255,0.2)',
            }}>
              <div style={{
                width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
                background: i === 0 && isActive ? act.neon : 'rgba(255,255,255,0.12)',
                boxShadow: i === 0 && isActive ? `0 0 5px ${act.neon}` : 'none',
              }} />
              {step}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <button
            data-testid={`act-enter-${act.num}`}
            onClick={(e) => { e.stopPropagation(); onEnter(act); }}
            style={{
              width: '100%',
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
              padding: '10px 0',
              border: `1px solid ${act.neon}`,
              background: hovered ? `rgba(${act.rgb},0.15)` : `rgba(${act.rgb},0.06)`,
              color: act.neon,
              cursor: 'pointer',
              boxShadow: hovered ? `0 0 20px ${act.glow}, inset 0 0 12px rgba(${act.rgb},0.08)` : 'none',
              transition: 'all 0.22s',
            }}
          >
            {needsUnlock ? '✦ Unlock Access' : isActive ? 'Continue →' : 'Enter'}
          </button>

          <button
            data-testid={`act-immersion-${act.num}`}
            onClick={(e) => { e.stopPropagation(); onImmersion(act.num); }}
            style={{
              width: '100%',
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '7px 0',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.28)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${act.rgb},0.45)`; e.currentTarget.style.color = act.neon; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; }}
          >
            <span style={{ color: act.neon }}>♫</span> Immersion Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Frosted glass stat panel ──────────────────────────────────────────────────
const GlassPanel = ({ accentColor, accentRgb, children, style = {} }) => (
  <div style={{
    background: 'rgba(8,10,8,0.55)',
    backdropFilter: 'blur(22px) saturate(150%)',
    WebkitBackdropFilter: 'blur(22px) saturate(150%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderTop: `2px solid ${accentColor}`,
    boxShadow: `0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(${accentRgb},0.06)`,
    padding: '16px 18px',
    ...style,
  }}>
    {children}
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isAdmin = user?.is_admin || false;
  const currentAct = user?.current_act || 1;
  const completedActs = user?.completed_acts || [];
  const currentLevel = user?.level ?? 0;
  const tier = user?.tier || 'free';

  const pollPaymentStatus = useCallback(async (sessionId, attempts = 0) => {
    if (attempts >= 5) return;
    try {
      const res = await axios.get(`/payments/status/${sessionId}`);
      if (res.data.payment_status === 'paid') await checkAuth();
      else if (res.data.status !== 'expired') setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
    } catch (e) {}
  }, [checkAuth]);

  useEffect(() => {
    const sid = searchParams.get('session_id');
    if (sid) { pollPaymentStatus(sid); setSearchParams({}, { replace: true }); }
  }, [searchParams, pollPaymentStatus, setSearchParams]);

  const getActStatus = (act) => {
    if (completedActs.includes(act.num)) return 'Complete';
    if (act.num === currentAct) return 'Active';
    if (isAdmin || tier === 'full' || tier === 'license') return 'Available';
    if (act.num > 1) return act.num === 4 ? 'Sealed' : 'Locked';
    return 'Available';
  };

  const handleActClick = (act) => {
    const st = getActStatus(act);
    if (st === 'Locked' || st === 'Sealed') { navigate('/dashboard?showUnlock=true'); return; }
    navigate(`/protocol/${act.num}`);
  };

  const currentActData = actData[currentAct - 1] || actData[0];

  return (
    <div style={{ position: 'relative', minHeight: '100%', overflowX: 'hidden' }}>

      {/* Animated elemental canvas */}
      <ElementalBackground />

      {/* Per-element ambient corner glow */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(ellipse at 15% 15%, rgba(0,255,102,0.05) 0%, transparent 45%)',
          'radial-gradient(ellipse at 85% 20%, rgba(255,69,0,0.05) 0%, transparent 40%)',
          'radial-gradient(ellipse at 85% 85%, rgba(0,229,255,0.05) 0%, transparent 45%)',
          'radial-gradient(ellipse at 15% 80%, rgba(255,204,0,0.04) 0%, transparent 40%)',
        ].join(', '),
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '28px 24px 44px' }}>

        {/* ── HERO BRAND ── */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>

          {/* Brand pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginBottom: 16, padding: '5px 18px',
            background: 'rgba(212,175,55,0.07)',
            border: '1px solid rgba(212,175,55,0.3)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 8px #D4AF37' }} />
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#D4AF37' }}>
              Musiq Matrix · Chroma Key Protocol
            </span>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 8px #D4AF37' }} />
          </div>

          <div
            data-testid="home-hero-title"
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 'clamp(22px, 3.8vw, 46px)',
              fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#fff',
              textShadow: '0 0 60px rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.8)',
              marginBottom: 10, lineHeight: 1.15,
              animation: 'heroFadeIn 0.8s ease both',
            }}
          >
            The Chroma Key Protocol
          </div>

          <div style={{
            fontFamily: "'IM Fell English',serif", fontStyle: 'italic',
            fontSize: 15, color: 'rgba(232,228,216,0.5)',
            maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.75,
            animation: 'heroFadeIn 0.9s 0.1s ease both',
          }}>
            A four-stage initiatory system encoded in sound, mythology, and architecture.
          </div>

          {/* Elemental color bar */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 8,
            animation: 'heroFadeIn 1s 0.2s ease both',
          }}>
            {actData.map(act => (
              <div key={act.num} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <div style={{
                  width: 48, height: 3, borderRadius: 2,
                  background: act.neon,
                  boxShadow: `0 0 10px ${act.neon}, 0 0 20px rgba(${act.rgb},0.4)`,
                }} />
                <span style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: `rgba(${act.rgb},0.6)`,
                }}>
                  {act.element}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACT CARDS ── */}
        <div data-testid="roadmap" style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <span style={{
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}>
              Protocol Acts
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}>
            {actData.map((act, idx) => (
              <div key={act.num} style={{ animation: `cardRise 0.5s ${idx * 0.08}s ease both` }}>
                <ActCard
                  act={act}
                  status={getActStatus(act)}
                  isActive={act.num === currentAct}
                  onEnter={handleActClick}
                  onImmersion={(num) => navigate(`/listen/${num}`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div data-testid="dash-strip" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>

          {/* Current Stage */}
          <GlassPanel accentColor="#00FF66" accentRgb="0,255,102">
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 12 }}>
              Current Stage
            </div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 700, color: '#00FF66', marginBottom: 5, textShadow: '0 0 14px rgba(0,255,102,0.5)' }}>
              Act {['I', 'II', 'III', 'IV'][currentAct - 1]} · {['Earth', 'Fire', 'Water', 'Air'][currentAct - 1]}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.16em' }}>
              {['Observer', 'Participant', 'Decoder', 'Architect'][Math.min(currentLevel, 3)]} · Level {String(currentLevel).padStart(2, '0')}
            </div>
          </GlassPanel>

          {/* Protocol Progress */}
          <GlassPanel accentColor="#D4AF37" accentRgb="212,175,55" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 12 }}>
              Protocol Progress
            </div>
            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
              {actData.map(act => (
                <div key={act.num} style={{
                  flex: 1, height: 5, borderRadius: 1,
                  background: completedActs.includes(act.num)
                    ? act.neon
                    : act.num === currentAct
                      ? `linear-gradient(90deg, ${act.neon}, rgba(255,255,255,0.08))`
                      : 'rgba(255,255,255,0.05)',
                  boxShadow: completedActs.includes(act.num) ? `0 0 8px ${act.neon}` : 'none',
                  transition: 'all 0.4s',
                }} />
              ))}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: '#D4AF37', letterSpacing: '0.12em', textShadow: '0 0 10px rgba(212,175,55,0.4)' }}>
              {completedActs.length}/4 Acts Complete
            </div>
          </GlassPanel>

          {/* Quick Actions */}
          <GlassPanel accentColor="#00E5FF" accentRgb="0,229,255" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>
              Quick Actions
            </div>
            {[
              { label: 'Start Protocol Session', path: '/protocol', color: '#00FF66', rgb: '0,255,102', icon: '◈' },
              { label: 'Spin The Wheel',          path: '/wheel',    color: '#FFCC00', rgb: '255,204,0', icon: '◎' },
              { label: 'Open Journal',            path: '/journal',  color: '#00E5FF', rgb: '0,229,255', icon: '✎' },
            ].map(a => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.12em',
                  padding: '7px 10px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'transparent', color: 'rgba(255,255,255,0.45)',
                  cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `rgba(${a.rgb},0.5)`;
                  e.currentTarget.style.color = a.color;
                  e.currentTarget.style.background = `rgba(${a.rgb},0.08)`;
                  e.currentTarget.style.boxShadow = `0 0 12px rgba(${a.rgb},0.12)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ color: a.color, fontSize: 11 }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </GlassPanel>
        </div>

        {/* ── SEEKER'S ECHO ── */}
        <div data-testid="seeker-echo" style={{
          background: 'rgba(8,9,8,0.65)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: '3px solid #D4AF37',
          padding: '20px 24px',
          marginBottom: 20,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase',
              color: '#D4AF37',
              textShadow: '0 0 10px rgba(212,175,55,0.5)',
            }}>
              The Seeker's Echo · Act {['I', 'II', 'III', 'IV'][currentAct - 1]}
            </div>
            <button
              onClick={() => navigate('/seeker')}
              style={{
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 8, letterSpacing: '0.16em',
                padding: '4px 12px',
                border: '1px solid rgba(212,175,55,0.35)',
                background: 'transparent', color: '#D4AF37',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(212,175,55,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Meet The Seeker →
            </button>
          </div>
          <p style={{
            fontFamily: "'IM Fell English',serif", fontStyle: 'italic',
            fontSize: 14, color: 'rgba(232,228,216,0.58)',
            lineHeight: 1.75, margin: 0,
          }}>
            {seekerEchoes[currentAct]}
          </p>
        </div>

        {/* ── ACTION STRIP ── */}
        <div data-testid="action-strip" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {[
            { testid: 'action-protocol', path: '/protocol',                    color: '#00FF66', rgb: '0,255,102',   icon: '◈', label: 'Begin Protocol Session' },
            { testid: 'action-upgrade',  path: '/dashboard?showUnlock=true',   color: '#D4AF37', rgb: '212,175,55',  icon: '↑', label: 'Unlock Full System' },
            { testid: 'action-seeker',   path: '/seeker',                      color: '#00E5FF', rgb: '0,229,255',   icon: '◇', label: 'Meet The Seeker' },
          ].map(btn => (
            <button
              key={btn.testid}
              data-testid={btn.testid}
              onClick={() => navigate(btn.path)}
              style={{
                background: `rgba(${btn.rgb},0.06)`,
                backdropFilter: 'blur(14px)',
                border: `1px solid rgba(${btn.rgb},0.35)`,
                padding: '15px 16px',
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
                color: btn.color, cursor: 'pointer', textAlign: 'center',
                boxShadow: `0 0 20px rgba(${btn.rgb},0.08)`,
                transition: 'all 0.22s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `rgba(${btn.rgb},0.14)`;
                e.currentTarget.style.boxShadow = `0 0 32px rgba(${btn.rgb},0.2), 0 0 0 1px rgba(${btn.rgb},0.4)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `rgba(${btn.rgb},0.06)`;
                e.currentTarget.style.boxShadow = `0 0 20px rgba(${btn.rgb},0.08)`;
                e.currentTarget.style.transform = 'none';
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
