import React, { useMemo } from "react";
import { Pause, Play, SkipBack, SkipForward, Shuffle, Repeat, Database, Radio } from "lucide-react";

import "./VisualizerFrame.css";

const EMBLEM_SRC = "/emblem/reclamation_core_emblem.png";

export default function VisualizerFrame({ act_id, track, audioData, error, playback }) {
  const {
    audioRef,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    progress,
    duration,
    currentTime,
    tracks = [],
    currentIndex = 0,
    selectTrack,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
  } = playback || {};

  const title = track?.title || track?.name || "Signal Awaiting Track";
  const artist = track?.artist || "Musiq Matrix";
  const actLabel = track?.act || track?.album || track?.act_title || "Reclamation: Act Three";
  const progressPercent = Math.max(0, Math.min(100, Number(progress) || 0));
  const bpm = track?.bpm || track?.tempo || 128;
  const songKey = track?.key || track?.track_key || "C# Minor";
  const intensity = Math.max(1, Math.min(100, Number(track?.intensity || track?.energy_score || 78)));
  const sonicArtifactId = track?.sonic_artifact_id || track?.signature || track?.id || "CKP-ACT3-SIGNAL";

  const spectrumBars = useMemo(() => {
    return Array.from({ length: 96 }, (_, index) => {
      const liveValue = Array.isArray(audioData) ? Number(audioData[index % audioData.length]) / 255 : 0;
      const idleValue = (24 + ((index * 37) % 64)) / 100;
      const value = isPlaying ? Math.max(0.18, liveValue || idleValue) : idleValue;
      return `${Math.round(value * 100)}%`;
    });
  }, [audioData, isPlaying]);

  const waveformBars = useMemo(() => {
    return Array.from({ length: 72 }, (_, index) => {
      const liveValue = Array.isArray(audioData) ? Number(audioData[(index * 3) % audioData.length]) / 255 : 0;
      const idleValue = (18 + ((index * 19) % 62)) / 100;
      const value = isPlaying ? Math.max(0.12, liveValue || idleValue) : idleValue;
      return `${Math.round(value * 100)}%`;
    });
  }, [audioData, isPlaying]);

  const visibleLyrics = useMemo(() => {
    const lines = Array.isArray(track?.lyric_lines) ? track.lyric_lines : [];
    if (!lines.length) {
      return [
        { id: "fallback-1", text: "I'M BREAKING THE CODE", active: true },
        { id: "fallback-2", text: "I'M REWRITING THE SYSTEM" },
        { id: "fallback-3", text: "THE KEYS IN MY HANDS" },
        { id: "fallback-4", text: "I'M TAKING BACK WHAT'S MINE" },
        { id: "fallback-5", text: "NO FIREWALL CAN HOLD ME" },
      ];
    }

    const activeIndex = lines.reduce((active, line, index) => {
      if (Number.isFinite(line.time) && Number(currentTime) >= line.time) return index;
      return active;
    }, 0);
    const start = Math.max(0, activeIndex - 1);
    return lines.slice(start, start + 6).map((line, index) => ({
      ...line,
      active: start + index === activeIndex,
    }));
  }, [track?.lyric_lines, currentTime]);

  const carouselTracks = useMemo(() => {
    const source = tracks.length ? tracks : [track].filter(Boolean);
    if (!source.length) return [];
    const windowSize = Math.min(7, source.length);
    const half = Math.floor(windowSize / 2);

    return Array.from({ length: windowSize }, (_, slot) => {
      const offset = slot - half;
      const index = (currentIndex + offset + source.length) % source.length;
      return {
        ...source[index],
        index,
        offset,
        distance: Math.abs(offset),
        isActive: offset === 0,
      };
    });
  }, [tracks, track, currentIndex]);

  if (error && !track) {
    return (
      <div className="vf-shell vf-shell--error">
        <div className="vf-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="vf-shell">
      <audio
        ref={audioRef}
        src={track?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="vf-noise" aria-hidden="true" />
      <section className="vf-mainframe" aria-label="CKP Visualizer Core">
        <header className="vf-header">
          <div className="vf-brand"><strong>CKP</strong><span>Reclamation Mainframe</span></div>
          <div className="vf-title">The Chroma Key Protocol</div>
          <div className="vf-status"><span>System Status</span><strong>Authorized</strong><i /></div>
        </header>

        <aside className="vf-panel vf-audio-feed">
          <PanelTitle eyebrow="Live Signal Analysis" title="Audio Feed" />
          <Metric label="RMS" value="-8.2 dB" level={72} />
          <Metric label="Peak" value="-1.1 dB" level={84} />
          <Metric label="Dynamic Range" value="11.6 dB" level={61} />
          <div className="vf-mini-spectrum" aria-hidden="true">
            {waveformBars.slice(0, 40).map((height, index) => <span key={index} style={{ "--bar": height }} />)}
          </div>
          <Metric label="Bass Energy" value="87%" level={87} />
          <Metric label="Low Mids" value="63%" level={63} />
          <Metric label="High Mids" value="58%" level={58} />
          <Metric label="Treble" value="71%" level={71} />
          <div className="vf-signal-quality"><span>Signal Quality</span><strong>96%</strong></div>
        </aside>

        <main className="vf-core-zone">
          <div className="vf-reactor" style={{ "--intensity": intensity / 100 }}>
            <div className="vf-radial-grid" aria-hidden="true" />
            <div className="vf-radial-spectrum" aria-hidden="true">
              {spectrumBars.map((height, index) => (
                <span key={index} style={{ "--bar": height, "--angle": `${index * 3.75}deg` }} />
              ))}
            </div>
            <div className="vf-horizontal-wave" aria-hidden="true">
              {waveformBars.map((height, index) => <span key={index} style={{ "--bar": height }} />)}
            </div>
            <img className="vf-emblem" src={EMBLEM_SRC} alt="" />
          </div>

          <div className="vf-artifact-card">
            <span>Sonic Artifact</span>
            <h1>{title}</h1>
            <p>{artist} // {actLabel}</p>
            <div className="vf-artifact-wave" aria-hidden="true">
              {waveformBars.slice(0, 44).map((height, index) => <i key={index} style={{ "--bar": height }} />)}
            </div>
            <div className="vf-progress" onClick={handleSeek} role="button" tabIndex={0} onKeyDown={() => {}} aria-label="Seek track">
              <i style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="vf-time"><span>{formatTime(currentTime)}</span><span>{formatTime(duration || track?.duration_seconds)}</span></div>
          </div>
        </main>

        <aside className="vf-right-stack">
          <section className="vf-panel vf-sync-core">
            <PanelTitle eyebrow="Real Time Analysis" title="Sync Core" />
            <StatusRow label="Vocal Detection" value="Active" />
            <StatusRow label="Beat Lock" value="Locked" />
            <StatusRow label="BPM" value={bpm} />
            <StatusRow label="Key" value={songKey} />
            <StatusRow label="Chorus Detected" value="Yes" />
            <StatusRow label="Sync Accuracy" value="97%" />
            <div className="vf-intensity"><span>Intensity Monitor</span><strong>{intensity}%</strong></div>
          </section>

          <section className="vf-panel vf-lyrics-feed">
            <PanelTitle eyebrow="Live Lyrical Protocol" title="Lyrics Feed" />
            <div className="vf-lyrics-list">
              {visibleLyrics.map((line, index) => (
                <p key={line.id || index} className={line.active ? "is-active" : ""}>{highlightKeywords(line.text)}</p>
              ))}
            </div>
            <div className="vf-lyric-meter"><span>Lyrical Intensity</span><i style={{ width: `${intensity}%` }} /></div>
          </section>
        </aside>

        <section className="vf-track-info">
          <div className="vf-artifact-sigil"><img src={EMBLEM_SRC} alt="" /></div>
          <div><span>Current Track</span><strong>{title}</strong><small>{sonicArtifactId}</small></div>
        </section>

        <section className="vf-jukebox" aria-label="Reclamation Jukebox">
          <button type="button" onClick={prevTrack} aria-label="Previous track" className="vf-juke-arrow"><SkipBack size={22} /></button>
          <div className="vf-card-rail">
            {carouselTracks.map((item) => (
              <button
                type="button"
                key={`${item.id || item.title}-${item.index}`}
                className={`vf-track-card ${item.isActive ? "is-active" : ""}`}
                style={{ "--offset": item.offset, "--distance": item.distance }}
                onClick={() => selectTrack?.(item.index, { autoplay: isPlaying })}
              >
                <span>{String(item.sort_order || item.track_order || item.index + 1).padStart(2, "0")}</span>
                <strong>{item.title || item.name || "Untitled Signal"}</strong>
                <small>{item.duration || formatTime(item.duration_seconds)}</small>
              </button>
            ))}
          </div>
          <button type="button" onClick={nextTrack} aria-label="Next track" className="vf-juke-arrow"><SkipForward size={22} /></button>
        </section>

        <nav className="vf-controls" aria-label="Playback controls">
          <button type="button" aria-label="Shuffle"><Shuffle size={18} /></button>
          <button type="button" onClick={prevTrack} aria-label="Previous track"><SkipBack size={20} fill="currentColor" /></button>
          <button type="button" className="vf-controls__main" onClick={togglePlay} disabled={!track?.src} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>
          <button type="button" onClick={nextTrack} aria-label="Next track"><SkipForward size={20} fill="currentColor" /></button>
          <button type="button" aria-label="Repeat"><Repeat size={18} /></button>
        </nav>

        <footer className="vf-bottom-rail">
          <span><Database size={14} /> Supabase Connected</span>
          <span><Radio size={14} /> R2 Live</span>
          <span>Visualizer Core</span>
          <span>CKP Encrypted</span>
          <span>{formatTime(currentTime)} / {formatTime(duration || track?.duration_seconds)}</span>
        </footer>
      </section>
    </div>
  );
}

function PanelTitle({ eyebrow, title }) {
  return <div className="vf-panel-title"><span>{eyebrow}</span><h2>{title}</h2></div>;
}

function Metric({ label, value, level }) {
  return (
    <div className="vf-metric">
      <span>{label}</span>
      <i><b style={{ width: `${Math.max(0, Math.min(100, Number(level) || 0))}%` }} /></i>
      <strong>{value}</strong>
    </div>
  );
}

function StatusRow({ label, value }) {
  return <div className="vf-status-row"><span>{label}</span><strong>{value}</strong></div>;
}

function highlightKeywords(text = "") {
  const keywords = ["CODE", "SYSTEM", "KEYS", "MINE", "FIREWALL", "GATE", "BURN", "RECLAMATION"];
  const pattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  const parts = String(text).split(pattern);
  return parts.map((part, index) => keywords.includes(part.toUpperCase()) ? <mark key={index}>{part}</mark> : part);
}

function formatTime(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const remainingSeconds = Math.floor(value % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
