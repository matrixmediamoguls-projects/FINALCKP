import React from 'react';
import ActVisualizerBackground from './ActVisualizerBackground';
import ActLogoVisualizer from './ActLogoVisualizer';
import LyricsEngine from './LyricsEngine';
import SonicArtifactDeclaration from './SonicArtifactDeclaration';
import ActKeysModule from './ActKeysModule';

export default function ProtocolShell({ currentTrack, audioData }) {
  const reactiveStrength = (audioData.averageVolume || 0) * ((currentTrack?.intensity || 50) / 100);

  return (
    <div className="protocol-shell" style={{ '--accent': currentTrack?.primary_color || '#ff1a2d' }}>
      <ActVisualizerBackground currentTrack={currentTrack} audioData={audioData} />

      <div className="protocol-content-layer">
        <SonicArtifactDeclaration currentTrack={currentTrack} />
        <ActLogoVisualizer currentTrack={currentTrack} audioData={audioData} />
        <ActKeysModule currentTrack={currentTrack} />
        <LyricsEngine currentTrack={currentTrack} reactiveStrength={reactiveStrength} />
      </div>
    </div>
  );
}
