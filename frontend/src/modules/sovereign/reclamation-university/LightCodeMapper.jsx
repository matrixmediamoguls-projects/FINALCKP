export default function LightCodeMapper({ mappings, selectedShadowCodes, retrievedLightCodes, onRetrieveLightCode }) {
  const activeMappings = mappings.filter((item) => selectedShadowCodes.includes(item.shadowId));

  return (
    <section className="fire-door-panel">
      <p className="fire-door-kicker">Scene 04 • Light Code Retrieval</p>
      <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Convert pressure into law.</h4>

      {activeMappings.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-zinc-500">Mark a Shadow Code to reveal its paired Light Code.</div>
      ) : (
        <div className="mt-5 space-y-3">
          {activeMappings.map((item) => {
            const retrieved = retrievedLightCodes.includes(item.lightId);
            return (
              <article key={item.shadowId} className={`fire-door-card p-4 ${retrieved ? 'is-unlocked' : ''}`}>
                <div className="fire-door-transmute">
                  <div>
                    <span className="fire-door-badge">Shadow Code</span>
                    <h5 className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-200">{item.shadowTitle}</h5>
                  </div>
                  <div className="fire-door-glyph" aria-hidden="true">→</div>
                  <div>
                    <span className="fire-door-badge is-hot">{item.lightId}</span>
                    <h5 className="mt-3 text-base font-semibold uppercase tracking-[0.12em] text-white">{item.lightTitle}</h5>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-zinc-300">{item.activation}</p>
                <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-950/20 p-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-50">{item.replacementLaw}</p>

                <button
                  type="button"
                  onClick={() => onRetrieveLightCode(item.lightId)}
                  className="fire-door-action mt-4 w-full"
                >
                  {retrieved ? 'Code Retrieved' : 'Retrieve Code'}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
