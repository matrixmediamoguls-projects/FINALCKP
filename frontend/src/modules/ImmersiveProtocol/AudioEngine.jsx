import React, { forwardRef } from 'react';

const AudioEngine = forwardRef(function AudioEngine({ src, onLoadedMetadata, onTimeUpdate, onEnded }, ref) {
  return (
    <audio
      ref={ref}
      src={src}
      preload="metadata"
      onLoadedMetadata={onLoadedMetadata}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      crossOrigin="anonymous"
    />
  );
});

export default AudioEngine;
