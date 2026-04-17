import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const actData = [
  { num: 1, roman: 'I', element: 'Earth', title: 'The Fractured Veil', principle: 'Awareness · Recognition · Naming what was hidden.', glyph: '\u2295', colorVar: '--g3', colorVar2: '--g4', dimVar: '--gdim', surfGrad: 'linear-gradient(180deg,var(--gsurf),#070c05)', borderGrad: 'linear-gradient(90deg,var(--g3),var(--g4))', hex: '#5ab038', steps: ['Recognize the fracture', 'Name the pattern', 'Begin excavation', 'Engage The Seeker', 'Declare your finding'] },
  { num: 2, roman: 'II', element: 'Fire', title: 'Reclamation', principle: 'Reclamation · 30 Keys · Sovereignty.', glyph: '\u25B3', colorVar: '--r3', colorVar2: '--r4', dimVar: '--rdim', surfGrad: 'linear-gradient(180deg,var(--rsurf),#0b0402)', borderGrad: 'linear-gradient(90deg,var(--r2),var(--r3))', hex: '#D85A30', steps: ['Enter the fire', 'Burn what is not essential', 'Reclaim your power', 'Engage The Seeker', 'Declare sovereignty'] },
  { num: 3, roman: 'III', element: 'Water', title: 'The Reflection Chamber', principle: 'Reflection · Shadow Work · The Mirror.', glyph: '\u224B', colorVar: '--b3', colorVar2: '--b4', dimVar: '--bdim', surfGrad: 'linear-gradient(180deg,var(--bsurf),#050810)', borderGrad: 'linear-gradient(90deg,var(--b2),var(--b3))', hex: '#50a0e0', steps: ['Enter the mirror', 'Face the shadow', 'Document what you see', 'Engage The Seeker', 'Declare your clarity'] },
  { num: 4, roman: 'IV', element: 'Air', title: 'The Crucible Code', principle: 'Integration · Equilibrium · Grace.', glyph: '\u2726', colorVar: '--y3', colorVar2: '--y4', dimVar: '--ydim', surfGrad: 'linear-gradient(180deg,var(--ysurf),#080600)', borderGrad: 'linear-gradient(90deg,var(--y2),var(--y3))', hex: '#c8a020', steps: ['Integration begins', 'Hold all of it', 'Build from overflow', 'Engage The Seeker', 'Declare wholeness'] },
];

const seekerEchoes = {
  1: "The Seeker, too, began here — feeling the weight of energies that didn't belong to him. His first act of power was not transformation. It was recognition. Naming the fracture is not defeat. It is the first sovereign act.",
  2: "The Seeker's ignition came when he recognized the difference between compassion and sacrifice. Reclamation is not selfishness. It is the prerequisite for every act of genuine service that follows.",
  3: "The Seeker walked naked into every storm because he had stopped pretending the storms weren't real. Learning to find his own face in the mirror was the most dangerous work he ever did. It is also the most necessary work you will do.",
  4: "The Seeker reached Stage Four not by becoming untouchable, but by becoming spacious. True sovereignty is not the absence of burden — it is the presence of grace."
};

/* ── Ambient Background ── */
const AmbientBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const colors = ['#5ab038', '#D85A30', '#50a0e0', '#c8a020'];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1 - 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.008 + 0.003
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(232,228,216,0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grad.addColorStop(0, p.color.replace(')', `,${a})`.replace('rgb', 'rgba').replace('#', '')));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = `${p.color}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `${p.color}${Math.round(Math.min(1, a * 2) * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ── 3D Act Card ── */
const ActCard3D = ({ act, locked, status, isActive, onEnter, onImmersion }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (locked || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = ((e.clientY - cy) / (rect.height / 2)) * -4;
    const y = ((e.clientX - cx) / (rect.width / 2)) * 4;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => { setTilt({ x: 0, y: 0 }); setHovering(false); };

  const glowColor = act.hex;
  const glowIntensity = hovering ? 0.4 : isActive ? 0.2 : 0;

  return (
    <div
      ref={cardRef}
      data-testid={`act-card-${act.num}`}
      onClick={() => onEnter(act)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.4 : 1,
        perspective: '800px',
        transition: 'opacity 0.3s'
      }}
    >
      <div style={{
        padding: '18px 14px', position: 'relative',
        background: act.surfGrad,
        border: `1px solid ${isActive || hovering ? glowColor : 'rgba(232,228,216,0.06)'}`,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovering ? 'translateZ(8px) scale(1.015)' : ''}`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
        boxShadow: glowIntensity > 0
          ? `0 0 ${hovering ? 25 : 15}px ${glowColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}, inset 0 0 ${hovering ? 20 : 12}px ${glowColor}${Math.round(glowIntensity * 0.3 * 255).toString(16).padStart(2, '0')}`
          : 'none',
        transformStyle: 'preserve-3d',
      }}>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: act.borderGrad,
          boxShadow: hovering ? `0 0 8px ${glowColor}66` : 'none',
          transition: 'box-shadow 0.3s'
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: `var(${act.colorVar})` }}>
            Act {act.roman} · {act.element}
          </span>
          <span style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em',
            padding: '2px 6px',
            background: status === 'Active' ? `${glowColor}18` : 'transparent',
            border: `1px solid ${status === 'Active' ? glowColor : status === 'Complete' ? `var(${act.colorVar})` : 'var(--border)'}`,
            color: status === 'Active' ? glowColor : status === 'Complete' ? `var(${act.colorVar})` : 'var(--muted)',
            boxShadow: status === 'Active' ? `0 0 6px ${glowColor}33` : 'none'
          }}>
            {status}
          </span>
        </div>

        {/* Glyph with glow */}
        <div style={{
          fontSize: 26, display: 'block', marginBottom: 8,
          color: `var(${act.colorVar})`, lineHeight: 1,
          filter: !locked ? `drop-shadow(0 0 ${hovering ? 12 : 6}px ${glowColor}88)` : 'none',
          transition: 'filter 0.3s',
          transform: 'translateZ(20px)',
        }}>
          {act.glyph}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, marginBottom: 4,
          color: `var(${act.colorVar2})`,
          textShadow: hovering ? `0 0 8px ${glowColor}44` : 'none',
          transition: 'text-shadow 0.3s'
        }}>
          {act.title}
        </div>

        {/* Principle */}
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 10, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 10 }}>
          {act.principle}
        </div>

        {/* Steps */}
        {!locked && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 10 }}>
            {act.steps.map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: "'Share Tech Mono',monospace", fontSize: 7,
                color: i === 0 && isActive ? glowColor : 'var(--muted)',
                letterSpacing: '0.1em',
                textShadow: i === 0 && isActive ? `0 0 4px ${glowColor}44` : 'none'
              }}>
                <span style={{ fontSize: 6, color: i === 0 && isActive ? glowColor : 'var(--muted)' }}>
                  {i === 0 && isActive ? '\u25B6' : '\u25C7'}
                </span>
                {step}
              </div>
            ))}
          </div>
        )}

        {/* Locked overlay */}
        {locked && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'rgba(6,6,4,0.6)', backdropFilter: 'blur(3px)'
          }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: `var(${act.colorVar})` }}>
              {act.num === 4 ? 'Coming Soon' : 'Unlock to Access'}
            </span>
          </div>
        )}

        {/* Enter button */}
        <button data-testid={`act-enter-${act.num}`} onClick={(e) => { e.stopPropagation(); onEnter(act); }} style={{
          width: '100%', fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em',
          textTransform: 'uppercase', padding: '7px 0',
          border: `1px solid ${locked ? 'var(--border)' : glowColor}`,
          background: hovering && !locked ? `${glowColor}0d` : 'transparent',
          cursor: locked ? 'not-allowed' : 'pointer',
          color: locked ? 'var(--muted)' : glowColor,
          boxShadow: hovering && !locked ? `0 0 10px ${glowColor}22` : 'none',
          transition: 'all 0.2s'
        }}>
          {isActive ? 'Continue \u2192' : locked ? (act.num === 4 ? 'Sealed' : 'Locked') : 'Enter'}
        </button>

        {/* Immersion button */}
        {!locked && (
          <button data-testid={`act-immersion-${act.num}`} onClick={(e) => { e.stopPropagation(); onImmersion(act.num); }} style={{
            width: '100%', fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '5px 0', marginTop: 3,
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <span style={{ color: `var(${act.colorVar})` }}>{'\u266B'}</span> Immersion Protocol
          </button>
        )}

        {/* Corner accents */}
        {!locked && (
          <>
            <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: `1px solid ${glowColor}44`, borderRight: `1px solid ${glowColor}44`, opacity: hovering ? 1 : 0.3, transition: 'opacity 0.3s' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: `1px solid ${glowColor}44`, borderLeft: `1px solid ${glowColor}44`, opacity: hovering ? 1 : 0.3, transition: 'opacity 0.3s' }} />
          </>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const act3Unlocked = user?.act3_unlocked || false;
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
    } catch (e) { /* ignore */ }
  }, [checkAuth]);

  useEffect(() => {
    const sid = searchParams.get('session_id');
    if (sid) { pollPaymentStatus(sid); setSearchParams({}, { replace: true }); }
  }, [searchParams, pollPaymentStatus, setSearchParams]);

  const isLocked = (act) => {
    if (isAdmin) return false;
    if (act.num === 1) return false;
    if (tier === 'full' || tier === 'license') return false;
    return true;
  };

  const getActStatus = (act) => {
    if (isLocked(act)) return act.num === 4 ? 'Sealed' : 'Locked';
    if (completedActs.includes(act.num)) return 'Complete';
    if (act.num === currentAct) return 'Active';
    return 'Available';
  };

  const handleActClick = (act) => {
    if (isLocked(act)) {
      navigate('/dashboard?showUnlock=true');
      return;
    }
    navigate(`/protocol/${act.num}`);
  };

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto', position: 'relative' }}>
      {/* Ambient Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <AmbientBackground />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(16px,2.5vw,26px)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--act)', marginBottom: 4 }} data-testid="home-hero-title">
            The Chroma Key Protocol
          </div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 2 }}>
            Musiq Matrix presents: Balanced Elementals
          </div>
          <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
            A four-stage initiatory system encoded in sound, mythology, and architecture.
          </div>
        </div>

        {/* Roadmap */}
        <div data-testid="roadmap" style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, paddingLeft: 2 }}>
            Your Protocol Roadmap
          </div>

          {/* Progress line with completion trail */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 3, height: 4, position: 'relative' }}>
            {actData.map((act, idx) => {
              const status = getActStatus(act);
              const isComplete = status === 'Complete';
              const isActive = status === 'Active';
              return (
                <div key={act.num} style={{
                  flex: 1, position: 'relative',
                  background: isComplete ? `var(${act.colorVar})` :
                    isActive ? `linear-gradient(90deg, var(${act.colorVar}), var(--border))` : 'var(--border)',
                  boxShadow: isComplete ? `0 0 8px ${act.hex}55, 0 0 16px ${act.hex}22` : isActive ? `0 0 4px ${act.hex}33` : 'none',
                  transition: 'all 0.5s',
                  overflow: 'visible'
                }}>
                  {/* Animated pulse on active segment */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', top: -1, right: 0, width: 6, height: 6,
                      borderRadius: '50%', background: act.hex,
                      boxShadow: `0 0 8px ${act.hex}, 0 0 16px ${act.hex}88`,
                      animation: 'trailPulse 2s ease-in-out infinite'
                    }} />
                  )}
                  {/* Connection spark between completed segments */}
                  {isComplete && idx < actData.length - 1 && getActStatus(actData[idx + 1]) !== 'Locked' && getActStatus(actData[idx + 1]) !== 'Sealed' && (
                    <div style={{
                      position: 'absolute', top: -2, right: -3, width: 8, height: 8,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${act.hex}, ${actData[idx + 1].hex})`,
                      boxShadow: `0 0 6px ${act.hex}88`,
                      animation: 'trailSpark 1.5s ease-in-out infinite',
                      zIndex: 2
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* 3D Act cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {actData.map(act => (
              <ActCard3D
                key={act.num}
                act={act}
                locked={isLocked(act)}
                status={getActStatus(act)}
                isActive={act.num === currentAct && !isLocked(act)}
                onEnter={handleActClick}
                onImmersion={(num) => navigate(`/listen/${num}`)}
              />
            ))}
          </div>
        </div>

        {/* Seeker's Echo */}
        <div data-testid="seeker-echo" style={{
          background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)', borderLeft: '3px solid var(--act)',
          padding: '16px 20px', marginBottom: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--act)', marginBottom: 4 }}>
                The Seeker's Echo · Act {['I','II','III','IV'][currentAct - 1]}
              </div>
            </div>
            <button onClick={() => navigate('/seeker')} style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em', padding: '3px 8px',
              border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer'
            }}>
              Meet The Seeker
            </button>
          </div>
          <p style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(232,228,216,0.65)', lineHeight: 1.65, margin: 0 }}>
            {seekerEchoes[currentAct]}
          </p>
        </div>

        {/* Dashboard Strip */}
        <div data-testid="dash-strip" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, marginBottom: 24 }}>
          <div style={{ background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(6px)', border: '1px solid var(--border)', padding: '12px 14px' }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, display: 'block', paddingBottom: 4, borderBottom: '1px solid var(--border)' }}>
              Current Stage
            </span>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--act)', marginBottom: 2 }}>
              Act {['I','II','III','IV'][currentAct - 1]} · {['Earth','Fire','Water','Air'][currentAct - 1]}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)', letterSpacing: '0.15em' }}>
              {['Observer','Participant','Decoder','Architect'][Math.min(currentLevel, 3)]} · Level {String(currentLevel).padStart(2, '0')}
            </div>
          </div>

          <div style={{ background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(6px)', border: '1px solid var(--border)', padding: '12px 14px', textAlign: 'center' }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, display: 'block', paddingBottom: 4, borderBottom: '1px solid var(--border)' }}>
              Protocol Progress
            </span>
            <div style={{ display: 'flex', gap: 3, margin: '8px 0' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 4,
                  background: completedActs.includes(i) ? 'var(--act)' : i === currentAct ? 'linear-gradient(90deg,var(--act),var(--border))' : 'var(--border)',
                  boxShadow: completedActs.includes(i) ? '0 0 4px rgba(90,176,56,0.3)' : 'none'
                }} />
              ))}
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'var(--act)' }}>
              {completedActs.length}/4 Acts Complete
            </div>
          </div>

          <div style={{ background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(6px)', border: '1px solid var(--border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--muted)', paddingBottom: 4, borderBottom: '1px solid var(--border)' }}>
              Quick Actions
            </span>
            {[
              { label: 'Start Protocol Session', path: '/protocol', icon: '\u25C8' },
              { label: 'Spin The Wheel', path: '/wheel', icon: '\u25CE' },
              { label: 'Open Journal', path: '/journal', icon: '\u270E' },
            ].map(a => (
              <button key={a.path} onClick={() => navigate(a.path)} style={{
                fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.15em',
                padding: '5px 8px', border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--muted)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <span style={{ color: 'var(--act)' }}>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Strip */}
        <div data-testid="action-strip" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
          <button data-testid="action-protocol" onClick={() => navigate('/protocol')} style={{
            background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(6px)',
            border: '1px solid var(--act)', padding: '12px 16px',
            fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'var(--act)', cursor: 'pointer', textAlign: 'center',
            boxShadow: '0 0 12px rgba(90,176,56,0.15)',
            animation: 'ctaPulse 3s ease-in-out infinite'
          }}>
            {'\u25C8'} Begin Protocol Session
          </button>
          <button data-testid="action-upgrade" onClick={() => navigate('/dashboard?showUnlock=true')} style={{
            background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(6px)',
            border: '1px solid var(--gdim)', padding: '12px 16px',
            fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'var(--gold)', cursor: 'pointer', textAlign: 'center'
          }}>
            {'\u2191'} Unlock Full System
          </button>
          <button data-testid="action-seeker" onClick={() => navigate('/seeker')} style={{
            background: 'rgba(10,10,8,0.7)', backdropFilter: 'blur(6px)',
            border: '1px solid var(--border)', padding: '12px 16px',
            fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer', textAlign: 'center'
          }}>
            {'\u25C7'} Meet The Seeker
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
