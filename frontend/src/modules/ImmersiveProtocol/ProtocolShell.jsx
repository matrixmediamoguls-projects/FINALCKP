import React from 'react';
import { useProtocol } from './context/ProtocolContext';
import ActBackground from './background/ActBackground';
import LyricsProtocol from './modules/LyricsProtocol';
import SonicArtifact from './modules/SonicArtifact';
import ActKeysModule from './ActKeysModule';
import MechPanel from '../../components/ui/MechPanel';
import AudioVisualizer from './AudioVisualizer';

export default function ProtocolShell({ children }) {
  const { currentTrack, error } = useProtocol();

  return (
    <main className="protocol-shell" style={{ '--accent': currentTrack?.primary_color || '#ff1a2d' }}>
      <ActBackground />

      <div className="protocol-topline">
        <span>MUSIQ MATRIX MAINFRAME</span>
        <span>{currentTrack?.visual_mode || ''}</span>
      </div>

      <div className="protocol-content">
        <AudioVisualizer />

        <MechPanel className="left-module">
          <SonicArtifact />
        </MechPanel>

        <MechPanel className="right-module">
          <ActKeysModule />
        </MechPanel>

        <MechPanel className="lyrics-module">
          <LyricsProtocol />
        </MechPanel>
      </div>

      {error && <div className="ip-error">{error}</div>}

      {children}
    </main>
  );
}
