import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  Check,
  Compass,
  Lightning,
  LockKey,
  MusicNotes,
  Notebook,
  SealCheck,
  ShieldChevron,
} from "@phosphor-icons/react";
import {
  ACTS,
  canAccessAct,
  getActLockReason,
  getActMeta,
} from "../../data/journey";
import { POWER_AXIS_TOKENS } from "../../data/actCodexData";

const sectionMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const romanToWord = {
  I: "One",
  II: "Two",
  III: "Three",
  IV: "Four",
};

const getActTheme = (tok) => ({
  "--codex-act": tok.color,
  "--codex-hi": tok.colorHi,
  "--codex-dim": tok.colorDim,
  "--codex-bg": tok.bg,
  "--codex-border": tok.bdSolid,
});

const SectionShell = ({ id, eyebrow, title, children, className = "" }) => (
  <motion.section id={id} className={`codex-section ${className}`} variants={sectionMotion}>
    <div className="codex-section-head">
      <span className="console-label">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
    {children}
  </motion.section>
);

const CodexTopbar = ({ actNum, isHub, onBack, onPrevious, onNext, canPrevious, canNext }) => (
  <div className="codex-topbar">
    <div className="codex-topbar-left">
      <button className="codex-back" type="button" onClick={onBack}>
        <ArrowLeft size={16} weight="bold" />
        <span>Dashboard</span>
      </button>
      <span className="codex-route-chip">{isHub ? "Codex Hub" : `Deep Link / Act ${actNum}`}</span>
    </div>

    <div className="codex-topbar-actions" aria-label="Codex act navigation">
      <button type="button" onClick={onPrevious} disabled={!canPrevious} aria-label="Previous Codex act">
        <ArrowLeft size={14} weight="bold" />
        <span>Act {actNum - 1}</span>
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label="Next Codex act">
        <span>Act {actNum + 1}</span>
        <ArrowRight size={14} weight="bold" />
      </button>
    </div>
  </div>
);

const ActSelector = ({ selectedAct, user, onSelect }) => (
  <div className="codex-act-selector" aria-label="Codex act selector">
    {ACTS.map((meta) => {
      const locked = !canAccessAct(user, meta.num);
      const Icon = meta.icon;
      return (
        <button
          key={meta.num}
          type="button"
          className={`${meta.num === selectedAct ? "is-active" : ""} ${locked ? "is-locked" : ""}`}
          onClick={() => onSelect(meta.num)}
          style={{ "--selector-act": `var(${meta.colorVar})` }}
          title={locked ? getActLockReason(user, meta.num) : `Open Act ${meta.roman}`}
        >
          <span className="codex-selector-sigil">
            <Icon size={18} weight={meta.num === selectedAct ? "fill" : "duotone"} />
          </span>
          <span>
            <strong>Act {meta.roman}</strong>
            <em>{meta.shortTitle}</em>
          </span>
          {locked && <LockKey size={14} weight="bold" />}
        </button>
      );
    })}
  </div>
);

const SectionIndex = ({ sections, activeId, onJump }) => (
  <aside className="codex-index" aria-label="Codex section index">
    <span className="console-label">Dossier Index</span>
    <div>
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onJump(section.id)}
          className={activeId === section.id ? "is-active" : ""}
        >
          <small>{String(index + 1).padStart(2, "0")}</small>
          <span>{section.label}</span>
        </button>
      ))}
    </div>
  </aside>
);

const CodexHero = ({
  act,
  actNum,
  actMeta,
  isCompleted,
  locked,
  onProtocol,
  onImmersion,
  onJournal,
}) => (
  <motion.section className={`codex-hero ${locked ? "is-locked" : ""}`} variants={sectionMotion}>
    <div className="codex-hero-signal" aria-hidden="true">
      <img src={actMeta.emblem} alt="" />
      <span>{act.roman}</span>
    </div>

    <div className="codex-hero-copy">
      <span className="console-label">{act.kicker}</span>
      <h1>{act.elementName}</h1>
      <p className="codex-principle">{act.principle}</p>

      <div className="codex-hero-actions">
        <button type="button" onClick={onProtocol} disabled={locked}>
          <ShieldChevron size={16} weight="fill" />
          Protocol
        </button>
        <button type="button" onClick={onImmersion} disabled={locked}>
          <MusicNotes size={16} weight="fill" />
          Immersion
        </button>
        <button type="button" onClick={onJournal}>
          <Notebook size={16} weight="fill" />
          Journal
        </button>
      </div>
    </div>

    <div className="codex-status-panel">
      <span className="console-label">Archive Status</span>
      <strong>{locked ? "Access Sealed" : isCompleted ? "Act Sealed" : "Readable"}</strong>
      <p>{locked ? getActLockReason(null, actNum) : act.alchemicalState}</p>
      <div className="codex-status-row">
        <span>Element</span>
        <b>{actMeta.element}</b>
      </div>
      <div className="codex-status-row">
        <span>Position</span>
        <b>Act {act.roman}</b>
      </div>
      <div className="codex-status-row">
        <span>Record</span>
        <b>{isCompleted ? "Complete" : "In Progress"}</b>
      </div>
    </div>
  </motion.section>
);

const LockedDossier = ({ act, actMeta, reason, onBack, onUnlock }) => (
  <motion.div className="codex-locked-state" variants={sectionMotion}>
    <div className="codex-locked-emblem" aria-hidden="true">
      <img src={actMeta.emblem} alt="" />
      <LockKey size={34} weight="duotone" />
    </div>
    <span className="console-label">Restricted Dossier</span>
    <h2>Act {act.roman} is sealed</h2>
    <p>{reason}</p>
    <div className="codex-locked-actions">
      <button type="button" onClick={onBack}>
        <Compass size={16} weight="fill" />
        Dashboard
      </button>
      <button type="button" onClick={onUnlock}>
        <Lightning size={16} weight="fill" />
        Access
      </button>
    </div>
  </motion.div>
);

const ShadowLightFramework = ({ framework }) => (
  <div className="codex-code-grid">
    {["shadow", "light"].map((variant) => {
      const col = framework[variant];
      return (
        <article key={variant} className={`codex-code-card ${variant}`}>
          <span className="console-label">{col.label}</span>
          <h3>{col.name}</h3>
          <em>{col.subtitle}</em>
          <p>{col.definition}</p>
          <details className="codex-manifest-details">
            <summary>{col.manifestLabel}</summary>
            <div className="codex-manifest-list">
              {col.manifests.map((manifest) => (
                <div key={manifest.name}>
                  <strong>{manifest.name}</strong>
                  <p>{manifest.desc}</p>
                </div>
              ))}
            </div>
          </details>
        </article>
      );
    })}
  </div>
);

const AlchemyPanel = ({ alchemy }) => (
  <article className="codex-panel codex-alchemy-panel">
    <span className="console-label">{alchemy.kicker}</span>
    <h3>{alchemy.title}</h3>
    <p>{alchemy.body}</p>
    <div className="codex-mini-grid">
      <div>
        <strong>{alchemy.shadowLabel}</strong>
        <p>{alchemy.shadowText}</p>
      </div>
      <div>
        <strong>{alchemy.lightLabel}</strong>
        <p>{alchemy.lightText}</p>
      </div>
    </div>
  </article>
);

const PillarAccordion = ({ pillars }) => {
  const [openPillar, setOpenPillar] = useState(pillars[0]?.num || null);
  return (
    <div className="codex-pillars">
      {pillars.map((pillar) => {
        const isOpen = openPillar === pillar.num;
        return (
          <article key={pillar.num} className={`codex-pillar ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="codex-pillar-button"
              onClick={() => setOpenPillar(isOpen ? null : pillar.num)}
              aria-expanded={isOpen}
            >
              <span>{pillar.num}</span>
              <strong>{pillar.title}</strong>
              <em>{pillar.sub}</em>
              <CaretDown size={15} weight="bold" />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="codex-pillar-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <p>{pillar.context}</p>
                  <div className="codex-quote-list">
                    {pillar.bars.map((bar) => (
                      <blockquote key={bar}>{bar}</blockquote>
                    ))}
                  </div>
                  {pillar.tracks && (
                    <div className="codex-objective">
                      <span>Tracks</span>
                      <p>{pillar.tracks}</p>
                    </div>
                  )}
                  <div className="codex-objective">
                    <span>Objective</span>
                    <p>{pillar.objective}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
};

const FireAxioms = ({ fireDeep }) => {
  if (!fireDeep) return null;
  return (
    <div className="codex-fire-deep">
      <p>{fireDeep.intro}</p>
      {fireDeep.pullQuote && <blockquote>{fireDeep.pullQuote}</blockquote>}
      <div className="codex-mini-grid">
        {fireDeep.axioms.map((axiom) => (
          <div key={axiom.tag}>
            <strong>{axiom.tag}</strong>
            <p>{axiom.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PowerFramework = ({ powerFramework }) => {
  const [openTrack, setOpenTrack] = useState(null);
  if (!powerFramework) return null;

  return (
    <div className="codex-power">
      <p>{powerFramework.intro}</p>
      {powerFramework.nodesTag && <span className="codex-power-tag">{powerFramework.nodesTag}</span>}
      <div className="codex-power-grid">
        {powerFramework.axes.map((axis) => {
          const tokens = POWER_AXIS_TOKENS[axis.letter] || POWER_AXIS_TOKENS.P;
          return (
            <article key={axis.letter} style={{ "--power-color": tokens.color, "--power-bg": tokens.bg, "--power-border": tokens.bd }}>
              <span>{axis.letter}</span>
              <h3>{axis.word || axis.name}</h3>
              <em>{axis.sub || axis.subtitle}</em>
              <p>{axis.fn || axis.body}</p>
              {axis.question && <blockquote>{axis.question}</blockquote>}
              {axis.count && <small>{axis.count}</small>}
              {axis.isFinalForm && <strong className="codex-final-form">Final Form</strong>}
            </article>
          );
        })}
      </div>

      <div className="codex-power-tracks">
        {powerFramework.axes
          .filter((axis) => axis.tracks || axis.subfns)
          .map((axis) => {
            const tokens = POWER_AXIS_TOKENS[axis.letter] || POWER_AXIS_TOKENS.P;
            const isOpen = openTrack === axis.letter;
            return (
              <article
                key={axis.letter}
                style={{ "--power-color": tokens.color, "--power-bg": tokens.bg, "--power-border": tokens.bd }}
                className={isOpen ? "is-open" : ""}
              >
                <button type="button" onClick={() => setOpenTrack(isOpen ? null : axis.letter)}>
                  <span>{axis.letter}</span>
                  <strong>{axis.word || axis.name}</strong>
                  <CaretDown size={14} weight="bold" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {axis.subfns && (
                        <div className="codex-mini-grid">
                          {axis.subfns.map((sub) => (
                            <div key={sub.n || sub.title}>
                              <strong>{sub.n || sub.title}</strong>
                              <p>{sub.t || sub.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {axis.tracks && (
                        <ul>
                          {axis.tracks.map((track) => (
                            <li key={track}>{track}</li>
                          ))}
                        </ul>
                      )}
                      {axis.trackRole && <p>{axis.trackRole}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
      </div>
      {powerFramework.loopText && <blockquote className="codex-power-loop">{powerFramework.loopText}</blockquote>}
    </div>
  );
};

const FireStages = ({ stages }) => {
  if (!stages) return null;
  return (
    <div className="codex-fire-stages">
      {stages.map((stage) => (
        <article key={stage.num}>
          <span>{stage.num}</span>
          <h3>{stage.title}</h3>
          <p>{stage.desc}</p>
        </article>
      ))}
    </div>
  );
};

const ActivationProtocol = ({ activation }) => (
  <article className="codex-panel codex-activation">
    <div>
      <span className="console-label">{activation.kicker}</span>
      <h3>{activation.title}</h3>
      <em>{activation.badge}</em>
    </div>
    <div className="codex-activation-grid">
      {activation.steps.map((step) => (
        <article key={step.num}>
          <span>{step.num}</span>
          <strong>{step.name}</strong>
          <p>{step.desc}</p>
        </article>
      ))}
    </div>
  </article>
);

const ReflectionChecklist = ({ questions, reflections, onChange }) => (
  <div className="codex-reflection">
    {questions.map((question, index) => {
      const key = `protocol_${index}`;
      const checked = Boolean(reflections[key]);
      return (
        <label key={question} className={checked ? "is-checked" : ""}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(index, event.target.checked)}
          />
          <span>
            <Check size={13} weight="bold" />
          </span>
          <p>{question}</p>
        </label>
      );
    })}
  </div>
);

const CompletionFooter = ({ act, actNum, isCompleted, onCompleteAct, onProtocol }) => (
  <motion.section className="codex-completion" variants={sectionMotion}>
    <div>
      <span className="console-label">Completion Footer</span>
      <h2>{isCompleted ? "This dossier is sealed in your record." : "Seal the act when the record feels complete."}</h2>
      <p>{act.conclusion}</p>
    </div>
    <div>
      <button type="button" onClick={onCompleteAct} disabled={isCompleted}>
        {isCompleted ? <Check size={16} weight="bold" /> : <Lightning size={16} weight="fill" />}
        {isCompleted ? "Completed" : `Complete Act ${romanToWord[act.roman] || actNum}`}
      </button>
      <button type="button" onClick={onProtocol}>
        <ShieldChevron size={16} weight="fill" />
        Protocol
      </button>
    </div>
  </motion.section>
);

const CodexDossier = ({
  act,
  actNum,
  isHub,
  user,
  tok,
  reflections,
  onReflectionChange,
  onCompleteAct,
  onSelectAct,
  onBack,
  onPrevious,
  onNext,
  onProtocol,
  onImmersion,
  onJournal,
  onUnlock,
}) => {
  const reducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("signal");
  const actMeta = getActMeta(actNum);
  const isCompleted = Boolean(user?.completed_acts?.map(Number).includes(Number(actNum)));
  const locked = !canAccessAct(user, actNum);

  const sections = useMemo(() => {
    const base = [
      { id: "signal", label: "Act Signal" },
      { id: "framework", label: "Shadow / Light" },
      { id: "alchemy", label: "Alchemy" },
      { id: "pillars", label: "Pillars" },
    ];
    if (act.fireDeep) base.splice(1, 0, { id: "fire", label: "Fire Doctrine" });
    if (act.powerFramework) base.push({ id: "power", label: "P.O.W.E.R." });
    if (act.fireStages) base.push({ id: "stages", label: "Flame Stages" });
    base.push({ id: "activation", label: "Activation" });
    base.push({ id: "reflection", label: "Reflection" });
    return base;
  }, [act]);

  const activeSectionIndex = Math.max(0, sections.findIndex((section) => section.id === activeSection));
  const activeSectionConfig = sections[activeSectionIndex] || sections[0];

  const handleJump = (id) => {
    setActiveSection(id);
  };

  const handleAdjacentSection = (direction) => {
    const nextIndex = Math.max(0, Math.min(sections.length - 1, activeSectionIndex + direction));
    setActiveSection(sections[nextIndex].id);
  };

  const renderActiveSection = () => {
    switch (activeSectionConfig.id) {
      case "signal":
        return (
          <SectionShell id="signal" eyebrow="Act Signal" title={`${act.elementName} Archive`}>
            <article className="codex-panel codex-reading-panel">
              <p>{act.operativeRole}</p>
            </article>
          </SectionShell>
        );
      case "fire":
        return (
          <SectionShell id="fire" eyebrow="Fire Doctrine" title="The Operative Flame">
            <FireAxioms fireDeep={act.fireDeep} />
          </SectionShell>
        );
      case "framework":
        return (
          <SectionShell id="framework" eyebrow="Shadow / Light Framework" title="Two Codes In The Same Room">
            <ShadowLightFramework framework={act.codeFramework} />
          </SectionShell>
        );
      case "alchemy":
        return (
          <SectionShell id="alchemy" eyebrow="Relationship" title="Alchemy Of The Code">
            <AlchemyPanel alchemy={act.alchemy} />
          </SectionShell>
        );
      case "pillars":
        return (
          <SectionShell id="pillars" eyebrow="Act Architecture" title="Curriculum Pillars">
            <PillarAccordion pillars={act.pillars} />
          </SectionShell>
        );
      case "power":
        return (
          <SectionShell id="power" eyebrow="Act III Operating System" title="The P.O.W.E.R. Framework">
            <PowerFramework powerFramework={act.powerFramework} />
          </SectionShell>
        );
      case "stages":
        return (
          <SectionShell id="stages" eyebrow="Four Stages" title="The Operative Flame">
            <FireStages stages={act.fireStages} />
          </SectionShell>
        );
      case "activation":
        return (
          <SectionShell id="activation" eyebrow="User Activation Protocol" title={act.activation.title}>
            <ActivationProtocol activation={act.activation} />
            <div className="codex-conclusion">
              <SealCheck size={16} weight="fill" />
              <span>{act.conclusionIcon}</span>
              <p>{act.conclusion}</p>
            </div>
          </SectionShell>
        );
      case "reflection":
        return (
          <SectionShell id="reflection" eyebrow="Reflection Checklist" title="Questions For The Record">
            <ReflectionChecklist
              questions={act.reflectionQuestions}
              reflections={reflections}
              onChange={onReflectionChange}
            />
          </SectionShell>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`codex-dossier codex-${act.tone}`}
      style={getActTheme(tok)}
      initial={reducedMotion ? false : "hidden"}
      animate="show"
      transition={{ staggerChildren: reducedMotion ? 0 : 0.055 }}
    >
      <CodexTopbar
        actNum={actNum}
        isHub={isHub}
        onBack={onBack}
        onPrevious={onPrevious}
        onNext={onNext}
        canPrevious={actNum > 1}
        canNext={actNum < 4}
      />

      <main className="codex-main">
        <ActSelector selectedAct={actNum} user={user} onSelect={onSelectAct} />

        <CodexHero
          act={act}
          actNum={actNum}
          actMeta={actMeta}
          isCompleted={isCompleted}
          locked={locked}
          onProtocol={onProtocol}
          onImmersion={onImmersion}
          onJournal={onJournal}
        />

        {locked ? (
          <LockedDossier
            act={act}
            actMeta={actMeta}
            reason={getActLockReason(user, actNum)}
            onBack={onBack}
            onUnlock={onUnlock}
          />
        ) : (
          <div className="codex-reader-grid">
            <SectionIndex sections={sections} activeId={activeSection} onJump={handleJump} />

            <div className="codex-reader">
              <div className="codex-compartment-meter">
                <span>{String(activeSectionIndex + 1).padStart(2, "0")}</span>
                <b>{activeSectionConfig.label}</b>
                <em>{sections.length} compartments</em>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSectionConfig.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {renderActiveSection()}
                </motion.div>
              </AnimatePresence>

              <div className="codex-reader-actions">
                <button type="button" onClick={() => handleAdjacentSection(-1)} disabled={activeSectionIndex === 0}>
                  <ArrowLeft size={14} weight="bold" />
                  Previous
                </button>
                <button type="button" onClick={() => handleAdjacentSection(1)} disabled={activeSectionIndex === sections.length - 1}>
                  Next Compartment
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>

              {activeSectionConfig.id === "reflection" && (
                <CompletionFooter
                  act={act}
                  actNum={actNum}
                  isCompleted={isCompleted}
                  onCompleteAct={onCompleteAct}
                  onProtocol={onProtocol}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default CodexDossier;
