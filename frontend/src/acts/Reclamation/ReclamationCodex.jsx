import "../../styles/reclamation-codex.css";

import MainframeCore from "../../mainframe/MainframeCore";
import OrbitalSystem from "../../systems/OrbitalSystem";

export default function ReclamationCodex() {
  return (
    <main className="reclamation-codex">
      <div className="reclamation-background" />
      <div className="reclamation-overlay" />

      <div className="codex-header">
        <span>ACT THREE</span>
        <h1>RECLAMATION</h1>
        <p>POWER RECLAMATION · PROTOCOL ACTIVE</p>
      </div>

      <div className="reclamation-stage">
        <MainframeCore color="#ff4d4d" />
        <OrbitalSystem />
      </div>
    </main>
  );
}
