import { useEffect, useMemo, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getActThreeTracks } from '../../lib/supabase/tracks';
import { getLyricsProtocolByTrack, getLyricsProtocolForTracks } from '../../lib/supabase/lyricsProtocol';

const QUESTION_STARTERS = [
  'What does this lyric mean inside Reclamation?',
  'What is the shadow code in this line?',
  'What is the light code in this line?',
  'How does this connect to Fire?',
];

function lyricText(record) {
  return record?.lyrics_full || record?.lyrics_clean || '';
}

function splitLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function trackLabel(track) {
  if (!track) return 'No Track Selected';
  return `${String(track.track_order || '').padStart(2, '0')} · ${track.title || 'Untitled Track'}`;
}

function buildLineInfo(line, lyrics) {
  const lower = line.toLowerCase();
  const signals = [];
  if (/fire|flame|burn|ignite|torch|ash/.test(lower)) signals.push('Fire marker');
  if (/code|protocol|signal|frequency|system/.test(lower)) signals.push('Protocol marker');
  if (/speak|voice|name|truth|word/.test(lower)) signals.push('Voice marker');
  if (/mirror|shadow|witness|memory|reflection/.test(lower)) signals.push('Inner archive marker');

  return {
    signals: signals.length ? signals : ['Context marker'],
    text:
      lyrics?.hidden_meaning ||
      lyrics?.lyric_summary ||
      lyrics?.primary_light_code ||
      'No detailed textual note is stored for this line yet. Use the question panel to frame a lyric-specific inquiry.',
  };
}

function answerQuestion(question, selectedLine, lyrics, track) {
  if (!question.trim()) return 'Ask a lyric-specific question to generate a focused interpretation panel.';
  if (!selectedLine) return 'Select or hover a lyric line first so the question can be anchored to a specific line.';

  const info = buildLineInfo(selectedLine, lyrics);
  const lightCode = lyrics?.primary_light_code || 'No primary light code stored yet';
  const summary = lyrics?.lyric_summary || lyrics?.hidden_meaning || 'No stored summary is available for this track yet.';

  return `${trackLabel(track)}\n\nSelected lyric:\n“${selectedLine}”\n\nQuestion:\n${question}\n\nInterpretive frame:\n${info.signals.join(' / ')}. ${summary}\n\nPrimary light code:\n${lightCode}`;
}

export default function LyricalCodex({ selectedTrackId }) {
  const [tracks, setTracks] = useState([]);
  const [lyricBank, setLyricBank] = useState([]);
  const [activeTrackId, setActiveTrackId] = useState(selectedTrackId);
  const [lyrics, setLyrics] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [hoveredLine, setHoveredLine] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (selectedTrackId) setActiveTrackId(selectedTrackId);
  }, [selectedTrackId]);

  useEffect(() => {
    let active = true;
    getActThreeTracks().then((items) => {
      if (!active) return;
      setTracks(items);
      setActiveTrackId((current) => current || items[0]?.id || null);
      getLyricsProtocolForTracks(items.map((track) => track.id)).then((records) => {
        if (active) setLyricBank(records);
      });
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getLyricsProtocolByTrack(activeTrackId).then((payload) => {
      if (active) {
        setLyrics(payload);
        setSelectedLine('');
        setHoveredLine('');
        setAnswer('');
      }
    });
    return () => {
      active = false;
    };
  }, [activeTrackId]);

  const activeTrack = useMemo(() => tracks.find((track) => track.id === activeTrackId) || null, [tracks, activeTrackId]);
  const activeLines = useMemo(() => splitLines(lyricText(lyrics)), [lyrics]);
  const keyLines = Array.isArray(lyrics?.key_lines) ? lyrics.key_lines : [];
  const inspectLine = hoveredLine || selectedLine;
  const lineInfo = inspectLine ? buildLineInfo(inspectLine, lyrics) : null;

  const filteredTracks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tracks;

    return tracks.filter((track) => {
      const bankRecord = lyricBank.find((record) => record.track_id === track.id);
      return [track.title, lyricText(bankRecord), bankRecord?.lyric_summary, bankRecord?.hidden_meaning, bankRecord?.primary_light_code]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [tracks, lyricBank, search]);

  const runQuestion = () => {
    setAnswer(answerQuestion(question, selectedLine, lyrics, activeTrack));
  };

  return (
    <SovereignModulePanel eyebrow="Lyrical Codex" title="Interactive Lyric Bank">
      <div className="space-y-5">
        <section className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/30 via-black/70 to-black p-5">
          <p className="text-[10px] uppercase tracking-[0.32em] text-red-300/75">Reclamation Lyric Bank</p>
          <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Search every Act III song</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-300">Select a track, scan the lyric body, highlight a line for contextual notes, or ask a focused question about a specific lyric.</p>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_0.9fr]">
          <aside className="rounded-2xl border border-white/10 bg-black/45 p-4">
            <label className="text-[10px] uppercase tracking-[0.24em] text-red-300/70" htmlFor="lyric-search">Search Bank</label>
            <input
              id="lyric-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, lyric, light code..."
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-400/50"
            />
            <div className="mt-4 max-h-[520px] space-y-2 overflow-auto pr-1">
              {filteredTracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setActiveTrackId(track.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left text-xs uppercase tracking-[0.12em] ${track.id === activeTrackId ? 'border-red-400/60 bg-red-950/35 text-white' : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-red-400/35 hover:text-zinc-100'}`}
                >
                  {trackLabel(track)}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-white/10 bg-black/50 p-4">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-red-300/70">Active Track</p>
                <h4 className="mt-1 text-xl font-semibold uppercase tracking-[0.1em] text-white">{trackLabel(activeTrack)}</h4>
              </div>
              <span className="rounded-full border border-red-400/30 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-red-200">{activeLines.length || keyLines.length} lines</span>
            </div>

            <div className="max-h-[610px] space-y-2 overflow-auto pr-1">
              {(activeLines.length ? activeLines : keyLines).map((line, index) => (
                <button
                  key={`${line}-${index}`}
                  type="button"
                  onMouseEnter={() => setHoveredLine(line)}
                  onFocus={() => setHoveredLine(line)}
                  onMouseLeave={() => setHoveredLine('')}
                  onClick={() => setSelectedLine(line)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm leading-7 ${selectedLine === line ? 'border-red-400/60 bg-red-950/35 text-red-50' : 'border-white/10 bg-white/[0.025] text-zinc-300 hover:border-red-400/35 hover:bg-red-950/20 hover:text-white'}`}
                >
                  {line}
                </button>
              ))}
              {!activeLines.length && !keyLines.length && (
                <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-zinc-400">No lyric body is stored for this track yet. Add lyrics_protocol data and this bank will render it here.</p>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-red-300/70">Hover / Highlight Context</p>
              <h4 className="mt-2 text-base font-semibold uppercase tracking-[0.12em] text-white">{inspectLine ? 'Line Intelligence' : 'No line selected'}</h4>
              {inspectLine && (
                <div className="mt-3 space-y-3">
                  <p className="rounded-xl border border-red-500/15 bg-red-950/15 p-3 text-sm leading-7 text-red-50">{inspectLine}</p>
                  <p className="text-sm leading-7 text-zinc-300">{lineInfo?.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {lineInfo?.signals.map((signal) => (
                      <span key={signal} className="rounded-full border border-red-400/25 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-red-200">{signal}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/45 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-red-300/70">Ask About This Lyric</p>
              <div className="mt-3 grid gap-2">
                {QUESTION_STARTERS.map((starter) => (
                  <button key={starter} type="button" onClick={() => setQuestion(starter)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs leading-5 text-zinc-400 hover:border-red-400/35 hover:text-white">{starter}</button>
                ))}
              </div>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a question about the selected lyric..."
                className="mt-3 min-h-28 w-full rounded-xl border border-white/10 bg-black/60 p-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-400/50"
              />
              <button type="button" onClick={runQuestion} className="mt-3 w-full rounded-xl border border-red-400/45 bg-red-950/35 px-4 py-3 text-xs uppercase tracking-[0.18em] text-red-100 hover:bg-red-900/35">Generate Lyric Reading</button>
              {answer && <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-red-500/15 bg-red-950/15 p-3 text-xs leading-6 text-zinc-200">{answer}</pre>}
            </section>
          </aside>
        </section>
      </div>
    </SovereignModulePanel>
  );
}
