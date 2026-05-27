import "../../styles/reclamation-codex.css";

import MainframeCore from "../../mainframe/MainframeCore";
import OrbitalSystem from "../../systems/OrbitalSystem";

export default function ReclamationCodex() {
  return (
    <main className="reclamation-codex">
      <div className="reclamation-background" />
      <div className="reclamation-grid" />

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

      <section className="reclamation-telemetry-panel">
        <div className="telemetry-chip">SIGNAL LOCKED</div>
        <div className="telemetry-chip">SOVEREIGNTY VECTOR: LIVE</div>
        <div className="telemetry-chip">PROMETHEUS LINK STABLE</div>
      </section>

      <div className="reclamation-stage">
        <MainframeCore
          color="#ff4d4d"
          emblem="/emblem/reclamation_core_emblem.png"
        />

        <div className="reclamation-system-shell">
          <OrbitalSystem />
        </div>
      </div>

      <section className="reclamation-briefing">
        <article>
          <h2>Operational Sequence</h2>
          <p>
            Identify the active fracture, isolate the noise, then route attention to the exact point
            where your agency can be recovered right now.
          </p>
        </article>
        <article>
          <h2>Command Directive</h2>
          <p>
            Choose a module. Finish one full cycle. Move one decision from hesitation into public action
            before ending this session.
          </p>
        </article>
      </section>
    </main>
  );
}
