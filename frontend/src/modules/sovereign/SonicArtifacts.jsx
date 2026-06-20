import { useEffect, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getSonicArtifactByTrack } from '../../lib/supabase/sonicArtifacts';

export default function SonicArtifacts({ selectedTrackId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    getSonicArtifactByTrack(selectedTrackId).then((payload) => {
      if (active) setData(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  const track = data?.track;
  const artifact = data?.artifact;

  return (
    <SovereignModulePanel eyebrow="Sonic Artifact" title={artifact?.artifact_title || track?.title || 'Artifact Pending'}>
      <p className="text-zinc-400">{artifact?.artifact_summary || track?.core_theme || 'Track metadata will appear here once this artifact is mapped.'}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
        <span>Energy: {track?.energy_level ?? '—'}</span>
        <span>BPM: {track?.bpm ?? '—'}</span>
        <span>Key: {track?.key_signature || '—'}</span>
        <span>Signal: {track?.signal_type || '—'}</span>
      </div>
    </SovereignModulePanel>
  );
}
