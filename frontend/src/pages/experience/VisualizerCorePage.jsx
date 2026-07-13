import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AudioVisualizerCore from '../../modules/sovereign/AudioVisualizerCore';
import SonicArtifacts from '../../modules/sovereign/SonicArtifacts';
import ElementalCodex from '../../modules/sovereign/ElementalCodex';
import Archaetypes from '../../modules/sovereign/Archaetypes';
import LyricalCodex from '../../modules/sovereign/LyricalCodex';
import { getActThreeTracks } from '../../lib/supabase/tracks';
import './VisualizerCorePage.css';

const MODULE_VIEWS = {
  'audio-visualizer-core': { title: 'Audio Visualizer Core', Component: AudioVisualizerCore },
  'elemental-codex': { title: 'Elemental Codex', Component: ElementalCodex },
  'lyrical-codex': { title: 'Lyrical Codex', Component: LyricalCodex },
  'sonic-artifacts': { title: 'Sonic Artifacts', Component: SonicArtifacts },
  archetype: { title: 'Archetype', Component: Archaetypes },
};

export default function VisualizerCorePage() {
  const navigate = useNavigate();
  const { moduleSlug } = useParams();
  const moduleView = MODULE_VIEWS[moduleSlug];
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
    return () => { active = false; };
  }, []);

  const activeTrackData = useMemo(
    () => tracks.find((track) => track.id === selectedTrackId) || null,
    [tracks, selectedTrackId],
  );

  if (!moduleView) {
    return <Navigate to="/experiencemode/sovereign" replace />;
  }

  const { Component } = moduleView;
  const isVisualizer = moduleSlug === 'audio-visualizer-core';

  return (
    <main className={`sovereign-module-page ${isVisualizer ? 'is-visualizer' : ''}`}>
      <header className="sovereign-module-command">
        <button type="button" onClick={() => navigate('/experiencemode/sovereign')}>
          <ChevronLeft aria-hidden="true" /> Sovereign Chamber
        </button>
        <div>
          <span>Reclamation Mainframe</span>
          <strong>{moduleView.title}</strong>
        </div>
        {!isVisualizer && (
          <label>
            <span>Active Track</span>
            <select value={selectedTrackId || ''} onChange={(event) => setSelectedTrackId(event.target.value)} disabled={!tracks.length}>
              {!tracks.length && <option value="">Loading archive…</option>}
              {tracks.map((track) => <option key={track.id} value={track.id}>{track.track_order}. {track.title}</option>)}
            </select>
          </label>
        )}
      </header>

      <section className="sovereign-module-workspace" aria-label={moduleView.title}>
        {isVisualizer ? (
          <Component
            selectedTrackId={selectedTrackId}
            activeTrackData={activeTrackData}
            tracks={tracks}
            onTrackChange={setSelectedTrackId}
            isPlaying={isPlaying}
            onPlayStateChange={setIsPlaying}
          />
        ) : (
          <Component selectedTrackId={selectedTrackId} />
        )}
      </section>
    </main>
  );
}
