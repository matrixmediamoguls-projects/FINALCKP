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
  { key: 'sonic_artifacts', title: 'Sonic Artifacts', rail: 'left', Component: SonicArtifacts },
  { key: 'elemental_codex', title: 'Elemental Codex', rail: 'left', Component: ElementalCodex },
  { key: 'archaetypes', title: 'Archaetype', rail: 'left', Component: Archaetypes },
  { key: 'lyrical_codex', title: 'Lyrical Codex', rail: 'right', Component: LyricalCodex },
  { key: 'reclamation_university', title: 'Reclamation University', rail: 'right', Component: ReclamationUniversity },
  { key: 'vibes_and_scribes', title: 'Vibes & Scribes', rail: 'right', Component: VibesAndScribes },
];

function ModuleCard({ item, selectedTrackId }) {
  const Component = item.Component;
  return (
    <section className="sovereign-module-card">
      <div className="sovereign-module-card-title">{item.title}</div>
      <Component selectedTrackId={selectedTrackId} />
    </section>
  );
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

  const leftModules = MODULES.filter((item) => item.rail === 'left');
  const rightModules = MODULES.filter((item) => item.rail === 'right');

  return (
    <main className="sovereign-visualizer-page sovereign-module-layout">
      <aside className="sovereign-module-rail">
        {leftModules.map((item) => (
          <ModuleCard key={item.key} item={item} selectedTrackId={selectedTrackId} />
        ))}
      </aside>

      <section className="sovereign-module-center">
        <AudioVisualizerCore
          selectedTrackId={selectedTrackId}
          activeTrackData={activeTrackData}
          tracks={tracks}
          onTrackChange={setSelectedTrackId}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
        />
      </section>

      <aside className="sovereign-module-rail">
        {rightModules.map((item) => (
          <ModuleCard key={item.key} item={item} selectedTrackId={selectedTrackId} />
        ))}
      </aside>
    </main>
  );
}
