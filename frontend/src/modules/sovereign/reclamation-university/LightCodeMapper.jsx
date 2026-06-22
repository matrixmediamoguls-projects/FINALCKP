export default function LightCodeMapper({ mappings, selectedShadowCodes, retrievedLightCodes, onRetrieveLightCode }) {
  const activeMappings = mappings.filter((item) => selectedShadowCodes.includes(item.shadowId));

  return (
    <section className="rounded-3xl border border-white/10 bg-black/55 p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/70">Light Code Retrieval</p>
      <h4 className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-white">Convert pressure into law.</h4>

      {activeMappings.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-zinc-500">Select a Shadow Code to reveal its paired Light Code.</div>
      ) : (
        <div className="mt-5 space-y-3">
          {activeMappings.map((item) => {
            const retrieved = retrievedLightCodes.includes(item.lightId);
            return (
              <article key={item.shadowId} className="rounded-2xl border border-red-500/20 bg-red-950/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">{item.shadowTitle}</span>
                    <h5 className="mt-1 text-base font-semibold uppercase tracking-[0.12em] text-white">{item.lightTitle}</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRetrieveLightCode(item.lightId)}
                    className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em] ${retrieved ? 'border-red-200/60 bg-red-600/25 text-red-50' : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-red-300/40 hover:text-red-100'}`}
                  >
                    {retrieved ? 'Retrieved' : 'Retrieve'}
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{item.activation}</p>
                <p className="mt-4 rounded-xl border border-red-400/20 bg-red-950/20 p-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-50">{item.replacementLaw}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
