import { ArrowUpRight, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ActOneEntry.css";

const HERO_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/banani-prod.appspot.com/o/reference-images%2Fe9c67977-39a8-42f5-9459-b8b87643b754?alt=media&token=6c950b8e-59bc-4c4b-aa4d-e007e680574c";

export default function ActOneEntry() {
  const navigate = useNavigate();

  return (
    <main className="act-one-entry" aria-label="Act One entry screen">
      <div className="act-one-entry__grid" aria-hidden="true" />
      <div className="act-one-entry__glow act-one-entry__glow--right" aria-hidden="true" />
      <div className="act-one-entry__glow act-one-entry__glow--left" aria-hidden="true" />

      <header className="act-one-entry__topbar">
        <div className="act-one-entry__top-left">
          <span>SYS.VER.9.0.1</span>
          <i aria-hidden="true" />
          <span>Protocol Active</span>
        </div>

        <div className="act-one-entry__connection" aria-label="Secure connection active">
          <span />
          Chroma Key Protocol // Secure Connection
        </div>

        <div className="act-one-entry__status">
          <span><i aria-hidden="true" />Latency: 12ms</span>
          <span><i aria-hidden="true" />Status: Standby</span>
        </div>
      </header>

      <section className="act-one-entry__stage">
        <aside className="act-one-entry__image-pane" aria-label="The Fractured Veil visual signal">
          <img src={HERO_IMAGE} alt="" />
          <div className="act-one-entry__image-shade act-one-entry__image-shade--right" aria-hidden="true" />
          <div className="act-one-entry__image-shade act-one-entry__image-shade--bottom" aria-hidden="true" />
          <div className="act-one-entry__scanner" aria-hidden="true" />
          <span className="act-one-entry__meta act-one-entry__meta--top">SYS.ON // TRUE</span>
          <span className="act-one-entry__meta act-one-entry__meta--bottom">COORD // 48.203.11</span>
          <span className="act-one-entry__corner act-one-entry__corner--tl" aria-hidden="true" />
          <span className="act-one-entry__corner act-one-entry__corner--tr" aria-hidden="true" />
          <span className="act-one-entry__corner act-one-entry__corner--bl" aria-hidden="true" />
          <span className="act-one-entry__corner act-one-entry__corner--br" aria-hidden="true" />
        </aside>

        <section className="act-one-entry__content">
          <div className="act-one-entry__axis" aria-hidden="true">
            <span />
          </div>

          <div className="act-one-entry__badge">
            <span aria-hidden="true" />
            The Chroma Key Protocol
          </div>

          <p className="act-one-entry__act">Act One</p>
          <h1 className="act-one-entry__title">
            <span>The</span>
            <strong>Fractured</strong>
            <span>Veil</span>
          </h1>
          <p className="act-one-entry__subtitle">The veil fractures at the foundation.</p>
          <div className="act-one-entry__divider" aria-hidden="true" />

          <button
            className="act-one-entry__cta"
            type="button"
            onClick={() => navigate("/protocol/1")}
            aria-label="Enter The Fractured Veil protocol"
          >
            <span className="act-one-entry__key" aria-hidden="true">
              <i />
              <KeyRound size={30} strokeWidth={1.8} />
              <b />
            </span>
            <span className="act-one-entry__connector" aria-hidden="true">
              <i />
              <b />
            </span>
            <span className="act-one-entry__cta-copy">
              <strong>Enter The Fractured Veil</strong>
              <em>Initialize Protocol</em>
            </span>
            <ArrowUpRight className="act-one-entry__cta-arrow" size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </section>
      </section>

      <footer className="act-one-entry__footer">
        <span>Sector // Alpha-7</span>
        <div aria-hidden="true">
          <i />
          <b />
          <i />
          <b />
          <i />
        </div>
        <span>Node // Fractured-01</span>
      </footer>
    </main>
  );
}
