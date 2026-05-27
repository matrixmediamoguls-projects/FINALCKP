import "../../styles/reclamation-codex.css";

import MainframeCore from "../../mainframe/MainframeCore";
import OrbitalSystem from "../../systems/OrbitalSystem";

const tracks = [
  ["01", "System Override", "03:47"],
  ["02", "Digital Ghost", "03:21"],
  ["03", "Break The Code", "01:24"],
  ["04", "Wasteland", "03:56"],
  ["05", "Blackout Protocol", "04:28"],
  ["06", "No Gatekeepers", "03:09"],
  ["07", "Glitch In The Plan", "04:11"],
  ["08", "Rewrite Reality", "03:58"],
  ["09", "Data Rebellion", "04:44"],
  ["10", "Reclamation", "05:02"],
];

const metrics = [
  ["Bass", "82%"],
  ["Mids", "64%"],
  ["Treble", "71%"],
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
          <a href="/vma">VMA MODULE</a>
          <button type="button" aria-label="Open protocol menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="reclamation-console">
        <aside className="ckp-side-rail ckp-side-rail--left">
          <ConsolePanel title="Tracklist">
            <ol className="ckp-tracklist">
              {tracks.map(([number, title, time]) => (
                <li key={number} className={number === "03" ? "is-active" : ""}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <em>{time}</em>
                </li>
              ))}
            </ol>
          </ConsolePanel>

          <ConsolePanel title="Now Playing" className="ckp-now-playing">
            <div className="ckp-current-track">
              <img src="/emblem/reclamation_core_emblem.png" alt="" />
              <div>
                <strong>Break The Code</strong>
                <span>Chroma Key Reclamation: Act Three</span>
                <div className="ckp-mini-wave" />
                <small>01:24 / 03:47</small>
              </div>
            </div>
          </ConsolePanel>

          <ConsolePanel title="Quick Controls">
            <div className="ckp-control-row" aria-label="Playback controls">
              <button type="button">SH</button>
              <button type="button">PR</button>
              <button type="button" className="is-primary">II</button>
              <button type="button">NX</button>
              <button type="button">LP</button>
            </div>
            <div className="ckp-volume">
              <span>VOL</span>
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
          <ConsolePanel title="Context Module" className="ckp-context-card">
            <img src="/emblem/reclamation_core_emblem.png" alt="" />
            <p>
              Reclamation decrypts the control layer and turns the signal back
              toward the operator. The protocol is active, unstable, and ready
              for live visual analysis.
            </p>
            <button type="button">Expand Lore Card</button>
          </ConsolePanel>

          <ConsolePanel title="Audio Analysis">
            <div className="ckp-analysis">
              <div className="ckp-intensity">
                <span>Intensity</span>
                <strong>78%</strong>
              </div>
              <div className="ckp-metrics">
                {metrics.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <i><b style={{ width: value }} /></i>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </ConsolePanel>

          <ConsolePanel title="Frequency Bands">
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
          </ConsolePanel>
        </aside>
      </div>
    </main>
  );
}
