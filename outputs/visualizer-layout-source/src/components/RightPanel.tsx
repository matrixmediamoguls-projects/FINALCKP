import type { Levels } from '../App'

type Props = { levels: Levels }

function GatekeeperPanel({ denied = true, label }: { denied?: boolean; label?: string }) {
  return (
    <div style={{
      border: `1px solid ${denied ? 'rgba(255,42,26,0.6)' : 'rgba(34,255,136,0.6)'}`,
      background: denied ? 'rgba(30,0,0,0.65)' : 'rgba(0,30,10,0.65)',
      padding: '8px 10px',
      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="6" width="10" height="7" rx="1" fill="none" stroke={denied ? '#ff2a1a' : '#22ff88'} strokeWidth="1.2" />
          <path d="M4 6V4.5a3 3 0 116 0V6" stroke={denied ? '#ff2a1a' : '#22ff88'} strokeWidth="1.2" fill="none" />
          <circle cx="7" cy="9.5" r="1" fill={denied ? '#ff2a1a' : '#22ff88'} />
        </svg>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: '0.14em', color: denied ? 'var(--red)' : 'var(--green)', textTransform: 'uppercase' }}>
          GATEKEEPER PROTOCOL
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 14, height: 14, border: `1.5px solid ${denied ? '#ff2a1a' : '#22ff88'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {denied
            ? <span style={{ color: '#ff2a1a', fontSize: 12, lineHeight: 1, fontWeight: 700 }}>✕</span>
            : <span style={{ color: '#22ff88', fontSize: 10, lineHeight: 1 }}>✓</span>
          }
        </div>
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: denied ? '#ff4d40' : '#22ff88', textShadow: denied ? '0 0 8px rgba(255,42,26,0.7)' : '0 0 8px rgba(34,255,136,0.7)' }}>
          {label ?? (denied ? 'ACCESS DENIED' : 'ACCESS GRANTED')}
        </span>
      </div>
    </div>
  )
}

export default function RightPanel({ levels }: Props) {
  // levels used by child spectrum bars
  void levels

  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '8px 0',
      overflow: 'hidden',
    }}>
      {/* Gatekeeper panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <GatekeeperPanel denied={true} />
        <GatekeeperPanel denied={true} />
      </div>

      {/* New Path Confirmed */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,20,8,0.85), rgba(0,10,5,0.7))',
        border: '1px solid rgba(34,255,136,0.65)',
        padding: '14px',
        position: 'relative',
        boxShadow: '0 0 24px rgba(34,255,136,0.12), inset 0 0 14px rgba(34,255,136,0.06)',
        clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.18em',
          color: 'rgba(34,255,136,0.6)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>SYSTEM RESPONSE</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 10,
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: '2px solid var(--green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 14px rgba(34,255,136,0.5)',
          }}>
            {/* Arrow right */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5 11H17M17 11L11 5M17 11L11 17" stroke="#22ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 13,
              fontWeight: 900,
              color: 'var(--green)',
              textShadow: '0 0 10px rgba(34,255,136,0.8)',
              letterSpacing: '0.06em',
              lineHeight: 1.2,
            }}>NEW PATH<br />CONFIRMED</div>
          </div>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(34,255,136,0.5)', lineHeight: 1.6 }}>
          ROUTE RECLAIMED<br />
          PROTOCOL: ACTIVE<br />
          DECRYPT: COMPLETE
        </div>
        <div style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderTop: '1.5px solid var(--green)', borderRight: '1.5px solid var(--green)' }} />
        <div style={{ position: 'absolute', bottom: 6, left: 6, width: 12, height: 12, borderBottom: '1.5px solid var(--green)', borderLeft: '1.5px solid var(--green)' }} />
      </div>

      {/* Spectrum analyzer */}
      <div style={{
        background: 'rgba(5,0,0,0.75)',
        border: '1px solid rgba(255,42,26,0.4)',
        padding: '10px 12px',
      }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'var(--red)', letterSpacing: '0.16em', marginBottom: 8 }}>SPECTRUM ANALYZER</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60 }}>
          {Array.from({ length: 32 }, (_, i) => {
            const vals = [levels.r1, levels.r2, levels.r3, levels.r4, levels.r5]
            const v = vals[i % vals.length] * (0.5 + ((i * 13) % 17) / 20)
            const hue = i < 8 ? 'var(--red)' : i < 16 ? '#ff8844' : i < 24 ? '#cc44ff' : 'var(--cyan)'
            return (
              <div key={i} style={{
                flex: 1,
                background: hue,
                height: Math.max(4, v * 60),
                boxShadow: `0 0 4px ${hue}`,
                minWidth: 3,
              }} />
            )
          })}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 8,
          color: 'rgba(255,255,255,0.3)',
        }}>
          <span>20</span><span>80</span><span>250</span><span>2k</span><span>8k</span><span>20k</span>
        </div>
      </div>

      {/* Core modes */}
      <div style={{
        background: 'rgba(5,0,0,0.75)',
        border: '1px solid rgba(255,42,26,0.4)',
        padding: '10px 12px',
      }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'var(--red)', letterSpacing: '0.16em', marginBottom: 8 }}>CORE MODES</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {['PULSE', 'WAVE', 'RIPPLE', 'EXPAND'].map((mode, i) => (
            <button key={mode} style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.1em',
              color: i === 0 ? 'var(--red)' : 'rgba(255,255,255,0.5)',
              background: i === 0 ? 'rgba(255,42,26,0.12)' : 'transparent',
              border: `1px solid ${i === 0 ? 'rgba(255,42,26,0.7)' : 'rgba(255,255,255,0.15)'}`,
              padding: '5px 0',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}>{mode}</button>
          ))}
        </div>
      </div>
    </aside>
  )
}
