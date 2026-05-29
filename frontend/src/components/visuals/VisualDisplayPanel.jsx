import { useMemo } from "react";

const isVideo = (url) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url || "");

export default function VisualDisplayPanel({ track }) {
  const mediaUrl = useMemo(
    () =>
      track?.visual_media_url ||
      track?.background_image_url ||
      track?.act_background_image ||
      "",
    [track]
  );

  const mediaType = track?.visual_media_type || (isVideo(mediaUrl) ? "video" : "image");

  return (
    <section className="pva-panel pva-visual-display">
      <div className="pva-panel-title">VISUALS</div>
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
      <footer>{mediaType.toUpperCase()}</footer>
    </section>
  );
}
