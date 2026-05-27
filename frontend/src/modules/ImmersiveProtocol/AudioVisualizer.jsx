import React, { useMemo } from 'react';
import { useProtocol } from './context/ProtocolContext';

const BAR_COUNT = 56;

const getFrequencyValue = (frequencyData, index) => {
  if (!frequencyData?.length) {
    return 18 + Math.sin(index * 0.65) * 9;
  }

  const bucket = Math.floor((index / BAR_COUNT) * frequencyData.length);
  return frequencyData[bucket] || 0;
};

export default function AudioVisualizer() {
  const { audioData, currentTrack, isPlaying } = useProtocol();
  const color = currentTrack?.primary_color || '#ff1a2d';
  const volume = audioData?.averageVolume || 0;
  const pulse = isPlaying ? 1 + Math.min(volume * 0.16, 0.1) : 1;

  const bars = useMemo(() => Array.from({ length: BAR_COUNT }, (_, index) => index), []);

  return (
    <div
      className="av-wrap"
      style={{
        '--av-color': color,
        transform: `translate(-50%, -50%) scale(${pulse})`,
      }}
      aria-label="Audio visualizer"
    >
      <div className="av-orbit" />
      <div className="av-pulse" />
      <div className="av-bars" aria-hidden="true">
        {bars.map((index) => {
          const value = getFrequencyValue(audioData?.frequencyData, index);
          const idleLift = isPlaying ? 0 : 0.45;
          const height = 18 + Math.max(value * 0.36, 18 * idleLift);
          const opacity = isPlaying ? 0.38 + Math.min(value / 255, 0.62) : 0.36;

          return (
            <span
              key={index}
              style={{
                height: `${height}px`,
                opacity,
                transform: `rotate(${(360 / BAR_COUNT) * index}deg) translateY(-126px)`,
              }}
            />
          );
        })}
      </div>
      <div className="av-core">
        {currentTrack?.act_logo_asset ? (
          <img className="av-logo" src={currentTrack.act_logo_asset} alt="" />
        ) : (
          <span className="av-logo-text">ACT III</span>
        )}
        <span className="av-logo-subtitle">{currentTrack?.title || 'Reclamation'}</span>
      </div>
    </div>
  );
}
