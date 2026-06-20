import { useEffect, useMemo, useState } from 'react';
import AudioVisualizerCore from '../../modules/sovereign/AudioVisualizerCore';
import SonicArtifacts from '../../modules/sovereign/SonicArtifacts';
import ElementalCodex from '../../modules/sovereign/ElementalCodex';
import Archaetypes from '../../modules/sovereign/Archaetypes';
import LyricalCodex from '../../modules/sovereign/LyricalCodex';
import ReclamationUniversity from '../../modules/sovereign/ReclamationUniversity';
import VibesAndScribes from '../../modules/sovereign/VibesAndScribes';
import { getActThreeTracks } from '../../lib/supabase/tracks';
import './SovereignMode.css';
import './SovereignModePolish.css';

const MODULES = [
  { key: 'sonic_artifacts', rail: 'left', Component: SonicArtifacts },
  { key: 'elemental_codex', rail: 'left', Component: ElementalCodex },
  { key: 'archaetypes', rail: 'left', Component: Archaetypes },
  { key: 'lyrical_codex', rail: 'right', Component: LyricalCodex },
  { key: 'reclamation_university', rail: 'right', Component: ReclamationUniversity },
  { key: 'vibes_and_scribes', rail: 'right', Component: VibesAndScribes },
];

function ModuleCard({ module, selectedTrackId }) {
  const Component = module.Component;
  return <Component selectedTrackId={selectedTrackId} />;
}

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

  const leftModules = MODULES.filter((module) => module.rail === 'left');
  const rightModules = MODULES.filter((module) => module.rail === 'right');

  return (
    <main className="sovereign-visualizer-page">
      <aside className="sovereign-left-modules">
        {leftModules.map((module) => (
          <ModuleCard key={module.key} module={module} selectedTrackId={selectedTrackId} />
        ))}
      </aside>

      <AudioVisualizerCore
        selectedTrackId={selectedTrackId}
        activeTrackData={activeTrackData}
        tracks={tracks}
        onTrackChange={setSelectedTrackId}
        isPlaying={isPlaying}
        onPlayStateChange={setIsPlaying}
      />

      <aside className="sovereign-right-modules">
        {rightModules.map((module) => (
          <ModuleCard key={module.key} module={module} selectedTrackId={selectedTrackId} />
        ))}
      </aside>
    </main>
  );
}
