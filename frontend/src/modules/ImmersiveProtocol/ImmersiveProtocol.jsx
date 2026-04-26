import React, { useEffect, useMemo, useState } from 'react';
import './protocolStyles.css';
import useReclamationTracks from './useReclamationTracks';
import useAudioAnalyser from './useAudioAnalyser';
import ProtocolShell from './ProtocolShell';
import ProtocolPlayer from './ProtocolPlayer';
import TrackSelector from './TrackSelector';

export default function ImmersiveProtocol() {
  const { tracks, loading, error } = useReclamationTracks();
  const { audioData, connect } = useAudioAnalyser();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    if (!tracks.length) return;
    const firstActive = tracks.findIndex((track) => track.is_active);
    setCurrentTrackIndex(firstActive >= 0 ? firstActive : 0);
  }, [tracks]);

  const currentTrack = useMemo(() => tracks[currentTrackIndex] || tracks[0], [tracks, currentTrackIndex]);

  if (loading) {
    return <div className="protocol-state">Loading protocol metadata...</div>;
  }

  if (!currentTrack) {
    return <div className="protocol-state">No track available.</div>;
  }

  return (
    <section className="immersive-protocol-root">
      {error && <div className="protocol-banner">{error}</div>}
      <ProtocolShell currentTrack={currentTrack} audioData={audioData} />
      <TrackSelector
        tracks={tracks}
        currentTrackId={currentTrack.id}
        onSelect={(id) => {
          const nextIndex = tracks.findIndex((track) => track.id === id);
          if (nextIndex >= 0) setCurrentTrackIndex(nextIndex);
        }}
      />
      <ProtocolPlayer
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        setCurrentTrackIndex={setCurrentTrackIndex}
        connectAudio={connect}
      />
    </section>
  );
}
