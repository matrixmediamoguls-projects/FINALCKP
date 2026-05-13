import React, { useMemo } from 'react';
import { useProtocol } from '../context/ProtocolContext';

export default function AudioVisualizer() {
  const { currentTrack, audioData } = useProtocol();
  const color = currentTrack?.primary_color || '#ff1a2d';
  const intensity = Number(currentTrack?.intensity || 70) / 100;
  const bass = (audioData?.bassLevel || 0) * intensity;
  const avg = (audioData?.averageVolume || 0) * intensity;
  const bars = useMemo(() => Array.from({ length: 36 }), []);

  return (
    <div className="av-wrap" style={{ '--av-color': color, transform: `scale(${1 + bass * 0.05})` }}>
      <div
        className="av-orbit"
        style={{
          opacity: 0.35 + avg,
          animationDuration: `${12 - Math.min(8, avg * 8)}s`,
        }}
      />
      <div className="av-bars">
        {bars.map((_, i) => {
          const sample = audioData?.frequencyData?.[i * 4] || 0;
          const h = 12 + (sample / 255) * 52 * intensity;
          return (
            <span
              key={i}
              style={{
                transform: `rotate(${i * 10}deg) translateY(-112px)`,
                height: `${h}px`,
                opacity: 0.18 + sample / 255,
              }}
            />
          );
        })}
      </div>
      <div className="av-core" style={{ boxShadow: `0 0 ${30 + avg * 90}px ${color}` }}>
        {currentTrack?.act_logo_asset ? (
          <img
            src={currentTrack.act_logo_asset}
            alt={currentTrack?.act_logo_text || 'Act logo'}
            className="av-logo"
          />
        ) : (
          <strong className="av-logo-text">{currentTrack?.act_logo_text || 'CKP'}</strong>
        )}
        <small className="av-logo-subtitle">{currentTrack?.act_logo_subtitle || currentTrack?.act}</small>
      </div>
    </div>
  );
}
