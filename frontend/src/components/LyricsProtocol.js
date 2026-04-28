const WAVEFORM_WIDTHS = [20, 30, 20, 40, 50, 40, 60, 50, 70, 80, 70, 90, 80, 60, 50, 40, 60, 50, 40, 30, 20];

const CLIP = 'polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)';

const RED = 'var(--r3)';
const RED_GLOW = 'rgba(208,48,16,';

export default function LyricsProtocol() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--void)', padding: '2rem',
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      {/* Outer border shell */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: '64rem',
        background: RED, padding: 1,
        boxShadow: `0 0 20px ${RED_GLOW}0.1)`, clipPath: CLIP,
      }}>
        {/* Inner card */}
        <div style={{ position: 'relative', background: 'var(--void)', clipPath: CLIP }}>

          {/* Ambient glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, ${RED_GLOW}0.05) 0%, transparent 70%)`,
          }} />

          {/* Corner accent lines */}
          {[
            { top: 0, left: '2rem', width: '4rem', height: 2 },
            { top: 0, right: '2rem', width: '4rem', height: 2 },
            { bottom: 0, left: '2rem', width: '4rem', height: 2 },
            { bottom: 0, right: '2rem', width: '4rem', height: 2 },
            { top: '2rem', left: 0, width: 2, height: '4rem' },
            { bottom: '2rem', left: 0, width: 2, height: '4rem' },
            { top: '2rem', right: 0, width: 2, height: '4rem' },
            { bottom: '2rem', right: 0, width: 2, height: '4rem' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', background: RED, ...s }} />
          ))}

          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '2rem 3rem 1rem', position: 'relative',
          }}>
            <div style={{ width: '8rem' }} />

            <div style={{
              display: 'flex', alignItems: 'center', gap: '1.5rem',
              color: RED, fontSize: 12, letterSpacing: '0.4em', fontWeight: 600,
            }}>
              <div style={{ display: 'flex', gap: 4, opacity: 0.7 }}>
                <div style={{ width: 16, height: 2, background: RED }} />
                <div style={{ width: 4, height: 2, background: RED }} />
                <div style={{ width: 4, height: 2, background: RED }} />
              </div>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase' }}>
                LYRICS PROTOCOL
              </span>
              <div style={{ display: 'flex', gap: 4, opacity: 0.7 }}>
                <div style={{ width: 4, height: 2, background: RED }} />
                <div style={{ width: 4, height: 2, background: RED }} />
                <div style={{ width: 16, height: 2, background: RED }} />
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: RED,
                boxShadow: `0 0 8px ${RED_GLOW}1)`,
              }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase' }}>
                DECRYPTION ACTIVE
              </span>
            </div>
          </div>

          {/* Separator */}
          <div style={{
            margin: '0 3rem', height: 1,
            background: `${RED_GLOW}0.2)`, position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: -2,
              width: 4, height: 4, borderRadius: '50%', background: `${RED_GLOW}0.5)`,
            }} />
            <div style={{
              position: 'absolute', right: 0, top: -2,
              width: 4, height: 4, borderRadius: '50%', background: `${RED_GLOW}0.5)`,
            }} />
          </div>

          {/* Main content */}
          <div style={{
            display: 'flex', padding: '3rem', gap: '3rem', alignItems: 'center',
          }}>

            {/* Waveform bars */}
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              gap: 3, width: 32, flexShrink: 0, height: 160,
            }}>
              {WAVEFORM_WIDTHS.map((w, i) => (
                <div key={i} style={{
                  height: 2, background: RED,
                  boxShadow: `0 0 4px ${RED_GLOW}0.8)`, width: `${w}%`,
                }} />
              ))}
            </div>

            {/* Lyrics */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', gap: '1.75rem',
            }}>
              {/* Active line */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute', left: -32, color: RED,
                  fontSize: 20, fontWeight: 700,
                  filter: `drop-shadow(0 0 10px ${RED_GLOW}0.5))`,
                }}>{'>'}</span>
                <p style={{
                  color: 'var(--white)', fontSize: 22, letterSpacing: '0.15em',
                  fontWeight: 500, textTransform: 'uppercase',
                  filter: 'drop-shadow(0 0 8px rgba(232,228,216,0.4))',
                }}>
                  I'M BREAKING THE{' '}
                  <span style={{
                    color: RED, fontWeight: 700,
                    filter: `drop-shadow(0 0 8px ${RED_GLOW}0.6))`,
                  }}>CODE</span>
                  , I'M REWRITING THE SYSTEM
                </p>
              </div>

              {/* Upcoming lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginLeft: 8 }}>
                <p style={{
                  color: 'var(--muted)', fontSize: 16, letterSpacing: '0.15em',
                  textTransform: 'uppercase', opacity: 0.7,
                }}>
                  THE KEYS IN MY HANDS, I'M TAKING BACK WHAT'S MINE
                </p>
                <p style={{
                  color: 'var(--muted)', fontSize: 16, letterSpacing: '0.15em',
                  textTransform: 'uppercase', opacity: 0.6,
                }}>
                  NO FIREWALL CAN HOLD ME, NO{' '}
                  <span style={{ color: `${RED_GLOW}0.7)` }}>GATE</span>
                  {' '}CAN KEEP ME OUT
                </p>
                <p style={{
                  color: 'var(--muted)', fontSize: 16, letterSpacing: '0.15em',
                  textTransform: 'uppercase', opacity: 0.4,
                }}>
                  I'M THE GLITCH IN THEIR PLAN, WATCH THE WHOLE THING
                </p>
              </div>
            </div>

            {/* Dot navigation */}
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              gap: 16, width: 16, flexShrink: 0, alignItems: 'center', height: 160,
            }}>
              <div style={{
                width: 4, height: 4, borderRadius: '50%', background: RED,
                boxShadow: `0 0 6px ${RED_GLOW}1)`,
              }} />
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'rgba(136,136,136,0.4)',
                }} />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ padding: '0 3rem 2.5rem' }}>
            <div style={{
              position: 'relative', height: 4, background: 'rgba(136,136,136,0.1)',
              width: '100%', marginBottom: 16, display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                background: RED, width: '35%',
                boxShadow: `0 0 8px ${RED_GLOW}0.8)`,
              }} />
              <div style={{
                position: 'absolute', left: '35%', width: 12, height: 12,
                borderRadius: '50%', background: RED, marginLeft: -6,
                boxShadow: `0 0 10px ${RED_GLOW}1)`,
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10, letterSpacing: '0.2em',
              color: `${RED_GLOW}0.8)`,
              fontFamily: "'Share Tech Mono', monospace",
            }}>
              <span>01:24</span>
              <span>03:47</span>
            </div>
          </div>

          {/* Bottom center decoration */}
          <div style={{
            position: 'absolute', bottom: 16, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 6,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 3, background: RED }} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
