import "../../styles/reclamation-codex.css";

import MainframeCore from "../../mainframe/MainframeCore";
import OrbitalSystem from "../../systems/OrbitalSystem";

export default function ReclamationCodex() {
  return (
    <main className="reclamation-codex">

      <div className="reclamation-background" />

      <div
        className="reclamation-flames"
        aria-hidden="true"
      >
        <span className="reclamation-flame flame-one" />
        <span className="reclamation-flame flame-two" />
        <span className="reclamation-flame flame-three" />
        <span className="reclamation-flame flame-four" />
        <span className="reclamation-flame flame-five" />
      </div>

      <div className="reclamation-overlay" />

      <div className="codex-header">
        <span>ACT THREE</span>

        <h1>RECLAMATION</h1>

        <p>
          POWER RECLAMATION · PROTOCOL ACTIVE
        </p>
      </div>

      <div className="reclamation-stage">

        <MainframeCore
          color="#ff4d4d"
          emblem="/emblem/reclamation_core_emblem.png"
        />

        <div className="reclamation-system-shell">

          <OrbitalSystem />

        </div>

      </div>

    </main>
  );
}
