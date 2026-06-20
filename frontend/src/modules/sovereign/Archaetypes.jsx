import { useEffect, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getArchetypesByTrack } from '../../lib/supabase/archetypes';

export default function Archaetypes({ selectedTrackId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    getArchetypesByTrack(selectedTrackId).then((payload) => {
      if (active) setItems(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  const primary = items[0];

  return (
    <SovereignModulePanel eyebrow="Archaetype" title={primary?.title || 'Pattern Pending'}>
      <p className="text-zinc-400">{primary?.description || primary?.archetype_role || 'The mythic identity pattern for this track will resolve here.'}</p>
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
        <strong className="block text-red-200">Reclaimed Expression</strong>
        {primary?.reclaimed_expression || 'Unmapped.'}
      </div>
    </SovereignModulePanel>
  );
}
