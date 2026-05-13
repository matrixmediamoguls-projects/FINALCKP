import React from 'react';
import { useProtocol } from '../context/ProtocolContext';

export default function SonicArtifact() {
  const { currentTrack } = useProtocol();
  if (currentTrack?.sonic_artifact_enabled === false || !currentTrack?.sonic_artifact_declaration) return null;

  return (
    <aside className={`sonic-artifact is-${currentTrack?.sonic_artifact_style || 'protocol-card'}`}>
      <span className="sa-label">{currentTrack?.sonic_artifact_title || 'SONIC ARTIFACT DECLARATION'}</span>
      <p className="sa-text">{currentTrack?.sonic_artifact_declaration}</p>
    </aside>
  );
}
