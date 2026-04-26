import React from 'react';

export default function ActVisualizerBackground({ currentTrack, audioData }) {
  const color = currentTrack?.primary_color || '#ff1a2d';
  const intensity = (Number(currentTrack?.intensity || 50) / 100) * (audioData?.averageVolume || 0);
  const pulse = Number(currentTrack?.pulse_strength || 40) / 100;
  const overlayOpacity = Number(currentTrack?.background_overlay_opacity ?? 0.24);
  const blur = Number(currentTrack?.background_blur || 0);
  const vignette = Number(currentTrack?.vignette_strength || 50) / 100;
  const glitch = Number(currentTrack?.glitch_level || 0) / 100;
  const fog = Number(currentTrack?.fog_level || 0) / 100;

  return (
    <div className="protocol-bg-wrap">
      <div
        className="protocol-bg-shell"
        style={{
          backgroundImage: `url(${currentTrack?.shell_image_url || currentTrack?.shell_image || ''})`,
          filter: `blur(${blur}px)`,
        }}
      />

      {currentTrack?.background_image_url && (
        <div
          className="protocol-bg-secondary"
          style={{ backgroundImage: `url(${currentTrack.background_image_url})`, opacity: overlayOpacity }}
        />
      )}

      <div
        className="protocol-bg-glow"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${color}${Math.round((0.2 + intensity * pulse) * 255).toString(16).padStart(2, '0')} 0%, transparent 62%)`,
        }}
      />

      {currentTrack?.scanline_enabled && <div className="protocol-bg-scanline" />}
      <div className="protocol-bg-noise" style={{ opacity: 0.08 + glitch * 0.18 }} />
      <div className="protocol-bg-fog" style={{ opacity: 0.05 + fog * 0.35 }} />
      <div className="protocol-bg-vignette" style={{ opacity: 0.35 + vignette * 0.45 }} />
    </div>
  );
}
