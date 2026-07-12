import { useMemo } from 'react'
import type { Levels } from '../App'
import sunImg from '../imports/Audio-Reactive_Healthy_Frequency_Sun.png'

type Props = { levels: Levels; isPlaying: boolean }

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end)
  const e = polar(cx, cy, r, start)
  const large = end - start <= 180 ? 0 : 1
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`
}

function buildSegs(count: number, gap = 1.2) {
  return Array.from({ length: count }, (_, i) => {
    const step = 360 / count
    return { id: i, start: i * step + gap, end: (i + 1) * step - gap }
  })
}

function buildTicks(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i, angle: (360 / count) * i, major: i % 8 === 0,
  }))
}

export default function ReactorCenter({ levels, isPlaying }: Props) {
  const { r1, r2, r3, r4, r5 } = levels

  const innerSegs = useMemo(() => buildSegs(56), [])
  const midSegs = useMemo(() => buildSegs(44), [])
  const outerSegs = useMemo(() => buildSegs(36), [])
  const ticks = useMemo(() => buildTicks(180), [])

  const cx = 400
  const cy = 400

  const coreR = clamp(82 + r1 * 22, 82, 106)
  const innerR = clamp(162 + r2 * 10, 162, 174)
  const midR = clamp(222 + r3 * 9, 222, 233)
  const outerR = clamp(282 + r4 * 9, 282, 293)
  const perimR = 320

  const intensity = Math.round(levels.overall * 100)
  const glowSize = 6 + r1 * 14

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 0 }}>
      {/* Title bar above reactor */}
      <div style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: 11,
        letterSpacing: '0.22em',
        color: 'var(--red)',
        textTransform: 'uppercase',
        marginBottom: 6,
        textShadow: '0 0 8px rgba(255,42,26,0.8)',
        display: 'flex',
        gap: 24,
        alignItems: 'center',
      }}>
        <span style={{ color: 'var(--cyan)', textShadow: '0 0 8px rgba(0,200,255,0.8)' }}>4K 144Hz</span>
        <span>REACTOR CORE</span>
        <span style={{ color: 'var(--cyan)', textShadow: '0 0 8px rgba(0,200,255,0.8)' }}>24BIT</span>
      </div>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxHeight: '100%', maxWidth: 560 }}>
        <svg
          viewBox="0 0 800 800"
          style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={glowSize} result="blur" />
              <feColorMatrix in="blur" type="matrix"
                values="1 0 0 0 1  0 0.12 0 0 0  0 0 0.05 0 0  0 0 0 0.85 0" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" type="matrix"
                values="0 0 0 0 0  0 0.6 0 0 0.7  0 0 1 0 1  0 0 0 0.8 0" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" type="matrix"
                values="0 0 0 0 0.1  0 1 0 0 0.5  0 0 0 0 0.3  0 0 0 0.8 0" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="30%" stopColor="rgba(255,40,20,0.8)" />
              <stop offset="100%" stopColor="rgba(40,0,0,0.05)" />
            </radialGradient>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(80,0,0,0.35)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <clipPath id="circleClip">
              <circle cx={cx} cy={cy} r={coreR - 2} />
            </clipPath>
            <path id="topArc" d={arcPath(cx, cy, 340, -58, 58)} fill="none" />
            <path id="bottomArc" d={arcPath(cx, cy, 340, 122, 238)} fill="none" />
          </defs>

          {/* Background radial pulse */}
          <circle cx={cx} cy={cy} r={380} fill="url(#bgGrad)" opacity={0.4 + r1 * 0.3} />

          {/* Axis cross */}
          <line x1={cx} y1={28} x2={cx} y2={772} stroke="rgba(255,42,26,0.18)" strokeWidth="1" />
          <line x1={28} y1={cy} x2={772} y2={cy} stroke="rgba(255,42,26,0.18)" strokeWidth="1" />
          <line x1={82} y1={82} x2={718} y2={718} stroke="rgba(255,42,26,0.08)" strokeWidth="1" />
          <line x1={718} y1={82} x2={82} y2={718} stroke="rgba(255,42,26,0.08)" strokeWidth="1" />

          {/* Outer perimeter ticks - R5 Air */}
          {ticks.map(tick => {
            const p1 = polar(cx, cy, perimR + 4, tick.angle)
            const p2 = polar(cx, cy, perimR + 4 + r5 * (tick.major ? 28 : 16) + (tick.major ? 10 : 4), tick.angle)
            return (
              <line key={tick.id}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={tick.major ? 'rgba(130,255,0,0.85)' : 'rgba(80,200,0,0.55)'}
                strokeWidth={tick.major ? 2.5 : 1.2}
                filter="url(#greenGlow)"
              />
            )
          })}

          {/* Outer ring - R4 Presence */}
          {outerSegs.map(seg => (
            <path key={`o-${seg.id}`}
              d={arcPath(cx, cy, outerR, seg.start, seg.end)}
              fill="none"
              stroke={`rgba(0,192,255,${0.4 + r4 * 0.5})`}
              strokeWidth={20 + r4 * 14}
              filter="url(#cyanGlow)"
              strokeLinecap="round"
            />
          ))}

          {/* Mid ring - R3 Vocals */}
          {midSegs.map(seg => (
            <path key={`m-${seg.id}`}
              d={arcPath(cx, cy, midR, seg.start, seg.end)}
              fill="none"
              stroke={`rgba(180,40,255,${0.45 + r3 * 0.5})`}
              strokeWidth={22 + r3 * 12}
              filter="url(#redGlow)"
              strokeLinecap="round"
            />
          ))}

          {/* Inner ring - R2 Bass */}
          {innerSegs.map(seg => (
            <path key={`i-${seg.id}`}
              d={arcPath(cx, cy, innerR, seg.start, seg.end)}
              fill="none"
              stroke={`rgba(255,22,10,${0.7 + r2 * 0.3})`}
              strokeWidth={18 + r2 * 14}
              filter="url(#redGlow)"
              strokeLinecap="round"
            />
          ))}

          {/* Static reference rings */}
          <circle cx={cx} cy={cy} r={140} fill="none" stroke="rgba(255,38,24,0.22)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={perimR} fill="none" stroke="rgba(255,38,24,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Compass impact points */}
          {[0, 90, 180, 270].map(angle => {
            const p = polar(cx, cy, 345 + r1 * 16, angle)
            return (
              <circle key={angle} cx={p.x} cy={p.y}
                r={8 + r1 * 10}
                fill="var(--red)"
                filter="url(#redGlow)"
                opacity={0.85 + r1 * 0.15}
              />
            )
          })}

          {/* Arc text rings */}
          <text fontSize="18" fill="rgba(255,255,255,0.9)" fontFamily="'Orbitron',monospace" letterSpacing="6" textAnchor="middle" fontWeight="700">
            <textPath href="#topArc" startOffset="50%">✦ RECLAMATION ✦</textPath>
          </text>
          <text fontSize="16" fill="rgba(255,42,26,0.8)" fontFamily="'Orbitron',monospace" letterSpacing="5" textAnchor="middle">
            <textPath href="#bottomArc" startOffset="50%">✦ ACT THREE ✦</textPath>
          </text>

          {/* Center sun image */}
          <circle cx={cx} cy={cy} r={coreR + 2} fill="rgba(0,0,0,0.6)" />
          <image
            href={sunImg}
            x={cx - coreR}
            y={cy - coreR}
            width={coreR * 2}
            height={coreR * 2}
            clipPath="url(#circleClip)"
            style={{ filter: `brightness(${0.85 + r1 * 0.5})` }}
          />

          {/* Core glow overlay */}
          <circle cx={cx} cy={cy} r={coreR}
            fill="url(#coreGrad)"
            opacity={0.08 + r1 * 0.12}
            filter="url(#redGlow)"
          />

          {/* Badge banner: CHROMA KEY PROTOCOL */}
          <rect x={cx - 148} y={cy - 24} width={296} height={48}
            fill="rgba(180,0,0,0.88)"
            stroke="rgba(255,60,40,0.9)"
            strokeWidth="2"
          />
          <rect x={cx - 150} y={cy - 26} width={300} height={52}
            fill="none"
            stroke="rgba(255,120,80,0.4)"
            strokeWidth="1"
          />
          {/* Banner rivets */}
          {[-138, 138].map(dx => (
            <circle key={dx} cx={cx + dx} cy={cy} r="5" fill="none" stroke="rgba(255,100,60,0.8)" strokeWidth="1.5" />
          ))}
          <text x={cx} y={cy + 7}
            textAnchor="middle"
            fontFamily="'Orbitron',monospace"
            fontSize="16"
            fontWeight="900"
            letterSpacing="4"
            fill="white"
            style={{ textShadow: '0 0 12px rgba(255,80,40,0.9)' }}
          >CHROMA KEY PROTOCOL</text>

          {/* Corner HUD marks */}
          {[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx, sy], i) => {
            const bx = cx + sx * 300
            const by = cy + sy * 300
            const lx = sx > 0 ? bx - 20 : bx + 20
            const ly = sy > 0 ? by - 20 : by + 20
            return (
              <g key={i} stroke="rgba(255,42,26,0.5)" strokeWidth="1.5" fill="none">
                <line x1={bx} y1={by} x2={lx} y2={by} />
                <line x1={bx} y1={by} x2={bx} y2={ly} />
              </g>
            )
          })}

        </svg>
      </div>

      {/* Status row under reactor */}
      <div style={{
        display: 'flex',
        gap: 20,
        marginTop: 6,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.15em',
        color: 'var(--red)',
      }}>
        <span>CORE: <b style={{ color: isPlaying ? '#22ff88' : 'var(--red)' }}>{isPlaying ? 'ACTIVE' : 'STANDBY'}</b></span>
        <span>INTENSITY: <b>{intensity}%</b></span>
        <span>FFT: <b style={{ color: 'var(--cyan)' }}>2048</b></span>
        <span>MODE: <b>PULSE</b></span>
      </div>
    </div>
  )
}
