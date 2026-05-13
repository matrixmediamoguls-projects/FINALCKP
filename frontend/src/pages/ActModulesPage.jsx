import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LockKey } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import useJourneyProgress from "../hooks/useJourneyProgress";
import {
  ACTS,
  JOURNEY_MODULES,
  buildProtocolPath,
  canAccessAct,
  getActLockReason,
  getActStatus,
} from "../data/journey";
import actDefs from "../data/actDefinitions";
import { DEFAULT_VISUALIZER_PATH } from "../components/visualizer/visualizerAssets";

const panelMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const ActMeltTransition = ({ act, reducedMotion }) => {
  if (!act) return null;

  return (
    <motion.div
      className={`act-melt-transition ${act.tone}`}
      style={{ "--act-card": `var(${act.colorVar})`, "--act-card-raw": act.hex }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.16 }}
    >
      <motion.div
        className="act-melt-field"
        initial={reducedMotion ? false : { scaleY: 0.12, y: "-42%" }}
        animate={reducedMotion ? false : { scaleY: 1, y: "0%" }}
        transition={{ duration: 0.72, ease: [0.7, 0, 0.18, 1] }}
      />
      <motion.img
        className="act-melt-emblem"
        src={act.emblem}
        alt=""
        aria-hidden="true"
        initial={reducedMotion ? false : { scale: 0.76, opacity: 0.65, filter: "blur(10px)" }}
        animate={reducedMotion ? false : { scale: 1.12, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.62, ease: "easeOut" }}
      />
      <div className="act-melt-copy">
        <span>Act {act.roman} route opening</span>
        <strong>{act.title}</strong>
      </div>
    </motion.div>
  );
};

const ActModuleCard = ({ act, user, activeAct, completedActs, completedSteps, onEnter }) => {
  const Icon = act.icon;
  const locked = !canAccessAct(user, act.num);
  const status = getActStatus(user, act.num, activeAct);
  const stepsDone = act.num === activeAct ? completedSteps.length : completedActs.includes(act.num) ? 5 : 0;
  const stepNames = actDefs[act.num]?.steps?.map((step) => step.label || step.name) || [];

  return (
    <motion.article
      data-testid={`journey-act-${act.num}`}
      data-act-label={`ACT ${act.roman}`}
      className={`journey-card journey-act-card act-gateway-card ${act.tone} ${locked ? "is-locked" : ""} ${act.num === activeAct ? "is-active" : ""}`}
      style={{ "--act-card": `var(${act.colorVar})`, "--act-card-raw": act.hex }}
      variants={panelMotion}
    >
      <div className="journey-act-card-glow" aria-hidden="true" />
      <div className="journey-act-head">
        <span>Act {act.roman} / {act.element}</span>
        <em>{status}</em>
      </div>

      <button
        className="journey-emblem"
        type="button"
        onClick={() => onEnter(act)}
        aria-label={`Open Act ${act.roman}: ${act.title}`}
      >
        <img src={act.emblem} alt="" aria-hidden="true" />
        <span><Icon size={21} weight="duotone" />{act.glyph}</span>
      </button>

      <h2>{act.title}</h2>
      <p>{act.principle}</p>

      <div className="journey-step-pips" aria-label={`${stepsDone} of 5 steps complete`}>
        {[0, 1, 2, 3, 4].map((step) => (
          <span key={step} className={step < stepsDone ? "is-complete" : step === stepsDone && act.num === activeAct ? "is-current" : ""} />
        ))}
      </div>

      <div className="journey-step-list">
        {stepNames.slice(0, 5).map((step, index) => (
          <span key={step} className={index < stepsDone ? "is-complete" : index === stepsDone && act.num === activeAct ? "is-next" : ""}>
            {String(index + 1).padStart(2, "0")} / {step}
          </span>
        ))}
      </div>

      {locked && (
        <div className="journey-lock">
          <LockKey size={22} weight="duotone" />
          <strong>{act.num === 4 ? "Sealed" : "Locked"}</strong>
          <span>{getActLockReason(user, act.num)}</span>
        </div>
      )}

      <div className="journey-card-actions">
        <button type="button" data-testid={`journey-enter-${act.num}`} onClick={() => onEnter(act)}>
          {locked ? (act.num === 4 ? "View Seal" : "Unlock") : "Enter"}
          <ArrowUpRight size={13} weight="bold" />
        </button>
      </div>
    </motion.article>
  );
};

const ActModulesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [activatingAct, setActivatingAct] = useState(null);
  const activationTimerRef = useRef(null);

  const {
    activeAct,
    completedActs,
    completedSteps,
    nextAction,
    nextStepIndex,
  } = useJourneyProgress(user);

  const activeActMeta = ACTS.find((act) => act.num === activeAct) || ACTS[0];
  const userName = user?.name || user?.full_name || "Seeker";
  const userTier = user?.tier || "free";
  const availableModules = JOURNEY_MODULES.filter((module) => module.id !== "admin" || user?.is_admin);

  useEffect(() => {
    return () => {
      if (activationTimerRef.current) window.clearTimeout(activationTimerRef.current);
    };
  }, []);

  const handleActEnter = (act) => {
    if (!canAccessAct(user, act.num)) {
      navigate(act.num === 4 ? "/act/4" : "/dashboard?showUnlock=true");
      return;
    }

    if (act.num === 3) {
      navigate(DEFAULT_VISUALIZER_PATH);
      return;
    }

    const step = act.num === activeAct ? nextStepIndex : 0;
    setActivatingAct(act);
    if (activationTimerRef.current) window.clearTimeout(activationTimerRef.current);
    activationTimerRef.current = window.setTimeout(
      () => navigate(buildProtocolPath(act.num, step)),
      reducedMotion ? 70 : 820,
    );
  };

  return (
    <motion.main
      data-testid="act-gateway"
      className="act-gateway protocol-launch"
      initial={reducedMotion ? false : "hidden"}
      animate="show"
      transition={{ staggerChildren: reducedMotion ? 0 : 0.07 }}
    >
      <motion.section
        className={`protocol-launch-hero ${activeActMeta.tone}`}
        style={{ "--act-card": `var(${activeActMeta.colorVar})`, "--act-card-raw": activeActMeta.hex }}
        variants={panelMotion}
      >
        <div className="protocol-launch-copy">
          <span className="console-label">Authenticated Launch</span>
          <h1>Chroma Key Protocol</h1>
          <p>
            Welcome back, {userName}. Your current signal is staged; the act sequence,
            archive, and journal are synchronized for this session.
          </p>

          <div className="protocol-launch-actions">
            <button type="button" onClick={() => navigate(nextAction.path)}>
              {nextAction.label}
              <ArrowUpRight size={14} weight="bold" />
            </button>
            <button type="button" onClick={() => navigate("/codex")}>
              Open Codex
              <ArrowUpRight size={14} weight="bold" />
            </button>
            <button type="button" onClick={() => navigate("/journal")}>
              Journal
              <ArrowUpRight size={14} weight="bold" />
            </button>
          </div>
        </div>

        <button
          className="protocol-launch-emblem"
          type="button"
          onClick={() => handleActEnter(activeActMeta)}
          aria-label={`Open active act: ${activeActMeta.title}`}
        >
          <img src={activeActMeta.emblem} alt="" aria-hidden="true" />
          <span>Act {activeActMeta.roman} // {activeActMeta.element}</span>
        </button>

        <div className="protocol-launch-status" aria-label="Launch status">
          <div>
            <span>Active Act</span>
            <strong>{activeActMeta.title}</strong>
          </div>
          <div>
            <span>Current Operation</span>
            <strong>{nextAction.eyebrow}</strong>
          </div>
          <div>
            <span>Protocol State</span>
            <strong>{nextAction.description}</strong>
          </div>
          <div>
            <span>Access Tier</span>
            <strong>{userTier}</strong>
          </div>
        </div>
      </motion.section>

      <motion.section className="protocol-launch-modules" variants={panelMotion} aria-label="Main modules">
        {availableModules.map((module) => {
          const Icon = module.icon;
          const path = module.id === "codex" ? "/codex" : module.path;
          return (
            <button key={module.id} type="button" onClick={() => navigate(path)}>
              <Icon size={18} weight="duotone" />
              <span>{module.label}</span>
            </button>
          );
        })}
      </motion.section>

      <div className="act-gateway-grid">
        {ACTS.map((act) => (
          <ActModuleCard
            key={act.num}
            act={act}
            user={user}
            activeAct={activeAct}
            completedActs={completedActs}
            completedSteps={completedSteps}
            onEnter={handleActEnter}
          />
        ))}
      </div>

      <AnimatePresence>
        {activatingAct && <ActMeltTransition act={activatingAct} reducedMotion={reducedMotion} />}
      </AnimatePresence>
    </motion.main>
  );
};

export default ActModulesPage;
