import React from 'react';
import { useProtocol } from './context/ProtocolContext';
import ActBackground from './background/ActBackground';
import AudioVisualizer from './modules/AudioVisualizer';
import LyricsProtocol from './modules/LyricsProtocol';
import SonicArtifact from './modules/SonicArtifact';
import ActKeysModule from './ActKeysModule';
import MechPanel from './components/ui/MechPanel'; // adjust the import path as needed

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
        <MechPanel className="left-module">
          <SonicArtifact />
        </MechPanel>

        {/* Keep the visualizer unwrapped */}
        <AudioVisualizer />

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
