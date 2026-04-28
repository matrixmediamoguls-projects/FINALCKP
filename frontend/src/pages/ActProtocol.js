import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import actDefs from '../data/actDefinitions';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const AGENT_SYSTEM = (actDef) => `You are ${actDef.agent} — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act ${actDef.roman}: ${actDef.title}. You speak with authority, warmth, and prophetic precision. You are not a therapist. You are a mirror that refuses to lie. Your tone is confident, spiritual, declarative — aligned with the Musiq Matrix aesthetic: street prophet meets Hermetic architect. Keep responses under 200 words. Use line breaks for breathing room. End with a clear directive or question.`;

const ActProtocol = () => {
  const { actNumber } = useParams();
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const actNum = parseInt(actNumber, 10);
  const actDef = actDefs[actNum];

  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [savedSteps, setSavedSteps] = useState([]);
  const [agentResponses, setAgentResponses] = useState({});
  const [agentLoading, setAgentLoading] = useState({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStepProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/protocol/steps/${actNum}`);
      const steps = res.data.steps || [];
      const dataMap = {};
      const completedSteps = [];
      steps.forEach(s => {
        dataMap[s.step] = s.data || {};
        if (s.completed) completedSteps.push(s.step);
      });
      setStepData(dataMap);
      setSavedSteps(completedSteps);
      if (completedSteps.length === 5) setCompleted(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [actNum]);

  useEffect(() => {
    if (!actDef) return;
    loadStepProgress();
  }, [actDef, loadStepProgress]);

  const getStepState = (step) => stepData[step] || {};
  const updateStepState = (step, key, value) => {
    setStepData(prev => ({
      ...prev,
      [step]: { ...prev[step], [key]: value }
    }));
  };

  const saveStep = async (step, markComplete = false) => {
    const data = getStepState(step);
    try {
      await axios.post(`/protocol/steps/${actNum}/${step}`, {
        data,
        completed: markComplete
      });
      if (markComplete && !savedSteps.includes(step)) {
        setSavedSteps(prev => [...prev, step]);
      }
    } catch (e) { console.error(e); }
  };

  const advanceStep = async (next) => {
    await saveStep(currentStep, true);
    if (next < 5) {
      setCurrentStep(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completeProtocol = async () => {
    await saveStep(currentStep, true);
    try {
      const res = await axios.post(`/protocol/complete-act/${actNum}`);
      if (res.data.spin_awarded) {
        setCompleted(true);
        await checkAuth();
      } else {
        setCompleted(true);
      }
    } catch (e) {
      // Might already be complete
      setCompleted(true);
    }
  };

  const callAgent = async (stepIdx) => {
    const stepDef = actDef.steps[stepIdx];
    const state = getStepState(stepIdx);
    setAgentLoading(prev => ({ ...prev, [stepIdx]: true }));

    let promptData = { text: state.text || '' };
    if (stepDef.exercise === 'domain_sliders') {
      const vals = stepDef.domains.map((_, i) => state[`slider_${i}`] || 5);
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
      const maxVal = Math.max(...vals);
      const topIdx = vals.indexOf(maxVal);
      promptData = { ...promptData, vals, avg, topVal: maxVal, topDomain: stepDef.domains[topIdx], domains: stepDef.domains };
    } else if (stepDef.exercise === 'checklist') {
      const checked = (state.checked || []);
      promptData = { ...promptData, checked, checkedLabels: checked.map(i => stepDef.items[i]) };
    } else if (stepDef.exercise === 'pills') {
      promptData = { ...promptData, pills: state.pills || [] };
    } else if (stepDef.exercise === 'witness_sliders') {
      const vals = stepDef.witnessItems.map((_, i) => state[`witness_${i}`] || 5);
      promptData = { ...promptData, vals, total: vals.reduce((a, b) => a + b, 0) };
    } else if (stepDef.exercise === 'declaration') {
      const vals = stepDef.sliderItems.map((_, i) => state[`decl_${i}`] || 5);
      const step1Text = stepData[0]?.text || '';
      const step3Text = stepData[2]?.text || '';
      promptData = { ...promptData, vals, gap: Math.max(0, vals[0] - vals[1]), step1Text, step3Text };
    }

    const userPrompt = stepDef.agentPrompt(promptData);

    try {
      const res = await axios.post('/protocol/chat', {
        message: userPrompt,
        session_id: `protocol_act${actNum}_step${stepIdx}_${user?.user_id}`,
        act: actNum
      });
      setAgentResponses(prev => ({ ...prev, [stepIdx]: res.data.response }));
    } catch (e) {
      const msg = e.response?.status === 402
        ? 'The Seeker needs fuel. Go to Profile > Universal Key > Add Balance.'
        : 'The Seeker is temporarily in silence. Your work here is still recorded.';
      setAgentResponses(prev => ({ ...prev, [stepIdx]: msg }));
    }
    setAgentLoading(prev => ({ ...prev, [stepIdx]: false }));
  };

  if (!actDef) return <div style={centerStyle}><p style={monoStyle}>Act not found.</p></div>;
  if (loading) return <div style={centerStyle}><p style={{ ...monoStyle, letterSpacing: '0.3em' }}>Loading protocol...</p></div>;

  if (completed) {
    const decl = getStepState(4)?.text || '"Protocol complete. The declaration lives in the record now."';
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, border: `1px solid ${actDef.color}`, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 28, color: actDef.color }}>&#x2726;</span>
        </div>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 900, color: 'var(--bone, #E8E0D0)', marginBottom: 12 }}>Protocol Complete</h2>
        <p style={{ fontStyle: 'italic', color: 'rgba(232,228,216,0.6)', lineHeight: 1.8, marginBottom: 24 }}>
          Act {actDef.roman} closes. What the {actDef.element.toLowerCase()} revealed is yours to carry forward. You have earned a spin on the Wheel.
        </p>
        <div data-testid="final-declaration" style={{ background: 'rgba(232,228,216,0.04)', border: `1px solid rgba(232,228,216,0.12)`, borderLeft: `3px solid ${actDef.color}`, padding: '20px', textAlign: 'left', fontStyle: 'italic', lineHeight: 1.8, color: 'var(--bone, #E8E0D0)', fontSize: 15, marginBottom: 24 }}>
          {decl}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button data-testid="go-to-wheel" onClick={() => navigate('/wheel')} style={btnPrimary(actDef.color)}>Spin the Wheel &#x2192;</button>
          <button onClick={() => navigate('/dashboard')} style={btnSecondary}>Back to Dashboard</button>
          <button onClick={() => { setCompleted(false); setCurrentStep(0); }} style={btnSecondary}>Review Steps</button>
        </div>
      </div>
    );
  }

  const stepDef = actDef.steps[currentStep];
  const state = getStepState(currentStep);

  return (
    <div data-testid="act-protocol" style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid rgba(232,228,216,0.12)', marginBottom: 28 }}>
        <div style={{ ...monoStyle, color: actDef.color, marginBottom: 8 }}>Act {actDef.roman} · {actDef.element} · {actDef.title}</div>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(18px,3vw,28px)', fontWeight: 900, color: 'var(--bone, #E8E0D0)', lineHeight: 1.2, marginBottom: 8 }}>The Five-Step Initiatory Engine</h1>
        <p style={{ fontStyle: 'italic', color: 'rgba(232,228,216,0.5)' }}>{actDef.principle}</p>
      </div>

      {/* Step Navigation */}
      <div data-testid="step-nav" style={{ display: 'flex', border: '1px solid rgba(232,228,216,0.12)', marginBottom: 28, overflow: 'hidden' }}>
        {actDef.steps.map((s, i) => (
          <div key={i} data-testid={`step-pip-${i}`} onClick={() => { saveStep(currentStep, false); setCurrentStep(i); }}
            style={{
              flex: 1, padding: '10px 4px', textAlign: 'center', cursor: 'pointer',
              fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: i === currentStep ? 'var(--bone, #E8E0D0)' : savedSteps.includes(i) ? actDef.color : 'rgba(232,228,216,0.3)',
              background: i === currentStep ? 'rgba(232,228,216,0.04)' : 'transparent',
              borderRight: i < 4 ? '1px solid rgba(232,228,216,0.12)' : 'none',
              transition: 'all 0.15s'
            }}>
            <span style={{ fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 2 }}>{s.num}</span>
            {s.label}
            {savedSteps.includes(i) && <span style={{ display: 'block', color: actDef.color, fontSize: 14, lineHeight: '0.5' }}>&#xB7;</span>}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div key={currentStep} style={{ animation: 'fadeUp 0.4s ease' }}>
        <div style={{ ...monoStyle, color: actDef.color, marginBottom: 6 }}>Step {String(currentStep + 1).padStart(2, '0')} of 05</div>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 600, color: 'var(--bone, #E8E0D0)', marginBottom: 12 }}>{stepDef.name}</h2>
        <blockquote style={{ fontStyle: 'italic', color: 'rgba(232,228,216,0.55)', lineHeight: 1.7, borderLeft: `2px solid ${actDef.dim}`, paddingLeft: 16, marginBottom: 16 }}>
          {stepDef.lyric}<br /><span style={{ fontSize: 12, opacity: 0.5 }}>— {stepDef.lyricSource}</span>
        </blockquote>
        <p style={{ lineHeight: 1.8, color: 'rgba(232,228,216,0.75)', marginBottom: 24 }}>{stepDef.desc}</p>

        {/* Exercise */}
        <div style={exerciseBlock}>
          {stepDef.exercise === 'domain_sliders' && <DomainSliders stepDef={stepDef} state={state} update={(k, v) => updateStepState(currentStep, k, v)} color={actDef.color} />}
          {stepDef.exercise === 'checklist' && <Checklist stepDef={stepDef} state={state} update={(k, v) => updateStepState(currentStep, k, v)} color={actDef.color} />}
          {stepDef.exercise === 'pills' && <PillGrid stepDef={stepDef} state={state} update={(k, v) => updateStepState(currentStep, k, v)} color={actDef.color} />}
          {stepDef.exercise === 'witness_sliders' && <WitnessSliders stepDef={stepDef} state={state} update={(k, v) => updateStepState(currentStep, k, v)} color={actDef.color} />}
          {stepDef.exercise === 'declaration' && <Declaration stepDef={stepDef} state={state} update={(k, v) => updateStepState(currentStep, k, v)} color={actDef.color} />}

          <div style={{ marginTop: 20 }}>
            <div style={{ ...monoStyle, color: actDef.color, marginBottom: 8 }}>&#x25C7; Reflection</div>
            <p style={{ marginBottom: 10, color: 'rgba(232,228,216,0.8)' }}>{stepDef.textPrompt}</p>
            <textarea data-testid="step-textarea" value={state.text || ''} onChange={e => updateStepState(currentStep, 'text', e.target.value)}
              placeholder={stepDef.textPlaceholder}
              style={textareaStyle} />
          </div>
        </div>

        {/* Agent Panel */}
        <div data-testid="agent-panel" style={{ marginTop: 20, border: `1px solid ${actDef.color}33`, background: `${actDef.color}08`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${actDef.color}22` }}>
            <div style={{ width: 7, height: 7, background: actDef.color, borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ ...monoStyle, color: actDef.color }}>{actDef.agent} · Protocol Agent</span>
            <span style={{ ...monoStyle, color: 'rgba(232,228,216,0.3)', marginLeft: 'auto' }}>
              {agentLoading[currentStep] ? 'Transmitting...' : agentResponses[currentStep] ? 'Transmission complete' : 'Ready'}
            </span>
          </div>
          <div style={{ padding: 16, minHeight: 60 }}>
            {agentResponses[currentStep] ? (
              <div style={{ lineHeight: 1.8, color: 'rgba(232,228,216,0.8)' }}>
                {agentResponses[currentStep].split('\n').map((p, i) => <p key={i} style={{ marginBottom: 8 }}>{p}</p>)}
              </div>
            ) : (
              <p style={{ ...monoStyle, color: 'rgba(232,228,216,0.2)' }}>Submit your reading to receive your protocol transmission.</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
          <button data-testid="transmit-btn" onClick={() => callAgent(currentStep)} disabled={agentLoading[currentStep]}
            style={{ ...btnGhost(actDef.color), opacity: agentLoading[currentStep] ? 0.4 : 1 }}>
            {agentLoading[currentStep] ? 'Transmitting...' : `Transmit to ${actDef.agent} \u2197`}
          </button>
          {currentStep < 4 ? (
            <button data-testid="advance-btn" onClick={() => advanceStep(currentStep + 1)} style={btnPrimary(actDef.color)}>
              Proceed to Step {actDef.steps[currentStep + 1]?.num} &#x2192;
            </button>
          ) : (
            <button data-testid="complete-btn" onClick={completeProtocol} style={btnPrimary(actDef.color)}>
              Complete the Protocol &#x2192;
            </button>
          )}
          {currentStep > 0 && (
            <button onClick={() => { saveStep(currentStep, false); setCurrentStep(currentStep - 1); }} style={btnSecondary}>&#x2190; Back</button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Exercise Components ── */

const DomainSliders = ({ stepDef, state, update, color }) => {
  const vals = stepDef.domains.map((_, i) => state[`slider_${i}`] || 5);
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  const maxVal = Math.max(...vals);
  const topIdx = vals.indexOf(maxVal);

  // Contextual metric reading
  let metricReading = '';
  if (stepDef.metricReadings) {
    const r = stepDef.metricReadings.find(r => parseFloat(avg) <= r.max);
    metricReading = r ? r.text : stepDef.metricReadings[stepDef.metricReadings.length - 1].text;
  }
  const domainReading = stepDef.domainReadings ? stepDef.domainReadings[topIdx] : '';

  return (
    <div>
      <div style={{ ...monoStyle, color: 'var(--gold, #C9962A)', marginBottom: 12 }}>{stepDef.exLabel || `${stepDef.metricLabel} Calibration`}</div>
      {stepDef.domains.map((domain, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...monoStyle, color: 'rgba(232,228,216,0.5)', marginBottom: 4 }}>
            <span>{domain}</span><span style={{ color: 'var(--ember, #F5C97A)', fontWeight: 700 }}>{vals[i]}</span>
          </div>
          <input type="range" min="1" max="10" value={vals[i]} onChange={e => update(`slider_${i}`, parseInt(e.target.value))} style={rangeStyle} />
          <div style={{ display: 'flex', justifyContent: 'space-between', ...monoStyle, fontSize: 8, color: 'rgba(232,228,216,0.25)', marginTop: 2 }}>
            <span>{stepDef.sliderEnds[0]}</span><span>{stepDef.sliderEnds[1]}</span>
          </div>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <MetricCard label={stepDef.metricLabel} value={avg} sub={metricReading} color={color} />
        <MetricCard label={stepDef.metricDomain} value={stepDef.domains[topIdx]} sub={domainReading} small color={color} />
      </div>
      {stepDef.exQuestion && <div style={{ marginTop: 16, lineHeight: 1.7, color: 'var(--bone, #E8E0D0)' }}>{stepDef.exQuestion}</div>}
    </div>
  );
};

const Checklist = ({ stepDef, state, update, color }) => {
  const checked = state.checked || [];
  const toggle = (i) => {
    const next = checked.includes(i) ? checked.filter(x => x !== i) : [...checked, i];
    update('checked', next);
  };

  // Use specific verdicts if provided, otherwise defaults
  let verdict = '';
  if (stepDef.burnVerdicts) {
    const c = checked.length;
    const vi = c === 0 ? 0 : c <= 1 ? 1 : c <= 3 ? 2 : c <= 4 ? 3 : c <= 6 ? 4 : 5;
    verdict = stepDef.burnVerdicts[vi];
  } else {
    const defaults = ['Minimal patterns active.', 'One or two patterns identified.', 'Moderate patterning.', 'Significant patterning detected.', 'Heavy patterning. Deep work territory.', 'Full pattern saturation.'];
    const vi = checked.length === 0 ? 0 : checked.length <= 1 ? 1 : checked.length <= 3 ? 2 : checked.length <= 4 ? 3 : checked.length <= 6 ? 4 : 5;
    verdict = defaults[vi];
  }

  return (
    <div>
      <div style={{ ...monoStyle, color: 'var(--gold, #C9962A)', marginBottom: 12 }}>{stepDef.exLabel || `${stepDef.metricLabel} Inventory`}</div>
      {stepDef.exQuestion && <div style={{ lineHeight: 1.7, color: 'var(--bone, #E8E0D0)', marginBottom: 16 }}>{stepDef.exQuestion}</div>}
      {stepDef.items.map((item, i) => (
        <label key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} style={{ marginTop: 3, accentColor: color, width: 15, height: 15, flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: checked.includes(i) ? 'var(--bone, #E8E0D0)' : 'rgba(232,228,216,0.7)', lineHeight: 1.6 }}>{item}</span>
        </label>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <MetricCard label={stepDef.metricLabel} value={`${checked.length}/7`} sub={`${checked.length} active masks identified.`} color={color} />
        <MetricCard label={stepDef.verdictLabel} value={verdict} small color={color} />
      </div>
    </div>
  );
};

const PillGrid = ({ stepDef, state, update, color }) => {
  const pills = state.pills || [];
  const toggle = (opt) => {
    const next = pills.includes(opt) ? pills.filter(x => x !== opt) : [...pills, opt];
    update('pills', next);
  };

  // Priority ordering if defined
  let priorityItem = pills[0] || '—';
  if (stepDef.ledgerPriority) {
    const ordered = stepDef.ledgerPriority.filter(p => pills.includes(p));
    priorityItem = ordered.length > 0 ? `${ordered[0]} — highest protocol priority` : '—';
  }

  // Contextual reading
  let reading = '';
  if (stepDef.ledgerReadings) {
    const c = pills.length;
    const ri = c === 0 ? 0 : c === 1 ? 1 : c <= 3 ? 2 : 3;
    reading = ri === 3 ? `${c}${stepDef.ledgerReadings[3]}` : stepDef.ledgerReadings[ri];
  }

  return (
    <div>
      <div style={{ ...monoStyle, color: 'var(--gold, #C9962A)', marginBottom: 12 }}>{stepDef.exLabel || `${stepDef.metricLabel} Selection`}</div>
      {stepDef.exQuestion && <div style={{ lineHeight: 1.7, color: 'var(--bone, #E8E0D0)', marginBottom: 16 }}>{stepDef.exQuestion}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {stepDef.options.map(opt => (
          <button key={opt} onClick={() => toggle(opt)} style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: '0.08em', padding: '6px 14px',
            border: `1px solid ${pills.includes(opt) ? color : 'rgba(232,228,216,0.12)'}`,
            background: pills.includes(opt) ? `${color}14` : 'transparent',
            color: pills.includes(opt) ? color : 'rgba(232,228,216,0.4)', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.15s'
          }}>{opt}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MetricCard label={stepDef.metricLabel} value={pills.length} sub={reading} color={color} />
        <MetricCard label={stepDef.priorityLabel} value={priorityItem} small color={color} />
      </div>
    </div>
  );
};

const WitnessSliders = ({ stepDef, state, update, color }) => {
  const vals = stepDef.witnessItems.map((_, i) => state[`witness_${i}`] || 5);
  const total = vals.reduce((a, b) => a + b, 0);
  const gap = 30 - total;
  const defaultGaps = ['Fully sovereign witness.', 'Mostly sovereign. One pocket of dependency remains.', 'Partial witness. The practice is active but incomplete.', 'Significant gap. This is the primary work.'];
  const gaps = stepDef.witnessGaps || defaultGaps;
  const gi = gap <= 3 ? 0 : gap <= 9 ? 1 : gap <= 15 ? 2 : 3;

  return (
    <div>
      <div style={{ ...monoStyle, color, marginBottom: 12 }}>{stepDef.exLabel || '\u25C7 Witness Calibration'}</div>
      {stepDef.witnessItems.map((item, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...monoStyle, color: 'rgba(232,228,216,0.5)', marginBottom: 4 }}>
            <span style={{ fontSize: 11 }}>{item}</span><span style={{ color, fontWeight: 700 }}>{vals[i]}</span>
          </div>
          <input type="range" min="1" max="10" value={vals[i]} onChange={e => update(`witness_${i}`, parseInt(e.target.value))} style={rangeStyle} />
          <div style={{ display: 'flex', justifyContent: 'space-between', ...monoStyle, fontSize: 8, color: 'rgba(232,228,216,0.25)', marginTop: 2 }}>
            <span>{stepDef.sliderEnds[i][0]}</span><span>{stepDef.sliderEnds[i][1]}</span>
          </div>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MetricCard label={stepDef.metricLabel} value={total} color={color} />
        <MetricCard label={stepDef.gapLabel} value={gaps[gi]} small color={color} />
      </div>
    </div>
  );
};

const Declaration = ({ stepDef, state, update, color }) => {
  const vals = stepDef.sliderItems.map((_, i) => state[`decl_${i}`] || 5);
  const gap = Math.max(0, vals[0] - vals[1]);
  const defaultReads = ['No gap. Fully on record.', 'Small gap. One move remaining.', 'Moderate gap. Declaration required.', 'Large gap. The declaration is the entire work.'];
  const defaultStatuses = ['Complete.', 'One move remaining.', 'Declaration required.', 'Declaration is the entire work.'];
  const reads = stepDef.declReadings || defaultReads;
  const statuses = stepDef.declStatuses || defaultStatuses;
  const ri = gap <= 0 ? 0 : gap <= 2 ? 1 : gap <= 5 ? 2 : 3;

  return (
    <div>
      <div style={{ ...monoStyle, color, marginBottom: 12 }}>{stepDef.exLabel || '\u25C7 Declaration Analysis'}</div>
      {stepDef.sliderItems.map((item, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...monoStyle, color: 'rgba(232,228,216,0.5)', marginBottom: 4 }}>
            <span style={{ fontSize: 11 }}>{item}</span><span style={{ color, fontWeight: 700 }}>{vals[i]}</span>
          </div>
          <input type="range" min="1" max="10" value={vals[i]} onChange={e => update(`decl_${i}`, parseInt(e.target.value))} style={rangeStyle} />
          <div style={{ display: 'flex', justifyContent: 'space-between', ...monoStyle, fontSize: 8, color: 'rgba(232,228,216,0.25)', marginTop: 2 }}>
            <span>{stepDef.sliderEnds[i][0]}</span><span>{stepDef.sliderEnds[i][1]}</span>
          </div>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MetricCard label={stepDef.metricLabel} value={gap} sub={reads[ri]} color={color} />
        <MetricCard label={stepDef.statusLabel} value={statuses[ri]} small color={color} />
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, sub, small, color }) => (
  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(232,228,216,0.12)', padding: 14 }}>
    <div style={{ ...monoStyle, fontSize: 8, color: 'rgba(232,228,216,0.3)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: small ? "'IM Fell English',serif" : "'Cinzel',serif", fontSize: small ? 13 : 28, color: small ? 'rgba(232,228,216,0.6)' : color, fontStyle: small ? 'italic' : 'normal', lineHeight: small ? 1.5 : 1, marginTop: small ? 4 : 0 }}>{value}</div>
    {sub && <div style={{ fontStyle: 'italic', fontSize: 12, color: 'rgba(232,228,216,0.5)', marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
  </div>
);

/* ── Styles ── */
const monoStyle = { fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' };
const centerStyle = { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const exerciseBlock = { background: 'rgba(232,228,216,0.04)', border: '1px solid rgba(232,228,216,0.12)', padding: '20px', marginBottom: 0 };
const textareaStyle = {
  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(232,228,216,0.12)',
  padding: 14, color: 'var(--bone, #E8E0D0)', fontFamily: "'IM Fell English',serif", fontSize: 15,
  lineHeight: 1.7, resize: 'vertical', minHeight: 90, outline: 'none', boxSizing: 'border-box'
};
const rangeStyle = { width: '100%', accentColor: 'var(--fire, #D85A30)' };
const btnPrimary = (color) => ({
  fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
  padding: '10px 24px', background: color, color: '#1A1917', border: 'none', cursor: 'pointer'
});
const btnSecondary = {
  fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
  padding: '10px 24px', background: 'transparent', color: 'rgba(232,228,216,0.5)',
  border: '1px solid rgba(232,228,216,0.12)', cursor: 'pointer'
};
const btnGhost = (color) => ({
  fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
  padding: '10px 18px', background: 'transparent', color, border: `1px solid ${color}44`, cursor: 'pointer'
});

export default ActProtocol;
