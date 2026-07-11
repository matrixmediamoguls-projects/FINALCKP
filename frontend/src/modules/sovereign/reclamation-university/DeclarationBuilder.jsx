const DEFAULT_FIELDS = [
  { key: 'restriction', label: 'The restriction I am no longer allowing to define me is' },
  { key: 'authorship', label: 'The part of my authorship I am reclaiming is' },
  { key: 'fireLesson', label: 'The fire I once feared is now teaching me' },
  { key: 'newLaw', label: 'The law I speak over my next chapter is' },
];

export default function DeclarationBuilder({ declaration = {}, declarationFields = DEFAULT_FIELDS, onChange, onComplete, isComplete = false, isSealed = false }) {
  const FIELDS = declarationFields.length > 0 ? declarationFields : DEFAULT_FIELDS;
  return (
    <section className="fire-door-panel fire-door-record">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="fire-door-kicker">Scene 05 • First Law Declaration</p>
          <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Speak the law of the self that cannot be erased.</h4>
        </div>
        <span className={`fire-door-badge ${isComplete ? 'is-hot' : ''}`}>{isSealed ? 'First Law Sealed' : isComplete ? 'Ready to Seal' : 'Four fields required'}</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {FIELDS.map((field) => {
          const key = field.key || field[0];
          const label = field.label || field[1];
          return (
          <label key={key} className="fire-door-card block p-4">
            <span className="fire-door-badge">{label}</span>
            <textarea
              value={declaration[key] || ''}
              onChange={(event) => onChange(key, event.target.value)}
              className="mt-3 min-h-[120px] w-full resize-y rounded-2xl border border-red-500/15 bg-black/60 p-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-700 focus:border-red-300/45"
              placeholder="Write the law here..."
            />
          </label>
        );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-950/15 p-4 text-sm leading-7 text-zinc-200">
        I sign my own authorship. I cross the Fire Door awake.
      </div>

      {isSealed && (
        <div className="fire-door-sealed-record mt-5 rounded-3xl border border-red-300/35 bg-red-950/20 p-5">
          <p className="fire-door-kicker">First Law Sealed</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {FIELDS.map((field) => {
              const key = field.key || field[0];
              const label = field.label || field[1];
              return (
              <div key={key} className="rounded-2xl border border-white/10 bg-black/35 p-3">
                <span className="fire-door-micro text-red-200/70">{label}</span>
                <p className="mt-2 text-sm leading-6 text-zinc-100">{declaration[key]}</p>
              </div>
            );
            })
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onComplete}
        disabled={!isComplete}
        className="fire-door-action mt-5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSealed ? 'First Law Sealed' : 'Seal First Law'}
      </button>
    </section>
  );
}
