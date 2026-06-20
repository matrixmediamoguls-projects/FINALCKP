import { useEffect, useMemo, useState } from 'react';
import AudioVisualizerCore from '../../modules/sovereign/AudioVisualizerCore';
import { getActThreeTracks } from '../../lib/supabase/tracks';
import './SovereignMode.css';

export default function SovereignMode() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    getActThreeTracks().then((items) => {
      if (!active) return;
      setTracks(items);
      setSelectedTrackId((current) => current || items[0]?.id || null);
    });
    return () => {
      active = false;
    };
  }, []);

  const activeTrackData = useMemo(
    () => tracks.find((track) => track.id === selectedTrackId) || null,
    [tracks, selectedTrackId]
  );

  return (
    <main className="sovereign-visualizer-page">
      <AudioVisualizerCore
        selectedTrackId={selectedTrackId}
        activeTrackData={activeTrackData}
        tracks={tracks}
        onTrackChange={setSelectedTrackId}
        isPlaying={isPlaying}
        onPlayStateChange={setIsPlaying}
      />
    </main>
  );
}
