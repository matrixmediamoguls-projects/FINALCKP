import React from 'react';
import { useProtocol } from '../context/ProtocolContext';

export default function ActBackground() {
  const { currentTrack, audioData } = useProtocol();
  const color = currentTrack?.primary_color || '#ff1a2d';
  const intensity = (Number(currentTrack?.intensity || 50) / 100) * (audioData?.averageVolume || 0);
  const pulse = Number(currentTrack?.pulse_strength || 40) / 100;
  const blur = Number(currentTrack?.background_blur || 0);
  const vignette = Number(currentTrack?.vignette_strength || 50) / 100;
  const glitch = Number(currentTrack?.glitch_level || 0) / 100;
  const fog = Number(currentTrack?.fog_level || 0) / 100;
  const bgImage = currentTrack?.act_background_image || '';

  return (
    <div className="act-bg" aria-hidden="true">
      {bgImage ? (
        <img src={bgImage} alt="" className="act-bg-image" style={{ filter: `blur(${blur}px)` }} />
      ) : (
        <div className="act-bg-fallback" style={{ '--ab-color': color }} />
      )}
      <div
        className="act-bg-glow"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${color}${Math.round(
            Math.min(1, 0.2 + intensity * pulse) * 255
          ).toString(16).padStart(2, '0')} 0%, transparent 62%)`,
        }}
      />
      {currentTrack?.scanline_enabled !== false && <div className="act-bg-scanlines" />}
      <div className="act-bg-noise" style={{ opacity: 0.05 + glitch * 0.18 }} />
      <div className="act-bg-fog" style={{ opacity: 0.05 + fog * 0.35 }} />
      <div className="act-bg-vignette" style={{ opacity: 0.35 + vignette * 0.45 }} />
    </div>
  );
}
