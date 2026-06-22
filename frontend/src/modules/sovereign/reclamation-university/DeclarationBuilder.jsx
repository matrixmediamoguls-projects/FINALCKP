const FIELDS = [
  ['restriction', 'The restriction I am no longer allowing to define me is'],
  ['authorship', 'The part of my authorship I am reclaiming is'],
  ['fireLesson', 'The fire I once feared is now teaching me'],
  ['newLaw', 'The law I speak over my next chapter is'],
];

export default function DeclarationBuilder({ declaration, onChange, onComplete, isComplete }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/55 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/70">Fire Door Declaration</p>
          <h4 className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-white">Sign the first law.</h4>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${isComplete ? 'border-red-200/60 text-red-100' : 'border-white/10 text-zinc-500'}`}>{isComplete ? 'Declaration Ready' : 'Four fields required'}</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {FIELDS.map(([key, label]) => (
          <label key={key} className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-red-200/70">{label}</span>
            <textarea
              value={declaration[key] || ''}
              onChange={(event) => onChange(key, event.target.value)}
              className="mt-3 min-h-[110px] w-full resize-y rounded-xl border border-red-500/15 bg-black/60 p-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-red-300/45"
              placeholder="Write the law here..."
            />
          </label>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-950/15 p-4 text-sm leading-7 text-zinc-200">
        I sign my own authorship. I enter the fire awake.
      </div>

      <button
        type="button"
        onClick={onComplete}
        disabled={!isComplete}
        className="mt-5 rounded-full border border-red-300/45 bg-red-950/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-red-50 transition enabled:hover:border-red-200 enabled:hover:bg-red-900/55 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-zinc-600"
      >
        Seal Declaration
      </button>
    </section>
  );
}
