<ReclamationEnvironment>
  <MainframeCore />
  <OrbitalSystem />
  <CodexOverlay />
  <AmbientFX />
</ReclamationEnvironment>

import MainframeCore from "../../mainframe/MainframeCore";
import OrbitalSystem from "../../systems/OrbitalSystem";

export default function ReclamationCodex() {
  return (
    <div className="reclamation-codex">

      <div className="reclamation-background" />

      <div className="reclamation-overlay" />

      <MainframeCore
        color="#ff4d4d"
      />

      <OrbitalSystem />

      <div className="codex-header">
        <span>ACT THREE</span>

        <h1>RECLAMATION</h1>

        <p>
          POWER RECLAMATION
          PROTOCOL ACTIVE
        </p>
      </div>

    </div>
  );
}