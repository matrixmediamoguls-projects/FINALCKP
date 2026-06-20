export default function SovereignModulePanel({ eyebrow, title, children, accent = '#ef4444' }) {
  return (
    <section className="rounded-2xl border border-red-500/25 bg-black/45 p-4 shadow-[0_0_35px_rgba(127,29,29,0.22)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-red-300/70">{eyebrow}</p>
          <h2 className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white">{title}</h2>
        </div>
        <span
          className="h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]"
          style={{ color: accent, backgroundColor: accent }}
        />
      </div>
      <div className="text-sm leading-relaxed text-zinc-300">{children}</div>
    </section>
  );
}
