import { useEffect, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getElementalCodexByTrack } from '../../lib/supabase/elementalCodex';

export default function ElementalCodex({ selectedTrackId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    getElementalCodexByTrack(selectedTrackId).then((payload) => {
      if (active) setData(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  const act = data?.act;
  const codex = data?.codex;
  const accent = codex?.color_hex || act?.color_hex || '#ef4444';

  return (
    <SovereignModulePanel eyebrow="Elemental Codex" title={codex?.title || act?.element || 'Fire'} accent={accent}>
      <p>{codex?.summary || act?.description || 'Elemental decoding activates once the selected track is mapped to its act force.'}</p>
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
        <strong className="block text-red-200">Activation</strong>
        {codex?.activation_prompt || 'What force is this track asking the listener to reclaim?'}
      </div>
    </SovereignModulePanel>
  );
}
