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

export default function ReclamationPathway() {
  return (
    <main className="rp-page">
      <header className="rp-command-bar">
        <div className="rp-command-identity">
          <img
            src="/emblem/reclamation_core_emblem.png"
            alt=""
            className="rp-command-emblem"
          />
          <div>
            <span>Reclamation Mainframe</span>
            <strong>Select your pathway</strong>
          </div>
        </div>

        <div className="rp-command-status" aria-label="Mainframe status online">
          <span>Act III</span>
          <i />
          <strong>Online</strong>
        </div>
      </header>

      <section className="rp-card-stage" aria-label="Choose a Reclamation pathway">
        {PATHWAYS.map((pathway) => (
          <PathwayCard key={pathway.id} pathway={pathway} />
        ))}
      </section>
    </main>
  );
}
