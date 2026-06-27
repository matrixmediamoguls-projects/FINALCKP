import { useEffect, useMemo, useState } from "react";

import useAudioAnalyzer from "../../hooks/useAudioAnalyzer";
import useReclamationTracks, { DEFAULT_VISUALIZER_VIEWPORT_IMAGE } from "../../modules/ImmersiveProtocol/useReclamationTracks";
import { useAudio } from "../../context/audioprovider";
import "../../styles/reclamation-command-center.css";

const FALLBACK_LYRICS = [
  "I'm breaking the code",
  "I'm rewriting the system",
  "The keys in my hands",
  "I'm taking back what's mine",
  "No firewall can hold me",
  "No gate can keep me out",
  "I'm the glitch in their plan",
  "Watch the whole thing burn",
];

const KEYWORDS = ["POWER", "RECLAMATION", "SOVEREIGN", "FIRE", "FREEDOM"];
const TIMELINE_SEGMENTS = ["INTRO", "VERSE 1", "PRE", "HOOK", "VERSE 2", "HOOK", "BRIDGE", "FINAL"];

function fmt(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const m = Math.floor(value / 60);
  const s = Math.floor(value % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getTrackDuration(track, audioDuration, isCurrentTrack) {
  if (isCurrentTrack && Number(audioDuration) > 0) return Number(audioDuration);
  return Number(track?.duration_seconds ?? track?.duration_in_seconds ?? 0) || 0;
}

function buildTimedLyrics(track, duration) {
  const parsed = Array.isArray(track?.lyric_lines)
    ? track.lyric_lines.filter((line) => line?.text)
    : [];

  if (parsed.length) {
    const hasTiming = parsed.some((line) => Number.isFinite(Number(line.time)));
    const step = duration && parsed.length ? duration / parsed.length : 8;
    return parsed.map((line, index) => ({
      id: line.id || `${track?.id || track?.track_id || "track"}-line-${index}`,
      text: line.text,
      time: hasTiming && Number.isFinite(Number(line.time)) ? Number(line.time) : index * step,
    }));
  }

  const source = track?.lyrics || track?.lyrics_text || track?.display_text;
  const lines = source
    ? source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : FALLBACK_LYRICS;
  const step = duration && lines.length ? duration / lines.length : 8;

  return lines.map((line, index) => ({
    id: `${track?.id || track?.track_id || "track"}-line-${index}`,
    text: line,
    time: index * step,
  }));
}

function getActiveLyricIndex(lyricLines, currentTime) {
  if (!lyricLines.length) return -1;
  let index = 0;
  lyricLines.forEach((line, i) => {
    if (currentTime >= Number(line.time || 0)) index = i;
  });
  return index;
}

function getViewportImage(track) {
  return (
    track?.viewport_image_url ||
    track?.visual_media_fallback_image ||
    track?.background_image_url ||
    track?.act_background_image ||
    DEFAULT_VISUALIZER_VIEWPORT_IMAGE
  );
}

function getVisibleTracks(tracks, activeTrackIndex) {
  if (!tracks.length) return [];
  const windowSize = Math.min(7, tracks.length);
  const half = Math.floor(windowSize / 2);
  const visible = [];

  for (let offset = -half; visible.length < windowSize; offset += 1) {
    const index = (activeTrackIndex + offset + tracks.length) % tracks.length;
    if (!visible.some((item) => item.index === index)) visible.push({ track: tracks[index], index, offset });
    if (tracks.length <= visible.length) break;
  }

  return visible.sort((a, b) => a.offset - b.offset);
}

function clampPercent(value, fallback = 78) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function ReactorBars({ intensity, bass, mid, treble }) {
  const bars = Array.from({ length: 128 }, (_, index) => {
    const band = index % 4 === 0 ? bass : index % 4 === 1 ? mid : index % 4 === 2 ? treble : intensity;
    const height = 12 + ((band + (index * 7) % 31) % 100) * 0.34;
    return <i key={index} style={{ "--bar-index": index, "--bar-height": `${height}px` }} />;
  });

  return <div className="pva-reactor-bars" aria-hidden="true">{bars}</div>;
}

function WaveformStrip() {
  return (
    <span className="pva-wave-strip" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => <i key={index} style={{ "--wave-index": index }} />)}
    </span>
  );
}

function MiniSparkline() {
  return (
    <div className="pva-sparkline" aria-hidden="true">
      {Array.from({ length: 34 }, (_, index) => <i key={index} style={{ "--spark-index": index }} />)}
    </div>
  );
}

export default function ReclamationCodex() {
  const { tracks, loading, error } = useReclamationTracks();
  const audio = useAudio();
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  useEffect(() => {
    if (activeTrackIndex >= tracks.length) setActiveTrackIndex(0);
  }, [activeTrackIndex, tracks.length]);

  const activeTrack = tracks[activeTrackIndex] ?? null;
  const currentAudioTrack = audio?.currentTrack;
  const isCurrentTrack = currentAudioTrack?.id === activeTrack?.id || currentAudioTrack?.track_id === activeTrack?.track_id;
  const isPlaying = Boolean(isCurrentTrack && audio?.isPlaying);
  const duration = getTrackDuration(activeTrack, audio?.duration, isCurrentTrack);
  const currentTime = isCurrentTrack && Number(audio?.currentTime) ? Number(audio.currentTime) : 0;
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 37;

  const analysis = useAudioAnalyzer(audio?.audioElement, isPlaying);
  const intensity = clampPercent((isPlaying ? analysis.intensity : 0.78) * 100, activeTrack?.intensity || 78);
  const bass = clampPercent((isPlaying ? analysis.bass : 0.82) * 100, 82);
  const mid = clampPercent((isPlaying ? analysis.mid : 0.64) * 100, 64);
  const treble = clampPercent((isPlaying ? analysis.treble : 0.71) * 100, 71);
  const viewportImage = getViewportImage(activeTrack);

  const lyricLines = useMemo(() => buildTimedLyrics(activeTrack, duration), [activeTrack, duration]);
  const activeLyricIndex = useMemo(() => getActiveLyricIndex(lyricLines, currentTime), [lyricLines, currentTime]);
  const lyricWindow = useMemo(() => {
    if (!lyricLines.length) return [];
    const start = Math.max(0, activeLyricIndex - 1);
    const end = Math.min(lyricLines.length, start + 8);
    return lyricLines.slice(Math.max(0, end - 8), end);
  }, [activeLyricIndex, lyricLines]);

  const playTrack = (track, index) => {
    setActiveTrackIndex(index);
    audio?.playTrack?.(track, index, tracks);
  };

  const togglePlayback = () => {
    if (!activeTrack) return;
    if (isCurrentTrack) {
      audio?.togglePlayback?.();
      return;
    }
    playTrack(activeTrack, activeTrackIndex);
  };

  const prevTrack = () => {
    if (!tracks.length) return;
    const index = activeTrackIndex === 0 ? tracks.length - 1 : activeTrackIndex - 1;
    playTrack(tracks[index], index);
  };

  const nextTrack = () => {
    if (!tracks.length) return;
    const index = (activeTrackIndex + 1) % tracks.length;
    playTrack(tracks[index], index);
  };

  const seek = (event) => {
    if (!isCurrentTrack || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audio?.seek?.(ratio * duration);
  };

  const visibleTracks = getVisibleTracks(tracks, activeTrackIndex);
  const activeTimelineIndex = Math.min(TIMELINE_SEGMENTS.length - 1, Math.floor((progress / 100) * TIMELINE_SEGMENTS.length));

  return (
    <main
      className="pva-root pva-reference-root"
      style={{
        "--intensity": intensity / 100,
        "--bass": bass / 100,
        "--mid": mid / 100,
        "--treble": treble / 100,
        "--progress": `${progress}%`,
      }}
    >
      <header className="pva-topbar">
        <div className="pva-brand-lockup">
          <strong>CKP</strong>
          <span><b>CKP //</b> RECLAMATION MAINFRAME</span>
          <em>SOVEREIGN MODE</em>
        </div>
        <div className="pva-protocol-title"><span>✦</span><b>THE CHROMA KEY PROTOCOL</b><span>✦</span></div>
        <div className="pva-system-authorized">
          <span>SYSTEM STATUS<br /><b>AUTHORIZED</b></span>
          <i />
          <strong>V4.7.2</strong>
          <b className="pva-glyph">♜</b>
        </div>
      </header>

      <section className="pva-reference-main">
        <aside className="pva-panel pva-lyrics-feed">
          <div className="pva-panel-heading">
            <h2>LYRICS FEED</h2>
            <p>LIVE LYRICAL PROTOCOL</p>
          </div>
          <div className="pva-lyric-stack">
            {(lyricWindow.length ? lyricWindow : FALLBACK_LYRICS.map((text, index) => ({ id: `fallback-${index}`, text }))).map((line) => {
              const active = line.id === lyricLines[activeLyricIndex]?.id || (!lyricLines.length && line.id === 'fallback-0');
              return (
                <p key={line.id} className={active ? 'is-active' : ''}>
                  {active && <span className="pva-active-lyric-sigil">✣</span>}
                  {line.text}
                </p>
              );
            })}
            <div className="pva-lyric-rail" aria-hidden="true" />
          </div>
          <div className="pva-keyword-box">
            <h3>KEYWORD HIGHLIGHT</h3>
            {KEYWORDS.map((keyword, index) => (
              <p key={keyword}>
                <span>{keyword}</span>
                <i style={{ width: `${52 + ((intensity + index * 9) % 38)}%` }} />
              </p>
            ))}
          </div>
        </aside>

        <section
          className="pva-center pva-center--reference-match"
          style={{ "--pva-viewport-image": `url("${viewportImage}")` }}
          aria-label={activeTrack?.viewport_alt_text || "Chroma Key Protocol visualizer viewport"}
        >
          <div className="pva-hud-ring pva-hud-ring--outer" aria-hidden="true" />
          <div className="pva-hud-ring pva-hud-ring--inner" aria-hidden="true" />
          <ReactorBars intensity={intensity} bass={bass} mid={mid} treble={treble} />
          <div className="pva-crosshair pva-crosshair--horizontal" aria-hidden="true" />
          <div className="pva-crosshair pva-crosshair--vertical" aria-hidden="true" />
          <div className="pva-center-chip pva-center-chip--bpm"><span>BPM</span><b>{activeTrack?.bpm || 128}</b></div>
          <div className="pva-center-chip pva-center-chip--key"><span>KEY</span><b>{activeTrack?.key_signature || "C# MINOR"}</b></div>
          <div className="pva-reactive-emblem" aria-hidden="true">
            <span className="pva-emblem-flame" />
            <span className="pva-emblem-diamond" />
          </div>
          <div className="pva-now-playing">NOW PLAYING</div>
          <div className="pva-viewport-track-title">{activeTrack?.title || "RECLAMATION"}</div>
        </section>

        <aside className="pva-panel pva-sync-core">
          <div className="pva-panel-heading">
            <h2>SYNC CORE</h2>
            <p>REAL TIME PROTOCOL</p>
          </div>
          <div className="pva-sync-list">
            {[
              ["VOCAL DETECTION", "ACTIVE"],
              ["BEAT LOCK", isPlaying ? "LOCKED" : "ARMED"],
              ["BPM", activeTrack?.bpm || 128],
              ["KEY", activeTrack?.key_signature || "C# MINOR"],
              ["CHORUS DETECTED", progress > 30 && progress < 70 ? "YES" : "SCAN"],
              ["INTENSITY STATE", intensity > 80 ? "ASCENDING" : "CHARGING"],
              ["SYNC ACCURACY", `${Math.max(91, Math.min(99, Math.round(90 + intensity / 9)))}%`],
            ].map(([label, value]) => (
              <p key={label}><span>{label}</span><b>{value}</b></p>
            ))}
          </div>
          <div className="pva-intensity-monitor">
            <h3>INTENSITY MONITOR</h3>
            <MiniSparkline />
            <strong>{intensity}%<span>CURRENT</span></strong>
          </div>
          <div className="pva-frequency-core">
            <h3>FREQUENCY CORE</h3>
            <div className="pva-radar" aria-hidden="true"><i /></div>
            {[
              ["SUB BASS", bass],
              ["BASS", Math.round((bass + intensity) / 2)],
              ["MIDS", mid],
              ["HIGHS", treble],
            ].map(([label, value]) => (
              <p key={label}><span>{label}</span><i style={{ width: `${value}%` }} /><b>{value}%</b></p>
            ))}
          </div>
        </aside>
      </section>

      <section className="pva-bottom-dock">
        <button className="pva-carousel-arrow" type="button" onClick={prevTrack} aria-label="Previous track">‹</button>
        <div className="pva-track-carousel">
          {loading && <div className="pva-loading-card">SUPABASE SIGNAL SYNCING</div>}
          {visibleTracks.map(({ track, index, offset }) => (
            <button
              type="button"
              key={track?.id || track?.track_id || index}
              className={`pva-carousel-card ${index === activeTrackIndex ? 'is-active' : ''}`}
              style={{ "--offset": offset }}
              onClick={() => playTrack(track, index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{track?.title || track?.name || 'RECLAMATION SIGNAL'}</strong>
              <em>{track?.duration || fmt(track?.duration_seconds) || '03:47'}</em>
              <WaveformStrip />
            </button>
          ))}
        </div>
        <button className="pva-carousel-arrow" type="button" onClick={nextTrack} aria-label="Next track">›</button>
      </section>

      <footer className="pva-protocol-footer">
        <div className="pva-protocol-timeline" onClick={seek} role="button" tabIndex={0} aria-label="Protocol timeline">
          <span className="pva-timeline-label">PROTOCOL TIMELINE</span>
          <i className="pva-timeline-line"><b /></i>
          {TIMELINE_SEGMENTS.map((segment, index) => (
            <span key={`${segment}-${index}`} className={index === activeTimelineIndex ? 'is-active' : ''}>{segment}</span>
          ))}
        </div>
        <div className="pva-status-strip">
          <span>DATABASE <b className="is-green">●</b> SUPABASE CONNECTED</span>
          <span>NODE <b>●</b> {isPlaying ? 'R2 LIVE' : 'LOCAL LIVE'}</span>
          <span>SECTOR 7 - EXTERIOR FEED</span>
          <span>PROTOCOL <b>●</b> CKP ENCRYPTED</span>
          <span>{fmt(currentTime)} / {fmt(duration)}</span>
        </div>
        {error && <p className="pva-signal-error">SUPABASE SIGNAL INTERRUPTED: {error}</p>}
      </footer>

      <button className="pva-play-toggle" type="button" onClick={togglePlayback}>{isPlaying ? 'PAUSE PROTOCOL' : 'LAUNCH PROTOCOL'}</button>
    </main>
  );
}
