import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAudioAnalyser } from './useAudioAnalyser';
import './protocolStyles.css';

const R2_BASE = process.env.REACT_APP_R2_PUBLIC_BASE_URL || '';

// ─── FALLBACK DEMO TRACK ─────────────────────────────────────────────────────
const FALLBACK_TRACK = {
  id: 'demo-code-red',
  sort_order: 1,
  title: 'CODE RED',
  audio_file_name: '',
  audio_url: '',
  act: 'ACT THREE',
  act_keys: ['Override obstruction', 'Reclaim the route', 'Expose the system'],
  shell_image: '',
  shell_image_url: '',
  visual_mode: 'system-fracture',
  primary_color: '#ff1a2d',
  intensity: 95,
  display_text: 'Power through exposure.',
  needs_user_input: '',
  notes: '',
  is_active: true,
  act_logo_text: 'CHROMA KEY PROTOCOL',
  act_logo_subtitle: 'ACT THREE',
  act_logo_ring_enabled: true,
  act_logo_reactivity_strength: 90,
  act_logo_glow_strength: 95,
  act_logo_rotation_speed: 0.15,
  act_logo_visualizer_style: 'radial-bars',
  background_overlay_opacity: 0.22,
  background_blur: 0,
  background_motion_enabled: true,
  scanline_enabled: true,
  glitch_level: 35,
  fog_level: 20,
  pulse_strength: 90,
  vignette_strength: 70,
  display_text_enabled: true,
  display_text_label: 'LYRICAL BANK',
  display_text_animation: 'pulse',
  display_text_reactive: true,
  sonic_artifact_enabled: true,
  sonic_artifact_title: 'SONIC ARTIFACT DECLARATION',
  sonic_artifact_declaration: 'The route is reclaimed.',
  sonic_artifact_position: 'upper-left',
  sonic_artifact_style: 'protocol-card',
  act_keys_enabled: true,
  act_keys_title: 'KEYS TO ACT THREE',
  act_keys_position: 'right-panel',
  act_keys_style: 'access-panel',
  release_status: 'demo',
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const joinUrl = (base, path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (!base) return path;
  return `${base.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
};

const normalizeActKeys = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (_) {
      return value.split(/[\n,|]/).map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const normalizeTrack = (raw, index = 0) => {
  const audioFile = raw.audio_file_name || raw.audio_filename || '';
  const shellPath = raw.shell_image || raw.background_image || '';
  return {
    ...raw,
    id: raw.id || `track-${index}`,
    sort_order: raw.sort_order ?? index + 1,
    title: raw.title || raw.name || 'Untitled Track',
    audio_file_name: audioFile,
    audio_url: raw.audio_url || (audioFile ? joinUrl(R2_BASE, `audio/reclamation/${audioFile}`) : ''),
    act: raw.act_label || raw.act || 'ACT ONE',
    act_keys: normalizeActKeys(raw.act_keys),
    shell_image: shellPath,
    shell_image_url: raw.shell_image_url || joinUrl(R2_BASE, shellPath),
    visual_mode: raw.visual_mode || 'shell-reactive',
    primary_color: raw.primary_color || raw.color || '#5ab038',
    intensity: Number(raw.intensity ?? 70),
    display_text: raw.display_text || raw.lyrics || '',
    sonic_artifact_title: raw.sonic_artifact_title || 'SONIC ARTIFACT DECLARATION',
    sonic_artifact_declaration: raw.sonic_artifact_declaration || '',
    act_logo_text: raw.act_logo_text || 'CHROMA KEY PROTOCOL',
    act_logo_subtitle: raw.act_logo_subtitle || raw.act_label || raw.act || '',
    release_status: raw.release_status || 'draft',
    is_active: raw.is_active !== false,
  };
};

// ─── DATA HOOK ────────────────────────────────────────────────────────────────
const useReclamationTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!supabase) throw new Error('Supabase not configured — check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
        const { data, error: sbErr } = await supabase
          .from('tracks')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (sbErr) throw sbErr;
        if (!mounted) return;
        const normalized = (data || []).map(normalizeTrack).filter((t) => t.is_active);
        setTracks(normalized.length ? normalized : [normalizeTrack(FALLBACK_TRACK)]);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unable to load tracks from Supabase');
        setTracks([normalizeTrack(FALLBACK_TRACK)]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return { tracks, loading, error };
};

// ─── BACKGROUND ───────────────────────────────────────────────────────────────
const ActVisualizerBackground = ({ track, audioData }) => {
  const strength = audioData.averageVolume * (track.intensity / 100);
  const color = track.primary_color;
  const shellUrl = track.shell_image_url || track.shell_image;
  const glowHex = Math.min(88, Math.floor(18 + strength * 110)).toString(16).padStart(2, '0');

  return (
    <div className="ip-background" aria-hidden="true">
      {shellUrl
        ? <img src={shellUrl} alt="" className="ip-shell-image" />
        : <div className="ip-shell-fallback" />
      }
      <div className="ip-vignette" />
      <div
        className="ip-reactive-wash"
        style={{
          background: `radial-gradient(circle at 52% 42%, ${color}${glowHex} 0%, transparent 58%)`,
          transform: `scale(${1 + strength * 0.09})`,
        }}
      />
      <div
        className="ip-scanlines"
        style={{ opacity: track.scanline_enabled === false ? 0 : 0.13 + strength * 0.16 }}
      />
      <div
        className="ip-noise"
        style={{ opacity: 0.04 + audioData.trebleLevel * 0.11 }}
      />
    </div>
  );
};

// ─── SYSTEM STATUS (top-left) ─────────────────────────────────────────────────
const SystemStatus = ({ isPlaying }) => (
  <div className="ip-system-status">
    <span className="ip-sys-line ip-status-on">SYSTEMS ACTIVE</span>
    <span className={`ip-sys-line ${isPlaying ? 'ip-status-on' : 'ip-status-dim'}`}>
      AUDIO LINK: {isPlaying ? 'ESTABLISHED' : 'STANDBY'}
    </span>
    <span className={`ip-sys-line ${isPlaying ? 'ip-status-on' : 'ip-status-dim'}`}>
      VISUALIZER: {isPlaying ? 'ONLINE' : 'OFFLINE'}
    </span>
  </div>
);

// ─── AUDIO QUALITY (top-center) ───────────────────────────────────────────────
const AudioQualityDisplay = () => (
  <div className="ip-quality-display">
    <span>44.1kHz / 24bit</span>
  </div>
);

// ─── NETWORK PANEL (top-right) ────────────────────────────────────────────────
const NetworkPanel = ({ audioData }) => {
  const bars = useMemo(() => Array.from({ length: 28 }), []);
  return (
    <div className="ip-network-panel">
      <span className="ip-mono-label">RECLAMATION NETWORK</span>
      <div className="ip-network-bars">
        {bars.map((_, i) => {
          const val = (audioData.frequencyData[i * 7] || 0) / 255;
          return (
            <span
              key={i}
              className="ip-network-bar"
              style={{ height: `${6 + val * 26}px`, opacity: 0.35 + val * 0.65 }}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── SONIC ARTIFACT DECLARATION (left panel) ──────────────────────────────────
const SonicArtifactDeclaration = ({ track }) => {
  if (track.sonic_artifact_enabled === false || !track.sonic_artifact_declaration) return null;
  return (
    <div className="ip-sonic-artifact ip-glass-panel ip-panel-left-accent">
      <span className="ip-mono-label">{track.sonic_artifact_title || 'SONIC ARTIFACT DECLARATION'}</span>
      <p className="ip-artifact-text">{track.sonic_artifact_declaration}</p>
      <small className="ip-artifact-sub">PRIORITY: SEEKER</small>
    </div>
  );
};

// ─── GATEKEEPER PANEL (decorative HUD chrome) ────────────────────────────────
const GatekeeperPanel = ({ label = 'GATEKEEPER PROTOCOL' }) => (
  <div className="ip-gatekeeper ip-glass-panel ip-panel-left-accent">
    <div className="ip-gatekeeper-header">
      <span className="ip-lock">&#9953;</span>
      <span className="ip-mono-label">{label}</span>
    </div>
    <div className="ip-gatekeeper-status">
      <span className="ip-denied-x">×</span>
      <span className="ip-denied-text">ACCESS DENIED</span>
    </div>
  </div>
);

// ─── ACT LOGO VISUALIZER (center) ────────────────────────────────────────────
const ActLogoVisualizer = ({ track, audioData }) => {
  const color = track.primary_color;
  const strength = audioData.averageVolume * (track.intensity / 100);
  const bass = audioData.bassLevel * (track.intensity / 100);
  const bars = useMemo(() => Array.from({ length: 36 }), []);
  const logoUrl = track.act_logo_image ? joinUrl(R2_BASE, track.act_logo_image) : null;

  return (
    <div
      className="ip-logo-wrap"
      style={{
        '--ip-color': color,
        transform: `translate(-50%, -50%) scale(${1 + bass * 0.045})`,
      }}
    >
      {/* Radial frequency bars */}
      <div className="ip-radial-bars">
        {bars.map((_, i) => {
          const sample = audioData.frequencyData[i * 4] || 0;
          const h = 12 + (sample / 255) * 58 * (track.intensity / 100);
          return (
            <span
              key={i}
              style={{
                transform: `rotate(${i * 10}deg) translateY(-126px)`,
                height: `${h}px`,
                opacity: 0.18 + (sample / 255) * 0.82,
              }}
            />
          );
        })}
      </div>

      {/* Outer orbit ring */}
      <div
        className="ip-logo-orbit"
        style={{
          opacity: 0.28 + strength * 0.72,
          animationDuration: `${Math.max(3.5, 12 - strength * 10)}s`,
        }}
      />

      {/* Inner glow ring */}
      <div
        className="ip-logo-inner-ring"
        style={{ boxShadow: `0 0 ${12 + strength * 40}px ${color}66` }}
      />

      {/* Core */}
      <div
        className="ip-logo-core"
        style={{ boxShadow: `0 0 ${22 + strength * 70}px ${color}, inset 0 0 24px rgba(0,0,0,0.7)` }}
      >
        {logoUrl
          ? <img src={logoUrl} alt="Act Logo" className="ip-logo-img" />
          : (
            <>
              <span className="ip-logo-name">{track.act_logo_text || 'CHROMA KEY PROTOCOL'}</span>
              <span className="ip-logo-divider" />
              <span className="ip-logo-act">{track.act_logo_subtitle || track.act}</span>
            </>
          )
        }
      </div>
    </div>
  );
};

// ─── ACT KEYS MODULE (right column) ──────────────────────────────────────────
const ActKeysModule = ({ track }) => {
  if (track.act_keys_enabled === false || !track.act_keys?.length) return null;
  return (
    <div className="ip-act-keys-panel ip-glass-panel ip-panel-right-accent">
      <span className="ip-mono-label">{track.act_keys_title || 'KEYS TO THE ACT'}</span>
      <div className="ip-act-keys-list">
        {track.act_keys.slice(0, 5).map((key, i) => (
          <div key={i} className="ip-act-key-row">
            <span className="ip-key-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="ip-key-text">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ACTION BUTTON (bottom of right column) ───────────────────────────────────
const ActActionButton = ({ track }) => {
  const actLower = (track.act || '').toLowerCase();
  const defaultLabel = actLower.includes('three') ? 'NEW PATH CONFIRMED' : 'COLLAPSE THE ILLUSION';
  const label = track.act_action_text || defaultLabel;
  return (
    <div className="ip-action-btn ip-glass-panel ip-panel-right-accent">
      <span className="ip-action-label">{label}</span>
      <span className="ip-action-arrow">→</span>
    </div>
  );
};

// ─── AUDIO REACTIVITY (bottom-right) ─────────────────────────────────────────
const AudioReactivityDisplay = ({ audioData }) => {
  const bars = useMemo(() => Array.from({ length: 36 }), []);
  return (
    <div className="ip-audio-reactivity">
      <span className="ip-mono-label">AUDIO REACTIVITY</span>
      <div className="ip-reactivity-bars">
        {bars.map((_, i) => {
          const val = (audioData.frequencyData[i * 5] || 0) / 255;
          return (
            <span
              key={i}
              className="ip-react-bar"
              style={{ height: `${5 + val * 34}px`, opacity: 0.3 + val * 0.7 }}
            />
          );
        })}
      </div>
      <div className="ip-signal-row">
        <span className="ip-signal-label">SIGNAL</span>
        <div className="ip-signal-track">
          <div
            className="ip-signal-fill"
            style={{ width: `${Math.round(audioData.averageVolume * 100)}%` }}
          />
        </div>
        <span className="ip-signal-pct">{Math.round(audioData.averageVolume * 100)}%</span>
      </div>
    </div>
  );
};

// ─── BOTTOM HUD BAR ───────────────────────────────────────────────────────────
const BottomHUDBar = ({
  track, audioData, isPlaying, onToggle, onNext, onPrev,
  progress, duration, currentTime, onSeek, onOpenManifest,
}) => {
  const fmt = (s) => {
    if (!s || Number.isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  const thumbUrl = track.act_logo_image
    ? joinUrl(R2_BASE, track.act_logo_image)
    : (track.shell_image_url || null);

  return (
    <footer className="ip-bottom-bar">
      {/* Now Playing */}
      <button className="ip-now-playing" onClick={onOpenManifest} title="Open Track Manifest">
        <div className="ip-album-thumb">
          {thumbUrl
            ? <img src={thumbUrl} alt="" />
            : <div className="ip-album-placeholder" />
          }
        </div>
        <div className="ip-np-info">
          <span className="ip-np-label">NOW PLAYING</span>
          <strong className="ip-np-title">{track.title}</strong>
          <span className="ip-np-act">{track.act}</span>
        </div>
      </button>

      {/* Lyrical Bank */}
      <div className="ip-lyrical-bank">
        <span className="ip-mono-label">{track.display_text_label || 'LYRICAL BANK'}</span>
        <p
          className="ip-lyric-text"
          style={{
            opacity: track.display_text_reactive !== false
              ? 0.7 + audioData.midLevel * 0.3
              : 0.88,
          }}
        >
          {track.display_text_enabled !== false ? (track.display_text || '—') : '—'}
        </p>
      </div>

      {/* Player Controls */}
      <div className="ip-player-controls">
        <div className="ip-ctrl-row">
          <button className="ip-ctrl-btn" onClick={onPrev} aria-label="Previous">⏮</button>
          <button className="ip-play-btn" onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ip-ctrl-btn" onClick={onNext} aria-label="Next">⏭</button>
        </div>
        <div
          className="ip-progress-track"
          onClick={onSeek}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <div className="ip-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="ip-time-row">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Audio Reactivity */}
      <AudioReactivityDisplay audioData={audioData} />
    </footer>
  );
};

// ─── TRACK SELECTOR (toggleable overlay) ─────────────────────────────────────
const TrackSelector = ({ tracks, currentIndex, onSelect, visible, onClose }) => (
  <>
    {visible && <div className="ip-selector-backdrop" onClick={onClose} />}
    <aside className={`ip-track-selector ${visible ? 'ip-selector-open' : ''}`}>
      <div className="ip-selector-header">
        <span className="ip-mono-label">RECLAMATION MANIFEST</span>
        <button className="ip-selector-close" onClick={onClose}>×</button>
      </div>
      <div className="ip-selector-list">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            className={`ip-track-item ${i === currentIndex ? 'ip-track-active' : ''}`}
            onClick={() => { onSelect(i); onClose(); }}
          >
            <span className="ip-track-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="ip-track-meta">
              <strong>{t.title}</strong>
              <small>{t.act} · {t.release_status}</small>
            </div>
            <span className="ip-track-status">{t.release_status === 'demo' ? 'DEMO' : t.release_status === 'draft' ? 'DRAFT' : 'ACTIVE'}</span>
          </button>
        ))}
      </div>
    </aside>
  </>
);

// ─── PROTOCOL SHELL ───────────────────────────────────────────────────────────
const ProtocolShell = ({ track, audioData, isPlaying, children }) => (
  <div className="ip-shell" style={{ '--ip-color': track.primary_color }}>
    {/* Layer 0: Background */}
    <ActVisualizerBackground track={track} audioData={audioData} />

    {/* Layer 1: HUD Overlay */}
    <div className="ip-hud">
      {/* Top row */}
      <div className="ip-top-row">
        <SystemStatus isPlaying={isPlaying} />
        <AudioQualityDisplay />
        <NetworkPanel audioData={audioData} />
      </div>

      {/* Left column panels */}
      <div className="ip-left-col">
        <SonicArtifactDeclaration track={track} />
        <GatekeeperPanel label="GATEKEEPER PROTOCOL" />
        <GatekeeperPanel label="GATEKEEPER PROTOCOL" />
      </div>

      {/* Center: act logo */}
      <ActLogoVisualizer track={track} audioData={audioData} />

      {/* Right column panels */}
      <div className="ip-right-col">
        <ActKeysModule track={track} />
        <ActActionButton track={track} />
      </div>
    </div>

    {/* Layer 2: Bottom bar + children */}
    {children}
  </div>
);

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div className="ip-loading">
    <div className="ip-loading-inner">
      <div className="ip-loading-ring" />
      <p className="ip-loading-text">INITIALIZING RECLAMATION PROTOCOL</p>
      <small className="ip-loading-sub">MUSIQ MATRIX MAINFRAME · CHROMA KEY PROTOCOL</small>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ImmersiveProtocol = () => {
  const { tracks, loading, error } = useReclamationTracks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [manifestOpen, setManifestOpen] = useState(false);
  const audioRef = useRef(null);
  const { audioData, connectAudioElement, stopAudioAnalyser } = useAudioAnalyser();

  const currentTrack = tracks[currentIndex] || normalizeTrack(FALLBACK_TRACK);

  const selectTrack = useCallback((index) => {
    if (audioRef.current) audioRef.current.pause();
    stopAudioAnalyser();
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setCurrentTime(0);
    setCurrentIndex(index);
  }, [stopAudioAnalyser]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.audio_url) return;
    if (audio.src !== currentTrack.audio_url) {
      audio.src = currentTrack.audio_url;
      audio.load();
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await connectAudioElement(audio);
      await audio.play();
      setIsPlaying(true);
    }
  }, [connectAudioElement, currentTrack.audio_url, isPlaying]);

  const nextTrack = useCallback(
    () => selectTrack((currentIndex + 1) % tracks.length),
    [currentIndex, selectTrack, tracks.length],
  );
  const prevTrack = useCallback(
    () => selectTrack((currentIndex - 1 + tracks.length) % tracks.length),
    [currentIndex, selectTrack, tracks.length],
  );

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration || 0;
    setCurrentTime(audio.currentTime);
    setDuration(dur);
    setProgress(dur ? (audio.currentTime / dur) * 100 : 0);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="ip-root" style={{ '--ip-color': currentTrack.primary_color }}>
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={nextTrack}
      />

      <ProtocolShell track={currentTrack} audioData={audioData} isPlaying={isPlaying}>
        {error && (
          <div className="ip-error-banner">
            <span>⚠</span> {error}
          </div>
        )}
        {!currentTrack.audio_url && !error && (
          <div className="ip-error-banner">
            No audio URL configured for this track — upload audio to R2 and set audio_file_name in Supabase.
          </div>
        )}
        <BottomHUDBar
          track={currentTrack}
          audioData={audioData}
          isPlaying={isPlaying}
          onToggle={togglePlay}
          onNext={nextTrack}
          onPrev={prevTrack}
          progress={progress}
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
          onOpenManifest={() => setManifestOpen(true)}
        />
      </ProtocolShell>

      <TrackSelector
        tracks={tracks}
        currentIndex={currentIndex}
        onSelect={selectTrack}
        visible={manifestOpen}
        onClose={() => setManifestOpen(false)}
      />
    </div>
  );
};

export default ImmersiveProtocol;
