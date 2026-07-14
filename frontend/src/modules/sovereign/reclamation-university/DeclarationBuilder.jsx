const DEFAULT_FIELDS = [
  { key: 'observation', label: 'The pattern I observed is' },
  { key: 'meaning', label: 'The meaning I retrieved is' },
  { key: 'practice', label: 'The practice I will carry forward is' },
  { key: 'declaration', label: 'The declaration I am authoring is' },
];

export default function DeclarationBuilder({ declaration = {}, declarationFields = DEFAULT_FIELDS, onChange, onComplete, isComplete = false, isSealed = false }) {
  const FIELDS = declarationFields.length > 0 ? declarationFields : DEFAULT_FIELDS;
  return (
    <section className="rec-module-panel rec-module-record">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="rec-module-kicker">Scene 05 • First Law Declaration</p>
          <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Speak the law of the self that cannot be erased.</h4>
        </div>
        <span className={`rec-module-badge ${isComplete ? 'is-hot' : ''}`}>{isSealed ? 'First Law Sealed' : isComplete ? 'Ready to Seal' : 'Four fields required'}</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {FIELDS.map((field) => {
          const key = field.key || field[0];
          const label = field.label || field[1];
          return (
          <label key={key} htmlFor={`${key}-declaration`} className="rec-module-card block p-4">
            <span className="rec-module-badge">{label}</span>
            <textarea
              id={`${key}-declaration`}
              value={declaration[key] || ''}
              onChange={(event) => onChange(key, event.target.value)}
              className="mt-3 min-h-[120px] w-full resize-y rounded-2xl border border-red-500/15 bg-black/60 p-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-700 focus:border-red-300/45"
              placeholder={field.placeholder || 'Write the law here...'}
              aria-describedby={`${key}-declaration-guidance`}
            />
            {(field.feedbackCopy || field.rubricCriteria?.length > 0) && (
              <details id={`${key}-declaration-guidance`} className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3 text-left">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.14em] text-red-200">Response guidance</summary>
                {field.feedbackCopy && <p className="mt-2 text-xs leading-6 text-zinc-300">{field.feedbackCopy}</p>}
                {field.rubricCriteria?.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-zinc-400">
                    {field.rubricCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
                  </ul>
                )}
              </details>
            )}
          </label>
        );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-950/15 p-4 text-sm leading-7 text-zinc-200">
        I seal this declaration as a conscious record of the work completed here.
      </div>

      {isSealed && (
        <div className="rec-module-sealed-record mt-5 rounded-3xl border border-red-300/35 bg-red-950/20 p-5">
          <p className="rec-module-kicker">First Law Sealed</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {FIELDS.map((field) => {
              const key = field.key || field[0];
              const label = field.label || field[1];
              return (
              <div key={key} className="rounded-2xl border border-white/10 bg-black/35 p-3">
                <span className="rec-module-micro text-red-200/70">{label}</span>
                <p className="mt-2 text-sm leading-6 text-zinc-100">{declaration[key]}</p>
              </div>
            );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onComplete}
        disabled={!isComplete}
        className="rec-module-action mt-5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSealed ? 'First Law Sealed' : 'Seal First Law'}
      </button>
    </section>
  );
}
