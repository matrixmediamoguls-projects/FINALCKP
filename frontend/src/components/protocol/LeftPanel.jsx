import React from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

const fallbackTracklist = [
  { id: 'system-override', title: 'SYSTEM OVERRIDE', duration: 227 },
  { id: 'digital-ghost', title: 'DIGITAL GHOST', duration: 201 },
  { id: 'break-the-code', title: 'BREAK THE CODE', duration: 248 },
  { id: 'wasteland', title: 'WASTELAND', duration: 236 },
  { id: 'blackout-protocol', title: 'BLACKOUT PROTOCOL', duration: 268 },
  { id: 'no-gatekeepers', title: 'NO GATEKEEPERS', duration: 219 },
  { id: 'glitch-in-the-plan', title: 'GLITCH IN THE PLAN', duration: 251 },
  { id: 'rewrite-reality', title: 'REWRITE REALITY', duration: 238 },
  { id: 'data-rebellion', title: 'DATA REBELLION', duration: 284 },
  { id: 'reclamation', title: 'RECLAMATION', duration: 302 },
];

function formatDur(sec) {
  if (!sec || !Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function NowPlayingWave({ active, audioData }) {
  return (
    <div className="lp-wave" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, i) => {
        const sample = audioData?.frequencyData?.[i * 6] ?? 0;
        const level = active && sample ? sample / 255 : 0;

        return (
          <span
            key={i}
            className={`lp-wave-bar${active ? ' lp-wave-bar--on' : ''}`}
            style={{ '--i': i, '--lvl': level }}
          />
        );
      })}
    </div>
  );
}

export default function LeftPanel({
  act,
  track,
  tracks = [],
  currentIndex = 0,
  selectTrack,
  isPlaying,
  togglePlay,
  nextTrack,
  prevTrack,
  audioData,
}) {
  const cover = track?.album_art || track?.artwork_url || track?.act_logo_asset || act?.emblem || '';
  const actLabel = act?.label || 'ACT THREE';
  const hasSupabaseTracks = tracks.length > 0;
  const displayTracks = hasSupabaseTracks ? tracks : fallbackTracklist;
  const activeIndex = hasSupabaseTracks ? currentIndex : 2;

  return (
    <aside className="lp-root">
      <div className="lp-act-header">
        <span className="lp-act-chevrons">{"<<<"}</span>
        <span className="lp-act-name">{actLabel}</span>
        <span className="lp-act-chevrons">{">>>"}</span>
      </div>

      <div className="lp-album-wrap">
        {cover && <img src={cover} alt="" className="lp-album-art" />}
        <div className="lp-album-title">
          <strong>RECLAMATION</strong>
          <span>CHROMA KEY ACT THREE</span>
        </div>
        <div className="lp-gate-badge">
          <div className="lp-gate-icon">LOCK</div>
          <div className="lp-gate-text">GATEKEEPER<br />PROTOCOL</div>
          <div className="lp-gate-denied">X ACCESS DENIED</div>
        </div>
      </div>

      <div className="lp-tracklist-head">
        <span>TRACKLIST</span>
        <span className="lp-tl-icon">+</span>
      </div>

      <div className="lp-tracklist">
        {displayTracks.map((t, i) => (
          <button
            key={t?.id ?? i}
            type="button"
            className={`lp-track${i === activeIndex ? ' lp-track--active' : ''}`}
            onClick={() => hasSupabaseTracks && selectTrack?.(i)}
          >
            {i === activeIndex
              ? <span className="lp-track-play">PLAY</span>
              : <span className="lp-track-num">{String(i + 1).padStart(2, '0')}</span>}
            <span className="lp-track-title">{t?.title || `TRACK ${i + 1}`}</span>
            <span className="lp-track-dur">{formatDur(t?.duration)}</span>
          </button>
        ))}
      </div>

      <div className="lp-now-playing">
        <span className="lp-np-label">NOW PLAYING</span>
        <NowPlayingWave active={isPlaying} audioData={audioData} />
      </div>

      <div className="lp-controls">
        <button type="button" className="lp-ctrl" onClick={prevTrack} aria-label="Previous">
          <SkipBack size={18} strokeWidth={1.8} />
        </button>
        <button type="button" className="lp-ctrl lp-ctrl--play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={22} strokeWidth={1.8} /> : <Play size={22} strokeWidth={1.8} />}
        </button>
        <button type="button" className="lp-ctrl" onClick={nextTrack} aria-label="Next">
          <SkipForward size={18} strokeWidth={1.8} />
        </button>
      </div>

      <div className="lp-volume">
        <span>VOLUME</span>
        <div className="lp-vol-track">
          <div className="lp-vol-fill" style={{ width: '78%' }} />
          <div className="lp-vol-thumb" style={{ left: '78%' }} />
        </div>
        <span>78%</span>
      </div>
    </aside>
  );
}
