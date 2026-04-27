import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useAudioAnalyser } from './useAudioAnalyser';
import './protocolStyles.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const R2_PUBLIC_BASE_URL = process.env.REACT_APP_R2_PUBLIC_BASE_URL || process.env.REACT_APP_R2_BASE_URL || '';

const FALLBACK_TRACK = {
  id: 'demo-code-red',
  track_id: 'demo-code-red',
  sort_order: 1,
  title: 'CODE RED',
  name: 'CODE RED',
  audio_file_name: '',
  audio_filename: '',
  audio_url: '',
  act: 'ACT THREE',
  act_keys: ['Override obstruction', 'Reclaim the route', 'Expose the system'],
  shell_image: '/images/reclamation/shells/act-three-shell.png',
  visual_mode: 'system-fracture',
  primary_color: '#ff1a2d',
  intensity: 95,
  display_text: 'Power through exposure.',
  sonic_artifact_title: 'SONIC ARTIFACT DECLARATION',
  sonic_artifact_declaration: 'The route is reclaimed.',
  act_logo_text: 'CHROMA KEY PROTOCOL',
  act_logo_subtitle: 'ACT THREE',
  release_status: 'demo',
  is_active: true,
};

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
      return value.split(/[\n,|]/).map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const normalizeTrack = (track, index = 0) => {
  const audioFile = track.audio_file_name || track.audio_filename || '';
  const shellImage = track.shell_image || track.background_image || '';
  const directAudioUrl = track.audio_url || track.public_audio_url || '';

  return {
    ...track,
    id: track.id || track.track_id || `track-${index}`,
    track_id: track.track_id || track.id || `track-${index}`,
    sort_order: track.sort_order ?? index + 1,
    title: track.title || track.name || 'Untitled Track',
    audio_file_name: audioFile,
    audio_url: directAudioUrl || (audioFile ? joinUrl(R2_PUBLIC_BASE_URL, `audio/reclamation/${audioFile}`) : track.has_audio ? `${API_URL}/api/audio/${track.track_id}` : ''),
    act: track.act_label || track.act || 'ACT ONE',
    act_keys: normalizeActKeys(track.act_keys),
    shell_image: shellImage,
    shell_image_url: track.shell_image_url || joinUrl(R2_PUBLIC_BASE_URL, shellImage),
    visual_mode: track.visual_mode || 'shell-reactive',
    primary_color: track.primary_color || track.color || '#5ab038',
    intensity: Number(track.intensity ?? 70),
    display_text: track.display_text || track.lyrics || '',
    sonic_artifact_title: track.sonic_artifact_title || 'SONIC ARTIFACT DECLARATION',
    sonic_artifact_declaration: track.sonic_artifact_declaration || track.system_role || track.lore || '',
    act_logo_text: track.act_logo_text || 'CHROMA KEY PROTOCOL',
    act_logo_subtitle: track.act_logo_subtitle || track.act_label || track.act || '',
    release_status: track.release_status || 'draft',
    is_active: track.is_active !== false,
  };
};

const useReclamationTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchTracks = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/immersive/tracks');
        const nextTracks = (response.data.tracks || [])
          .map(normalizeTrack)
          .filter((track) => track.is_active)
          .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));

        if (mounted) setTracks(nextTracks.length ? nextTracks : [normalizeTrack(FALLBACK_TRACK)]);
      } catch (err) {
        try {
          const response = await axios.get('/tracks');
          const nextTracks = (response.data.tracks || [])
            .filter((track) => track.type === 'track')
            .map(normalizeTrack)
            .sort((a, b) => Number(a.act || 0) - Number(b.act || 0));
          if (mounted) setTracks(nextTracks.length ? nextTracks : [normalizeTrack(FALLBACK_TRACK)]);
        } catch (fallbackErr) {
          if (mounted) {
            setError(fallbackErr?.response?.data?.detail || fallbackErr.message || 'Unable to load immersive tracks.');
            setTracks([normalizeTrack(FALLBACK_TRACK)]);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTracks();
    return () => { mounted = false; };
  }, []);

  return { tracks, loading, error };
};

const ActVisualizerBackground = ({ track, audioData }) => {
  const strength = audioData.averageVolume * (track.intensity / 100);
  const color = track.primary_color;
  const shellUrl = track.shell_image_url || track.shell_image;

  return (
    <div className="ip-background" aria-hidden="true">
      {shellUrl ? <img src={shellUrl} alt="" className="ip-shell-image" /> : <div className="ip-shell-fallback" />}
      <div className="ip-vignette" />
      <div className="ip-reactive-wash" style={{ background: `radial-gradient(circle at center, ${color}${Math.min(88, Math.floor(24 + strength * 120)).toString(16).padStart(2, '0')} 0%, transparent 58%)`, transform: `scale(${1 + strength * 0.1})` }} />
      <div className="ip-scanlines" style={{ opacity: track.scanline_enabled === false ? 0 : 0.16 + strength * 0.22 }} />
      <div className="ip-noise" style={{ opacity: 0.05 + audioData.trebleLevel * 0.14 }} />
    </div>
  );
};

const ActLogoVisualizer = ({ track, audioData }) => {
  const color = track.primary_color;
  const strength = audioData.averageVolume * (track.intensity / 100);
  const bass = audioData.bassLevel * (track.intensity / 100);
  const bars = useMemo(() => Array.from({ length: 36 }), []);

  return (
    <div className="ip-logo-wrap" style={{ '--ip-color': color, transform: `scale(${1 + bass * 0.05})` }}>
      <div className="ip-logo-orbit" style={{ opacity: 0.35 + strength, animationDuration: `${12 - Math.min(8, strength * 8)}s` }} />
      <div className="ip-radial-bars">
        {bars.map((_, i) => {
          const sample = audioData.frequencyData[i * 4] || 0;
          const h = 12 + (sample / 255) * 52 * (track.intensity / 100);
          return <span key={i} style={{ transform: `rotate(${i * 10}deg) translateY(-112px)`, height: `${h}px`, opacity: 0.18 + sample / 255 }} />;
        })}
      </div>
      <div className="ip-logo-core" style={{ boxShadow: `0 0 ${30 + strength * 90}px ${color}` }}>
        {track.act_logo_image ? <img src={joinUrl(R2_PUBLIC_BASE_URL, track.act_logo_image)} alt="Act logo" /> : <strong>{track.act_logo_text || 'CKP'}</strong>}
        <small>{track.act_logo_subtitle || track.act}</small>
      </div>
    </div>
  );
};

const LyricsEngine = ({ track, audioData }) => {
  if (track.display_text_enabled === false || !track.display_text) return null;
  return (
    <section className="ip-lyrics-engine" style={{ opacity: 0.78 + audioData.midLevel * 0.22 }}>
      <span>{track.display_text_label || 'LYRICS ENGINE'}</span>
      <p>{track.display_text}</p>
    </section>
  );
};

const SonicArtifactDeclaration = ({ track }) => {
  if (track.sonic_artifact_enabled === false || !track.sonic_artifact_declaration) return null;
  return (
    <section className="ip-artifact">
      <span>{track.sonic_artifact_title || 'SONIC ARTIFACT DECLARATION'}</span>
      <p>{track.sonic_artifact_declaration}</p>
    </section>
  );
};

const ActKeysModule = ({ track }) => {
  if (track.act_keys_enabled === false || !track.act_keys?.length) return null;
  return (
    <section className="ip-act-keys">
      <span>{track.act_keys_title || 'KEYS TO THE ACT'}</span>
      <ol>
        {track.act_keys.slice(0, 5).map((key) => <li key={key}>{key}</li>)}
      </ol>
    </section>
  );
};

const TrackSelector = ({ tracks, currentIndex, onSelect }) => (
  <aside className="ip-track-selector">
    <div className="ip-panel-label">RECLAMATION MANIFEST</div>
    {tracks.map((track, index) => (
      <button key={track.id} className={index === currentIndex ? 'active' : ''} onClick={() => onSelect(index)}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{track.title}</strong>
        <small>{track.act} · {track.release_status}</small>
      </button>
    ))}
  </aside>
);

const ProtocolPlayer = ({ track, isPlaying, onToggle, onNext, onPrev, progress, duration, currentTime, onSeek }) => {
  const fmt = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  };

  return (
    <footer className="ip-player">
      <button onClick={onPrev} className="ip-control">PREV</button>
      <button onClick={onToggle} className="ip-play">{isPlaying ? 'PAUSE' : 'PLAY'}</button>
      <button onClick={onNext} className="ip-control">NEXT</button>
      <div className="ip-progress" onClick={onSeek} role="button" tabIndex={0}>
        <div style={{ width: `${progress}%`, background: track.primary_color }} />
      </div>
      <span>{fmt(currentTime)} / {fmt(duration)}</span>
    </footer>
  );
};

const ProtocolShell = ({ track, audioData, children }) => (
  <main className="ip-shell" style={{ '--ip-color': track.primary_color }}>
    <ActVisualizerBackground track={track} audioData={audioData} />
    <div className="ip-topline">
      <span>MUSIQ MATRIX MAINFRAME</span>
      <span>{track.visual_mode}</span>
    </div>
    <div className="ip-title-block">
      <small>{track.act}</small>
      <h1>{track.title}</h1>
    </div>
    <SonicArtifactDeclaration track={track} />
    <ActKeysModule track={track} />
    <ActLogoVisualizer track={track} audioData={audioData} />
    <LyricsEngine track={track} audioData={audioData} />
    {children}
  </main>
);

const ImmersiveProtocol = () => {
  const { tracks, loading, error } = useReclamationTracks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
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
      return;
    }
    await connectAudioElement(audio);
    await audio.play();
    setIsPlaying(true);
  }, [connectAudioElement, currentTrack.audio_url, isPlaying]);

  const nextTrack = useCallback(() => selectTrack((currentIndex + 1) % tracks.length), [currentIndex, selectTrack, tracks.length]);
  const prevTrack = useCallback(() => selectTrack((currentIndex - 1 + tracks.length) % tracks.length), [currentIndex, selectTrack, tracks.length]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  if (loading) return <div className="ip-loading">Loading immersive protocol...</div>;

  return (
    <div className="ip-root">
      <audio ref={audioRef} crossOrigin="anonymous" onTimeUpdate={handleTimeUpdate} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} onEnded={nextTrack} />
      <TrackSelector tracks={tracks} currentIndex={currentIndex} onSelect={selectTrack} />
      <ProtocolShell track={currentTrack} audioData={audioData}>
        {error && <div className="ip-error">{error}</div>}
        {!currentTrack.audio_url && <div className="ip-error">No audio URL available for this track yet.</div>}
        <ProtocolPlayer track={currentTrack} isPlaying={isPlaying} onToggle={togglePlay} onNext={nextTrack} onPrev={prevTrack} progress={progress} duration={duration} currentTime={currentTime} onSeek={handleSeek} />
      </ProtocolShell>
    </div>
  );
};

export default ImmersiveProtocol;
