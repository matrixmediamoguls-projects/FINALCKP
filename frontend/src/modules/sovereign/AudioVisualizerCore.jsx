import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Gauge,
  Hexagon,
  Image,
  Pause,
  Play,
  Repeat2,
  Settings,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Sun,
  Video,
  Waves,
} from 'lucide-react';
import { getTrackById } from '../../lib/supabase/tracks';
import { getVisualizerRequirementsByTrack } from '../../lib/supabase/visualizerRequirements';
import { useAudioAnalyzer } from '../../lib/audio/useAudioAnalyzer';

const FALLBACK_TRACKS = [
  { id: 'fallback-01', track_order: 1, title: 'System Override', duration_seconds: 227 },
  { id: 'fallback-02', track_order: 2, title: 'Digital Ghost', duration_seconds: 201 },
  { id: 'fallback-03', track_order: 3, title: 'Break The Code', duration_seconds: 248 },
  { id: 'fallback-04', track_order: 4, title: 'Wasteland', duration_seconds: 236 },
  { id: 'fallback-05', track_order: 5, title: 'Blackout Protocol', duration_seconds: 268 },
  { id: 'fallback-06', track_order: 6, title: 'No Gatekeepers', duration_seconds: 219 },
  { id: 'fallback-07', track_order: 7, title: 'Glitch In The Plan', duration_seconds: 251 },
  { id: 'fallback-08', track_order: 8, title: 'Rewrite Reality', duration_seconds: 298 },
  { id: 'fallback-09', track_order: 9, title: 'Data Rebellion', duration_seconds: 284 },
  { id: 'fallback-10', track_order: 10, title: 'Reclamation', duration_seconds: 302 },
];

const DEFAULT_VIEWPORT = '/media/visualizer/reclamation-city-gatekeeper.png.png';
const CORE_EMBLEM = '/emblem/reclamation_core_emblem.png';

function formatDuration(seconds) {
  const value = Number(seconds) || 0;
  const minutes = Math.floor(value / 60);
  return `${String(minutes).padStart(2, '0')}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}

function HudIcon({ children }) {
  return <span className="ckp-hud-icon">{children}</span>;
}

export default function AudioVisualizerCore({ selectedTrackId, activeTrackData, tracks = [], onTrackChange, isPlaying, onPlayStateChange }) {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(activeTrackData || null);
  const [requirements, setRequirements] = useState(null);
  const [repeat, setRepeat] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const { start, stop, frequencyData, audioLevel } = useAudioAnalyzer(audioRef);

  useEffect(() => {
    if (!selectedTrackId || String(selectedTrackId).startsWith('fallback-')) {
      setTrack(activeTrackData || null);
      setRequirements(null);
      return undefined;
    }

    let active = true;
    Promise.all([
      getTrackById(selectedTrackId),
      getVisualizerRequirementsByTrack(selectedTrackId),
    ]).then(([trackData, visualizerData]) => {
      if (!active) return;
      setTrack(trackData || activeTrackData || null);
      setRequirements(visualizerData);
    });

    return () => { active = false; };
  }, [selectedTrackId, activeTrackData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && track?.audio_url) {
      audio.play().then(start).catch(() => onPlayStateChange?.(false));
    } else {
      audio.pause();
      stop();
    }
  }, [isPlaying, track?.audio_url, start, stop, onPlayStateChange]);

  const carouselTracks = tracks.length > 0 ? tracks.slice(0, 10) : FALLBACK_TRACKS;
  const activeId = selectedTrackId || carouselTracks[2]?.id;
  const activeTrack = track || activeTrackData || carouselTracks.find((item) => item.id === activeId) || carouselTracks[2];
  const activeIndex = Math.max(0, carouselTracks.findIndex((item) => item.id === activeId));
  const accent = requirements?.accent_color || requirements?.primary_color || '#ff1717';
  const viewportImage = requirements?.viewport_image_url || activeTrack?.viewport_image_url || DEFAULT_VIEWPORT;

  const bars = useMemo(() => {
    if (frequencyData.length > 0) return frequencyData.slice(0, 96);
    return Array.from({ length: 96 }, (_, index) => 40 + Math.abs(Math.sin(index * 0.31)) * 120);
  }, [frequencyData]);

  const waveform = useMemo(() => Array.from({ length: 34 }, (_, index) => 8 + (bars[index * 2] || 40) * 0.18), [bars]);

  const selectRelativeTrack = (direction) => {
    const nextIndex = (activeIndex + direction + carouselTracks.length) % carouselTracks.length;
    onTrackChange?.(carouselTracks[nextIndex].id);
  };

  const selectRandomTrack = () => {
    if (carouselTracks.length < 2) return;
    let nextIndex = activeIndex;
    while (nextIndex === activeIndex) nextIndex = Math.floor(Math.random() * carouselTracks.length);
    onTrackChange?.(carouselTracks[nextIndex].id);
  };

  return (
    <section
      className={`ckp-visualizer-shell ${isPlaying ? 'is-playing' : ''}`}
      style={{ '--ckp-accent': accent, '--ckp-energy': Math.max(0.15, audioLevel / 100) }}
    >
      <div className="ckp-frame-corner ckp-frame-corner-tl" />
      <div className="ckp-frame-corner ckp-frame-corner-tr" />
      <div className="ckp-frame-corner ckp-frame-corner-bl" />
      <div className="ckp-frame-corner ckp-frame-corner-br" />

      <header className="ckp-top-command">
        <div className="ckp-top-left-panel ckp-angled-panel">
          <img className="ckp-mini-mark" src={CORE_EMBLEM} alt="" />
          <div>
            <p><span>CKP</span><b>//</b> Reclamation Mainframe</p>
            <strong>Sovereign Mode</strong>
          </div>
        </div>

        <div className="ckp-title-plate">
          <h1>Chroma Key Protocol</h1>
          <p>Audio Visualizer Engine</p>
        </div>

        <div className="ckp-top-right-panel ckp-angled-panel">
          <div>
            <p>System Status</p>
            <strong>Authorized <span /></strong>
          </div>
          <button type="button" aria-label="Expand visualizer"><Expand /></button>
          <button type="button" aria-label="Open signal monitor"><Waves /></button>
          <button type="button" aria-label="Visualizer settings"><Settings /></button>
        </div>
      </header>

      <section className="ckp-stage-window">
        <img className="ckp-stage-backdrop" src={viewportImage} alt="" />
        <div className="ckp-stage-tint" />
        <div className="ckp-stage-readout ckp-stage-readout--left">
          <span>Active transmission</span>
          <strong>{activeTrack?.title || 'Reclamation'}</strong>
        </div>
        <div className="ckp-stage-readout ckp-stage-readout--right">
          <span>Signal response</span>
          <strong>{isPlaying ? `${Math.max(1, Math.round(audioLevel))}%` : 'Standby'}</strong>
        </div>
        {(requirements?.video_url || requirements?.loop_visual_url) && (
          <video className="ckp-video-layer" src={requirements.video_url || requirements.loop_visual_url} muted loop playsInline autoPlay />
        )}

        <div className="ckp-reactor-wrap">
          <div className="ckp-reactor-rays">
            {bars.map((value, index) => {
              const rotation = (index / bars.length) * 360;
              const height = 42 + value * 0.44 + (isPlaying ? audioLevel * 0.15 : 0);
              return <span key={index} style={{ height, transform: `rotate(${rotation}deg) translateY(-205px)` }} />;
            })}
          </div>
          <div className="ckp-reactor-ring ckp-reactor-ring-outer" />
          <div className="ckp-reactor-ring ckp-reactor-ring-mid" />
          <div className="ckp-reactor-ring ckp-reactor-ring-inner" />
          <img className="ckp-core-emblem" src={CORE_EMBLEM} alt="Chroma Key Protocol" />
        </div>
      </section>

      <nav className="ckp-playback-dock" aria-label="Visualizer playback controls">
        <button type="button" onClick={selectRandomTrack} aria-label="Shuffle"><Shuffle /></button>
        <button type="button" onClick={() => selectRelativeTrack(-1)} aria-label="Previous track"><SkipBack /></button>
        <button type="button" className="ckp-play-main" onClick={() => onPlayStateChange?.(!isPlaying)} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button type="button" onClick={() => selectRelativeTrack(1)} aria-label="Next track"><SkipForward /></button>
        <button type="button" className={repeat ? 'is-enabled' : ''} onClick={() => setRepeat((value) => !value)} aria-pressed={repeat} aria-label="Repeat"><Repeat2 /></button>
      </nav>

      <section className="ckp-track-system">
        <h3>Track Selection</h3>
        <button type="button" className="ckp-carousel-arrow ckp-carousel-arrow-left" onClick={() => selectRelativeTrack(-1)} aria-label="Previous track"><ChevronLeft /></button>
        <div className="ckp-track-carousel">
          {carouselTracks.map((item, index) => {
            const isActive = item.id === activeId || (!selectedTrackId && index === 2);
            const cardImage = item.viewport_image_url || viewportImage;
            return (
              <button type="button" key={item.id} className={`ckp-track-card ${isActive ? 'is-active' : ''}`} onClick={() => onTrackChange?.(item.id)}>
                <img className="ckp-track-art" src={cardImage} alt="" />
                <span className="ckp-track-number">{String(item.track_order || index + 1).padStart(2, '0')}</span>
                <strong>{item.title || 'Untitled'}</strong>
                {isActive && <div className="ckp-card-waveform">{waveform.map((height, waveIndex) => <i key={waveIndex} style={{ height }} />)}</div>}
                <small>{formatDuration(item.duration_seconds)}</small>
              </button>
            );
          })}
        </div>
        <button type="button" className="ckp-carousel-arrow ckp-carousel-arrow-right" onClick={() => selectRelativeTrack(1)} aria-label="Next track"><ChevronRight /></button>
        <div className="ckp-carousel-dots">{carouselTracks.map((item) => <span key={item.id} className={item.id === activeId ? 'is-live' : ''} />)}</div>
      </section>

      <footer className="ckp-footer-command">
        <div className="ckp-database-status">Database <span /> Connected</div>
        <div className="ckp-footer-controls">
          <div><HudIcon><Image /></HudIcon><p>Visual Mode<strong>Cinematic</strong></p></div>
          <div><HudIcon><Gauge /></HudIcon><p>Reactive Level<strong>High</strong></p></div>
          <div><HudIcon><Sparkles /></HudIcon><p>Particles<strong>Enabled</strong></p></div>
          <img className="ckp-footer-mark" src={CORE_EMBLEM} alt="" />
          <div><HudIcon><Sun /></HudIcon><p>Light React<strong>Enabled</strong></p></div>
          <div><HudIcon><Video /></HudIcon><p>Camera FX<strong>Subtle</strong></p></div>
          <div><HudIcon><Hexagon /></HudIcon><p>Theme<strong>Red Protocol</strong></p></div>
        </div>
        <div className="ckp-live-status">
          <p>Node <strong>R2 Live</strong></p>
          <p>Protocol <strong>CKP Encrypted</strong></p>
          <time>{formatDuration(elapsed)}</time>
        </div>
      </footer>

      <audio
        ref={audioRef}
        src={activeTrack?.audio_url || undefined}
        preload="metadata"
        loop={repeat}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onEnded={() => { if (!repeat) selectRelativeTrack(1); }}
      />
    </section>
  );
}
