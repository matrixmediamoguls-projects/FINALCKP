export default function SystemStatusBar({
  intensity,
  particlesEnabled,
  visualsRunning,
  theme,
}) {
  return (
    <section className="pva-system-bar">
      <div>
        <span>REACTIVE</span>
        <strong>{intensity > 35 ? "ACTIVE" : "READY"}</strong>
      </div>
      <div>
        <span>PARTICLES</span>
        <strong>{particlesEnabled ? "ENABLED" : "DISABLED"}</strong>
      </div>
      <div>
        <span>VISUALS</span>
        <strong>{visualsRunning ? "RUNNING" : "IDLE"}</strong>
      </div>
      <div>
        <span>THEME</span>
        <strong>{theme}</strong>
      </div>
    </section>
  );
}
