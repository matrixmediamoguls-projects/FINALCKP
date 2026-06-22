export default function ShadowCodeSelector({ shadowCodes, selectedShadowCodes, onToggleShadowCode }) {
  return (
    <section className="fire-door-panel">
      <p className="fire-door-kicker">Scene 03 • Shadow Code Scan</p>
      <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Name the restriction.</h4>
      <p className="mt-3 text-sm leading-7 text-zinc-400">Name what attempted to restrict, redirect, or rename the signal. Each marked Shadow Code becomes material for retrieval.</p>

      <div className="mt-5 space-y-3">
        {shadowCodes.map((code) => {
          const active = selectedShadowCodes.includes(code.id);
          return (
            <button
              type="button"
              key={code.id}
              onClick={() => onToggleShadowCode(code.id)}
              className={`fire-door-card w-full p-4 text-left transition ${active ? 'is-active' : ''}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="fire-door-badge is-hot">{code.id}</span>
                <span className={`fire-door-badge ${active ? 'is-hot' : ''}`}>{active ? 'Marked for Retrieval' : 'Run Scan'}</span>
              </div>
              <strong className="mt-3 block text-base uppercase tracking-[0.12em] text-white">{code.title}</strong>
              <p className="mt-2 text-sm leading-7 text-zinc-400">{code.definition}</p>
              <p className="mt-4 rounded-2xl border border-red-500/15 bg-red-950/10 p-3 text-sm leading-6 text-zinc-200">{code.diagnostic}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
