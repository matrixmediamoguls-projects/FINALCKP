import { useEffect, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getLyricsProtocolByTrack } from '../../lib/supabase/lyricsProtocol';

export default function LyricalCodex({ selectedTrackId }) {
  const [lyrics, setLyrics] = useState(null);

  useEffect(() => {
    let active = true;
    getLyricsProtocolByTrack(selectedTrackId).then((payload) => {
      if (active) setLyrics(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  const keyLines = Array.isArray(lyrics?.key_lines) ? lyrics.key_lines.slice(0, 3) : [];

  return (
    <SovereignModulePanel eyebrow="Lyrical Codex" title={lyrics?.primary_light_code || 'Lyrics Pending'}>
      <p className="text-zinc-400">{lyrics?.lyric_summary || lyrics?.hidden_meaning || 'Lyric decoding will appear when this track receives lyrics_protocol data.'}</p>
      {keyLines.length > 0 && (
        <ul className="mt-3 space-y-2 text-xs text-red-100/80">
          {keyLines.map((line, index) => (
            <li key={`${line}-${index}`} className="rounded-lg border border-red-500/15 bg-red-950/20 p-2">{line}</li>
          ))}
        </ul>
      )}
    </SovereignModulePanel>
  );
}
