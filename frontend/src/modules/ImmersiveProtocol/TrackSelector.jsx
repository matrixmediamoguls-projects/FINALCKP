import React from 'react';
import { useProtocol } from './context/ProtocolContext';

export default function TrackSelector() {
  const { tracks, currentIndex, selectTrack, isPlaying } = useProtocol();

  return (
    <aside className="ip-track-selector">
      <div className="ip-panel-label">RECLAMATION MANIFEST</div>
      {tracks.map((track, index) => (
        <button
          key={track.id}
          className={index === currentIndex ? 'active' : ''}
          onClick={() => selectTrack(index, { autoplay: isPlaying })}
          type="button"
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{track.title}</strong>
          <small>{track.act} / {index === currentIndex && isPlaying ? 'playing' : track.release_status}</small>
        </button>
      ))}
    </aside>
  );
}
