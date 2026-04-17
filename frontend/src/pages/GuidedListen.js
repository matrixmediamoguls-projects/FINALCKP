import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const actMeta = [
  { num: 1, roman: 'I', element: 'Earth', title: 'The Fractured Veil', color: 'var(--g3)', hex: '#5ab038', dim: 'var(--gdim)', bg: 'var(--gsurf)', surfGrad: 'linear-gradient(180deg,var(--gsurf),#070c05)', borderGrad: 'linear-gradient(90deg,var(--g3),var(--g4))', desc: 'Awareness. Recognition. Naming what was hidden beneath the surface.' },
  { num: 2, roman: 'II', element: 'Fire', title: 'Reclamation', color: 'var(--r3)', hex: '#d03010', dim: 'var(--rdim)', bg: 'var(--rsurf)', surfGrad: 'linear-gradient(180deg,var(--rsurf),#0b0402)', borderGrad: 'linear-gradient(90deg,var(--r2),var(--r3))', desc: 'Reclamation. Burning away what is not essential. Sovereignty.' },
  { num: 3, roman: 'III', element: 'Water', title: 'The Reflection Chamber', color: 'var(--b3)', hex: '#50a0e0', dim: 'var(--bdim)', bg: 'var(--bsurf)', surfGrad: 'linear-gradient(180deg,var(--bsurf),#050810)', borderGrad: 'linear-gradient(90deg,var(--b2),var(--b3))', desc: 'Reflection. Shadow work. Looking clearly into the mirror of self.' },
  { num: 4, roman: 'IV', element: 'Air', title: 'The Crucible Code', color: 'var(--y3)', hex: '#c8a020', dim: 'var(--ydim)', bg: 'var(--ysurf)', surfGrad: 'linear-gradient(180deg,var(--ysurf),#080600)', borderGrad: 'linear-gradient(90deg,var(--y2),var(--y3))', desc: 'Integration. Equilibrium. Holding all of it with grace.' },
];

const shareBtnStyle = {
  fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.1em',
  padding: '3px 8px', border: '1px solid var(--border2)', background: 'transparent',
  color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s'
};

const ShareButtons = ({ track, act }) => {
  const text = `Listening to "${track.name}" from Balanced Elementals — Act ${act.roman} · ${act.element}`;
  const url = window.location.href;
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>Share</span>
      <button data-testid="share-twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420')} style={shareBtnStyle}>X</button>
      <button data-testid="share-facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=550,height=420')} style={shareBtnStyle}>FB</button>
      <button data-testid="share-copy" onClick={() => { navigator.clipboard.writeText(`${text}\n${url}`); alert('Copied to clipboard!'); }} style={shareBtnStyle}>&#x2398;</button>
    </div>
  );
};

/* ================================================================
   LANDING PAGE — 4 Immersion Protocol Cards
   ================================================================ */
const ImmersionLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trackCounts, setTrackCounts] = useState({});

  const fetchTrackCounts = useCallback(() => {
    axios.get('/tracks').then(res => {
      const counts = {};
      (res.data.tracks || []).filter(t => t.type === 'track').forEach(t => {
        counts[t.act] = (counts[t.act] || 0) + 1;
      });
      setTrackCounts(counts);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchTrackCounts();
  }, [fetchTrackCounts]);

  const isLocked = (act) => {
    if (user?.is_admin) return false;
    if (act.num === 1) return false;
    const tier = user?.tier || 'free';
    if (tier === 'full' || tier === 'license') return false;
    return true;
  };

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center', padding: '16px 0 28px' }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
          Musiq Matrix
        </div>
        <div data-testid="immersion-title" style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(18px,3vw,30px)', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--act)' }}>
          Balanced Elementals
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 4 }}>
          The Chroma Key Protocol
        </div>
        <div style={{ width: 60, height: 1, background: 'var(--border2)', margin: '16px auto 0' }} />
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(14px,2vw,20px)', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--white)', marginTop: 16 }}>
          The Immersion Protocol
        </div>
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 13, color: 'var(--muted)', marginTop: 6, maxWidth: 520, margin: '6px auto 0' }}>
          Select an Act to begin your sonic immersion. Each element carries its own frequency, mythology, and revelation.
        </div>
      </div>

      {/* 4 Act Cards */}
      <div data-testid="immersion-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, maxWidth: 1100, margin: '0 auto' }}>
        {actMeta.map(act => {
          const locked = isLocked(act);
          const count = trackCounts[act.num] || 0;
          return (
            <div
              key={act.num}
              data-testid={`immersion-card-${act.num}`}
              onClick={() => !locked && navigate(`/listen/${act.num}`)}
              style={{
                position: 'relative', overflow: 'hidden', cursor: locked ? 'not-allowed' : 'pointer',
                background: act.surfGrad, border: '1px solid var(--border)', padding: '24px 18px',
                opacity: locked ? 0.4 : 1, transition: 'all 0.25s', minHeight: 260,
                display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Top gradient line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: act.borderGrad }} />

              {/* Act label */}
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.4em', textTransform: 'uppercase', color: act.color, marginBottom: 12 }}>
                Act {act.roman} · {act.element}
              </div>

              {/* Glyph */}
              <div style={{ fontSize: 36, color: act.color, marginBottom: 12, lineHeight: 1, filter: `drop-shadow(0 0 12px ${act.hex}44)` }}>
                {act.num === 1 ? '\u2295' : act.num === 2 ? '\u224B' : act.num === 3 ? '\u25B3' : '\u2726'}
              </div>

              {/* Title */}
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 600, color: act.color, letterSpacing: '0.06em', marginBottom: 8 }}>
                {act.title}
              </div>

              {/* Description */}
              <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                {act.desc}
              </div>

              {/* Track count + CTA */}
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: 10 }}>
                {locked ? '' : `${count} tracks · Immersive experience`}
              </div>

              <button data-testid={`immersion-enter-${act.num}`} style={{
                width: '100%', fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em',
                textTransform: 'uppercase', padding: '8px 0',
                border: `1px solid ${locked ? 'var(--border)' : act.color}`,
                background: 'transparent', cursor: locked ? 'not-allowed' : 'pointer',
                color: locked ? 'var(--muted)' : act.color, transition: 'all 0.2s'
              }}>
                {locked ? (act.num === 4 ? 'Coming Soon' : 'Locked') : 'Enter Immersion \u2192'}
              </button>

              {/* Locked overlay */}
              {locked && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(6,6,4,0.55)', backdropFilter: 'blur(3px)'
                }}>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: act.color }}>
                    {act.num === 4 ? 'Coming Soon' : 'Unlock to Access'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================================================================
   ACT DETAIL — Sonic Visualizer + Track Player
   ================================================================ */
const ActImmersion = ({ actNumber }) => {
  const navigate = useNavigate();
  const act = actMeta.find(a => a.num === actNumber) || actMeta[0];

  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [contentTab, setContentTab] = useState('lore');
  const [visualBars, setVisualBars] = useState(Array(48).fill(10));
  const [showSpotify, setShowSpotify] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);

  const audioRef = useRef(null);
  const barsIntervalRef = useRef(null);
  const popupTimerRef = useRef(null);

  // Build the list of available content segments for the current track
  const getPopupSegments = useCallback((track) => {
    if (!track) return [];
    const segs = [];
    if (track.lore) segs.push({ type: 'lore', label: 'Backstory', icon: '\u2726', color: 'var(--y3)', text: track.lore });
    if (track.lightcodes) segs.push({ type: 'lightcodes', label: 'Lightcodes', icon: '\u25C7', color: 'var(--g3)', text: track.lightcodes });
    if (track.shadowcodes) segs.push({ type: 'shadowcodes', label: 'Shadowcodes', icon: '\u25B3', color: 'var(--r3)', text: track.shadowcodes });
    if (track.system_role) segs.push({ type: 'system', label: 'System Role', icon: '\u224B', color: 'var(--b3)', text: track.system_role });
    return segs;
  }, []);

  // Auto-cycle pop-ups when playing
  useEffect(() => {
    if (popupTimerRef.current) clearInterval(popupTimerRef.current);
    if (!isPlaying || !currentTrack) { setPopupVisible(false); return; }

    const segments = getPopupSegments(currentTrack);
    if (segments.length === 0) { setPopupVisible(false); return; }

    // Show first segment after a short delay
    setPopupIndex(0);
    const showDelay = setTimeout(() => setPopupVisible(true), 1500);

    // Cycle: 6s visible, 1.5s gap, next segment
    const VISIBLE_DURATION = 6000;
    const GAP_DURATION = 1500;
    const CYCLE = VISIBLE_DURATION + GAP_DURATION;

    popupTimerRef.current = setInterval(() => {
      setPopupVisible(false);
      setTimeout(() => {
        setPopupIndex(prev => (prev + 1) % segments.length);
        setPopupVisible(true);
      }, GAP_DURATION);
    }, CYCLE);

    return () => {
      clearTimeout(showDelay);
      if (popupTimerRef.current) clearInterval(popupTimerRef.current);
    };
  }, [isPlaying, currentTrack, getPopupSegments]);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tracks');
      const filtered = (res.data.tracks || []).filter(t => t.type === 'track' && t.act === actNumber).sort((a, b) => (a.name > b.name ? 1 : -1));
      setTracks(filtered);
      if (filtered.length > 0) { setCurrentTrack(filtered[0]); setCurrentIndex(0); }
      else { setCurrentTrack(null); }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [actNumber]);

  useEffect(() => {
    fetchTracks();
    return () => {
      if (barsIntervalRef.current) clearInterval(barsIntervalRef.current);
      if (popupTimerRef.current) clearInterval(popupTimerRef.current);
    };
  }, [fetchTracks]);

  const selectTrack = useCallback((track, index) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    setIsPlaying(false); setProgress(0); setCurrentTime(0); setDuration(0);
    setCurrentTrack(track); setCurrentIndex(index); setShowSpotify(false);
    setVisualBars(Array(48).fill(10));
    setPopupIndex(0); setPopupVisible(false);
    if (barsIntervalRef.current) clearInterval(barsIntervalRef.current);
    if (popupTimerRef.current) clearInterval(popupTimerRef.current);
  }, []);

  const nextTrack = () => { if (currentIndex < tracks.length - 1) selectTrack(tracks[currentIndex + 1], currentIndex + 1); };
  const prevTrack = () => { if (currentIndex > 0) selectTrack(tracks[currentIndex - 1], currentIndex - 1); };

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    if (!currentTrack.has_audio) { if (currentTrack.spotify_uri) setShowSpotify(true); return; }
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src || audio.src === window.location.href) { audio.src = `${API_URL}/api/audio/${currentTrack.track_id}`; audio.load(); }
    if (isPlaying) {
      audio.pause(); setIsPlaying(false);
      if (barsIntervalRef.current) clearInterval(barsIntervalRef.current);
    } else {
      audio.play().then(() => { setIsPlaying(true); startVisBars(); }).catch(e => console.error('Play error:', e));
    }
  }, [currentTrack, isPlaying]);

  const startVisBars = () => {
    if (barsIntervalRef.current) clearInterval(barsIntervalRef.current);
    barsIntervalRef.current = setInterval(() => { setVisualBars(prev => prev.map(() => 8 + Math.random() * 140)); }, 120);
  };

  const handleTimeUpdate = () => {
    const a = audioRef.current; if (!a) return;
    setCurrentTime(a.currentTime); setDuration(a.duration || 0);
    setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
  };

  const handleSeek = (e) => {
    const a = audioRef.current; if (!a || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (barsIntervalRef.current) clearInterval(barsIntervalRef.current);
    setVisualBars(Array(48).fill(10));
    if (currentIndex < tracks.length - 1) setTimeout(() => { selectTrack(tracks[currentIndex + 1], currentIndex + 1); }, 1500);
  };

  const fmtTime = (s) => { if (!s || isNaN(s)) return '0:00'; return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };

  const getSpotifyEmbed = (uri) => {
    if (!uri) return null;
    const m = uri.match(/spotify:track:(\w+)/) || uri.match(/open\.spotify\.com\/track\/(\w+)/);
    return m ? `https://open.spotify.com/embed/track/${m[1]}?utm_source=generator&theme=0` : null;
  };

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase' }}>Loading immersion...</div>
    </div>
  );

  const spotifyEmbed = currentTrack ? getSpotifyEmbed(currentTrack.spotify_uri) : null;

  return (
    <div data-testid="act-immersion" style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} crossOrigin="use-credentials" />

      {/* === Track Sidebar === */}
      <div style={{ width: 230, borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--surface)', flexShrink: 0 }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
          <button data-testid="back-to-immersion" onClick={() => navigate('/listen')} style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em', color: 'var(--muted)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 8, display: 'block'
          }}>
            &#x25C0; All Acts
          </button>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.4em', textTransform: 'uppercase', color: act.color, marginBottom: 4 }}>
            Act {act.roman} · {act.element}
          </div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 600, color: act.color, letterSpacing: '0.06em' }}>
            {act.title}
          </div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, color: 'var(--muted)', letterSpacing: '0.1em', marginTop: 2 }}>
            {tracks.length} tracks · Immersion Protocol
          </div>
        </div>

        {tracks.map((track, i) => {
          const active = currentIndex === i;
          return (
            <div key={track.track_id} onClick={() => selectTrack(track, i)} data-testid={`listen-track-${i}`}
              style={{ padding: '8px 14px', cursor: 'pointer', transition: 'all 0.15s', borderLeft: `2px solid ${active ? act.color : 'transparent'}`, background: active ? 'var(--panel)' : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: act.color, width: 16, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: active ? 'var(--white)' : 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.name}</span>
                {active && isPlaying && <span style={{ fontSize: 8, color: act.color, animation: 'pulse 1s ease-in-out infinite' }}>&#x25B6;</span>}
              </div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, color: 'var(--muted)', paddingLeft: 24, letterSpacing: '0.1em', display: 'flex', gap: 6 }}>
                {track.has_audio && <span style={{ color: 'var(--g2)' }}>&#x2713;</span>}
                {track.spotify_uri && <span style={{ color: '#1DB954' }}>&#x266B;</span>}
              </div>
            </div>
          );
        })}

        {tracks.length === 0 && (
          <div style={{ padding: '20px 14px', fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            No tracks for this Act yet. Add tracks in the Admin Panel.
          </div>
        )}
      </div>

      {/* === Main Visualizer === */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {currentTrack ? (
          <>
            {/* Header */}
            <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: act.color }}>
                  Track {String(currentIndex + 1).padStart(2, '0')} of {tracks.length} · Act {act.roman} · {act.element}
                </div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 600, color: 'var(--white)', letterSpacing: '0.06em', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentTrack.name}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                <ShareButtons track={currentTrack} act={act} />
                <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
                <button data-testid="prev-track-btn" onClick={prevTrack} disabled={currentIndex === 0} style={navBtnStyle(currentIndex === 0)}>&#x25C0; Prev</button>
                <button data-testid="next-track-btn" onClick={nextTrack} disabled={currentIndex >= tracks.length - 1} style={navBtnStyle(currentIndex >= tracks.length - 1)}>Next &#x25B6;</button>
              </div>
            </div>

            {/* Visualizer + Content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Visualizer */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center bottom, ${act.bg} 0%, var(--void) 70%)`, opacity: 0.7 }} />

                {/* Bars */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, padding: '0 24px', position: 'relative', zIndex: 1 }}>
                  {visualBars.map((h, i) => (
                    <div key={i} style={{
                      width: 5, borderRadius: '2px 2px 0 0', flexShrink: 0,
                      height: isPlaying ? h : 6 + Math.sin(i * 0.25) * 18,
                      background: `linear-gradient(180deg, ${act.hex}cc, ${act.hex}22)`,
                      opacity: isPlaying ? 0.6 + Math.random() * 0.4 : 0.12,
                      transition: isPlaying ? 'height 0.1s linear' : 'height 0.8s ease, opacity 0.5s ease'
                    }} />
                  ))}
                </div>

                {/* Player controls */}
                <div style={{ position: 'relative', zIndex: 2, padding: '16px 24px 12px', background: 'linear-gradient(transparent, rgba(6,6,4,0.9))' }}>
                  <div data-testid="progress-bar" onClick={handleSeek} style={{ height: 4, background: 'var(--border2)', cursor: 'pointer', marginBottom: 12, position: 'relative' }}>
                    <div style={{ height: '100%', background: act.color, width: `${progress}%`, transition: 'width 0.1s linear' }} />
                    <div style={{ position: 'absolute', top: -4, left: `${progress}%`, width: 12, height: 12, borderRadius: '50%', background: act.color, transform: 'translateX(-50%)', opacity: isPlaying || progress > 0 ? 1 : 0, transition: 'opacity 0.2s', boxShadow: `0 0 8px ${act.hex}66` }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div onClick={togglePlay} data-testid="play-btn" style={{
                      width: 52, height: 52, borderRadius: '50%', border: `2px solid ${act.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(6,6,4,0.8)', cursor: 'pointer',
                      boxShadow: isPlaying ? `0 0 24px ${act.hex}44` : 'none', transition: 'all 0.3s'
                    }}>
                      <span style={{ fontSize: 20, color: act.color, marginLeft: isPlaying ? 0 : 3 }}>{isPlaying ? '\u2759\u2759' : '\u25B6'}</span>
                    </div>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em' }}>{fmtTime(currentTime)} / {fmtTime(duration)}</div>
                    <div style={{ flex: 1 }} />

                    {spotifyEmbed && (
                      <button data-testid="spotify-toggle" onClick={() => setShowSpotify(!showSpotify)} style={{
                        fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.15em', padding: '6px 12px',
                        border: `1px solid ${showSpotify ? '#1DB954' : 'var(--border)'}`,
                        background: showSpotify ? 'rgba(29,185,84,0.1)' : 'transparent',
                        color: showSpotify ? '#1DB954' : 'var(--muted)', cursor: 'pointer', textTransform: 'uppercase'
                      }}>
                        {showSpotify ? '\u2713 Spotify' : '\u266B Open Spotify'}
                      </button>
                    )}
                    {!currentTrack.has_audio && !spotifyEmbed && (
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)', letterSpacing: '0.15em' }}>No audio uploaded</div>
                    )}
                  </div>

                  {showSpotify && spotifyEmbed && (
                    <div data-testid="spotify-embed" style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', animation: 'fadeUp 0.3s ease both' }}>
                      <iframe src={spotifyEmbed} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title={`Spotify: ${currentTrack.name}`} style={{ borderRadius: 8 }} />
                    </div>
                  )}
                </div>

                {/* Auto-cycling pop-up overlays (VH1 style) */}
                {(() => {
                  const segments = getPopupSegments(currentTrack);
                  if (!isPlaying || segments.length === 0 || !popupVisible) return null;
                  const seg = segments[popupIndex % segments.length];
                  const positions = [
                    { top: 16, left: 16, right: '40%', bottom: 'auto' },
                    { top: 16, left: '45%', right: 16, bottom: 'auto' },
                    { top: '35%', left: 16, right: '50%', bottom: 'auto' },
                    { top: '35%', left: '55%', right: 16, bottom: 'auto' },
                  ];
                  const pos = positions[popupIndex % positions.length];
                  return (
                    <div data-testid="auto-popup" key={`${seg.type}-${popupIndex}`} style={{
                      position: 'absolute', ...pos, zIndex: 3,
                      background: 'rgba(6,6,4,0.9)', border: `1px solid ${act.hex}33`,
                      padding: '14px 18px', backdropFilter: 'blur(14px)',
                      animation: 'popupCycle 6s ease both', pointerEvents: 'none',
                      maxHeight: '40%', overflow: 'hidden'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: seg.color }}>{seg.icon}</span>
                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: seg.color }}>
                          {seg.label}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(232,228,216,0.8)', lineHeight: 1.65 }}>
                        {seg.text.length > 280 ? seg.text.slice(0, 280) + '...' : seg.text}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Content Panel */}
              <div style={{ width: 280, borderLeft: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                  {[
                    { id: 'lore', label: 'Backstory', color: 'var(--y3)' },
                    { id: 'light', label: 'Lightcodes', color: 'var(--g3)' },
                    { id: 'shadow', label: 'Shadowcodes', color: 'var(--r3)' },
                    { id: 'system', label: 'System', color: 'var(--b3)' },
                  ].map(tab => (
                    <button key={tab.id} data-testid={`content-tab-${tab.id}`} onClick={() => setContentTab(tab.id)}
                      style={{ flex: 1, padding: '8px 4px', fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', background: contentTab === tab.id ? 'var(--panel)' : 'transparent', border: 'none', borderBottom: `2px solid ${contentTab === tab.id ? tab.color : 'transparent'}`, color: contentTab === tab.id ? tab.color : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div style={{ flex: 1, padding: '14px 16px' }}>
                  {contentTab === 'lore' && <ContentSection icon="&#x2726;" title="Backstory" color="var(--y3)" content={currentTrack.lore} empty="No backstory yet. Admin can add lore in the Admin Panel." />}
                  {contentTab === 'light' && <ContentSection icon="&#x25C7;" title="Lightcodes" color="var(--g3)" content={currentTrack.lightcodes} empty="No lightcodes yet. Admin can add lightcodes in the Admin Panel." />}
                  {contentTab === 'shadow' && <ContentSection icon="&#x25B3;" title="Shadowcodes" color="var(--r3)" content={currentTrack.shadowcodes} empty="No shadowcodes yet. Admin can add shadowcodes in the Admin Panel." />}
                  {contentTab === 'system' && <ContentSection icon="&#x224B;" title="System Role" color="var(--b3)" content={currentTrack.system_role} empty="How this track contributes to the protocol. Admin can add this in the Admin Panel." />}
                </div>
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, color: 'var(--muted)', letterSpacing: '0.1em', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {currentTrack.has_audio && <span style={{ color: 'var(--g3)' }}>&#x2713; Audio</span>}
                    {currentTrack.spotify_uri && <span style={{ color: '#1DB954' }}>&#x266B; Spotify</span>}
                    {currentTrack.lore && <span>&#x2726; Lore</span>}
                    {currentTrack.lightcodes && <span style={{ color: 'var(--g3)' }}>&#x25C7; Light</span>}
                    {currentTrack.shadowcodes && <span style={{ color: 'var(--r3)' }}>&#x25B3; Shadow</span>}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 36, color: 'var(--muted)', opacity: 0.3 }}>&#x266B;</div>
            <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 14, color: 'var(--muted)' }}>No tracks for this Act yet. Add tracks in the Admin Panel.</div>
            <button onClick={() => navigate('/listen')} style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em', padding: '6px 16px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', textTransform: 'uppercase', marginTop: 8 }}>&#x25C0; Back to All Acts</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentSection = ({ icon, title, color, content, empty }) => (
  <div>
    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.25em', textTransform: 'uppercase', color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
      <span dangerouslySetInnerHTML={{ __html: icon }} /> {title}
    </div>
    {content ? (
      <div style={{ fontSize: 13, color: 'rgba(232,228,216,0.7)', lineHeight: 1.7 }}>
        {content.split('\n').map((p, i) => <p key={i} style={{ marginBottom: 8 }}>{p}</p>)}
      </div>
    ) : (
      <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{empty}</div>
    )}
  </div>
);

const navBtnStyle = (disabled) => ({
  fontFamily: "'Share Tech Mono',monospace", fontSize: 9, padding: '5px 10px',
  border: '1px solid var(--border)', background: 'transparent',
  color: disabled ? 'var(--border)' : 'var(--muted)', cursor: disabled ? 'not-allowed' : 'pointer'
});

/* ================================================================
   ROUTER — Landing vs Act Detail
   ================================================================ */
const GuidedListen = () => {
  const { actNumber } = useParams();
  if (actNumber) return <ActImmersion actNumber={parseInt(actNumber, 10)} />;
  return <ImmersionLanding />;
};

export default GuidedListen;
