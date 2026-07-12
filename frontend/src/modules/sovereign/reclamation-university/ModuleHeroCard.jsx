export default function ModuleHeroCard({ moduleMeta, hasEntered, onEnter, actionLabel }) {
  return (
    <section className="fire-door-hero">
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
          <p className="fire-door-kicker">{moduleMeta.kicker}</p>
          <h3 className="mt-3 text-4xl font-semibold uppercase tracking-[0.1em] text-white md:text-6xl">{moduleMeta.title}</h3>
          <p className="mt-3 text-sm uppercase tracking-[0.22em] text-red-100/70">{moduleMeta.subtitle}</p>
          {moduleMeta.teacherOpening && <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300">{moduleMeta.teacherOpening}</p>}
        </div>
        <div className="min-w-[220px] rounded-2xl border border-red-400/25 bg-black/50 p-4 text-right">
          <span className="fire-door-micro block text-zinc-500">Module ID</span>
          <strong className="mt-1 block text-lg uppercase tracking-[0.18em] text-red-100">{moduleMeta.moduleId}</strong>
          <span className="fire-door-micro mt-4 block text-zinc-500">Identity State</span>
          <strong className="mt-1 block text-lg uppercase tracking-[0.22em] text-red-200">{hasEntered ? 'Rising Seeker' : moduleMeta.identityState}</strong>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {moduleMeta.statCards.map((item) => (
          <div key={item.label} className="fire-door-card p-4">
            <span className="fire-door-badge">{item.label}</span>
            <p className="mt-3 text-sm leading-6 text-zinc-200">{item.value}</p>
          </div>
        ))}
      </div>

      {moduleMeta.learningObjectives?.length > 0 && (
        <section className="mt-6 rounded-2xl border border-red-500/20 bg-black/35 p-5" aria-labelledby="module-learning-objectives">
          <p id="module-learning-objectives" className="fire-door-kicker">Measurable learning objectives</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
            {moduleMeta.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}
          </ul>
        </section>
      )}

      <button type="button" onClick={onEnter} className="fire-door-action mt-7">
        {actionLabel || (hasEntered ? 'Transmission Received' : 'Initiate Protocol')}
      </button>
    </section>
  );
}
