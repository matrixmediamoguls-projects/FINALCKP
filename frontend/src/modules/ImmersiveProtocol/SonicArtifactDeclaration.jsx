import React from 'react';

export default function SonicArtifactDeclaration({ currentTrack }) {
  if (!currentTrack?.sonic_artifact_enabled) return null;

  return (
    <aside className={`sonic-artifact is-${currentTrack?.sonic_artifact_style || 'protocol-card'}`}>
      <h4>{currentTrack?.sonic_artifact_title || 'SONIC ARTIFACT DECLARATION'}</h4>
      <p>{currentTrack?.sonic_artifact_declaration || ''}</p>
    </aside>
  );
}
