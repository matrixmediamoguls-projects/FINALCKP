import React from 'react';

export default function ActKeysModule({ currentTrack }) {
  if (!currentTrack?.act_keys_enabled) return null;

  return (
    <section className={`act-keys-module is-${currentTrack?.act_keys_style || 'access-panel'}`}>
      <h4>{currentTrack?.act_keys_title || `KEYS TO ${currentTrack?.act || 'THIS ACT'}`}</h4>
      <ul>
        {(currentTrack?.act_keys || []).slice(0, 5).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
