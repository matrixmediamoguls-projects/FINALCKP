import { useEffect, useMemo, useState } from "react";

import useAudioAnalyzer from "../../hooks/useAudioAnalyzer";
import useReclamationTracks, { DEFAULT_VISUALIZER_VIEWPORT_IMAGE } from "../../modules/ImmersiveProtocol/useReclamationTracks";
import { useAudio } from "../../context/audioprovider";
import "../../styles/reclamation-command-center.css";

import ProtocolHeader from "../../components/layout/ProtocolHeader";
import TrackListPanel from "../../components/music/TrackListPanel";
import QuickControlsPanel from "../../components/controls/QuickControlsPanel";
import VisualDisplayPanel from "../../components/visuals/VisualDisplayPanel";
import VisualizerReactorCore from "../../components/visuals/VisualizerReactorCore";
import LyricsProtocolPanel from "../../components/lyrics/LyricsProtocolPanel";
import AudioAnalysisPanel from "../../components/analysis/AudioAnalysisPanel";
import ProtocolEnginePanel from "../../components/protocol/ProtocolEnginePanel";
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
  const viewportImage =
    activeTrack?.viewport_image_url ||
    activeTrack?.visual_media_fallback_image ||
    activeTrack?.background_image_url ||
    activeTrack?.act_background_image ||
    DEFAULT_VISUALIZER_VIEWPORT_IMAGE;
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
  const bass = Math.round((isPlaying ? analysis.bass : 0.82) * 100);
  const mid = Math.round((isPlaying ? analysis.mid : 0.64) * 100);
  const treble = Math.round((isPlaying ? analysis.treble : 0.71) * 100);

  const lyricLines = useMemo(() => buildTimedLyrics(activeTrack, duration), [activeTrack, duration]);
  const activeLyricIndex = useMemo(() => {
    if (!lyricLines.length) return -1;
    let index = 0;
    lyricLines.forEach((line, i) => {
      if (currentTime >= Number(line.time || 0)) index = i;
    });
    return index;
  }, [lyricLines, currentTime]);

  const lyricWindow = useMemo(() => {
    if (!lyricLines.length) return [];
    const start = Math.max(0, activeLyricIndex - 1);
    const end = Math.min(lyricLines.length, start + 4);
    return lyricLines.slice(Math.max(0, end - 4), end);
  }, [activeLyricIndex, lyricLines]);

  const totalDuration = useMemo(() => {
    const seconds = tracks.reduce((sum, track) => sum + Number(track.duration_seconds || 0), 0);
    return fmt(seconds);
  }, [tracks]);

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
      <ProtocolHeader
        visualMode={visualMode}
        onVisualModeChange={setVisualMode}
        onOpenVideoProjector={() => setProjectorOpen(true)}
        videoProjectorReady
      />
      <CascadingVideoProjector
        open={projectorOpen}
        onOpen={() => setProjectorOpen(true)}
        onClose={() => setProjectorOpen(false)}
        contextTitle={activeTrack?.title || "ACT III RECLAMATION"}
      />

      <div className="pva-main-grid">
        <aside className="pva-left">
          <TrackListPanel
            tracks={tracks}
            loading={loading}
            error={error}
            activeTrackIndex={activeTrackIndex}
            onSelectTrack={playTrack}
            totalDuration={totalDuration}
          />
          <QuickControlsPanel
            isPlaying={isPlaying}
            onPlayPause={togglePlayback}
            onPrev={prevTrack}
            onNext={nextTrack}
            progress={progress}
            currentTime={fmt(currentTime)}
            duration={fmt(duration)}
            volume={volume}
            onVolumeChange={setVolume}
            onSeek={seek}
          />
        </aside>

        <section
          className="pva-center pva-center--reactor"
          style={{ "--pva-viewport-image": `url("${viewportImage}")` }}
          aria-label={activeTrack?.viewport_alt_text || "Chroma Key Protocol visualizer viewport"}
        >
          <VisualizerReactorCore
            isPlaying={isPlaying}
            intensity={intensity}
            bass={bass}
            mid={mid}
            treble={treble}
            bpm={activeTrack?.bpm}
            keySignature={activeTrack?.key_signature || activeTrack?.key}
            trackTitle={activeTrack?.title || "ACT III RECLAMATION"}
          />
          <LyricsProtocolPanel
            lines={lyricWindow}
            activeLineId={lyricLines[activeLyricIndex]?.id}
            currentTime={currentTime}
            empty={!lyricWindow.length}
          />
          <SystemStatusBar
            intensity={intensity}
            particlesEnabled
            visualsRunning={Boolean(activeTrack?.visual_media_url || viewportImage)}
            theme="Reclamation"
          />
        </section>

        <aside className="pva-right">
          <VisualDisplayPanel track={activeTrack} visualMode={visualMode} onVisualModeChange={setVisualMode} />
          <AudioAnalysisPanel
            intensity={intensity}
            bass={bass}
            mid={mid}
            treble={treble}
          />
          <ProtocolEnginePanel track={activeTrack} isPlaying={isPlaying} />
        </aside>
      </div>
    </main>
  );
}
