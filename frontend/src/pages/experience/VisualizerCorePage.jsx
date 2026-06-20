import { useEffect, useMemo, useState } from 'react';
import AudioVisualizerCore from '../../modules/sovereign/AudioVisualizerCore';
import { getActThreeTracks } from '../../lib/supabase/tracks';
import './VisualizerCorePage.css';
import './VisualizerCorePagePolish.css';

export default function VisualizerCorePage() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    getActThreeTracks().then((items) => {
      if (!active) return;
      setTracks(items);
      setSelectedTrackId((current) => current || items[2]?.id || items[0]?.id || null);
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
    <main className="visualizer-core-page">
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
