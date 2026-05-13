import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightning,
  SealCheck,
} from "@phosphor-icons/react";

const clampStep = (step) => Math.max(0, Math.min(4, Number(step) || 0));

export const ProtocolHeader = ({ actDef, actMeta, currentStep, completedSteps }) => (
  <header className="protocol-journey-header" style={{ "--protocol-act": actDef.color }}>
    <div className="protocol-orbit" aria-hidden="true">
      {actMeta?.emblem && <img src={actMeta.emblem} alt="" />}
      <span>{actMeta?.glyph || actDef.roman}</span>
    </div>
    <div>
      <span className="console-label">Act {actDef.roman} / {actDef.element} / {actDef.title}</span>
      <h1>The Five-Step Initiatory Engine</h1>
      <p>{actDef.principle}</p>
    </div>
    <div className="protocol-header-meter">
      <strong>{completedSteps.length}/5</strong>
      <span>steps sealed</span>
      <em>Current step {String(clampStep(currentStep) + 1).padStart(2, "0")}</em>
    </div>
  </header>
);

export const ProtocolStepNavigator = ({ actDef, currentStep, savedSteps, onSelectStep }) => (
  <nav data-testid="step-nav" className="protocol-step-nav" aria-label="Protocol steps">
    {actDef.steps.map((step, index) => {
      const complete = savedSteps.includes(index);
      const active = index === currentStep;
      return (
        <button
          key={step.name}
          type="button"
          data-testid={`step-pip-${index}`}
          onClick={() => onSelectStep(index)}
          className={`${active ? "is-active" : ""} ${complete ? "is-complete" : ""}`}
        >
          <span>{step.num}</span>
          <strong>{step.label}</strong>
          <em>{complete ? "Sealed" : active ? "Open" : "Pending"}</em>
        </button>
      );
    })}
  </nav>
);

export const ExerciseRenderer = ({ stepDef, state, update, color }) => {
  if (stepDef.exercise === "domain_sliders") {
    return <DomainSliders stepDef={stepDef} state={state} update={update} color={color} />;
  }
  if (stepDef.exercise === "checklist") {
    return <Checklist stepDef={stepDef} state={state} update={update} color={color} />;
  }
  if (stepDef.exercise === "pills") {
    return <PillGrid stepDef={stepDef} state={state} update={update} color={color} />;
  }
  if (stepDef.exercise === "witness_sliders") {
    return <WitnessSliders stepDef={stepDef} state={state} update={update} color={color} />;
  }
  if (stepDef.exercise === "declaration") {
    return <Declaration stepDef={stepDef} state={state} update={update} color={color} />;
  }
  return null;
};

export const AgentTransmissionPanel = ({ actDef, response, loading, onTransmit }) => (
  <section data-testid="agent-panel" className="protocol-agent-panel" style={{ "--protocol-act": actDef.color }}>
    <div className="protocol-agent-head">
      <span className="agent-pulse" aria-hidden="true" />
      <strong>{actDef.agent} / Protocol Agent</strong>
      <em>{loading ? "Transmitting..." : response ? "Transmission complete" : "Ready"}</em>
    </div>
    <div className="protocol-agent-body">
      {response ? (
        <div>
          {response.split("\n").map((part, index) => (
            <p key={`${part}-${index}`}>{part}</p>
          ))}
        </div>
      ) : (
        <p className="protocol-agent-empty">Submit your reading to receive your protocol transmission.</p>
      )}
    </div>
    <button type="button" data-testid="transmit-btn" onClick={onTransmit} disabled={loading}>
      <Lightning size={15} weight="fill" />
      {loading ? "Transmitting..." : `Transmit to ${actDef.agent}`}
    </button>
  </section>
);

export const ProtocolActionFooter = ({ actDef, currentStep, onBack, onAdvance, onComplete, saving }) => (
  <footer className="protocol-action-footer" style={{ "--protocol-act": actDef.color }}>
    {currentStep > 0 && (
      <button type="button" className="protocol-secondary-action" onClick={onBack} disabled={saving}>
        <ArrowLeft size={14} weight="bold" />
        Back
      </button>
    )}
    {currentStep < 4 ? (
      <button type="button" data-testid="advance-btn" className="protocol-primary-action" onClick={onAdvance} disabled={saving}>
        Proceed to Step {actDef.steps[currentStep + 1]?.num}
        <ArrowRight size={14} weight="bold" />
      </button>
    ) : (
      <button type="button" data-testid="complete-btn" className="protocol-primary-action" onClick={onComplete} disabled={saving}>
        Complete the Protocol
        <Check size={15} weight="bold" />
      </button>
    )}
  </footer>
);

export const ProtocolCompletion = ({ actDef, declaration, onWheel, onLaunchModule, onReview }) => (
  <section className="protocol-completion" style={{ "--protocol-act": actDef.color }}>
    <div className="protocol-completion-mark">
      <SealCheck size={34} weight="fill" />
    </div>
    <span className="console-label">Act {actDef.roman} Closed</span>
    <h1>Protocol Complete</h1>
    <p>
      What the {actDef.element.toLowerCase()} revealed is now sealed in the record.
      You have earned a spin on the Wheel.
    </p>
    <blockquote data-testid="final-declaration">{declaration}</blockquote>
    <div>
      <button type="button" data-testid="go-to-wheel" className="protocol-primary-action" onClick={onWheel}>
        Spin the Wheel
        <ArrowRight size={14} weight="bold" />
      </button>
      <button type="button" className="protocol-secondary-action" onClick={onLaunchModule}>Back to Launch Module</button>
      <button type="button" className="protocol-secondary-action" onClick={onReview}>Review Steps</button>
    </div>
  </section>
);

const DomainSliders = ({ stepDef, state, update, color }) => {
  const vals = stepDef.domains.map((_, index) => state[`slider_${index}`] || 5);
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  const maxVal = Math.max(...vals);
  const topIndex = vals.indexOf(maxVal);
  const metricReading =
    stepDef.metricReadings?.find((reading) => parseFloat(avg) <= reading.max)?.text ||
    stepDef.metricReadings?.[stepDef.metricReadings.length - 1]?.text ||
    "";
  const domainReading = stepDef.domainReadings?.[topIndex] || "";

  return (
    <div>
      <ExerciseLabel color={color}>{stepDef.exLabel || `${stepDef.metricLabel} Calibration`}</ExerciseLabel>
      {stepDef.domains.map((domain, index) => (
        <RangeField
          key={domain}
          label={domain}
          value={vals[index]}
          color={color}
          minLabel={stepDef.sliderEnds[0]}
          maxLabel={stepDef.sliderEnds[1]}
          onChange={(value) => update(`slider_${index}`, value)}
        />
      ))}
      <MetricGrid>
        <MetricCard label={stepDef.metricLabel} value={avg} sub={metricReading} color={color} />
        <MetricCard label={stepDef.metricDomain} value={stepDef.domains[topIndex]} sub={domainReading} small color={color} />
      </MetricGrid>
      {stepDef.exQuestion && <p className="protocol-exercise-question">{stepDef.exQuestion}</p>}
    </div>
  );
};

const Checklist = ({ stepDef, state, update, color }) => {
  const checked = state.checked || [];
  const toggle = (index) => {
    update("checked", checked.includes(index) ? checked.filter((item) => item !== index) : [...checked, index]);
  };

  const verdicts = stepDef.burnVerdicts || [
    "No patterns selected. Look again.",
    "One pattern active. This is the entry point.",
    "Moderate patterning. The architecture is becoming visible.",
    "Significant patterning. Multiple systems are running.",
    "Heavy patterning. Deep work territory.",
    "Full pattern saturation. This is where excavation begins.",
  ];
  const count = checked.length;
  const verdictIndex = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 4 ? 3 : count <= 6 ? 4 : 5;

  return (
    <div>
      <ExerciseLabel color={color}>{stepDef.exLabel || `${stepDef.metricLabel} Inventory`}</ExerciseLabel>
      {stepDef.exQuestion && <p className="protocol-exercise-question">{stepDef.exQuestion}</p>}
      <div className="protocol-check-list">
        {stepDef.items.map((item, index) => (
          <label key={item}>
            <input type="checkbox" checked={checked.includes(index)} onChange={() => toggle(index)} style={{ accentColor: color }} />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <MetricGrid>
        <MetricCard label={stepDef.metricLabel} value={`${checked.length}/7`} sub={`${checked.length} selections active.`} color={color} />
        <MetricCard label={stepDef.verdictLabel} value={verdicts[verdictIndex]} small color={color} />
      </MetricGrid>
    </div>
  );
};

const PillGrid = ({ stepDef, state, update, color }) => {
  const pills = state.pills || [];
  const toggle = (option) => {
    update("pills", pills.includes(option) ? pills.filter((item) => item !== option) : [...pills, option]);
  };
  const ordered = stepDef.ledgerPriority?.filter((item) => pills.includes(item)) || [];
  const priorityItem = ordered[0] ? `${ordered[0]} / highest protocol priority` : "None selected";
  const readingIndex = pills.length === 0 ? 0 : pills.length === 1 ? 1 : pills.length <= 3 ? 2 : 3;
  const reading = stepDef.ledgerReadings
    ? readingIndex === 3
      ? `${pills.length}${stepDef.ledgerReadings[3]}`
      : stepDef.ledgerReadings[readingIndex]
    : "";

  return (
    <div>
      <ExerciseLabel color={color}>{stepDef.exLabel || `${stepDef.metricLabel} Selection`}</ExerciseLabel>
      {stepDef.exQuestion && <p className="protocol-exercise-question">{stepDef.exQuestion}</p>}
      <div className="protocol-pill-grid">
        {stepDef.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={pills.includes(option) ? "is-selected" : ""}
            style={{ "--protocol-act": color }}
          >
            {option}
          </button>
        ))}
      </div>
      <MetricGrid>
        <MetricCard label={stepDef.metricLabel} value={pills.length} sub={reading} color={color} />
        <MetricCard label={stepDef.priorityLabel} value={priorityItem} small color={color} />
      </MetricGrid>
    </div>
  );
};

const WitnessSliders = ({ stepDef, state, update, color }) => {
  const vals = stepDef.witnessItems.map((_, index) => state[`witness_${index}`] || 5);
  const total = vals.reduce((a, b) => a + b, 0);
  const gap = 30 - total;
  const gaps = stepDef.witnessGaps || [
    "Fully grounded witness.",
    "Mostly grounded. One pocket remains.",
    "Partial witness. The practice is active but incomplete.",
    "Significant gap. This is the primary protocol.",
  ];
  const gapIndex = gap <= 3 ? 0 : gap <= 9 ? 1 : gap <= 15 ? 2 : 3;

  return (
    <div>
      <ExerciseLabel color={color}>{stepDef.exLabel || "Witness Calibration"}</ExerciseLabel>
      {stepDef.witnessItems.map((item, index) => (
        <RangeField
          key={item}
          label={item}
          value={vals[index]}
          color={color}
          minLabel={stepDef.sliderEnds[index][0]}
          maxLabel={stepDef.sliderEnds[index][1]}
          onChange={(value) => update(`witness_${index}`, value)}
        />
      ))}
      <MetricGrid>
        <MetricCard label={stepDef.metricLabel} value={total} color={color} />
        <MetricCard label={stepDef.gapLabel} value={gaps[gapIndex]} small color={color} />
      </MetricGrid>
    </div>
  );
};

const Declaration = ({ stepDef, state, update, color }) => {
  const vals = stepDef.sliderItems.map((_, index) => state[`decl_${index}`] || 5);
  const gap = Math.max(0, vals[0] - vals[1]);
  const reads = stepDef.declReadings || ["No gap.", "Small gap.", "Moderate gap.", "Large gap."];
  const statuses = stepDef.declStatuses || ["Complete.", "One move remaining.", "Declaration required.", "Declaration is the work."];
  const readingIndex = gap <= 0 ? 0 : gap <= 2 ? 1 : gap <= 5 ? 2 : 3;

  return (
    <div>
      <ExerciseLabel color={color}>{stepDef.exLabel || "Declaration Analysis"}</ExerciseLabel>
      {stepDef.sliderItems.map((item, index) => (
        <RangeField
          key={item}
          label={item}
          value={vals[index]}
          color={color}
          minLabel={stepDef.sliderEnds[index][0]}
          maxLabel={stepDef.sliderEnds[index][1]}
          onChange={(value) => update(`decl_${index}`, value)}
        />
      ))}
      <MetricGrid>
        <MetricCard label={stepDef.metricLabel} value={gap} sub={reads[readingIndex]} color={color} />
        <MetricCard label={stepDef.statusLabel} value={statuses[readingIndex]} small color={color} />
      </MetricGrid>
    </div>
  );
};

const RangeField = ({ label, value, color, minLabel, maxLabel, onChange }) => (
  <label className="protocol-range-field">
    <span>
      <strong>{label}</strong>
      <em>{value}</em>
    </span>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={(event) => onChange(parseInt(event.target.value, 10))}
      style={{ accentColor: color }}
    />
    <small><span>{minLabel}</span><span>{maxLabel}</span></small>
  </label>
);

const ExerciseLabel = ({ children, color }) => (
  <div className="protocol-exercise-label" style={{ color }}>{children}</div>
);

const MetricGrid = ({ children }) => <div className="protocol-metric-grid">{children}</div>;

const MetricCard = ({ label, value, sub, small, color }) => (
  <div className={`protocol-metric-card ${small ? "is-small" : ""}`} style={{ "--protocol-act": color }}>
    <span>{label}</span>
    <strong>{value}</strong>
    {sub && <em>{sub}</em>}
  </div>
);
