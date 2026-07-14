import { useState } from 'react';

export default function ShadowCodeSelector({ shadowCodes, selectedShadowCodes, onToggleShadowCode }) {
  const [diagnosticFrame, setDiagnosticFrame] = useState('personal');

  return (
    <section className="rec-module-panel" aria-labelledby="shadow-code-heading">
      <p className="rec-module-kicker">Scene 03 • Shadow Code Scan</p>
      <h4 id="shadow-code-heading" className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Name the restriction.</h4>
      <p className="mt-3 text-sm leading-7 text-zinc-400">Name what attempted to restrict, redirect, or rename the signal. Each marked Shadow Code becomes material for retrieval.</p>

      <fieldset className="mt-4">
        <legend className="rec-module-micro text-red-200/70">Diagnostic frame</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {['personal', 'collective'].map((frame) => (
            <button
              key={frame}
              type="button"
              className={`rec-module-secondary-action ${diagnosticFrame === frame ? 'is-active' : ''}`}
              aria-pressed={diagnosticFrame === frame}
              onClick={() => setDiagnosticFrame(frame)}
            >
              {frame === 'personal' ? 'Personal / individual' : 'Collective / ancestral'}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 space-y-3">
        {shadowCodes.map((code) => {
          const active = selectedShadowCodes.includes(code.id);
          return (
            <button
              type="button"
              key={code.id}
              onClick={() => onToggleShadowCode(code.id)}
              aria-pressed={active}
              className={`rec-module-card w-full p-4 text-left transition ${active ? 'is-active' : ''}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rec-module-badge is-hot" title={code.id}>{code.displayId || code.id}</span>
                <span className={`rec-module-badge ${active ? 'is-hot' : ''}`}>{active ? 'Marked for Retrieval' : 'Run Scan'}</span>
              </div>
              <strong className="mt-3 block text-base uppercase tracking-[0.12em] text-white">{code.title}</strong>
              <p className="mt-2 text-sm leading-7 text-zinc-400">{code.definition}</p>
              <p className="mt-4 rounded-2xl border border-red-500/15 bg-red-950/10 p-3 text-sm leading-6 text-zinc-200">
                {diagnosticFrame === 'collective' ? code.collectiveDiagnostic : code.diagnostic}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
