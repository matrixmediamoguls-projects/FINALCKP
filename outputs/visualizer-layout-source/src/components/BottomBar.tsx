import type { Levels } from '../App'
import sunImg from '../imports/Audio-Reactive_Healthy_Frequency_Sun.png'

type Props = {
  levels: Levels
  isPlaying: boolean
  onPlayToggle: () => void
  activeLyric: number
  progress: number
}

const LYRICS = [
  "I'M BREAKING THE CODE, I'M REWRITING THE SYSTEM",
  "THE KEYS IN MY HANDS, I'M TAKING BACK WHAT'S MINE",
  "NO FIREWALL CAN HOLD ME, NO GATE CAN KEEP ME OUT",
  "I'M THE GLITCH IN THEIR PLAN, WATCH THE WHOLE THING SHUT DOWN",
]

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function IconShuffle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" /><polyline points="4 20 21 3" />
      <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  )
}
function IconPrev() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  )
}
function IconNext() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="4" x2="19" y2="20" />
    </svg>
  )
}
function IconRepeat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  )
}

export default function BottomBar({ levels, isPlaying, onPlayToggle, activeLyric, progress }: Props) {
  const { overall, r1 } = levels
  const totalSecs = 213 // 3:33
  const currentSecs = Math.round(totalSecs * (progress / 100))

  return (
    <footer style={{
      flexShrink: 0,
      borderTop: '1px solid rgba(255,42,26,0.35)',
      background: 'linear-gradient(to top, rgba(10,0,0,0.95), rgba(5,0,0,0.85))',
    }}>
      {/* Main bottom section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 260px',
        gap: 0,
        height: 120,
      }}>
        {/* Now Playing */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderRight: '1px solid rgba(255,42,26,0.2)',
        }}>
          <div style={{
            width: 64,
            height: 64,
            flexShrink: 0,
            border: '1px solid rgba(255,42,26,0.6)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: `0 0 ${8 + r1 * 16}px rgba(255,42,26,0.4)`,
          }}>
            <img src={sunImg} alt="Album art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: 4 }}>NOW PLAYING</div>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 14,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>THE OVERRIDE</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: 'var(--red)', marginTop: 2 }}>RECLAMATION</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>ACT THREE</div>
          </div>
        </div>

        {/* Lyrics Center */}
        <div style={{
          padding: '8px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 4,
          borderRight: '1px solid rgba(255,42,26,0.2)',
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            marginBottom: 2,
          }}>— LYRICAL BANK —</div>
          {LYRICS.map((line, i) => (
            <div key={i} style={{
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontSize: i === activeLyric ? 15 : 12,
              fontWeight: i === activeLyric ? 700 : 400,
              color: i === activeLyric ? 'white' : 'rgba(255,255,255,0.28)',
              textTransform: 'uppercase',
              letterSpacing: i === activeLyric ? '0.08em' : '0.04em',
              textShadow: i === activeLyric ? '0 0 14px rgba(255,255,255,0.5)' : 'none',
              transition: 'all 0.4s ease',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {i === activeLyric && (
                <span style={{ color: 'var(--red)', marginRight: 6, textShadow: '0 0 8px var(--red)' }}>▶</span>
              )}
              {line}
            </div>
          ))}
        </div>

        {/* Audio Reactivity bars */}
        <div style={{
          padding: '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: '0.16em', color: 'var(--red)', textTransform: 'uppercase' }}>AUDIO REACTIVITY</span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'var(--cyan)' }}>{Math.round(overall * 100)}%</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            {Array.from({ length: 36 }, (_, i) => {
              const vals = [levels.r1, levels.r2, levels.r3, levels.r4, levels.r5]
              const v = vals[i % vals.length] * (0.4 + ((i * 11) % 19) / 22)
              const isRed = i > 28 && v > 0.7
              return (
                <div key={i} style={{
                  flex: 1,
                  minWidth: 3,
                  height: Math.max(4, v * 72),
                  background: isRed ? 'var(--red)' : 'var(--red)',
                  boxShadow: `0 0 4px rgba(255,42,26,0.7)`,
                  opacity: 0.6 + v * 0.4,
                }} />
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>
            <span>20</span><span>80</span><span>250</span><span>2k</span><span>8k</span><span>20k</span>
          </div>
        </div>
      </div>

      {/* Transport controls row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 260px',
        borderTop: '1px solid rgba(255,42,26,0.2)',
        height: 52,
      }}>
        {/* Volume */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          borderRight: '1px solid rgba(255,42,26,0.2)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
          </svg>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '87%', background: 'var(--red)', boxShadow: '0 0 6px var(--red)' }} />
            <div style={{ position: 'absolute', left: '87%', top: '50%', transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: 'white', boxShadow: '0 0 6px var(--red)' }} />
          </div>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>87%</span>
        </div>

        {/* Playback controls + progress */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '0 20px',
          borderRight: '1px solid rgba(255,42,26,0.2)',
        }}>
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {[
              { Icon: IconShuffle },
              { Icon: IconPrev },
            ].map(({ Icon }, i) => (
              <button key={i} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                <Icon />
              </button>
            ))}

            {/* Play/Pause */}
            <button
              onClick={onPlayToggle}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isPlaying ? 'rgba(255,42,26,0.15)' : 'var(--red)',
                border: '2px solid var(--red)',
                color: isPlaying ? 'var(--red)' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 ${10 + overall * 20}px rgba(255,42,26,0.6)`,
                flexShrink: 0,
                transition: 'box-shadow 0.05s',
              }}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {[
              { Icon: IconNext },
              { Icon: IconRepeat },
            ].map(({ Icon }, i) => (
              <button key={i} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                <Icon />
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{formatTime(currentSecs)}</span>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.12)', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: 'var(--red)', boxShadow: '0 0 6px var(--red)', transition: 'width 0.3s linear' }} />
              <div style={{ position: 'absolute', left: `${progress}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: 'white', boxShadow: '0 0 6px var(--red)', transition: 'left 0.3s linear' }} />
            </div>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{formatTime(totalSecs)}</span>
          </div>
        </div>

        {/* Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isPlaying ? '#22ff88' : 'var(--red)',
            boxShadow: isPlaying ? '0 0 8px #22ff88' : '0 0 8px var(--red)',
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>CORE STATUS</div>
            <div style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: isPlaying ? '#22ff88' : 'var(--red)',
              textShadow: isPlaying ? '0 0 8px #22ff88' : '0 0 8px var(--red)',
              letterSpacing: '0.06em',
            }}>{isPlaying ? 'ACTIVE' : 'STANDBY'}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
