export default function ShadowCodeSelector({ shadowCodes, selectedShadowCodes, onToggleShadowCode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/55 p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/70">Shadow Code Scan</p>
      <h4 className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-white">Name the restriction.</h4>
      <p className="mt-3 text-sm leading-7 text-zinc-400">Select at least one dense pattern the student recognizes. Each selected shadow becomes material for Light Code retrieval.</p>

      <div className="mt-5 space-y-3">
        {shadowCodes.map((code) => {
          const active = selectedShadowCodes.includes(code.id);
          return (
            <button
              type="button"
              key={code.id}
              onClick={() => onToggleShadowCode(code.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${active ? 'border-red-300/60 bg-red-950/35 shadow-[0_0_22px_rgba(239,68,68,0.13)]' : 'border-white/10 bg-white/[0.03] hover:border-red-400/35'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.24em] text-red-200/75">{code.id}</span>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">{active ? 'Selected' : 'Scan'}</span>
              </div>
              <strong className="mt-2 block text-sm uppercase tracking-[0.12em] text-white">{code.title}</strong>
              <p className="mt-2 text-xs leading-6 text-zinc-400">{code.definition}</p>
              <p className="mt-3 rounded-xl border border-red-500/15 bg-red-950/10 p-3 text-xs leading-6 text-zinc-300">{code.diagnostic}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
