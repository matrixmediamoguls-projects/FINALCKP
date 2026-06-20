import { useEffect, useMemo, useState } from 'react';
import AudioVisualizerCore from '../../modules/sovereign/AudioVisualizerCore';
import { getActThreeTracks } from '../../lib/supabase/tracks';
import './SovereignMode.css';
import './SovereignModePolish.css';

const VISUALIZER_CORE_CARD = {
  title: 'Visualizer Core',
  eyebrow: 'Sovereign Mode Module',
  image: '/ui/reclamation/Module_Cards/Visualizer_Core.png',
  alt: 'Visualizer Core sovereign mode module card',
  description: 'See the waveform. Shape the sound. Amplify your vision.',
};

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
      <aside className="sovereign-module-card-deck" aria-label="Sovereign Mode module cards">
        <article className="sovereign-module-card is-active">
          <img
            src={VISUALIZER_CORE_CARD.image}
            alt={VISUALIZER_CORE_CARD.alt}
            draggable="false"
          />
          <div className="sovereign-module-card__copy">
            <span>{VISUALIZER_CORE_CARD.eyebrow}</span>
            <strong>{VISUALIZER_CORE_CARD.title}</strong>
            <p>{VISUALIZER_CORE_CARD.description}</p>
          </div>
        </article>
      </aside>

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
