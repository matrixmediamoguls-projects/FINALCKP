import React from 'react';
import { useParams } from 'react-router-dom';
import { ProtocolProvider, useProtocol } from '../modules/ImmersiveProtocol/context/ProtocolContext';
import VisualizerFrame from '../components/visualizer/VisualizerFrame';
import { normalizeVisualizerActId } from '../components/visualizer/visualizerAssets';

function FinalVisualizerBridge() {
  const { actId: routeActId } = useParams();
  const {
    tracks,
    currentIndex,
    currentTrack,
    loading,
    error,
    audioData,
    audioRef,
    isPlaying,
    progress,
    duration,
    currentTime,
    selectTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
  } = useProtocol();

  if (loading && !currentTrack) return <div className="ip-loading">Loading final visualizer...</div>;

  const actId = normalizeVisualizerActId(routeActId || 'act_three', currentTrack);
  const track = {
    ...currentTrack,
    src: currentTrack?.audio_url,
  };

  return (
    <VisualizerFrame
      act_id={actId}
      track={track}
      audioData={audioData}
      error={error}
      playback={{
        audioRef,
        isPlaying,
        progress,
        duration,
        currentTime,
        tracks,
        currentIndex,
        selectTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleSeek,
      }}
    />
  );
}

export default function FinalVisualizerPage() {
  return (
    <ProtocolProvider>
      <FinalVisualizerBridge />
    </ProtocolProvider>
  );
}
