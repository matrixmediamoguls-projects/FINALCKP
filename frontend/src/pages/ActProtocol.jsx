import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  AgentTransmissionPanel,
  ExerciseRenderer,
  ProtocolActionFooter,
  ProtocolCompletion,
  ProtocolHeader,
  ProtocolStepNavigator,
} from "../components/journey/ProtocolJourneyModules";
import {
  buildProtocolPath,
  canAccessAct,
  getActMeta,
  getCompletedStepIndexes,
} from "../data/journey";
import actDefs from "../data/actDefinitions";

const clampStep = (step) => Math.max(0, Math.min(4, Number(step) || 0));

const buildPromptData = ({ stepDef, state, stepData }) => {
  let promptData = { text: state.text || "" };

  if (stepDef.exercise === "domain_sliders") {
    const vals = stepDef.domains.map((_, index) => state[`slider_${index}`] || 5);
    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    const maxVal = Math.max(...vals);
    const topIdx = vals.indexOf(maxVal);
    promptData = {
      ...promptData,
      vals,
      avg,
      topVal: maxVal,
      topDomain: stepDef.domains[topIdx],
      domains: stepDef.domains,
    };
  } else if (stepDef.exercise === "checklist") {
    const checked = state.checked || [];
    promptData = {
      ...promptData,
      checked,
      checkedLabels: checked.map((index) => stepDef.items[index]),
    };
  } else if (stepDef.exercise === "pills") {
    promptData = { ...promptData, pills: state.pills || [] };
  } else if (stepDef.exercise === "witness_sliders") {
    const vals = stepDef.witnessItems.map((_, index) => state[`witness_${index}`] || 5);
    promptData = { ...promptData, vals, total: vals.reduce((a, b) => a + b, 0) };
  } else if (stepDef.exercise === "declaration") {
    const vals = stepDef.sliderItems.map((_, index) => state[`decl_${index}`] || 5);
    promptData = {
      ...promptData,
      vals,
      gap: Math.max(0, vals[0] - vals[1]),
      step1Text: stepData[0]?.text || "",
      step3Text: stepData[2]?.text || "",
    };
  }

  return promptData;
};

const ActProtocol = () => {
  const { actNumber } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, checkAuth } = useAuth();

  const actNum = Number.parseInt(actNumber, 10);
  const actDef = actDefs[actNum];
  const actMeta = getActMeta(actNum);
  const requestedStep = clampStep(searchParams.get("step"));

  const [currentStep, setCurrentStep] = useState(requestedStep);
  const [stepData, setStepData] = useState({});
  const [savedSteps, setSavedSteps] = useState([]);
  const [agentResponses, setAgentResponses] = useState({});
  const [agentLoading, setAgentLoading] = useState({});
  const [completed, setCompleted] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const completedSteps = useMemo(
    () => getCompletedStepIndexes(savedSteps.map((step) => ({ step, completed: true }))),
    [savedSteps],
  );

  const setStepWithUrl = useCallback(
    (step, replace = false) => {
      const next = clampStep(step);
      setCurrentStep(next);
      setSearchParams({ step: String(next) }, { replace });
    },
    [setSearchParams],
  );

  const loadStepProgress = useCallback(async () => {
    if (!actDef) return;
    setLoading(true);
    try {
      const res = await axios.get(`/protocol/steps/${actNum}`);
      const steps = res.data.steps || [];
      const dataMap = {};
      const complete = [];

      steps.forEach((step) => {
        dataMap[step.step] = step.data || {};
        if (step.completed) complete.push(Number(step.step));
      });

      setStepData(dataMap);
      setSavedSteps([...new Set(complete)].sort((a, b) => a - b));
      setCompleted(complete.length >= 5);
    } catch (error) {
      setStepData({});
      setSavedSteps([]);
      setCompleted(false);
    } finally {
      setLoading(false);
    }
  }, [actDef, actNum]);

  useEffect(() => {
    if (!actDef) {
      navigate("/launchmodule", { replace: true });
      return;
    }
    if (!canAccessAct(user, actNum)) {
      navigate(actNum === 4 ? "/act/4" : "/acts?showUnlock=true", { replace: true });
      return;
    }
    loadStepProgress();
  }, [actDef, actNum, loadStepProgress, navigate, user]);

  useEffect(() => {
    if (requestedStep !== currentStep && !completed) {
      setCurrentStep(requestedStep);
    }
  }, [completed, currentStep, requestedStep]);

  const getStepState = (step) => stepData[step] || {};

  const updateStepState = (step, key, value) => {
    setStepData((prev) => ({
      ...prev,
      [step]: { ...prev[step], [key]: value },
    }));
  };

  const saveStep = async (step, markComplete = false) => {
    const data = getStepState(step);
    setSaving(true);
    setCompletionError("");

    try {
      await axios.post(`/protocol/steps/${actNum}/${step}`, {
        data,
        completed: markComplete,
      });
      if (markComplete) {
        setSavedSteps((prev) => [...new Set([...prev, step])].sort((a, b) => a - b));
      }
      return true;
    } catch (error) {
      setCompletionError("The step could not be saved. Check the connection and try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const selectStep = async (step) => {
    await saveStep(currentStep, false);
    setStepWithUrl(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const advanceStep = async () => {
    const saved = await saveStep(currentStep, true);
    if (!saved) return;
    setStepWithUrl(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackStep = async () => {
    await saveStep(currentStep, false);
    setStepWithUrl(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeProtocol = async () => {
    const saved = await saveStep(currentStep, true);
    if (!saved) return;

    try {
      await axios.post(`/protocol/complete-act/${actNum}`);
      setCompleted(true);
      await checkAuth();
    } catch (error) {
      setCompletionError(error.response?.data?.detail || "Complete all five steps before sealing this act.");
    }
  };

  const callAgent = async (stepIndex) => {
    const stepDef = actDef.steps[stepIndex];
    const state = getStepState(stepIndex);
    const promptData = buildPromptData({ stepDef, state, stepData });

    setAgentLoading((prev) => ({ ...prev, [stepIndex]: true }));
    try {
      const res = await axios.post("/protocol/chat", {
        message: stepDef.agentPrompt(promptData),
        session_id: `protocol_act${actNum}_step${stepIndex}_${user?.user_id}`,
        act: actNum,
      });
      setAgentResponses((prev) => ({ ...prev, [stepIndex]: res.data.response }));
    } catch (error) {
      const msg = error.response?.status === 402
        ? "The Seeker needs fuel. Go to Profile > Universal Key > Add Balance."
        : "The Seeker is temporarily in silence. Your work here is still recorded.";
      setAgentResponses((prev) => ({ ...prev, [stepIndex]: msg }));
    } finally {
      setAgentLoading((prev) => ({ ...prev, [stepIndex]: false }));
    }
  };

  if (!actDef) return null;
  if (loading) {
    return (
      <div className="protocol-loading">
        <span className="console-label">Loading Protocol</span>
      </div>
    );
  }

  if (completed) {
    return (
      <ProtocolCompletion
        actDef={actDef}
        declaration={getStepState(4)?.text || "Protocol complete. The declaration lives in the record now."}
        onWheel={() => navigate("/wheel")}
        onLaunchModule={() => navigate("/launchmodule")}
        onReview={() => {
          setCompleted(false);
          setStepWithUrl(0, true);
        }}
      />
    );
  }

  const stepDef = actDef.steps[currentStep];
  const state = getStepState(currentStep);

  return (
    <main
      data-testid="act-protocol"
      className="protocol-journey"
      style={{ "--protocol-act": actDef.color, "--protocol-act-dim": actDef.dim }}
    >
      <ProtocolHeader
        actDef={actDef}
        actMeta={actMeta}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <ProtocolStepNavigator
        actDef={actDef}
        currentStep={currentStep}
        savedSteps={savedSteps}
        onSelectStep={selectStep}
      />

      <section className="protocol-step-shell" key={`${actNum}-${currentStep}`}>
        <div className="protocol-step-copy">
          <span className="console-label">Step {String(currentStep + 1).padStart(2, "0")} of 05</span>
          <h2>{stepDef.name}</h2>
          {stepDef.lyric && (
            <blockquote>
              {stepDef.lyric}
              <span>{stepDef.lyricSource}</span>
            </blockquote>
          )}
          <p>{stepDef.desc}</p>
        </div>

        <section className="protocol-exercise-panel">
          <ExerciseRenderer
            stepDef={stepDef}
            state={state}
            update={(key, value) => updateStepState(currentStep, key, value)}
            color={actDef.color}
          />

          <label className="protocol-reflection-field">
            <span className="console-label">Reflection</span>
            <strong>{stepDef.textPrompt}</strong>
            <textarea
              data-testid="step-textarea"
              value={state.text || ""}
              onChange={(event) => updateStepState(currentStep, "text", event.target.value)}
              placeholder={stepDef.textPlaceholder}
            />
          </label>
        </section>

        <AgentTransmissionPanel
          actDef={actDef}
          response={agentResponses[currentStep]}
          loading={agentLoading[currentStep]}
          onTransmit={() => callAgent(currentStep)}
        />

        {completionError && <div className="protocol-error-state">{completionError}</div>}

        <ProtocolActionFooter
          actDef={actDef}
          currentStep={currentStep}
          onBack={goBackStep}
          onAdvance={advanceStep}
          onComplete={completeProtocol}
          saving={saving}
        />
      </section>

      <div className="protocol-reference-link">
        <button type="button" onClick={() => navigate(`/act/${actNum}`)}>Open Act {actDef.roman} Codex</button>
        <button type="button" onClick={() => navigate(buildProtocolPath(actNum, currentStep))}>Refresh Step Route</button>
      </div>
    </main>
  );
};

export default ActProtocol;
