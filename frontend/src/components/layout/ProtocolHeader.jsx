const modes = ["cinematic", "artifact", "performance", "immersive", "diagnostic"];

export default function ProtocolHeader({
  visualMode,
  onVisualModeChange,
  onOpenVideoProjector,
  videoProjectorReady = false,
}) {
  return (
    <header className="pva-header">
      <div className="pva-header-act">
        <strong>CKP</strong>
        <span>CKP // RECLAMATION MAINFRAME</span>
        <span>SOVEREIGN MODE</span>
      </div>

      <div className="pva-header-title">
        <h1>CHROMA KEY PROTOCOL</h1>
        <p>LIVE AUDIO REACTOR // PROMETHEAN CORE</p>
      </div>

      <div className="pva-header-status">
        <span>SYSTEM STATUS <b>AUTHORIZED</b></span>
        <label className="pva-mode-chip">
          <span>MODE</span>
          <select value={visualMode} onChange={(e) => onVisualModeChange?.(e.target.value)}>
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          aria-label="Open Act III video projector"
          onClick={onOpenVideoProjector}
          title="Open Act III video projector"
        >
          {videoProjectorReady ? "V4.7.2" : "VRA"}
        </button>
      </div>
    </header>
  );
}
