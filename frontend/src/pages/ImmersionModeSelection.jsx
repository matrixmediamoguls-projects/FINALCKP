import { useNavigate } from "react-router-dom";
import "./ImmersionModeSelection.css";

const SYSTEM_STATS = [
  { label: "SYSTEM INTEGRITY", value: "82%", tone: "red" },
  { label: "NETWORK STABILITY", value: "94%", tone: "red" },
  { label: "THREAT LEVEL", value: "ELEVATED", tone: "red" },
  { label: "NEXUS STATUS", value: "ONLINE", tone: "green" },
];

const modes = [
  {
    id: "guided",
    number: "01",
    kicker: "CHROMA KEY PROTOCOL",
    title: ["GUIDED", "IMMERSION", "EXPERIENCE"],
    description: "FULL CINEMATIC IMMERSION EXPERIENCE",
    button: "LAUNCH IMMERSION PROTOCOL",
    route: "/experiencemode/immersion",
    align: "left",
  },
  {
    id: "sovereign",
    number: "02",
    kicker: "CHROMA KEY PROTOCOL",
    title: ["SELF-DIRECTED", "SOVEREIGN MODE"],
    description: "You map your own journey through the Reclamation Mainframe.",
    badge: "LIMITED EXPERIENCE",
    button: "LAUNCH SOVEREIGN PROTOCOL",
    route: "/experiencemode/sovereign",
    align: "right",
  },
];

function TopInterface() {
  return (
    <header className="ims-top-interface">
      <div className="ims-profile-block">
        <div className="ims-avatar">47</div>
        <div>
          <div className="ims-user-row">SEEKER_47 <span /></div>
          <p>ACCESS LEVEL: <strong>SEEKER</strong></p>
          <p>© CLEARANCE: <strong>OMEGA</strong></p>
        </div>
      </div>

      <div className="ims-stat-row">
        {SYSTEM_STATS.map((stat) => (
          <div className="ims-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong className={`ims-${stat.tone}`}>{stat.value}</strong>
            <i />
          </div>
        ))}
      </div>

      <div className="ims-node-block">
        <span>TIME SYNCHRONIZED</span>
        <strong>21:47:32 UTC</strong>
        <p>CLASSIFIED NODE<br />RMF-03-ALPHA</p>
      </div>
    </header>
  );
}

function ModeCard({ mode }) {
  const navigate = useNavigate();

  return (
    <article className={`ims-mode-card ims-${mode.id}`}>
      <div className="ims-card-glow" />
      <div className="ims-card-content">
        <div className="ims-card-kicker"><span className="ims-mini-mark" />{mode.kicker}<b>••</b></div>
        <div className="ims-card-number">{mode.number}</div>

        <h2>
          {mode.title.map((line, index) => (
            <span key={line} className={index === mode.title.length - 1 ? "ims-redline" : ""}>{line}</span>
          ))}
        </h2>

        <div className="ims-title-rule" />
        <p className="ims-description">{mode.description}</p>
        {mode.badge && <div className="ims-mode-badge">{mode.badge}</div>}

        {mode.id === "guided" && (
          <div className="ims-holo-panel">
            <strong>DAY MUSIQ MATRIX · COMPLETE</strong>
            <span>SOUL SENTIMENT +87%</span>
            <span>VISUAL POTENTIAL OPTIMAL</span>
            <span>RECLAMATION ALIGNMENT EXACT</span>
          </div>
        )}

        {mode.id === "sovereign" && (
          <aside className="ims-side-diagnostics">
            <div><span>NETWORK STATUS</span><strong>18%</strong><small>INTEGRITY REMAINING</small></div>
            <div><span>CONTAINMENT PROTOCOL</span><strong>STANDBY</strong></div>
            <div><span>NEXUS OVERRIDE</span><strong>ACCESS GRANTED</strong></div>
          </aside>
        )}
      </div>

      <button type="button" className="ims-launch-button" onClick={() => navigate(mode.route)}>
        <span className="ims-play">▶</span>
        {mode.button}
      </button>
    </article>
  );
}

export default function ImmersionModeSelection() {
  return (
    <main className="ims-page">
      <TopInterface />
      <section className="ims-card-stage" aria-label="Select Reclamation protocol mode">
        {modes.map((mode) => <ModeCard key={mode.id} mode={mode} />)}
      </section>
    </main>
  );
}
