import React, { useCallback, useEffect, useRef } from 'react';
import FXController, { useFXController } from '../components/fx/FXController';
import OrbitalLyrics from '../components/lyrics/OrbitalLyrics';
import VisualizerCore from '../components/visualizer/VisualizerCore';
import { getActConfig, resolveTrackColor } from '../hooks/actConfig';
import { useKeywordFX } from '../hooks/useKeywordFX';
import { useLyricsEngine } from '../hooks/useLyricsEngine';
import ActKeysModule from './ImmersiveProtocol/ActKeysModule';
import ActBackground from './ImmersiveProtocol/background/ActBackground';
import { useProtocol } from './ImmersiveProtocol/context/ProtocolContext';
import ProtocolPlayer from './ImmersiveProtocol/ProtocolPlayer';
import SonicArtifact from './ImmersiveProtocol/modules/SonicArtifact';

export default function ActExperience() {
  const { currentTrack, audioData, audioRef, isPlaying } = useProtocol();
  const act = getActConfig(currentTrack);
  const color = resolveTrackColor(currentTrack);
  const lyrics = useLyricsEngine(audioRef, currentTrack?.lyrics || []);
  const { events, triggerFX } = useFXController();
  const lastEnergyBurstRef = useRef(0);
  const latestFx = events[events.length - 1]?.type || 'idle';

  useKeywordFX(lyrics.current, lyrics.activeWordIndex, triggerFX);

  useEffect(() => {
    if (!currentTrack?.id) return;
    triggerFX('prism', { source: 'act-change', act: act.id });
  }, [act.id, currentTrack?.id, triggerFX]);

  useEffect(() => {
    const energy = audioData?.energy || audioData?.averageVolume || 0;
    const now = Date.now();

    if (isPlaying && energy > 0.72 && now - lastEnergyBurstRef.current > 820) {
      lastEnergyBurstRef.current = now;
      triggerFX('shockwave', { source: 'energy', energy });
    }
  }, [audioData?.averageVolume, audioData?.energy, isPlaying, triggerFX]);

  const triggerManualFX = useCallback(() => {
    triggerFX('burst', { source: 'manual' });
  }, [triggerFX]);

  return (
    <main
      className={`protocol-shell engine-shell has-fx-${latestFx}`}
      style={{
        '--accent': color,
        '--act-secondary': currentTrack?.secondary_color || act.secondaryColor,
        '--engine-energy': audioData?.energy || 0,
      }}
    >
      <ActBackground />
      <VisualizerCore audio={audioData} color={color} fxEvents={events} />
      <FXController events={events} audio={audioData} color={color} />

      <div className="engine-topline">
        <span>CHROMA KEY PROTOCOL</span>
        <strong>{currentTrack?.title || 'Immersive Engine'}</strong>
        <span>{act.title} / {act.field}</span>
      </div>

      <button className="engine-core-mark" type="button" onClick={triggerManualFX} aria-label="Trigger visual pulse">
        {currentTrack?.album_art || currentTrack?.act_logo_asset ? (
          <img src={currentTrack.album_art || currentTrack.act_logo_asset} alt="" />
        ) : (
          <span>{act.id}</span>
        )}
      </button>

      <div className="protocol-content engine-content">
        <SonicArtifact />
        <ActKeysModule />
        <OrbitalLyrics line={lyrics.current} idx={lyrics.activeWordIndex} audio={audioData} color={color} />
      </div>

      <ProtocolPlayer />
    </main>
  );
}
