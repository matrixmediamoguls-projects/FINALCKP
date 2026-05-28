import React, { forwardRef } from 'react';

const AudioEngine = forwardRef(function AudioEngine({
  src,
  crossOrigin,
  onLoadedMetadata,
  onTimeUpdate,
  onCanPlay,
  onPlay,
  onPause,
  onError,
  onEnded,
}, ref) {
  return (
    <audio
      ref={ref}
      src={src}
      preload="metadata"
      crossOrigin={crossOrigin}
      onLoadedMetadata={onLoadedMetadata}
      onTimeUpdate={onTimeUpdate}
      onCanPlay={onCanPlay}
      onPlay={onPlay}
      onPause={onPause}
      onError={onError}
      onEnded={onEnded}
    />
  );
});

export default AudioEngine;
