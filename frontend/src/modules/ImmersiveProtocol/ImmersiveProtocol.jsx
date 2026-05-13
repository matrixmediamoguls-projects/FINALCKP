import React from 'react';
import { ProtocolProvider, useProtocol } from './context/ProtocolContext';
import TrackSelector from './TrackSelector';
import ActExperience from '../ActExperience';
import './protocolStyles.css';

function ImmersiveProtocolInner() {
  const { loading } = useProtocol();
  if (loading) return <div className="ip-loading">Loading immersive protocol...</div>;

  return (
    <div className="ip-root engine-root">
      <TrackSelector />
      <ActExperience />
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
