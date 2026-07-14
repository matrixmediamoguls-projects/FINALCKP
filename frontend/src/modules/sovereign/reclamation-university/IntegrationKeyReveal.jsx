export default function IntegrationKeyReveal({ isUnlocked, integrationKey, badge, nextPath, requirements }) {
  return (
    <section className={`rec-module-panel ${isUnlocked ? 'is-unlocked' : ''}`}>
      <p className="rec-module-kicker">Scene 06 • Integration Threshold</p>
      <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">{isUnlocked ? badge : 'Integration Locked'}</h4>
      <p className="mt-4 text-sm leading-7 text-zinc-300">{isUnlocked ? integrationKey : 'Complete every configured module requirement to unlock the Integration Key.'}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {requirements.map((item) => (
          <div key={item.label} className={`rec-module-badge ${item.complete ? 'is-hot' : ''}`}>
            {item.complete ? '✓ ' : '• '}{item.label}
          </div>
        ))}
      </div>

      {isUnlocked && (
        <div className="mt-5 rounded-3xl border border-red-400/25 bg-red-950/20 p-5">
          <span className="rec-module-kicker">Reclaimer State Unlocked</span>
          <strong className="mt-2 block text-lg uppercase tracking-[0.18em] text-red-50">{nextPath}</strong>
        </div>
      )}
    </section>
  );
}
