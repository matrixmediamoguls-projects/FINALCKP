import React, { useMemo } from 'react';

export default function ActLogoVisualizer({ currentTrack, audioData }) {
  const color = currentTrack?.primary_color || '#ff1a2d';
  const reactivity = Number(currentTrack?.act_logo_reactivity_strength || 80) / 100;
  const glowStrength = Number(currentTrack?.act_logo_glow_strength || 70) / 100;
  const rotationSpeed = Number(currentTrack?.act_logo_rotation_speed || 0.08);
  const style = currentTrack?.act_logo_visualizer_style || 'radial-bars';

  const meter = useMemo(() => {
    const energy = (audioData?.averageVolume || 0) * reactivity;
    const bassPush = (audioData?.bassLevel || 0) * reactivity;
    const glow = 20 + glowStrength * 40 + energy * 45;
    const scale = 1 + bassPush * 0.15;
    return { energy, bassPush, glow, scale };
  }, [audioData, glowStrength, reactivity]);

  return (
    <div className="act-logo-wrap" style={{ '--accent': color }}>
      {currentTrack?.act_logo_ring_enabled && (
        <div
          className={`act-logo-ring is-${style}`}
          style={{
            transform: `translate(-50%, -50%) scale(${meter.scale}) rotate(${(audioData?.midLevel || 0) * rotationSpeed * 360}deg)`,
            boxShadow: `0 0 ${meter.glow}px ${color}`,
          }}
        />
      )}

      <div
        className="act-logo-emblem"
        style={{
          transform: `scale(${meter.scale})`,
          boxShadow: `0 0 ${meter.glow}px ${color}`,
        }}
      >
        {currentTrack?.act_logo_image_url || currentTrack?.act_logo_image ? (
          <img
            src={currentTrack?.act_logo_image_url || currentTrack?.act_logo_image}
            alt={currentTrack?.act_logo_text || 'Act logo'}
            className="act-logo-image"
          />
        ) : (
          <div className="act-logo-text-fallback">{currentTrack?.act || 'RECLAMATION'}</div>
        )}
      </div>

      <div className="act-logo-copy">
        <h2>{currentTrack?.act_logo_text || 'CHROMA KEY PROTOCOL'}</h2>
        <p>{currentTrack?.act_logo_subtitle || currentTrack?.act || ''}</p>
      </div>
    </div>
  );
}
