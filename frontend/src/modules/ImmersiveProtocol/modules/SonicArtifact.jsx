import React from 'react';
import { useProtocol } from '../context/ProtocolContext';

export default function SonicArtifact() {
  const { currentTrack, playbackState } = useProtocol();
  const declaration = currentTrack?.sonic_artifact_declaration
    || playbackState.activeLyric?.text
    || currentTrack?.display_text
    || currentTrack?.lyrics;

  if (currentTrack?.sonic_artifact_enabled === false || !declaration) return null;

  return (
    <aside className={`sonic-artifact is-${currentTrack?.sonic_artifact_style || 'protocol-card'}`}>
      <span className="sa-label">{currentTrack?.sonic_artifact_title || 'ACTIVE TRANSMISSION'}</span>
      <p className="sa-text">{declaration}</p>
      <span className="sa-status">{playbackState.mediaStatus} / {Math.round(playbackState.progress || 0)}%</span>
    </aside>
  );
}
