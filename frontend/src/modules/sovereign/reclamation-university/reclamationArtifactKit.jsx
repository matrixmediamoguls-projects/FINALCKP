/* Shared building blocks for the Reclamation University module experiences.
 *
 * The per-principle modules (Cause & Effect, Rhythm, Gender, Polarity) each
 * rendered their own copy of these helpers. The copies differed only in the
 * CSS prefix that carries each module's design tokens -- "ruc-", "rur-",
 * "rug-", "rup-" -- so the components here take that prefix once, via
 * createArtifactKit, and the modules keep their own visual identity.
 *
 * Only genuinely shared behavior belongs here. Artifact composition
 * (buildArtifactMarkdown / buildArtifactPdf / buildPatternStatement) is
 * deliberately NOT shared: each module lays out a different diagram and
 * document structure, and collapsing them would flatten real differences.
 */

/** Download a generated artifact from the browser. */
export function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

export function formatDateTime(value) {
  return value ? new Date(value).toLocaleString() : "—";
}

/**
 * Build the prefix-bound presentational components for one module.
 * Call once at module scope so the component identities stay stable across
 * renders:
 *
 *   const { Blocks, Drawer, ArtifactField } = createArtifactKit("ruc");
 */
export function createArtifactKit(prefix) {
  function Blocks({ blocks }) {
    return blocks.map((block, index) =>
      block.kind === "lines" ? (
        <div className={`${prefix}-lines`} key={index}>
          {block.value.map((line) => <span key={line}>{line}</span>)}
        </div>
      ) : (
        <p className={`${prefix}-p`} key={index}>{block.value}</p>
      )
    );
  }

  function Drawer({ open, onToggle, label, body, rows }) {
    return (
      <>
        <button type="button" className={`${prefix}-drawer-toggle`} onClick={onToggle} aria-expanded={open}>
          {open ? "Hide" : "Show"} {label}
        </button>
        {open && (
          <div className={`${prefix}-drawer`}>
            {rows
              ? rows.map((row) => (
                  <p key={row.k}><strong style={{ color: "var(--bronze)" }}>{row.k}.</strong> {row.v}</p>
                ))
              : body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </div>
        )}
      </>
    );
  }

  function ArtifactField({ label, question, value, onChange, highlight }) {
    return (
      <div className={`${prefix}-artifact-card${highlight ? " is-lever" : ""}`}>
        <h4>{label}</h4>
        {/* Polarity authors these fields without a sub-question; keep the
            element out of the DOM entirely rather than rendering it empty. */}
        {question ? <small>{question}</small> : null}
        <textarea
          className={`${prefix}-area`}
          style={{ minHeight: 70, background: "transparent", border: "none", padding: 0, color: "var(--ivory)" }}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return { Blocks, Drawer, ArtifactField };
}
