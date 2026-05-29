import { useMemo } from "react";

const isVideo = (url) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url || "");

const modeOptions = ["cinematic", "artifact", "performance", "immersive", "diagnostic"];

export default function VisualDisplayPanel({ track, visualMode, onVisualModeChange }) {
  const mediaUrl = useMemo(
    () =>
      track?.visual_media_url ||
      track?.background_image_url ||
      track?.act_background_image ||
      "",
    [track]
  );

  const mediaType = track?.visual_media_type || (isVideo(mediaUrl) ? "video" : "image");
  const visualClass = `is-${visualMode || "cinematic"}`;

  return (
    <section className={`pva-panel pva-visual-display ${visualClass}`}>
      <div className="pva-panel-title pva-visual-display__head">
        <span>VISUALS</span>
        <label>
          MODE
          <select value={visualMode} onChange={(e) => onVisualModeChange?.(e.target.value)}>
            {modeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {mode.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pva-visual-stage">
        {mediaUrl ? (
          mediaType === "video" ? (
            <video src={mediaUrl} autoPlay muted loop playsInline />
          ) : (
            <img src={mediaUrl} alt="Track visual backdrop" />
          )
        ) : (
          <div className="pva-media-empty">No media URL resolved</div>
        )}
      </div>
      <footer>{mediaType.toUpperCase()} · {visualMode?.toUpperCase()}</footer>
    </section>
  );
}
