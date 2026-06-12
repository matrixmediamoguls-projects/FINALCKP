import { useNavigate } from "react-router-dom";
import "./ReclamationPathway.css";

const SYSTEM_STATS = [
  { label: "SYSTEM INTEGRITY", value: "82%", tone: "red" },
  { label: "NETWORK STABILITY", value: "94%", tone: "red" },
  { label: "THREAT LEVEL", value: "ELEVATED", tone: "red" },
  { label: "NEXUS STATUS", value: "ONLINE", tone: "green" },
];

const PATHWAYS = [
  {
    id: "immersion",
    number: "01",
    kicker: "CHROMA KEY PROTOCOL",
    title: ["IMMERSION", "MODE"],
    description: "FULL CINEMATIC IMMERSION EXPERIENCE",
    button: "LAUNCH IMMERSION MODE",
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
    <header className="rp-top-interface">
      <div className="rp-profile-block">
        <div className="rp-avatar">47</div>
        <div>
          <div className="rp-user-row">SEEKER_47 <span /></div>
          <p>ACCESS LEVEL: <strong>SEEKER</strong></p>
          <p>© CLEARANCE: <strong>OMEGA</strong></p>
        </div>
      </div>

      <div className="rp-stat-row">
        {SYSTEM_STATS.map((stat) => (
          <div className="rp-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong className={`rp-${stat.tone}`}>{stat.value}</strong>
            <i />
          </div>
        ))}
      </div>

      <div className="rp-node-block">
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
    <article className={`rp-mode-card rp-${mode.id}`}>
      <div className="rp-card-glow" />
      <div className="rp-card-content">
        <div className="rp-card-kicker"><span className="rp-mini-mark" />{mode.kicker}<b>••</b></div>
        <div className="rp-card-number">{mode.number}</div>

        <h2>
          {mode.title.map((line, index) => (
            <span key={line} className={index === mode.title.length - 1 ? "rp-redline" : ""}>{line}</span>
          ))}
        </h2>

        <div className="rp-title-rule" />
        <p className="rp-description">{mode.description}</p>
        {mode.badge && <div className="rp-mode-badge">{mode.badge}</div>}

        {mode.id === "guided" && (
          <div className="rp-holo-panel">
            <strong>DAY MUSIQ MATRIX · COMPLETE</strong>
            <span>SOUL SENTIMENT +87%</span>
            <span>VISUAL POTENTIAL OPTIMAL</span>
            <span>RECLAMATION ALIGNMENT EXACT</span>
          </div>
        )}

        {mode.id === "sovereign" && (
          <aside className="rp-side-diagnostics">
            <div><span>NETWORK STATUS</span><strong>18%</strong><small>INTEGRITY REMAINING</small></div>
            <div><span>CONTAINMENT PROTOCOL</span><strong>STANDBY</strong></div>
            <div><span>NEXUS OVERRIDE</span><strong>ACCESS GRANTED</strong></div>
          </aside>
        )}
      </div>

      <button type="button" className="rp-launch-button" onClick={() => navigate(mode.route)}>
        <span className="rp-play">▶</span>
        {mode.button}
      </button>
    </article>
  );
}

export default function ReclamationPathway() {
  return (
    <main className="rp-page">
      <TopInterface />
      <section className="rp-card-stage" aria-label="Choose a Reclamation pathway">
        {PATHWAYS.map((mode) => <ModeCard key={mode.id} mode={mode} />)}
      </section>
    </main>
  );
}
