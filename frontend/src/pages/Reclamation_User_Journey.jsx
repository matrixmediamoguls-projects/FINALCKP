import { useNavigate } from "react-router-dom";
import "./Reclamation_User_Journey.css";

const SYSTEM_STATS = [
  { label: "SYSTEM INTEGRITY", value: "82%", tone: "red" },
  { label: "NETWORK STABILITY", value: "94%", tone: "red" },
  { label: "THREAT LEVEL", value: "ELEVATED", tone: "red" },
  { label: "NEXUS STATUS", value: "ONLINE", tone: "green" },
];

const JOURNEY_OPTIONS = [
  {
    id: "guided",
    number: "01",
    title: ["GUIDED", "IMMERSION", "EXPERIENCE"],
    description: "FULL CINEMATIC IMMERSION EXPERIENCE",
    button: "LAUNCH IMMERSION PROTOCOL",
    route: "/listen/3",
  },
];

function TopInterface() {
  return (
    <header className="ruj-top-interface">
      <div className="ruj-profile-block">
        <div className="ruj-avatar">47</div>
        <div>
          <div className="ruj-user-row">SEEKER_47 <span /></div>
          <p>ACCESS LEVEL: <strong>SEEKER</strong></p>
          <p>© CLEARANCE: <strong>OMEGA</strong></p>
        </div>
      </div>

      <div className="ruj-stat-row">
        {SYSTEM_STATS.map((stat) => (
          <div className="ruj-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong className={`ruj-${stat.tone}`}>{stat.value}</strong>
            <i />
          </div>
        ))}
      </div>

      <div className="ruj-node-block">
        <span>TIME SYNCHRONIZED</span>
        <strong>21:47:32 UTC</strong>
        <p>CLASSIFIED NODE<br />RMF-03-ALPHA</p>
      </div>
    </header>
  );
}

function JourneyCard({ option }) {
  const navigate = useNavigate();

  return (
    <article className={`ruj-card ruj-card-${option.id}`}>
      <div className="ruj-card-glow" />
      <div className="ruj-card-content">
        <div className="ruj-card-kicker"><span className="ruj-mini-mark" />CHROMA KEY PROTOCOL<b>••</b></div>
        <div className="ruj-card-number">{option.number}</div>

        <h2>
          {option.title.map((line, index) => (
            <span key={line} className={index === option.title.length - 1 ? "ruj-redline" : ""}>{line}</span>
          ))}
        </h2>

        <div className="ruj-title-rule" />
        <p className="ruj-description">{option.description}</p>
        {option.id === "guided" && (
          <div className="ruj-holo-panel">
            <strong>DAY MUSIQ MATRIX · COMPLETE</strong>
            <span>SOUL SENTIMENT +87%</span>
            <span>VISUAL POTENTIAL OPTIMAL</span>
            <span>RECLAMATION ALIGNMENT EXACT</span>
          </div>
        )}

      </div>

      <button type="button" className="ruj-launch-button" onClick={() => navigate(option.route)}>
        <span className="ruj-play">▶</span>
        {option.button}
      </button>
    </article>
  );
}

export default function Reclamation_User_Journey() {
  return (
    <main className="ruj-page">
      <TopInterface />
      <section className="ruj-card-stage" aria-label="Reclamation user journey selection">
        {JOURNEY_OPTIONS.map((option) => <JourneyCard key={option.id} option={option} />)}
      </section>
    </main>
  );
}
