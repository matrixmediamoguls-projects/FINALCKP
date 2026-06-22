export default function IntegrationKeyReveal({ isUnlocked, integrationKey, badge, nextPath, requirements }) {
  return (
    <section className={`rounded-3xl border p-5 transition ${isUnlocked ? 'border-red-300/55 bg-red-950/25 shadow-[0_0_35px_rgba(239,68,68,0.18)]' : 'border-white/10 bg-black/55'}`}>
      <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/70">Integration Key</p>
      <h4 className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-white">{isUnlocked ? badge : 'Key Locked'}</h4>
      <p className="mt-4 text-sm leading-7 text-zinc-300">{isUnlocked ? integrationKey : 'Complete the listening chamber, select a Shadow Code, retrieve a Light Code, and seal the declaration to open the key.'}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {requirements.map((item) => (
          <div key={item.label} className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] ${item.complete ? 'border-red-300/35 bg-red-950/25 text-red-50' : 'border-white/10 bg-white/[0.03] text-zinc-500'}`}>
            {item.complete ? '✓ ' : '• '}{item.label}
          </div>
        ))}
      </div>

      {isUnlocked && (
        <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-950/20 p-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Unlocked Next Path</span>
          <strong className="mt-1 block text-sm uppercase tracking-[0.18em] text-red-50">{nextPath}</strong>
        </div>
      )}
    </section>
  );
}
