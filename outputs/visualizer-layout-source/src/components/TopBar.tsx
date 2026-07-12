import type { Levels } from '../App'

type Props = { levels: Levels; isPlaying: boolean }

function MiniWave({ level, color = 'var(--red)' }: { level: number; color?: string }) {
  const bars = Array.from({ length: 28 }, (_, i) =>
    Math.abs(Math.sin(i * 1.9 + Date.now() * 0.001)) * 0.3 + level * (0.3 + (i % 4) * 0.06)
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24 }}>
      {bars.map((v, i) => (
        <div key={i} style={{
          width: 2,
          height: Math.max(4, v * 24),
          background: color,
          boxShadow: `0 0 6px ${color}`,
          borderRadius: 1,
        }} />
      ))}
    </div>
  )
}

export default function TopBar({ levels, isPlaying }: Props) {
  const { overall } = levels

  return (
    <header style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '6px 14px',
      borderBottom: '1px solid rgba(255,42,26,0.3)',
      background: 'linear-gradient(to right, rgba(40,0,0,0.5), rgba(10,0,0,0.7), rgba(40,0,0,0.5))',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      flexShrink: 0,
    }}>
      {/* Left status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: isPlaying ? '#22ff88' : 'var(--red)',
              boxShadow: isPlaying ? '0 0 6px #22ff88' : '0 0 6px var(--red)',
              display: 'inline-block',
            }} />
            SYSTEMS ACTIVE
          </span>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>AUDIO LINK: <span style={{ color: isPlaying ? '#22ff88' : 'var(--cyan)' }}>ESTABLISHED</span></span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>
          VISUALIZER: <span style={{ color: 'var(--red)' }}>ONLINE</span>
          <span style={{ marginLeft: 12 }}>CORE TEMP: <span style={{ color: 'var(--cyan)' }}>{Math.round(68 + overall * 24)}°</span></span>
        </div>
      </div>

      {/* Center badge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '4px 24px',
        border: '1px solid rgba(255,42,26,0.4)',
        background: 'rgba(20,0,0,0.5)',
      }}>
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--red)',
          textShadow: '0 0 10px rgba(255,42,26,0.8)',
          letterSpacing: '0.2em',
        }}>MUSIQ MATRIX</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>4K 144Hz · 24BIT · FFT-2048</span>
      </div>

      {/* Right - Reclamation Network */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--cyan)', textShadow: '0 0 6px var(--cyan)' }}>RECLAMATION NETWORK</span>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--cyan)',
            boxShadow: '0 0 6px var(--cyan)',
            display: 'inline-block',
          }} />
        </div>
        <MiniWave level={overall} color="var(--cyan)" />
      </div>
    </header>
  )
}
