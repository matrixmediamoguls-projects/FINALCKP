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
import './VisualizerCorePage.css';
import './VisualizerCorePagePolish.css';

export default function VisualizerCorePage() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(3);
  const [openModuleKey, setOpenModuleKey] = useState(null);
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

  const activeCard = MODULE_CARDS[activeModuleIndex];
  const openCard = MODULE_CARDS.find((card) => card.key === openModuleKey);
  const OpenModule = openCard?.Component;

  const rotateCarousel = (direction) => {
    setActiveModuleIndex((current) => (current + direction + MODULE_CARDS.length) % MODULE_CARDS.length);
  };

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
