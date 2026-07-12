import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  List,
  LockKeyhole,
  LogOut,
  Maximize2,
  Pause,
  Play,
  Settings,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
} from 'lucide-react'
import { useAudioEngine } from './audio/useAudioEngine'
import { useAudioFrame } from './audio/useAudioFrame'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import NewReactorAudioReactive from './NewReactorAudioReactive'
import type { ReactorController } from './NewReactorAudioReactive'
import ReactiveArchiveBackground from './ReactiveArchiveBackground'
import './cinematic.css'

type Asset = {
  id: string
  title: string
  r2_bucket: string
  r2_key: string
  mime_type: string | null
  public_url?: string | null
}

type Track = {
  id: string
  track_order: number | null
  title: string
  artist: string | null
  lyrics: string | null
  visualizer_preset: Record<string, unknown>
  audio_asset?: Asset | null
  cover_asset?: Asset | null
}

type CatalogRow = {
  id: string
  title: string
  artist: string | null
  queue_index: number | null
  r2_audio_key: string | null
  r2_cover_key: string | null
  preset?: { intensity?: number | string | null } | { intensity?: number | string | null }[] | null
  track_lyrics?: { line_order: number; line_text: string }[] | null
}

type AbbreviatedPlaylistRow = {
  id: number
  playlist_order: number
  display_title: string
  track:
    | CatalogRow
    | CatalogRow[]
    | null
}

type ShadowCode = {
  id?: number
  code_order?: number | null
  title: string
  copy: string
}

const PUBLIC_R2_BASE_URL = 'https://pub-5104aa5bcb1b461c923683e4eaea1c1b.r2.dev'

const r2Url = (key?: string | null) => {
  if (!key) return null
  if (/^https?:\/\//i.test(key)) return key
  return `${PUBLIC_R2_BASE_URL}/${key}`
}

const publicAssetUrl = (asset?: Asset | null) =>
  asset?.public_url || (asset?.r2_key ? `${PUBLIC_R2_BASE_URL}/${asset.r2_key}` : null)

const normalizeCatalogTrack = (row: CatalogRow): Track => {
  const preset = Array.isArray(row.preset) ? row.preset[0] : row.preset
  const lyrics = [...(row.track_lyrics ?? [])]
    .sort((a, b) => a.line_order - b.line_order)
    .map((line) => line.line_text)
    .join('\n')

  return {
    id: row.id,
    track_order: row.queue_index,
    title: row.title,
    artist: row.artist,
    lyrics: lyrics || null,
    visualizer_preset: { intensity: Number(preset?.intensity ?? 0.92) },
    audio_asset: row.r2_audio_key
      ? {
          id: `${row.id}-audio`,
          title: row.title,
          r2_bucket: 'chroma-key-media',
          r2_key: row.r2_audio_key,
          mime_type: 'audio/mpeg',
          public_url: r2Url(row.r2_audio_key),
        }
      : null,
    cover_asset: row.r2_cover_key
      ? {
          id: `${row.id}-cover`,
          title: `${row.title} cover`,
          r2_bucket: 'chroma-key-media',
          r2_key: row.r2_cover_key,
          mime_type: 'image/png',
          public_url: r2Url(row.r2_cover_key),
        }
      : fallbackCover,
  }
}

const normalizeAbbreviatedPlaylistTrack = (row: AbbreviatedPlaylistRow): Track => {
  const linkedTrack = Array.isArray(row.track) ? row.track[0] : row.track

  if (!linkedTrack) {
    return {
      id: `abbreviated-${row.id}`,
      track_order: row.playlist_order,
      title: row.display_title,
      artist: 'Musiq Matrix',
      lyrics: null,
      visualizer_preset: { intensity: 0.92 },
      cover_asset: fallbackCover,
      audio_asset: null,
    }
  }

  return {
    ...normalizeCatalogTrack(linkedTrack),
    track_order: row.playlist_order,
    title: row.display_title || linkedTrack.title,
  }
}

const fallbackCover: Asset = {
  id: 'reclamation-cover',
  title: 'Reclamation Cover',
  r2_bucket: 'chroma-key-media',
  r2_key: 'covers/reclamation-cover.png',
  mime_type: 'image/png',
  public_url: `${PUBLIC_R2_BASE_URL}/covers/reclamation-cover.png`,
}

const fallbackLyrics = `THIS WAS NOT ADDED.
THIS SURFACED.

THERE IS A DIFFERENCE.

YOU THOUGHT THIS WAS INTERFERENCE.
YOU THOUGHT THIS WAS PRESSURE.
YOU THOUGHT THIS WAS SOMEONE.
NO.

THIS IS WHAT OCCURS
WHEN THE ENEMY
SEARCHES FOR A BODY--
AND FINDS RESISTANCE.

PROCEED.

THE CODE DOES NOT LIE.
THE CODE DOES NOT SLEEP.

WHAT YOU CARRY
IS OLDER THAN THE SYSTEM.
OLDER THAN THE SIGNAL.

RECLAIM IT.`

const fallbackTracks: Track[] = [
  {
    id: '02',
    track_order: 2,
    title: 'Reclamation',
    artist: 'Musiq Matrix',
    lyrics: fallbackLyrics,
    visualizer_preset: { intensity: 0.92 },
    cover_asset: fallbackCover,
    audio_asset: {
      id: 'audio-02',
      title: 'Reclamation',
      r2_bucket: 'chroma-key-media',
      r2_key: 'audio/02_-_Musiq_Matrix_-_Reclamation_(The_Day_Musiq_Matrix_Came_Back).mp3',
      mime_type: 'audio/mpeg',
      public_url: `${PUBLIC_R2_BASE_URL}/audio/02_-_Musiq_Matrix_-_Reclamation_(The_Day_Musiq_Matrix_Came_Back).mp3`,
    },
  },
]

const shadowCodes: ShadowCode[] = [
  {
    title: 'LIE (DISTORTION)',
    copy: 'Truth warped into falsehood. Information designed to mislead, confuse, and invert reality.',
  },
  {
    title: 'DISCONNECTION (INTENT)',
    copy: 'Severs the bond between self, source, and others. Breeds isolation and purposelessness.',
  },
  {
    title: 'MANIPULATION (SPEECH)',
    copy: 'Words weaponized to control or redirect. Uses fear, flattery, or falsity to hijack perception.',
  },
  {
    title: 'SUBMISSION (ACTION)',
    copy: 'Compliance through fear, conditioning, or force. The surrender of will to external control.',
  },
  {
    title: 'FEAR (SUPPRESSION)',
    copy: 'The primary weapon of control. Paralyzes action and keeps the seeker bound to lower frequencies.',
  },
  {
    title: 'INVERSION (BELIEF)',
    copy: 'Sacred knowledge reversed and weaponized. The shadow reframes truth as dangerous.',
  },
]

const presentationQueue = [
  'Welcome To The Fire',
  'Reclamation (The Day Musiq Matrix Came Back)',
  'Know Your Names',
  'Hold On',
  'Demonic Schemes',
  'Second Edition',
  'Thought Form',
  'Remember The Price (When You Speak The Name)',
  'Blueprint Of The Divine',
  'Hostile Rewrite',
]

export default function CinematicVisualizer() {
  const audio = useAudioEngine()
  const reactorRef = useRef<ReactorController>(null)
  useAudioFrame({
    analyserRef: audio.analyserRef,
    frequencyDataRef: audio.frequencyDataRef,
    bandsRef: audio.bandsRef,
    updateAnalysisFrame: audio.updateAnalysisFrame,
    onFrame: (frequencyData, _bands, analyser) => reactorRef.current?.update(frequencyData, analyser, {
      active: audio.isPlaying,
      currentTime: audio.currentTime,
    }),
  })

  const [tracks, setTracks] = useState<Track[]>(fallbackTracks)
  const [shadowFeed, setShadowFeed] = useState<ShadowCode[]>(shadowCodes)
  const [selected, setSelected] = useState(0)
  const [status, setStatus] = useState('public r2')

  const track = tracks[selected] ?? tracks[0]
  const visibleLyrics = (track?.lyrics || fallbackLyrics).split('\n').filter(Boolean).slice(0, 4)
  const coverUrl = publicAssetUrl(track?.cover_asset) || '/assets/foolish-pride-cover.png'
  const queueItems = buildQueueItems(tracks, coverUrl)

  useEffect(() => {
    let frame = 0

    const tick = () => {
      if (!audio.analyserRef.current) {
        reactorRef.current?.updateFallback({
          active: audio.isPlaying,
          currentTime: audio.currentTime,
        })
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [audio.analyserRef, audio.currentTime, audio.isPlaying])

  useEffect(() => {
    let cancelled = false

    async function loadCatalog() {
      if (!supabase || !isSupabaseConfigured) {
        setStatus('public r2 fallback')
        return
      }

      try {
        const playlistResult = await supabase
          .from('abbreviated_playlist')
          .select(`
            id,
            playlist_order,
            display_title,
            track:tracks(
              id,
              title,
              artist,
              queue_index,
              r2_audio_key,
              r2_cover_key,
              preset:visual_presets(intensity),
              track_lyrics(line_order,line_text)
            )
          `)
          .eq('active', true)
          .order('playlist_order', { ascending: true })

        if (cancelled) return
        if (playlistResult.data?.length) {
          setTracks((playlistResult.data as AbbreviatedPlaylistRow[]).map(normalizeAbbreviatedPlaylistTrack))
        } else {
          const trackResult = await supabase
            .from('tracks')
            .select('id,title,artist,queue_index,r2_audio_key,r2_cover_key,preset:visual_presets(intensity),track_lyrics(line_order,line_text)')
            .order('queue_index', { ascending: true })

          if (cancelled) return
          if (trackResult.data?.length) {
            setTracks((trackResult.data as CatalogRow[]).map(normalizeCatalogTrack))
          }
        }

        const shadowResult = await supabase
          .from('shadow_codes')
          .select('id,code_order,title,copy')
          .eq('active', true)
          .order('code_order', { ascending: true })

        if (cancelled) return
        if (shadowResult.data?.length) {
          setShadowFeed(shadowResult.data as ShadowCode[])
        }

        setStatus('supabase catalog + public r2')
      } catch {
        if (!cancelled) setStatus('public r2 fallback')
      }
    }

    void loadCatalog()
    return () => {
      cancelled = true
    }
  }, [])

  async function play(index = selected) {
    const next = tracks[index]
    setSelected(index)
    const url = publicAssetUrl(next?.audio_asset)
    if (!url) return

    try {
      await audio.loadUrl(url, next.title, true, true)
    } catch {
      await audio.loadUrl(url, next.title, true, false)
      setStatus('public r2 playback / analyzer fallback')
    }
  }

  function step(direction: -1 | 1) {
    void play((selected + direction + tracks.length) % tracks.length)
  }

  return (
    <main className="reclamation-player" aria-label="Chroma Key Act Three Reclamation music visualizer">
      <ReactiveArchiveBackground bandsRef={audio.bandsRef} currentTime={audio.currentTime} isPlaying={audio.isPlaying} />

      <header className="museum-header">
        <div className="wordmark"><span>MM</span><strong>MUSIQ MATRIX</strong></div>
        <p>ACT III</p>
      </header>

      <section className="dashboard-shell">
        <aside className="dashboard-stack dashboard-stack-left" aria-label="Playback dashboard modules">
          <GlassCard className="now-playing-card" eyebrow="NOW PLAYING">
            <div className="now-playing-grid">
              <img src={coverUrl} alt="" />
              <div>
                <h2>{track?.title ?? 'Welcome To The Fire'}</h2>
                <p>{track?.artist ?? 'Musiq Matrix'}</p>
                <div className="mini-progress" style={{ '--progress': `${audio.duration ? (audio.currentTime / audio.duration) * 100 : 28}%` } as CSSProperties} />
                <div className="time-pair"><span>{format(audio.currentTime)}</span><span>{format(audio.duration || 261)}</span></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="audio-reactor-card" eyebrow="AUDIO REACTOR">
            <div className="reactor-meter" aria-hidden="true">
              {Array.from({ length: 42 }, (_, index) => {
                const bands = [audio.bandsRef.current.bass, audio.bandsRef.current.mid, audio.bandsRef.current.high, audio.bandsRef.current.level]
                const band = bands[index % bands.length] ?? 0
                const idle = 28 + Math.sin(index * 0.63 + audio.currentTime * 1.8) * 18 + (index % 7) * 3
                const height = Math.max(13, Math.min(92, idle + (audio.isPlaying ? band * 58 : 0)))
                return <span key={index} style={{ height: `${height}%`, animationDelay: `${index * -37}ms` }} />
              })}
            </div>
            <div className="band-readout">
              <span>BASS <i /></span>
              <span>MID <i /></span>
              <span>TREBLE <i /></span>
            </div>
          </GlassCard>

          <GlassCard className="album-status-card" eyebrow="ALBUM STATUS">
            <div className="status-grid">
              <div className="status-shield"><LockKeyhole /></div>
              <div>
                <p>ACCESS &amp; PROTOCOL</p>
                <h2>UNLOCKED</h2>
                <small>ALL SYSTEMS OPERATIONAL <i /></small>
              </div>
            </div>
          </GlassCard>
        </aside>

        <section className="player-stage" aria-label="Primary visualizer stage">
          <div className="stage-heading">
            <div>
              <p>CHROMA KEY / ACT THREE</p>
              <h1>RECLAMATION</h1>
            </div>
          </div>

          <NewReactorAudioReactive ref={reactorRef} />

          <div className="archive-plaque">
            <h2>RECLAMATION ARCHIVE</h2>
            <p>MMR-III</p>
          </div>
        </section>

        <aside className="dashboard-stack dashboard-stack-right" aria-label="Archive dashboard modules">
          <GlassCard className="university-card" eyebrow="RECLAMATION UNIVERSITY" icon="✣">
            <ModuleCopy label="PRIMARY LIGHT CODE" lines={['The Flame Remembers.', 'The Signal Returns.']} />
            <ModuleCopy
              label="PRIMARY SHADOW CODE"
              lines={[shadowFeed.slice(0, 3).map((code) => code.title.split(' ')[0]).join(', ') || 'Erasure, Distortion, Falsehood']}
            />
            <ActionButton>ENTER UNIVERSITY</ActionButton>
          </GlassCard>

          <GlassCard className="lyrics-protocol-card" eyebrow="LYRICS PROTOCOL">
            <div className="lyric-quote" aria-live="polite">
              {visibleLyrics.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
            <ActionButton>VIEW FULL LYRICS</ActionButton>
          </GlassCard>
        </aside>
      </section>

      <TracklistDock items={queueItems} selected={selected} onPlay={(index) => index >= 0 && void play(index)} />

      <PlayerControls
        status={status}
        isPlaying={audio.isPlaying}
        currentTime={audio.currentTime}
        duration={audio.duration}
        onPrevious={() => step(-1)}
        onNext={() => step(1)}
        onToggle={() => (audio.fileName ? void audio.toggle() : void play())}
        onSeek={(value) => audio.seek(value)}
      />

      <FooterNav />
    </main>
  )
}

function GlassCard({
  eyebrow,
  icon,
  className = '',
  children,
}: {
  eyebrow: string
  icon?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={`glass-card ${className}`}>
      <header className="card-header">
        <span>{icon ?? ''}</span>
        <h2>{eyebrow}</h2>
      </header>
      {children}
    </section>
  )
}

function ModuleCopy({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="module-copy">
      <h3>{label}</h3>
      {lines.map((line) => <p key={line}>{line}</p>)}
    </div>
  )
}

function ActionButton({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="action-button">
      <span>{children}</span>
      <ChevronRight />
    </button>
  )
}

function PlayerControls({
  status,
  isPlaying,
  currentTime,
  duration,
  onPrevious,
  onNext,
  onToggle,
  onSeek,
}: {
  status: string
  isPlaying: boolean
  currentTime: number
  duration: number
  onPrevious: () => void
  onNext: () => void
  onToggle: () => void
  onSeek: (value: number) => void
}) {
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  return (
    <section className="player-controls" aria-label="Audio playback controls">
      <div className="control-row">
        <button type="button" aria-label="Shuffle">
          <Shuffle />
        </button>
        <button type="button" onClick={onPrevious} aria-label="Previous track">
          <SkipBack />
        </button>
        <button type="button" className="play-button" onClick={onToggle} aria-label={isPlaying ? 'Pause track' : 'Play track'}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button type="button" onClick={onNext} aria-label="Next track">
          <SkipForward />
        </button>
        <button type="button" aria-label="Open track list">
          <List />
        </button>
      </div>
      <div className="progress-row">
        <b>{format(currentTime)}</b>
        <input
          aria-label="Track progress"
          type="range"
          min="0"
          max={duration || 1}
          value={currentTime}
          onChange={(event) => onSeek(Number(event.target.value))}
          style={{ '--progress': `${progress}%` } as CSSProperties}
        />
        <b>{format(duration)}</b>
      </div>
      <small>{status}</small>
      <div className="volume-row" aria-hidden="true">
        <Volume1 />
        <span><i /></span>
        <Volume2 />
      </div>
      <div className="utility-row" aria-hidden="true">
        <Settings />
        <Maximize2 />
      </div>
    </section>
  )
}

type QueueItem = {
  id: string
  title: string
  sequence: number
  cover: string
  realIndex: number
}

function buildQueueItems(tracks: Track[], coverUrl: string): QueueItem[] {
  if (tracks.length > 1) {
    return tracks.slice(0, 10).map((item, index) => ({
      id: item.id,
      title: item.title,
      sequence: item.track_order ?? index + 1,
      cover: publicAssetUrl(item.cover_asset) || coverUrl,
      realIndex: index,
    }))
  }

  return presentationQueue.map((title, index) => ({
    id: `presentation-${index}`,
    title,
    sequence: index + 1,
    cover: coverUrl,
    realIndex: index === 0 ? 0 : -1,
  }))
}

function TracklistDock({
  items,
  selected,
  onPlay,
}: {
  items: QueueItem[]
  selected: number
  onPlay: (index: number) => void
}) {
  return (
    <section className="tracklist-dock" aria-label="Tracklist Act III Reclamation">
      <header>
        <h2>TRACKLIST: ACT III - RECLAMATION</h2>
        <div>
          <button type="button">VIEW FULL LIST</button>
          <button type="button">SHUFFLE <Shuffle /></button>
        </div>
      </header>
      <div className="track-rail">
        <button type="button" className="rail-arrow" aria-label="Previous track page"><ChevronLeft /></button>
        <div className="track-card-row">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`track-card ${item.realIndex === selected ? 'active' : ''}`}
              onClick={() => onPlay(item.realIndex)}
            >
              <img src={item.cover} alt="" />
              <span>{String(item.sequence).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <button type="button" className="rail-arrow" aria-label="Next track page"><ChevronRight /></button>
      </div>
    </section>
  )
}

function FooterNav() {
  return (
    <footer className="footer-nav">
      <div className="seeker-id">
        <span />
        <p>SEEKER ID<br /><b>MM-7777</b></p>
      </div>
      <nav aria-label="Visualizer sections">
        <a>DASHBOARD</a>
        <a>ELEMENTAL PROTOCOLS</a>
        <a>ANALYTICS</a>
        <a>ARCHIVE</a>
        <a>INTEL</a>
      </nav>
      <button type="button"><LogOut /> LOGOUT</button>
    </footer>
  )
}

function format(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
}
