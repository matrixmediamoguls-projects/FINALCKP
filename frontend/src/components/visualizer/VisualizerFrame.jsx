import React from "react";

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

  if (error) {
    return (
      <div style={{ color: "#fff", padding: "2rem", textAlign: "center" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="vf-shell" style={{ position: "relative", width: "100%", height: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <audio
        ref={audioRef}
        src={track?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div style={{ color: "#fff", textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{track?.title || "—"}</h2>
        <p style={{ margin: "0.25rem 0 0", opacity: 0.6, fontSize: "0.9rem" }}>{track?.artist || ""}</p>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={prevTrack} style={btnStyle}>Prev</button>
        <button onClick={togglePlay} style={btnStyle}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={nextTrack} style={btnStyle}>Next</button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  padding: "0.5rem 1.25rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.85rem",
};
