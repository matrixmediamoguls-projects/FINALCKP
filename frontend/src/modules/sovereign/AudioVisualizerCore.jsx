import { useEffect, useMemo, useRef, useState } from 'react';
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
  { id: 'fallback-10', track_order: 10, title: 'Reclamation', duration_seconds: 302 }
];

function formatDuration(seconds) {
  if (!seconds) return '03:47';
  const minutes = Math.floor(seconds / 60);
  const remaining = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function HudIcon({ children }) {
  return <span className="ckp-hud-icon">{children}</span>;
}

export default function AudioVisualizerCore({ selectedTrackId, activeTrackData, tracks = [], onTrackChange, isPlaying, onPlayStateChange }) {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(activeTrackData || null);
  const [requirements, setRequirements] = useState(null);
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
      getVisualizerRequirementsByTrack(selectedTrackId)
    ]).then(([trackData, visualizerData]) => {
      if (!active) return;
      setTrack(trackData || activeTrackData || null);
      setRequirements(visualizerData);
    });

    return () => {
      active = false;
    };
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
  const accent = requirements?.accent_color || requirements?.primary_color || '#ff1b1b';

  const bars = useMemo(() => {
    if (frequencyData.length > 0) return frequencyData.slice(0, 96);
    return Array.from({ length: 96 }, (_, index) => 40 + Math.abs(Math.sin(index * 0.31)) * 120);
  }, [frequencyData]);

  const waveform = useMemo(() => {
    return Array.from({ length: 34 }, (_, index) => {
      const source = bars[index * 2] || 40;
      return 8 + source * 0.18;
    });
  }, [bars]);

  return (
    <section className="ckp-visualizer-shell" style={{ '--ckp-accent': accent }}>
      <div className="ckp-frame-corner ckp-frame-corner-tl" />
      <div className="ckp-frame-corner ckp-frame-corner-tr" />
      <div className="ckp-frame-corner ckp-frame-corner-bl" />
      <div className="ckp-frame-corner ckp-frame-corner-br" />

      <header className="ckp-top-command">
        <div className="ckp-top-left-panel ckp-angled-panel">
          <div className="ckp-mini-mark">CK</div>
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
          <button type="button"><HudIcon>□</HudIcon></button>
          <button type="button"><HudIcon>⌁</HudIcon></button>
          <button type="button"><HudIcon>⚙</HudIcon></button>
        </div>
      </header>

      <section className="ckp-stage-window">
        <div className="ckp-city-grid" />
        <div className="ckp-perspective-lines" />
        {(requirements?.video_url || requirements?.loop_visual_url) && (
          <video
            className="ckp-video-layer"
            src={requirements.video_url || requirements.loop_visual_url}
            muted
            loop
            playsInline
            autoPlay
          />
        )}

        <div className="ckp-reactor-wrap">
          <div className="ckp-reactor-rays">
            {bars.map((value, index) => {
              const rotation = (index / bars.length) * 360;
              const height = 42 + value * 0.44 + (isPlaying ? audioLevel * 0.15 : 0);
              return (
                <span
                  key={index}
                  style={{
                    height,
                    transform: `rotate(${rotation}deg) translateY(-205px)`
                  }}
                />
              );
            })}
          </div>
          <div className="ckp-reactor-ring ckp-reactor-ring-outer" />
          <div className="ckp-reactor-ring ckp-reactor-ring-mid" />
          <div className="ckp-reactor-ring ckp-reactor-ring-inner" />
          <div className="ckp-reactor-node ckp-reactor-node-top" />
          <div className="ckp-reactor-node ckp-reactor-node-left" />
          <div className="ckp-reactor-node ckp-reactor-node-right" />
          <div className="ckp-core-emblem">
            <div className="ckp-core-symbol">CK</div>
            <h2>Chroma Key</h2>
            <p>Protocol</p>
            <small>Trust None. Verify All.<br />Act Three</small>
          </div>
        </div>
      </section>

      <nav className="ckp-playback-dock" aria-label="Visualizer playback controls">
        <button type="button">⇄</button>
        <button type="button">◀</button>
        <button type="button" className="ckp-play-main" onClick={() => onPlayStateChange?.(!isPlaying)}>{isPlaying ? 'Ⅱ' : '▶'}</button>
        <button type="button">▶</button>
        <button type="button">↻</button>
      </nav>

      <section className="ckp-track-system">
        <h3>Track Selection</h3>
        <button type="button" className="ckp-carousel-arrow ckp-carousel-arrow-left">‹</button>
        <div className="ckp-track-carousel">
          {carouselTracks.map((item, index) => {
            const isActive = item.id === activeId || (!selectedTrackId && index === 2);
            return (
              <button
                type="button"
                key={item.id}
                className={`ckp-track-card ${isActive ? 'is-active' : ''}`}
                onClick={() => onTrackChange?.(item.id)}
              >
                <span className="ckp-track-number">{String(item.track_order || index + 1).padStart(2, '0')}</span>
                <strong>{item.title || 'Untitled'}</strong>
                {isActive ? (
                  <div className="ckp-card-waveform">
                    {waveform.map((height, waveIndex) => <i key={waveIndex} style={{ height }} />)}
                  </div>
                ) : <span className="ckp-card-figure" />}
                <small>{formatDuration(item.duration_seconds)}</small>
              </button>
            );
          })}
        </div>
        <button type="button" className="ckp-carousel-arrow ckp-carousel-arrow-right">›</button>
        <div className="ckp-carousel-dots">
          {Array.from({ length: 8 }, (_, index) => <span key={index} className={index === 0 ? 'is-live' : ''} />)}
        </div>
      </section>

      <footer className="ckp-footer-command">
        <div className="ckp-database-status">Database <span /> Connected</div>
        <div className="ckp-footer-controls">
          <div><HudIcon>▣</HudIcon><p>Visual Mode<strong>Cinematic</strong></p></div>
          <div><HudIcon>◈</HudIcon><p>Reactive Level<strong>High</strong></p></div>
          <div><HudIcon>☼</HudIcon><p>Particles<strong>Enabled</strong></p></div>
          <div className="ckp-footer-mark">CK</div>
          <div><HudIcon>☼</HudIcon><p>Light React<strong>Enabled</strong></p></div>
          <div><HudIcon>RS</HudIcon><p>Camera FX<strong>Subtle</strong></p></div>
          <div><HudIcon>⬢</HudIcon><p>Theme<strong>Red Protocol</strong></p></div>
        </div>
        <div className="ckp-live-status"><p>Node <strong>R2 Live</strong></p><p>Protocol <strong>CKP Encrypted</strong></p><time>03:47:21</time></div>
      </footer>

      <audio ref={audioRef} src={activeTrack?.audio_url || undefined} preload="metadata" />
    </section>
  );
}
