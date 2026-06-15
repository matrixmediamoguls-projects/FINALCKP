import {
  Archive,
  LogOut,
  Network,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ReclamationPathway.css";

const PATHWAYS = [
  {
    id: "immersion",
    label: "Immersion Mode",
    image: "/media/reclamation-pathway/immersion-mode.png",
    route: "/experiencemode/immersion",
  },
  {
    id: "sovereign",
    label: "Sovereign Mode",
    image: "/media/reclamation-pathway/sovereign-mode.png",
    route: "/experiencemode/sovereign",
  },
];

const NAV_ITEMS = [
  { label: "Protocols", icon: ScanLine },
  { label: "Archives", icon: Archive },
  { label: "Intel", icon: ShieldCheck },
  { label: "System", icon: Network },
  { label: "Log out", icon: LogOut },
];

function PathwayCard({ pathway }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={`rp-pathway-card rp-pathway-card--${pathway.id}`}
      onClick={() => navigate(pathway.route)}
      aria-label={`Launch ${pathway.label}`}
    >
      <img src={pathway.image} alt="" draggable="false" />
      <span className="rp-card-sheen" aria-hidden="true" />
    </button>
  );
}

function IntegrityGraph() {
  return (
    <svg
      className="rp-integrity-graph"
      viewBox="0 0 180 30"
      role="img"
      aria-label="System integrity signal"
    >
      <path d="M0 20 L8 19 L16 21 L24 18 L33 20 L41 22 L49 19 L57 20 L65 14 L72 17 L78 12 L85 16 L93 13 L102 19 L112 14 L122 13 L131 17 L140 12 L150 4 L158 13 L168 15 L180 9" />
    </svg>
  );
}

export default function ReclamationPathway() {
  return (
    <main className="rp-page">
      <span className="rp-corner rp-corner--tl" aria-hidden="true" />
      <span className="rp-corner rp-corner--tr" aria-hidden="true" />

      <section className="rp-topline">
        <div className="rp-act-status">
          <span>Act III</span>
          <strong><i />Online</strong>
        </div>

        <header className="rp-hero">
          <img
            src="/emblem/reclamation_core_emblem.png"
            alt=""
            className="rp-hero-emblem"
          />
          <p>Reclamation Mainframe</p>
          <h1><span aria-hidden="true">“</span>Select Your Pathway</h1>
          <div>Two protocols. One purpose.</div>
          <i className="rp-title-rule" aria-hidden="true" />
        </header>

        <div className="rp-integrity">
          <div>
            <span>System integrity</span>
            <strong>98.7%</strong>
          </div>
          <IntegrityGraph />
          <i aria-hidden="true" />
        </div>
      </section>

      <section className="rp-pathway-frame" aria-label="Choose a Reclamation pathway">
        <span className="rp-frame-notch rp-frame-notch--top" aria-hidden="true" />
        <div className="rp-card-stage">
          {PATHWAYS.map((pathway) => (
            <PathwayCard key={pathway.id} pathway={pathway} />
          ))}
        </div>
        <span className="rp-frame-notch rp-frame-notch--bottom" aria-hidden="true" />
      </section>

      <blockquote className="rp-mission">
        <span aria-hidden="true">“</span>
        The choice is yours. The mission is ours.
      </blockquote>

      <footer className="rp-footer">
        <div className="rp-footer-brand">
          <strong>R // M</strong>
          <span>Reclamation Mainframe</span>
        </div>

        <nav className="rp-footer-nav" aria-label="Reclamation utilities">
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <span key={label}>
              <Icon aria-hidden="true" />
              {label}
            </span>
          ))}
        </nav>

        <div className="rp-secure">
          <Sparkles aria-hidden="true" />
          <span>Secure connection<br />encrypted</span>
        </div>
      </footer>
    </main>
  );
}
