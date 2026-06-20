import { useEffect, useMemo, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getReclamationUniversityByTrack } from '../../lib/supabase/reclamationUniversity';

const AREAS = [
  {
    key: 'fire',
    label: 'Fire Protocol',
    title: 'Reflection becomes command.',
    body: 'Act III turns awareness into movement, authorship, construction, and visible action.',
    points: ['Ignition', 'Command', 'Construction'],
  },
  {
    key: 'hermetic',
    label: 'Hermetic Code',
    title: 'As within, so without.',
    body: 'Thought, speech, will, and action are treated as one connected operating structure.',
    points: ['Mind', 'Correspondence', 'Coherence'],
  },
  {
    key: 'promethean',
    label: 'Promethean Code',
    title: 'The torch is agency returned.',
    body: 'The Promethean layer frames Fire as reclaimed agency, disciplined heat, and creative authorship.',
    points: ['Torch', 'Flame', 'Authorship'],
  },
  {
    key: 'curriculum',
    label: 'Track Curriculum',
    title: 'Every track becomes a teaching key.',
    body: 'Each Act III song can resolve into a lesson packet, shadow pressure, light code, and field assignment.',
    points: ['Track lesson', 'Light code', 'Assignment'],
  },
  {
    key: 'lab',
    label: 'Practice Lab',
    title: 'Education becomes executable.',
    body: 'The lesson has to become an action step the user can name, write, and apply.',
    points: ['Name', 'Apply', 'Integrate'],
  },
];

const LADDER = [
  ['01', 'Diagnose', 'Name the pattern.'],
  ['02', 'Ignite', 'Find the fire point.'],
  ['03', 'Command', 'Declare the new structure.'],
  ['04', 'Transmit', 'Turn the lesson outward.'],
  ['05', 'Construct', 'Build the next form.'],
];

const LESSONS = [
  'Threshold Ignition',
  'Authorship Recovery',
  'Mental Architecture',
  'Sacred Invocation',
  'Witness Logic',
  'Signal Transmission',
  'Language Reclamation',
  'Elemental Integration',
  'Aftermath Architecture',
];

function AreaButton({ area, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-left ${active ? 'border-red-400/60 bg-red-950/35 text-white' : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-red-400/35 hover:text-zinc-100'}`}
    >
      <span className="block text-[10px] uppercase tracking-[0.22em] text-red-300/70">University Area</span>
      <strong className="mt-1 block text-xs uppercase tracking-[0.16em]">{area.label}</strong>
    </button>
  );
}

export default function ReclamationUniversity({ selectedTrackId }) {
  const [lesson, setLesson] = useState(null);
  const [activeKey, setActiveKey] = useState('fire');

  useEffect(() => {
    let active = true;
    getReclamationUniversityByTrack(selectedTrackId).then((payload) => {
      if (active) setLesson(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  const activeArea = useMemo(() => AREAS.find((area) => area.key === activeKey) || AREAS[0], [activeKey]);

  return (
    <SovereignModulePanel eyebrow="Reclamation University" title="Fire Protocol Academy">
      <div className="space-y-5">
        <section className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/35 via-black/60 to-black/80 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-red-300/75">Master Educational Outlet</p>
              <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Act III: Reclamation</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">A professional learning hub for the Fire Act, organized around Fire, Hermetic code, Promethean code, track lessons, and applied practice.</p>
            </div>
            <div className="rounded-xl border border-red-400/25 bg-black/45 px-4 py-3 text-right">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-zinc-500">Core Element</span>
              <strong className="block text-lg uppercase tracking-[0.22em] text-red-200">Fire</strong>
              <small className="text-xs uppercase tracking-[0.16em] text-zinc-500">Ignition / Command / Build</small>
            </div>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-5">
          {AREAS.map((area) => (
            <AreaButton key={area.key} area={area} active={activeArea.key === area.key} onClick={() => setActiveKey(area.key)} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-red-300/70">{activeArea.label}</p>
            <h4 className="mt-2 text-xl font-semibold uppercase tracking-[0.1em] text-white">{activeArea.title}</h4>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{activeArea.body}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {activeArea.points.map((item) => (
                <div key={item} className="rounded-xl border border-red-500/15 bg-red-950/15 p-3 text-xs uppercase tracking-[0.14em] text-zinc-300">{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-red-300/70">Selected Track Lesson</p>
            <h4 className="mt-2 text-lg font-semibold uppercase tracking-[0.1em] text-white">{lesson?.lesson_title || 'Lesson Packet Pending'}</h4>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{lesson?.summary || 'When lesson data exists for the active track, this panel becomes the track-specific teaching packet.'}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              <span className="rounded-lg border border-white/10 bg-black/35 p-2">{lesson?.lesson_type || 'Protocol Lesson'}</span>
              <span className="rounded-lg border border-white/10 bg-black/35 p-2">{lesson?.estimated_minutes ? `${lesson.estimated_minutes} min` : '— min'}</span>
              <span className="rounded-lg border border-white/10 bg-black/35 p-2">{lesson?.difficulty_level || 'Fire Level'}</span>
              <span className="rounded-lg border border-white/10 bg-black/35 p-2">{lesson?.is_required ? 'Required' : 'Optional'}</span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-red-300/70">Fire Ladder</p>
            <div className="mt-4 space-y-3">
              {LADDER.map(([number, title, body]) => (
                <div key={number} className="grid grid-cols-[38px_1fr] gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-red-400/35 text-xs text-red-200">{number}</span>
                  <div>
                    <strong className="block text-xs uppercase tracking-[0.18em] text-white">{title}</strong>
                    <p className="mt-1 text-xs leading-6 text-zinc-400">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/45 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-red-300/70">University Index</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {LESSONS.map((item) => (
                <div key={item} className="rounded-xl border border-red-500/15 bg-red-950/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-300">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SovereignModulePanel>
  );
}
