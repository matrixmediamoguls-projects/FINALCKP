import React from 'react';
import { useProtocol } from './context/ProtocolContext';

export default function ActKeysModule() {
  const { currentTrack, playbackState, audioData } = useProtocol();
  const contextPoints = currentTrack?.act_keys?.length
    ? currentTrack.act_keys
    : currentTrack?.context_points || [];

  if (currentTrack?.act_keys_enabled === false && !contextPoints.length) return null;

  return (
    <section className={`act-keys-module is-${currentTrack?.act_keys_style || 'access-panel'}`}>
      <h4>{currentTrack?.act_keys_title || 'CONTEXT MODULE'}</h4>
      <div className="ak-status-grid">
        <span>TIME {Math.round(playbackState.progress || 0)}%</span>
        <span>BASS {Math.round((audioData?.bassLevel || 0) * 100)}%</span>
        <span>MID {Math.round((audioData?.midLevel || 0) * 100)}%</span>
        <span>TREBLE {Math.round((audioData?.trebleLevel || 0) * 100)}%</span>
      </div>
      <ul>
        {contextPoints.slice(0, 5).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
