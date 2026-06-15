import React from 'react';
import { ProtocolProvider, useProtocol } from './context/ProtocolContext';
import ProtocolShell from './ProtocolShell';
import TrackSelector from './TrackSelector';
import './protocolStyles.css';

function ImmersiveProtocolInner() {
  const { loading } = useProtocol();
  if (loading) return <div className="ip-loading">Loading immersive protocol...</div>;

  return (
    <div className="ip-root">
      <TrackSelector />
      <ProtocolShell />
    </div>
  );
}

export default function ImmersiveProtocol() {
  return (
    <ProtocolProvider>
      <ImmersiveProtocolInner />
    </ProtocolProvider>
  );
}
