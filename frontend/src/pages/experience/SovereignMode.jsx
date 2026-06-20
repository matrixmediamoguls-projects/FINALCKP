import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AudioVisualizerCore from '../../modules/sovereign/AudioVisualizerCore';
import SonicArtifacts from '../../modules/sovereign/SonicArtifacts';
import ElementalCodex from '../../modules/sovereign/ElementalCodex';
import Archaetypes from '../../modules/sovereign/Archaetypes';
import LyricalCodex from '../../modules/sovereign/LyricalCodex';
import ReclamationUniversity from '../../modules/sovereign/ReclamationUniversity';
import VibesAndScribes from '../../modules/sovereign/VibesAndScribes';
import { getActThreeTracks } from '../../lib/supabase/tracks';
import '../SelfDirectedSovereignMode.css';

const MODULE_CARDS = [
  { key: 'sonic_artifacts', label: 'Sonic Artifacts', Component: SonicArtifacts, image: '/media/sovereign-mode/module-cards/sonic-artifacts.png' },
  { key: 'elemental_codex', label: 'Elemental Codex', Component: ElementalCodex, image: '/media/sovereign-mode/module-cards/elemental-codex.png' },
  { key: 'archaetypes', label: 'Archaetype', Component: Archaetypes, image: '/media/sovereign-mode/module-cards/archetype.png' },
  { key: 'visualizer_core', label: 'Visualizer Core', Component: AudioVisualizerCore, image: '/media/sovereign-mode/module-cards/visualizer-core.png' },
  { key: 'lyrical_codex', label: 'Lyrical Codex', Component: LyricalCodex, image: '/media/sovereign-mode/module-cards/lyrical-codex.png' },
  { key: 'reclamation_university', label: 'Reclamation University', Component: ReclamationUniversity, image: '/media/sovereign-mode/module-cards/reclamation-university.png' },
  { key: 'vibes_and_scribes', label: 'Vibes & Scribes', Component: VibesAndScribes, image: '/media/sovereign-mode/module-cards/vibes-and-scribes.png' },
];

function getCarouselOffset(index, activeIndex) {
  const total = MODULE_CARDS.length;
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function ModuleCard({ card, index, activeIndex, onSelect }) {
  const offset = getCarouselOffset(index, activeIndex);

  return (
    <button
      type="button"
      className={`sos-module-card ${offset === 0 ? 'is-active' : ''}`}
      data-offset={offset}
      data-module-key={card.key}
      style={{ '--card-order': 10 - Math.abs(offset) }}
      onClick={() => onSelect(index)}
      aria-label={`Open ${card.label}`}
    >
      <img className="sos-card-art" src={card.image} alt={card.label} draggable="false" />
    </button>
  );
}

export default function SovereignMode() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(3);
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

  const activeCard = MODULE_CARDS[activeModuleIndex];
  const ActiveModule = activeCard.Component;

  const rotateCarousel = (direction) => {
    setActiveModuleIndex((current) => (current + direction + MODULE_CARDS.length) % MODULE_CARDS.length);
  };

  return (
    <main className="sos-page" style={{ '--parallax-x': 0, '--parallax-y': 0, '--deck-zoom': 1 }}>
      <div className="sos-chamber" aria-hidden="true" />
      <div className="sos-depth-field" aria-hidden="true" />
      <div className="sos-orbital-light sos-orbital-light--one" aria-hidden="true" />
      <div className="sos-orbital-light sos-orbital-light--two" aria-hidden="true" />
      <div className="sos-particles" aria-hidden="true" />
      <div className="sos-vignette" aria-hidden="true" />
      <div className="sos-violet-conduits" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>

      <div className="sos-promethean-core" aria-hidden="true">
        <div className="sos-core-flame" />
        <div className="sos-core-aura" />
        <div className="sos-core-reflection" />
        <div className="sos-core-embers" />
      </div>

      <section className="sos-operating-stage" aria-label="Sovereign module carousel">
        <button type="button" className="sos-stage-arrow sos-stage-arrow--left" onClick={() => rotateCarousel(-1)} aria-label="Previous module">
          <ChevronLeft />
        </button>
        <div className="sos-card-deck">
          {MODULE_CARDS.map((card, index) => (
            <ModuleCard key={card.key} card={card} index={index} activeIndex={activeModuleIndex} onSelect={setActiveModuleIndex} />
          ))}
        </div>
        <button type="button" className="sos-stage-arrow sos-stage-arrow--right" onClick={() => rotateCarousel(1)} aria-label="Next module">
          <ChevronRight />
        </button>
      </section>

      <section className="sos-core-readout" aria-label="Active sovereign module">
        <span>Selected Sovereign Module</span>
        <div>
          <i aria-hidden="true" />
          <small>{activeTrackData?.title || 'Act Three Reclamation'}</small>
          <strong>{activeCard.label}</strong>
        </div>
      </section>

      <div hidden>
        {activeCard.key === 'visualizer_core' ? (
          <ActiveModule
            selectedTrackId={selectedTrackId}
            activeTrackData={activeTrackData}
            tracks={tracks}
            onTrackChange={setSelectedTrackId}
            isPlaying={isPlaying}
            onPlayStateChange={setIsPlaying}
          />
        ) : (
          <ActiveModule selectedTrackId={selectedTrackId} />
        )}
      </div>
    </main>
  );
}
