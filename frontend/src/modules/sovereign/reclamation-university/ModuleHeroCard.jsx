export default function ModuleHeroCard({ moduleMeta, hasEntered, onEnter }) {
  return (
    <section className="rounded-3xl border border-red-500/30 bg-black/70 p-6 shadow-[0_0_55px_rgba(127,29,29,0.28)]">
      {moduleMeta.studentLessonCopy?.length > 0 && (
        <div className="mb-7 rounded-2xl border border-red-500/20 bg-red-950/15 p-5">
          <div className="space-y-4 text-sm leading-7 text-zinc-200">
            {moduleMeta.studentLessonCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.38em] text-red-200/75">{moduleMeta.kicker}</p>
          <h3 className="mt-3 text-3xl font-semibold uppercase tracking-[0.1em] text-white md:text-5xl">{moduleMeta.title}</h3>
          <p className="mt-3 text-sm uppercase tracking-[0.22em] text-red-100/70">{moduleMeta.subtitle}</p>
          {moduleMeta.teacherOpening && <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300">{moduleMeta.teacherOpening}</p>}
        </div>
        <div className="min-w-[220px] rounded-2xl border border-red-400/25 bg-black/50 p-4 text-right">
          <span className="block text-[10px] uppercase tracking-[0.24em] text-zinc-500">Module ID</span>
          <strong className="mt-1 block text-lg uppercase tracking-[0.18em] text-red-100">{moduleMeta.moduleId}</strong>
          <span className="mt-4 block text-[10px] uppercase tracking-[0.24em] text-zinc-500">Element</span>
          <strong className="mt-1 block text-lg uppercase tracking-[0.24em] text-red-200">{moduleMeta.element}</strong>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {moduleMeta.statCards.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <span className="text-[10px] uppercase tracking-[0.24em] text-red-300/70">{item.label}</span>
            <p className="mt-2 text-sm leading-6 text-zinc-200">{item.value}</p>
          </div>
        ))}
      </div>
      <button type="button" onClick={onEnter} className="mt-7 rounded-full border border-red-300/45 bg-red-950/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-red-50 transition hover:border-red-200 hover:bg-red-900/55">
        {hasEntered ? 'Fire Door Active' : 'Enter The Fire Door'}
      </button>
    </section>
  );
}
