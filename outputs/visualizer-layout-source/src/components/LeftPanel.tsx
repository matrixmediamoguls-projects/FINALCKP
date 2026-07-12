import type { Levels } from '../App'

type Props = { levels: Levels }

function GatekeeperPanel({ denied = true }: { denied?: boolean }) {
  return (
    <div style={{
      border: `1px solid ${denied ? 'rgba(255,42,26,0.6)' : 'rgba(34,255,136,0.6)'}`,
      background: denied ? 'rgba(30,0,0,0.65)' : 'rgba(0,30,10,0.65)',
      padding: '8px 10px',
      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="6" width="10" height="7" rx="1" fill="none" stroke={denied ? '#ff2a1a' : '#22ff88'} strokeWidth="1.2" />
          <path d="M4 6V4.5a3 3 0 116 0V6" stroke={denied ? '#ff2a1a' : '#22ff88'} strokeWidth="1.2" fill="none" />
          <circle cx="7" cy="9.5" r="1" fill={denied ? '#ff2a1a' : '#22ff88'} />
        </svg>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.14em',
          color: denied ? 'var(--red)' : 'var(--green)',
          textTransform: 'uppercase',
        }}>GATEKEEPER PROTOCOL</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <div style={{
          width: 14,
          height: 14,
          border: `1.5px solid ${denied ? '#ff2a1a' : '#22ff88'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {denied
            ? <span style={{ color: '#ff2a1a', fontSize: 12, lineHeight: 1, fontWeight: 700 }}>✕</span>
            : <span style={{ color: '#22ff88', fontSize: 10, lineHeight: 1 }}>✓</span>
          }
        </div>
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: denied ? '#ff4d40' : '#22ff88',
          textShadow: denied ? '0 0 8px rgba(255,42,26,0.7)' : '0 0 8px rgba(34,255,136,0.7)',
        }}>
          {denied ? 'ACCESS DENIED' : 'ACCESS GRANTED'}
        </span>
      </div>
    </div>
  )
}

export default function LeftPanel({ levels }: Props) {
  const { r1, overall } = levels

  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '8px 0',
      overflow: 'hidden',
    }}>
      {/* System Override badge */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(40,0,0,0.85), rgba(10,0,0,0.7))',
        border: '1px solid rgba(255,42,26,0.7)',
        padding: '12px 14px',
        position: 'relative',
        boxShadow: '0 0 24px rgba(255,0,0,0.15), inset 0 0 16px rgba(255,0,0,0.08)',
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>PROJECT: SIERRA</div>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: '0.08em',
          color: 'white',
          textTransform: 'uppercase',
          lineHeight: 1.1,
          textShadow: '0 0 12px rgba(255,255,255,0.4)',
        }}>SYSTEM<br />OVERRIDE</div>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'var(--red)',
          textShadow: '0 0 10px rgba(255,42,26,0.9)',
          marginTop: 4,
          textTransform: 'uppercase',
        }}>ROUTE RECLAIMED</div>
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderTop: '1.5px solid var(--red)', borderLeft: '1.5px solid var(--red)' }} />
        <div style={{ position: 'absolute', bottom: 6, right: 6, width: 12, height: 12, borderBottom: '1.5px solid var(--red)', borderRight: '1.5px solid var(--red)' }} />
      </div>

      {/* Gatekeeper panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <GatekeeperPanel denied={true} />
        <GatekeeperPanel denied={true} />
      </div>

      {/* Audio reactivity meters */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,0,0,0.75), rgba(0,0,0,0.6))',
        border: '1px solid rgba(255,42,26,0.4)',
        padding: '10px 12px',
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.16em',
          color: 'var(--red)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>FREQUENCY BANDS</div>
        {[
          { label: 'SUB', key: 'r1', hz: '20–80', color: 'var(--red)', val: levels.r1 },
          { label: 'BASS', key: 'r2', hz: '80–250', color: '#ff6644', val: levels.r2 },
          { label: 'MIDS', key: 'r3', hz: '250–2k', color: '#cc44ff', val: levels.r3 },
          { label: 'HIGH', key: 'r4', hz: '2k–8k', color: 'var(--cyan)', val: levels.r4 },
          { label: 'AIR', key: 'r5', hz: '8k–20k', color: 'var(--green)', val: levels.r5 },
        ].map(band => (
          <div key={band.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 9,
              color: band.color,
              width: 30,
              flexShrink: 0,
            }}>{band.label}</span>
            <div style={{
              flex: 1,
              height: 6,
              background: 'rgba(255,255,255,0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: `${band.val * 100}%`,
                background: band.color,
                boxShadow: `0 0 8px ${band.color}`,
                transition: 'width 0.05s linear',
              }} />
            </div>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: 'rgba(255,255,255,0.35)', width: 28, flexShrink: 0 }}>{band.hz}</span>
          </div>
        ))}
      </div>

      {/* Route Blocked */}
      <div style={{
        background: 'rgba(20,0,0,0.8)',
        border: '1px solid rgba(255,42,26,0.7)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: `0 0 ${12 + r1 * 20}px rgba(255,0,0,0.2)`,
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: '2px solid var(--red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 10px rgba(255,42,26,0.6)',
        }}>
          <span style={{ fontSize: 20, color: 'var(--red)', fontWeight: 700, lineHeight: 1 }}>✕</span>
        </div>
        <div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--red)',
            textShadow: '0 0 8px rgba(255,42,26,0.8)',
            letterSpacing: '0.08em',
          }}>ROUTE BLOCKED</div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 2,
          }}>FIREWALL ACTIVE</div>
        </div>
      </div>

      {/* Reactivity ring indicator */}
      <div style={{
        background: 'rgba(10,0,0,0.7)',
        border: '1px solid rgba(255,42,26,0.35)',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '2px solid rgba(255,42,26,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `inset 0 0 ${8 + overall * 28}px rgba(255,0,0,0.5), 0 0 ${8 + overall * 22}px rgba(255,0,0,0.25)`,
        }}>
          <span style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 13,
            fontWeight: 900,
            color: 'var(--red)',
          }}>{Math.round(overall * 100)}%</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'var(--red)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>REACTIVITY</div>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: 'white',
          }}>{Math.max(60, Math.round(90 + levels.r1 * 80))} BPM</div>
        </div>
      </div>
    </aside>
  )
}
