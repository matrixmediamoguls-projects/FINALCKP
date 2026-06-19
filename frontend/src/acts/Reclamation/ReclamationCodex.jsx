import { useEffect, useMemo, useState } from "react";

import useAudioAnalyzer from "../../hooks/useAudioAnalyzer";
import useReclamationTracks from "../../modules/ImmersiveProtocol/useReclamationTracks";
import { useAudio } from "../../context/audioprovider";
import "../../styles/reclamation-command-center.css";

import ProtocolHeader from "../../components/layout/ProtocolHeader";
import VisualizerCorePanel from "../../components/visualizer/VisualizerCorePanel";
import AudioAnalysisPanel from "../../components/analysis/AudioAnalysisPanel";
import SystemStatusBar from "../../components/layout/SystemStatusBar";
import CascadingVideoProjector from "../../components/media/CascadingVideoProjector";

const fallbackLyrics = [
  "This is where the spirit is set free.",
  "Welcome to the fire.",
  "Welcome to Chroma Key Act Three.",
  "Yeah, yeah, yeah.",
];

const fmt = (seconds) => {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const m = Math.floor(value / 60);
  const s = Math.floor(value % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const buildTimedLyrics = (track, duration) => {
  const parsed = Array.isArray(track?.lyric_lines)
    ? track.lyric_lines.filter((line) => line?.text)
    : [];

  if (parsed.length) {
    const hasTiming = parsed.some((line) => Number.isFinite(Number(line.time)));
    const step = duration && parsed.length ? duration / parsed.length : 8;
    return parsed.map((line, index) => ({
      id: line.id || `${track?.id || "track"}-line-${index}`,
      text: line.text,
      time: hasTiming && Number.isFinite(Number(line.time)) ? Number(line.time) : index * step,
    }));
  }

  const source = track?.lyrics || track?.display_text;
  const lines = source
    ? source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : fallbackLyrics;
  const step = duration && lines.length ? duration / lines.length : 8;
  return lines.map((line, index) => ({
    id: `${track?.id || "track"}-line-${index}`,
    text: line,
    time: index * step,
  }));
};

const keywordSeeds = ["POWER", "RECLAMATION", "SOVEREIGN", "FIRE", "FREEDOM"];
const timelineSegments = ["INTRO", "VERSE 1", "PRE", "HOOK", "VERSE 2", "HOOK", "BRIDGE", "FINAL"];
const visualFallbackLyrics = [
  "I'M BREAKING THE CODE",
  "I'M REWRITING THE SYSTEM",
  "THE KEYS IN MY HANDS",
  "I'M TAKING BACK WHAT'S MINE",
  "NO FIREWALL CAN HOLD ME",
  "NO GATE CAN KEEP ME OUT",
  "I'M THE GLITCH IN THEIR PLAN",
  "WATCH THE WHOLE THING BURN",
];
const visualFallbackTracks = [
  { id: "visual-01", title: "SYSTEM OVERRIDE", duration: "04:21", sort_order: 1 },
  { id: "visual-02", title: "DIGITAL GHOST", duration: "03:47", sort_order: 2 },
  { id: "visual-03", title: "BREAK THE CODE", duration: "04:08", sort_order: 3 },
  { id: "visual-04", title: "WASTELAND", duration: "03:56", sort_order: 4 },
  { id: "visual-05", title: "BLACKOUT PROTOCOL", duration: "04:28", sort_order: 5 },
  { id: "visual-06", title: "NO GATEKEEPERS", duration: "03:39", sort_order: 6 },
  { id: "visual-07", title: "GLITCH IN THE PLAN", duration: "04:11", sort_order: 7 },
];

export default function ReclamationCodex() {
  const { tracks, loading, error } = useReclamationTracks();
  const audio = useAudio();
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [visualMode, setVisualMode] = useState("cinematic");
  const [projectorOpen, setProjectorOpen] = useState(false);

  useEffect(() => {
    if (activeTrackIndex >= tracks.length) setActiveTrackIndex(0);
  }, [activeTrackIndex, tracks.length]);
  useEffect(() => {
    if (!tracks.length) return;
    const target = tracks.findIndex(
      (track) => track?.track_id === "act_three_welcome_to_the_fire"
    );
    if (target >= 0) setActiveTrackIndex(target);
  }, [tracks]);

  const activeTrack = tracks[activeTrackIndex] ?? null;
  const currentAudioTrack = audio?.currentTrack;
  const isCurrentTrack =
    currentAudioTrack?.id === activeTrack?.id ||
    currentAudioTrack?.track_id === activeTrack?.track_id;
  const isPlaying = Boolean(isCurrentTrack && audio?.isPlaying);
  const duration = isCurrentTrack && audio?.duration
    ? audio.duration
    : Number(activeTrack?.duration_seconds ?? activeTrack?.duration_in_seconds) || 0;
  const currentTime = isCurrentTrack && audio?.currentTime ? audio.currentTime : 0;
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const volume = Math.round((audio?.volume ?? 0.78) * 100);

  const analysis = useAudioAnalyzer(audio?.audioElement, isPlaying);
  const intensity = Math.round((isPlaying ? analysis.intensity : 0.78) * 100);

  const lyricLines = useMemo(() => buildTimedLyrics(activeTrack, duration), [activeTrack, duration]);
  const activeLyricIndex = useMemo(() => {
    if (!lyricLines.length) return -1;
    let index = 0;
    lyricLines.forEach((line, i) => {
      if (currentTime >= Number(line.time || 0)) index = i;
    });
    return index;
  }, [lyricLines, currentTime]);
  const activeLyricId = lyricLines[activeLyricIndex]?.id;

  const lyricWindow = useMemo(() => {
    if (!lyricLines.length) return [];
    const start = Math.max(0, activeLyricIndex);
    const end = Math.min(lyricLines.length, start + 8);
    return lyricLines.slice(Math.max(0, end - 8), end);
  }, [activeLyricIndex, lyricLines]);
  const displayLyricWindow = useMemo(() => {
    const seeded = lyricWindow.map((line) => ({ ...line, fallback: false }));
    if (seeded.length >= 8) return seeded;

    const existingText = new Set(seeded.map((line) => line.text?.toLowerCase()));
    const fill = visualFallbackLyrics
      .filter((text) => !existingText.has(text.toLowerCase()))
      .slice(0, 8 - seeded.length)
      .map((text, index) => ({
        id: `visual-fallback-line-${index}`,
        text,
        time: index * 8,
        fallback: true,
      }));

    return [...seeded, ...fill];
  }, [lyricWindow]);

  const totalDuration = useMemo(() => {
    const seconds = tracks.reduce((sum, track) => sum + Number(track.duration_seconds || 0), 0);
    return fmt(seconds);
  }, [tracks]);

  const useVisualFallback = Boolean(error && tracks.length <= 1);
  const carouselTracks = useMemo(() => {
    if (useVisualFallback) return visualFallbackTracks;
    const source = tracks.length ? tracks : [];
    const mapped = source.slice(0, 7);
    if (mapped.length >= 7) return mapped;
    const used = new Set(mapped.map((track) => String(track.id || track.track_id || track.title)));
    const fill = visualFallbackTracks.filter((track) => !used.has(track.id)).slice(0, 7 - mapped.length);
    return [...mapped, ...fill];
  }, [tracks, useVisualFallback]);

  const activeTrackIndexForDisplay = useVisualFallback
    ? (activeTrackIndex === 0 ? 2 : activeTrackIndex)
    : activeTrackIndex;
  const fallbackDisplayTrack = visualFallbackTracks[activeTrackIndexForDisplay] || visualFallbackTracks[2];
  const visualTrack = useVisualFallback
    ? {
        ...activeTrack,
        title: fallbackDisplayTrack.title,
        name: fallbackDisplayTrack.title,
        duration: fallbackDisplayTrack.duration,
        visual_media_url: "",
        background_video: "",
        visual_video: "",
        video_url: "",
        background_image_url: "",
        act_background_image: "",
      }
    : activeTrack;
  const activeTrackTitle = visualTrack?.title || visualTrack?.name || "BREAK THE CODE";
  const activeTrackDuration = fmt(duration || Number(activeTrack?.duration_seconds ?? activeTrack?.duration_in_seconds));
  const keySignature = activeTrack?.musical_key || activeTrack?.key || activeTrack?.key_signature || "C# MINOR";
  const bpm = activeTrack?.bpm || activeTrack?.tempo || 128;
  const safeProgress = Math.max(progress, isPlaying ? progress : 42);
  const keywordLevels = keywordSeeds.map((keyword, index) => ({
    keyword,
    value: Math.max(42, Math.min(98, intensity - index * 7 + (index % 2 ? 8 : 0))),
  }));

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

  const setVolume = (value) => {
    audio?.setVolume?.(value / 100);
  };

  return (
    <main className="pva-root">
      <div className="pva-command-frame" aria-hidden="true" />
      <ProtocolHeader
        visualMode={visualMode}
        onVisualModeChange={setVisualMode}
        onOpenVideoProjector={() => setProjectorOpen(true)}
        videoProjectorReady
      />
      {projectorOpen && (
        <CascadingVideoProjector
          open={projectorOpen}
          onOpen={() => setProjectorOpen(true)}
          onClose={() => setProjectorOpen(false)}
          contextTitle={activeTrack?.title || "ACT III RECLAMATION"}
        />
      )}

      <div className="pva-main-grid">
        <aside className="pva-left pva-beveled-module">
          <section className="pva-panel pva-lyrics-feed">
            <div className="pva-panel-title">
              <span>LYRICS FEED</span>
              <small>LIVE LYRICAL PROTOCOL</small>
            </div>
            <div className="pva-lyrics-lines">
              {loading && !displayLyricWindow.length ? (
                <p className="pva-media-empty">Loading lyrical artifacts...</p>
              ) : (
                displayLyricWindow.map((line, index) => (
                  <p key={line.id} className={line.id === activeLyricId ? "is-active" : ""}>
                    <span>{line.id === activeLyricId || (index === 0 && line.fallback) ? ">>" : String(index + 1).padStart(2, "0")}</span>
                    {line.text}
                    <i />
                  </p>
                ))
              )}
            </div>

            <div className="pva-keyword-bank">
              <div className="pva-panel-title is-compact">
                <span>KEYWORD HIGHLIGHT</span>
                <small>LIVE EXTRACTION</small>
              </div>
              {keywordLevels.map(({ keyword, value }) => (
                <div key={keyword} className="pva-keyword-row">
                  <strong>{keyword}</strong>
                  <span><i style={{ width: `${value}%` }} /></span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="pva-center">
          <VisualizerCorePanel
            track={visualTrack}
            currentTime={fmt(currentTime)}
            duration={fmt(duration)}
            progress={safeProgress}
            visualMode={visualMode}
            bpm={bpm}
            trackKey={keySignature}
          />
        </section>

        <aside className="pva-right pva-beveled-module">
          <AudioAnalysisPanel
            intensity={intensity}
            bass={Math.round((isPlaying ? analysis.bass : 0.82) * 100)}
            mid={Math.round((isPlaying ? analysis.mid : 0.64) * 100)}
            treble={Math.round((isPlaying ? analysis.treble : 0.71) * 100)}
            bpm={bpm}
            trackKey={keySignature}
            isPlaying={isPlaying}
          />
        </aside>
      </div>

      <section className="pva-track-carousel" aria-label="Track carousel">
        <button type="button" className="pva-carousel-arrow" onClick={prevTrack} aria-label="Previous track">&lt;</button>
        <div className="pva-carousel-deck">
          {carouselTracks.map((track, index) => {
            const active = index === activeTrackIndexForDisplay;
            const number = String(track.sort_order ?? index + 1).padStart(2, "0");
            return (
              <button
                type="button"
                key={track.id || track.track_id || number}
                className={`pva-track-card ${active ? "is-active" : ""}`}
                onClick={() => playTrack(track, index)}
              >
                <span>{number}</span>
                <strong>{track.title || track.name || `Artifact ${number}`}</strong>
                <em>{track.duration || fmt(Number(track.duration_seconds ?? track.duration_in_seconds))}</em>
                {active && <i />}
              </button>
            );
          })}
        </div>
        <button type="button" className="pva-carousel-arrow" onClick={nextTrack} aria-label="Next track">&gt;</button>
      </section>

      <section className="pva-protocol-timeline" onClick={seek} role="button" tabIndex={0} aria-label="Protocol timeline">
        <header>
          <span>PROTOCOL TIMELINE</span>
          {timelineSegments.map((segment, index) => <strong key={`${segment}-${index}`}>{segment}</strong>)}
        </header>
        <div className="pva-timeline-rail">
          <i style={{ width: `${safeProgress}%` }} />
          {timelineSegments.map((segment, index) => (
            <b key={`${segment}-${index}`} style={{ left: `${(index / (timelineSegments.length - 1)) * 100}%` }} />
          ))}
        </div>
      </section>

      <SystemStatusBar
        intensity={intensity}
        particlesEnabled
        visualsRunning={Boolean(activeTrack?.visual_media_url)}
        theme="Reclamation"
        currentTime={fmt(currentTime)}
        duration={activeTrackDuration}
        totalDuration={totalDuration}
        trackTitle={activeTrackTitle}
      />
    </main>
  );
}
