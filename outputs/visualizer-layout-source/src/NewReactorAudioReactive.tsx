import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { CSSProperties } from 'react'

const CENTER_X = 470.25
const CENTER_Y = 405
const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

function meanBandEnergy(data: Uint8Array<ArrayBuffer>, analyser: AnalyserNode, minHz: number, maxHz: number) {
  const nyquist = analyser.context.sampleRate / 2
  const minBin = Math.max(0, Math.floor((minHz / nyquist) * data.length))
  const maxBin = Math.min(data.length - 1, Math.ceil((maxHz / nyquist) * data.length))
  let sum = 0
  for (let index = minBin; index <= maxBin; index += 1) sum += data[index]
  return clamp01(sum / Math.max(1, maxBin - minBin + 1) / 255)
}

function polar(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return { x: CENTER_X + radius * Math.cos(radians), y: CENTER_Y + radius * Math.sin(radians) }
}

function arcPath(radius: number, start: number, end: number) {
  const from = polar(radius, end)
  const to = polar(radius, start)
  return `M ${from.x} ${from.y} A ${radius} ${radius} 0 0 0 ${to.x} ${to.y}`
}

function segments(count: number, gap: number) {
  const step = 360 / count
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    path: arcPath(1, index * step + gap, (index + 1) * step - gap),
    start: index * step + gap,
    end: (index + 1) * step - gap,
  }))
}

const INNER = segments(36, 2.2)
const MID = segments(60, 1.2)
const OUTER = segments(84, .9)
const SPECTRUM_BARS = Array.from({ length: 156 }, (_, index) => {
  const angle = (360 / 156) * index
  const wave = (Math.sin(index * 1.9) + 1) / 2
  const stagger = (Math.sin(index * .47) + 1) / 2
  return {
    id: index,
    angle,
    inner: 116 + stagger * 10,
    outer: 220 + wave * 52 + (index % 12 === 0 ? 18 : 0),
    major: index % 6 === 0,
    phase: index % 13,
    gain: .74 + wave * .72,
  }
})
const TICKS = Array.from({ length: 120 }, (_, index) => {
  const angle = (360 / 120) * index
  return { id: index, angle, major: index % 10 === 0 }
})

export type ReactorController = {
  update: (data: Uint8Array<ArrayBuffer>, analyser: AnalyserNode, playback?: ReactorPlaybackState) => void
  updateFallback: (playback: ReactorPlaybackState) => void
}

type Props = {
  imageSrc?: string
  className?: string
}

type ReactorPlaybackState = {
  active: boolean
  currentTime: number
}

const SYNTHETIC_IDLE = [0, 0, 0, 0, 0]

function fallbackBands({ active, currentTime }: ReactorPlaybackState) {
  if (!active) return SYNTHETIC_IDLE

  const beat = currentTime * 2.2
  const phrase = currentTime * .31
  const pulse = (Math.sin(beat * Math.PI * 2) + 1) / 2
  const secondary = (Math.sin((beat * .52 + .18) * Math.PI * 2) + 1) / 2
  const shimmer = (Math.sin((currentTime * 8.4 + .31) * Math.PI * 2) + 1) / 2
  const breath = (Math.sin(phrase * Math.PI * 2) + 1) / 2

  return [
    .24 + pulse * .55,
    .18 + secondary * .42,
    .12 + breath * .3,
    .1 + shimmer * .36,
    .09 + (1 - pulse) * .24,
  ]
}

const NewReactorAudioReactive = forwardRef<ReactorController, Props>(function NewReactorAudioReactive(
  { imageSrc = '/assets/new-reactor.svg', className = '' },
  ref,
) {
  const stageRef = useRef<HTMLDivElement>(null)
  const smoothRef = useRef([0, 0, 0, 0, 0])
  const playbackRef = useRef<ReactorPlaybackState>({ active: false, currentTime: 0 })

  const applyBands = (bands: number[], smoothing = [.22, .18, .14, .2, .25]) => {
    const next = bands.map((value, index) => smoothRef.current[index] + (value - smoothRef.current[index]) * smoothing[index])
    smoothRef.current = next
    const overall = (next[0] * 1.35 + next[1] + next[2] + next[3] + next[4] * .75) / 5.1
    const stage = stageRef.current

    if (stage) {
      stage.style.setProperty('--r1', String(next[0]))
      stage.style.setProperty('--r2', String(next[1]))
      stage.style.setProperty('--r3', String(next[2]))
      stage.style.setProperty('--r4', String(next[3]))
      stage.style.setProperty('--r5', String(next[4]))
      stage.style.setProperty('--overall', String(overall))
    }
  }

  useImperativeHandle(ref, () => ({
    update(data, analyser, playback) {
      if (playback) playbackRef.current = playback

      const raw = [
        meanBandEnergy(data, analyser, 20, 80),
        meanBandEnergy(data, analyser, 80, 250),
        meanBandEnergy(data, analyser, 250, 2000),
        meanBandEnergy(data, analyser, 2000, 8000),
        meanBandEnergy(data, analyser, 8000, 20000),
      ]
      const isFlatlined = raw.every((value) => value < .006)
      applyBands(isFlatlined ? fallbackBands(playbackRef.current) : raw)
    },
    updateFallback(playback) {
      playbackRef.current = playback
      applyBands(fallbackBands(playback), [.2, .17, .13, .2, .22])
    },
  }), [])

  return (
    <div ref={stageRef} className={`new-reactor-stage ${className}`} aria-label="Five-band audio-reactive Reclamation reactor">
      <div className="artifact-halo" aria-hidden="true" />
      <img src={imageSrc} alt="Musiq Matrix Reclamation reactor" className="new-reactor-art" />
      <svg className="new-reactor-overlay" viewBox="0 0 940.5 940.5" aria-hidden="true">
        <defs>
          <filter id="reactorGlow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="4.8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="reactorCore"><stop offset="0" stopColor="#fff3d5" /><stop offset=".34" stopColor="#a42d27" /><stop offset="1" stopColor="#4d0505" stopOpacity="0" /></radialGradient>
          <clipPath id="reactorFaceClip">
            <circle cx={CENTER_X} cy={CENTER_Y} r="306" />
          </clipPath>
        </defs>
        <g clipPath="url(#reactorFaceClip)">
          <g className="reactor-zone reactor-zone-core">
            <circle cx={CENTER_X} cy={CENTER_Y} r="38" className="reactor-core-flash" />
            <circle cx={CENTER_X} cy={CENTER_Y} r="64" className="reactor-core-orb" />
            <circle cx={CENTER_X} cy={CENTER_Y} r="98" className="reactor-pressure-ring" />
          </g>
          <g className="reactor-zone reactor-spectrum-bars">
            {SPECTRUM_BARS.map((bar) => {
              const from = polar(bar.inner, bar.angle)
              const to = polar(bar.outer, bar.angle)
              return (
                <line
                  key={bar.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={bar.major ? 'major' : undefined}
                  style={{
                    '--bar-phase': bar.phase,
                    '--bar-gain': bar.gain,
                  } as CSSProperties}
                />
              )
            })}
          </g>
          <g className="reactor-zone reactor-zone-inner">
            {INNER.map((segment) => <path key={segment.id} d={arcPath(147, segment.start, segment.end)} />)}
          </g>
          <g className="reactor-zone reactor-zone-mid">
            {MID.map((segment) => <path key={segment.id} d={arcPath(214, segment.start, segment.end)} />)}
          </g>
          <g className="reactor-zone reactor-zone-outer">
            {OUTER.map((segment) => <path key={segment.id} d={arcPath(286, segment.start, segment.end)} />)}
          </g>
          <g className="reactor-zone reactor-zone-perimeter">
            {TICKS.map((tick) => {
              const from = polar(294, tick.angle)
              const to = polar(tick.major ? 318 : 308, tick.angle)
              return <line key={tick.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={tick.major ? 'major' : undefined} />
            })}
          </g>
        </g>
      </svg>
    </div>
  )
})

export default NewReactorAudioReactive
