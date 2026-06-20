import { useEffect, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getVibesAndScribesByTrack } from '../../lib/supabase/vibesAndScribes';

export default function VibesAndScribes({ selectedTrackId }) {
  const [vibe, setVibe] = useState(null);
  const [entry, setEntry] = useState('');

  useEffect(() => {
    let active = true;
    getVibesAndScribesByTrack(selectedTrackId).then((payload) => {
      if (active) setVibe(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  return (
    <SovereignModulePanel eyebrow="Vibes & Scribes" title={vibe?.vibe_name || 'Reflection Pending'}>
      <p className="text-zinc-400">{vibe?.scribe_prompt || 'The selected track will generate a reflection prompt here.'}</p>
      <textarea
        className="mt-3 min-h-20 w-full rounded-xl border border-white/10 bg-black/45 p-3 text-sm text-white outline-none focus:border-red-400/50"
        value={entry}
        onChange={(event) => setEntry(event.target.value)}
        placeholder="Scribe entry..."
      />
    </SovereignModulePanel>
  );
}
