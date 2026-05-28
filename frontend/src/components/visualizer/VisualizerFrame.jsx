import React, { useMemo } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

import "./VisualizerFrame.css";

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
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
  } = playback || {};
  const title = track?.title || track?.name || "Signal awaiting track";
  const artist = track?.artist || track?.act_title || act_id || "Chroma Key Protocol";
  const progressPercent = Math.max(0, Math.min(100, Number(progress) || 0));
  const mediaUrl =
    track?.visual_media_url ||
    track?.background_image_url ||
    track?.act_background_image ||
    "/media/act-gateway-scene.jpg";
  const spectrumBars = useMemo(
    () =>
      Array.from({ length: 54 }, (_, index) => {
        const audioValue = Array.isArray(audioData)
          ? Number(audioData[index % audioData.length]) / 255
          : 0;
        const idleValue = (18 + ((index * 29) % 74)) / 100;
        const value = isPlaying ? Math.max(0.12, audioValue || idleValue) : idleValue;

        return `${Math.round(value * 100)}%`;
      }),
    [audioData, isPlaying]
  );

  if (error) {
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

      <div className="vf-backdrop" aria-hidden="true">
        <img src={mediaUrl} alt="" />
      </div>

      <section className="vf-console" aria-label="Final visualizer">
        <div className="vf-stage">
          <div className="vf-orbital" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <img
            className="vf-emblem"
            src="/emblem/reclamation_core_emblem.png"
            alt=""
          />
          <div className="vf-spectrum" aria-hidden="true">
            {spectrumBars.map((height, index) => (
              <span key={index} style={{ "--bar": height }} />
            ))}
          </div>
        </div>

        <div className="vf-deck">
          <div className="vf-track">
            <span>{String(act_id || "act_three").replace(/_/g, " ")}</span>
            <h1>{title}</h1>
            <p>{artist}</p>
          </div>

          <div
            className="vf-progress"
            onClick={handleSeek}
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
            aria-label="Seek track"
          >
            <i style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="vf-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="vf-controls">
            <button type="button" onClick={prevTrack} aria-label="Previous track">
              <SkipBack size={20} fill="currentColor" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              className="vf-controls__main"
              onClick={togglePlay}
              disabled={!track?.src}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" strokeWidth={1.5} />
              ) : (
                <Play size={28} fill="currentColor" strokeWidth={1.5} />
              )}
            </button>
            <button type="button" onClick={nextTrack} aria-label="Next track">
              <SkipForward size={20} fill="currentColor" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatTime(seconds) {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const remainingSeconds = Math.floor(value % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
