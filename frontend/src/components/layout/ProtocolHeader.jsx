import { Menu, Settings2 } from "lucide-react";

export default function ProtocolHeader() {
  return (
    <header className="pva-header">
      <div className="pva-header-act">
        <strong>ACT THREE</strong>
        <span>RECLAMATION</span>
      </div>

      <div className="pva-header-title">
        <h1>CHROMA KEY PROTOCOL</h1>
        <p>AUDIO VISUALIZER ENGINE</p>
      </div>

      <div className="pva-header-status">
        <span>PROTOCOL STATUS: ONLINE</span>
        <button type="button" aria-label="VRA module">
          VRA MODULE
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
