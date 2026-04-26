import React from 'react';

export default function TrackSelector({ tracks, currentTrackId, onSelect }) {
  return (
    <div className="track-selector">
      {tracks.map((track) => (
        <button
          key={track.id}
          className={`track-chip ${track.id === currentTrackId ? 'is-active' : ''}`}
          onClick={() => onSelect(track.id)}
          type="button"
        >
          <span>{track.title}</span>
          <small>{track.act} · {track.release_status || 'draft'}</small>
        </button>
      ))}
    </div>
  );
}
