import { Menu, Settings2 } from "lucide-react";

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
        <strong>ACT THREE</strong>
        <span>RECLAMATION</span>
      </div>

      <div className="pva-header-title">
        <h1>CHROMA KEY PROTOCOL</h1>
        <p>AUDIO PROTOCOL ENGINE</p>
      </div>

      <div className="pva-header-status">
        <span>PROTOCOL STATUS: ONLINE</span>
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
          {videoProjectorReady ? "MEDIA LIVE" : "VRA MODULE"}
        </button>
        <button type="button" aria-label="Settings">
          <Settings2 size={16} />
        </button>
        <button type="button" aria-label="Menu">
          <Menu size={16} />
        </button>
      </div>
    </header>
  );
}
