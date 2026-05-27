import "../../styles/reclamation-codex.css";
import { Link } from "react-router-dom";

import MainframeCore from "../../mainframe/MainframeCore";
import OrbitalSystem from "../../systems/OrbitalSystem";

const primaryModules = [
  {
    id: "visualizer",
    index: "01",
    title: "Visual Resonance",
    subtitle: "Open Act III final visualizer",
    status: "Live",
    route: "/visualizer/3",
  },
  {
    id: "listen",
    index: "02",
    title: "Sonic Immersion",
    subtitle: "Enter guided listening mode",
    status: "Ready",
    route: "/listen/3",
  },
  {
    id: "activation",
    index: "03",
    title: "Activation Protocol",
    subtitle: "Run the Reclamation steps",
    status: "Active",
    route: "/activation?act=3",
  },
  {
    id: "journal",
    index: "04",
    title: "Journal",
    subtitle: "Capture Act III field notes",
    status: "Open",
    route: "/journal?act=3",
  },
];

const supportModules = [
  {
    id: "vma",
    title: "VMA Module",
    subtitle: "Ask the assistant for signal interpretation",
    status: "Online",
    route: "/vma",
    telemetry: "AI",
  },
  {
    id: "seeker",
    title: "Seeker Profile",
    subtitle: "Review identity, tier, and act progress",
    status: "Synced",
    route: "/seeker",
    telemetry: "ID",
  },
  {
    id: "codex",
    title: "Codex Archive",
    subtitle: "Read the Reclamation lore layer",
    status: "Indexed",
    route: "/codex",
    telemetry: "CX",
  },
  {
    id: "artifacts",
    title: "Sonic Artifacts",
    subtitle: "Inspect recovered Act III signals",
    status: "Cached",
    route: "/protocol/3?module=artifacts",
    telemetry: "SA",
  },
];

const lyricLines = [
  "I'm breaking the code, I'm rewriting the system",
  "The keys in my hands, I'm taking back what's mine",
  "No firewall can hold me, no gate can keep me out",
  "I'm the glitch in their plan, watch the whole thing rise",
];

function ConsolePanel({ title, children, className = "" }) {
  return (
    <section className={`ckp-console-panel ${className}`}>
      <div className="ckp-panel-title">
        {title}
        <span />
      </div>
      {children}
    </section>
  );
}

function ModuleCard({ module, compact = false }) {
  return (
    <Link className={`ckp-module-card${compact ? " is-compact" : ""}`} to={module.route}>
      <span className="ckp-module-card__index">{module.index || module.telemetry}</span>
      <span className="ckp-module-card__copy">
        <strong>{module.title}</strong>
        <em>{module.subtitle}</em>
      </span>
      <span className="ckp-module-card__status">{module.status}</span>
    </Link>
  );
}

export default function ReclamationCodex() {
  return (
    <main className="reclamation-codex">
      <div className="reclamation-background" />
      <div className="reclamation-overlay" />

      <header className="ckp-topbar">
        <div className="ckp-act-brand">
          <img src="/emblem/reclamation_core_emblem.png" alt="" />
          <div>
            <strong>ACT THREE &gt;&gt;&gt;</strong>
            <span>RECLAMATION</span>
          </div>
        </div>

        <div className="ckp-title-lockup">
          <h1>CHROMA KEY PROTOCOL</h1>
          <p>AUDIO VISUALIZER ENGINE</p>
        </div>

        <div className="ckp-status-cluster">
          <span>CKP MAINFRAME: ONLINE</span>
          <Link to="/vma">VMA MODULE</Link>
          <button type="button" aria-label="Open protocol menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="reclamation-console">
        <aside className="ckp-side-rail ckp-side-rail--left">
          <ConsolePanel title="Core Modules">
            <div className="ckp-module-list">
              {primaryModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </ConsolePanel>

          <ConsolePanel title="Active Transmission" className="ckp-now-playing">
            <Link className="ckp-transmission-card" to="/listen/3">
              <span>Break The Code</span>
              <strong>Guided Listen</strong>
              <div className="ckp-mini-wave" />
              <small>Resume Act III audio chamber</small>
            </Link>
          </ConsolePanel>

          <ConsolePanel title="Module Controls">
            <div className="ckp-control-row" aria-label="Module shortcuts">
              <Link to="/activation?act=3">ACT</Link>
              <Link to="/journal?act=3">JRN</Link>
              <Link to="/visualizer/3" className="is-primary">VIZ</Link>
              <Link to="/vma">VMA</Link>
              <Link to="/seeker">ID</Link>
            </div>
            <div className="ckp-volume">
              <span>SYNC</span>
              <div><i /></div>
              <strong>78%</strong>
            </div>
          </ConsolePanel>
        </aside>

        <section className="ckp-center-stack" aria-label="Act Three spectrum analyzer">
          <section className="ckp-analyzer-frame">
            <div className="ckp-analyzer-topline">
              <span>FREQ: 44.1 KHZ<br />RES: 24 BIT</span>
              <strong>DECRYPTION ACTIVE</strong>
              <span>SIGNAL: STRONG<br />SOURCE: CKP CORE</span>
            </div>

            <div className="ckp-waveform ckp-waveform--left" />
            <div className="ckp-waveform ckp-waveform--right" />
            <div className="ckp-crosshair" />

            <div className="reclamation-stage">
              <MainframeCore
                color="#ff4d4d"
                title="SPECTRUM ANALYZER"
                subtitle="ACT 3: RECLAMATION"
                integrity={78}
                emblem="/emblem/reclamation_core_emblem.png"
              />

              <div className="reclamation-system-shell">
                <OrbitalSystem />
              </div>
            </div>
          </section>

          <section className="ckp-lyrics-frame">
            <div className="ckp-lyrics-meter" aria-hidden="true">
              {Array.from({ length: 28 }).map((_, index) => (
                <span key={index} style={{ "--bar": `${18 + ((index * 19) % 74)}%` }} />
              ))}
            </div>
            <div className="ckp-lyrics-copy">
              <strong>LYRICS PROTOCOL</strong>
              {lyricLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <div className="ckp-progress">
                <span>01:24</span>
                <div><i /></div>
                <span>03:47</span>
              </div>
            </div>
          </section>
        </section>

        <aside className="ckp-side-rail ckp-side-rail--right">
          <ConsolePanel title="Support Modules" className="ckp-context-card">
            <div className="ckp-module-grid">
              {supportModules.map((module) => (
                <ModuleCard key={module.id} module={module} compact />
              ))}
            </div>
          </ConsolePanel>

          <ConsolePanel title="Context Module">
            <Link className="ckp-lore-module" to="/codex">
              <strong>Reclamation Codex</strong>
              <span>
                Open the archive layer for Act III language, symbols, and
                protocol context.
              </span>
            </Link>
          </ConsolePanel>

          <ConsolePanel title="Frequency Module">
            <Link className="ckp-frequency-module" to="/visualizer/3">
              <div className="ckp-frequency-bars" aria-hidden="true">
                {Array.from({ length: 80 }).map((_, index) => (
                  <span key={index} style={{ "--bar": `${12 + ((index * 37) % 84)}%` }} />
                ))}
              </div>
              <div className="ckp-band-labels">
                <span>20</span>
                <span>80</span>
                <span>320</span>
                <span>1.2K</span>
                <span>5K</span>
                <span>20K</span>
              </div>
            </Link>
          </ConsolePanel>
        </aside>
      </div>
    </main>
  );
}
