import { useEffect, useMemo, useState } from 'react';
import AudioVisualizerCore from '../../modules/sovereign/AudioVisualizerCore';
import SonicArtifacts from '../../modules/sovereign/SonicArtifacts';
import ElementalCodex from '../../modules/sovereign/ElementalCodex';
import Archaetypes from '../../modules/sovereign/Archaetypes';
import LyricalCodex from '../../modules/sovereign/LyricalCodex';
import ReclamationUniversity from '../../modules/sovereign/ReclamationUniversity';
import VibesAndScribes from '../../modules/sovereign/VibesAndScribes';
import { getActThreeTracks } from '../../lib/supabase/tracks';

export default function SovereignMode() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedModuleKey, setSelectedModuleKey] = useState('audio_visualizer_core');
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

  const moduleKeys = [
    'audio_visualizer_core',
    'sonic_artifacts',
    'elemental_codex',
    'archaetypes',
    'lyrical_codex',
    'reclamation_university',
    'vibes_and_scribes'
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-black/30 px-5 py-6 text-white md:px-8">
      <header className="mx-auto mb-5 flex max-w-[1800px] flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.44em] text-red-300/70">Chroma Key Protocol</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.16em] md:text-5xl">Sovereign Mode</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            One living system. One selected track. Every module reacts to the same sonic artifact.
          </p>
        </div>
        <div className="rounded-2xl border border-red-500/25 bg-black/50 px-4 py-3 text-right backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/70">Selected Track</p>
          <p className="mt-1 text-sm font-semibold text-white">{activeTrackData?.title || 'Loading Act Three'}</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1800px] grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <aside className="space-y-4">
          <button type="button" onClick={() => setSelectedModuleKey('sonic_artifacts')} className="w-full text-left">
            <SonicArtifacts selectedTrackId={selectedTrackId} />
          </button>
          <button type="button" onClick={() => setSelectedModuleKey('elemental_codex')} className="w-full text-left">
            <ElementalCodex selectedTrackId={selectedTrackId} />
          </button>
          <button type="button" onClick={() => setSelectedModuleKey('archaetypes')} className="w-full text-left">
            <Archaetypes selectedTrackId={selectedTrackId} />
          </button>
        </aside>

        <section>
          <AudioVisualizerCore
            selectedTrackId={selectedTrackId}
            tracks={tracks}
            onTrackChange={setSelectedTrackId}
            isPlaying={isPlaying}
            onPlayStateChange={setIsPlaying}
          />
          <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-xl">
            {moduleKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedModuleKey(key)}
                className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] ${selectedModuleKey === key ? 'border-red-300 bg-red-900/60 text-white' : 'border-white/10 bg-white/5 text-zinc-500'}`}
              >
                {key.replaceAll('_', ' ')}
              </button>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <button type="button" onClick={() => setSelectedModuleKey('lyrical_codex')} className="w-full text-left">
            <LyricalCodex selectedTrackId={selectedTrackId} />
          </button>
          <button type="button" onClick={() => setSelectedModuleKey('reclamation_university')} className="w-full text-left">
            <ReclamationUniversity selectedTrackId={selectedTrackId} />
          </button>
          <button type="button" onClick={() => setSelectedModuleKey('vibes_and_scribes')} className="w-full text-left">
            <VibesAndScribes selectedTrackId={selectedTrackId} />
          </button>
        </aside>
      </section>
    </main>
  );
}
