import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle, LockKey, Play } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import PaywallModal from "../components/layout/PaywallModal";
import useJourneyProgress from "../hooks/useJourneyProgress";
import {
  ACTS,
  buildProtocolPath,
  canAccessAct,
} from "../data/journey";

const cardMotion = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const actPresentation = {
  1: {
    eyebrow: "Act One",
    title: "The Fractured Veil",
    titleLines: ["The", "Fractured", "Veil"],
    discipline: "Awakening",
    charge: "Reality is not as it seems.",
    verbs: ["Disrupt", "Discover", "Decode"],
    tone: "fracture",
    color: "#8ff044",
    colorSoft: "143,240,68",
    sceneHue: "0deg",
  },
  2: {
    eyebrow: "Act Two",
    title: "The Reflection Chamber",
    titleLines: ["The", "Reflection", "Chamber"],
    discipline: "Confrontation",
    charge: "Look clearly into the mirror of self.",
    verbs: ["Analyze", "Reflect", "Transcend"],
    tone: "reflection",
    color: "#33b9ff",
    colorSoft: "51,185,255",
    sceneHue: "120deg",
  },
  3: {
    eyebrow: "Act Three",
    title: "Reclamation",
    titleLines: ["Reclamation"],
    discipline: "Empowerment",
    charge: "Burn away what is not essential.",
    verbs: ["Confront", "Burn", "Reclaim"],
    tone: "reclamation",
    color: "#ff6338",
    colorSoft: "255,99,56",
    sceneHue: "240deg",
  },
  4: {
    eyebrow: "Act Four",
    title: "The Crucible Code",
    titleLines: ["The", "Crucible", "Code"],
    discipline: "Transcendence",
    charge: "Code your reality. Engineer the future.",
    verbs: ["Create", "Engineer", "Evolve"],
    tone: "crucible",
    color: "#ffd12d",
    colorSoft: "255,209,45",
    sceneHue: "300deg",
  },
};

const ActMeltTransition = ({ act, reducedMotion }) => {
  if (!act) return null;
  const card = actPresentation[act.num];

  return (
    <motion.div
      className={`act-melt-transition ${card.tone}`}
      style={{ "--act-card": card.color, "--act-card-rgb": card.colorSoft }}
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
        <span>{card.eyebrow} route opening</span>
        <strong>{card.title}</strong>
      </div>
    </motion.div>
  );
};

const ActLaunchCard = ({ act, user, activeAct, completedActs, onEnter }) => {
  const card = actPresentation[act.num];
  const locked = !canAccessAct(user, act.num);
  const isActive = act.num === activeAct;
  const isComplete = completedActs.includes(act.num);
  const statusLabel = isComplete ? "Complete" : locked ? "Locked" : isActive ? "Active" : "Available";
  const buttonLabel = locked ? (act.num === 4 ? "View Seal" : "Unlock Act") : `Enter Act ${act.roman}`;

  return (
    <motion.article
      data-testid={`journey-act-${act.num}`}
      className={`ckp-act-card ckp-act-${card.tone} ${locked ? "is-locked" : ""} ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
      style={{ "--act-card": card.color, "--act-card-rgb": card.colorSoft, "--scene-hue": card.sceneHue }}
      variants={cardMotion}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="ckp-card-circuit" aria-hidden="true" />
      <div className="ckp-card-topline">
        <span>{card.eyebrow}</span>
        <strong>{statusLabel}</strong>
      </div>

      <div className="ckp-card-roman" aria-hidden="true">{act.roman}</div>

      <button
        type="button"
        className="ckp-card-orbit"
        onClick={() => onEnter(act)}
        aria-label={`Launch ${card.title}`}
      >
        <span className="ckp-card-scene" aria-hidden="true" />
        <span className="ckp-card-emblem">
          <img src={act.emblem} alt="" aria-hidden="true" />
        </span>
      </button>

      <h2>
        {card.titleLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <p className="ckp-card-discipline">{card.discipline}</p>

      <p className="ckp-card-charge">{card.charge}</p>

      <button
        type="button"
        data-testid={`journey-enter-${act.num}`}
        className="ckp-launch-button"
        onClick={() => onEnter(act)}
      >
        <span className="ckp-play-mark" aria-hidden="true">
          {isComplete ? <CheckCircle size={15} weight="fill" /> : locked ? <LockKey size={15} weight="bold" /> : <Play size={14} weight="fill" />}
        </span>
        <span>{buttonLabel}</span>
      </button>

      <div className="ckp-card-verbs" aria-label={`${card.title} operating verbs`}>
        {card.verbs.map((verb) => (
          <span key={verb}>
            <i aria-hidden="true" />
            {verb}
          </span>
        ))}
      </div>
    </motion.article>
  );
};

const ActModulesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const reducedMotion = useReducedMotion();
  const [activatingAct, setActivatingAct] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const activationTimerRef = useRef(null);

  const {
    activeAct,
    completedActs,
    nextStepIndex,
  } = useJourneyProgress(user);

  useEffect(() => {
    if (searchParams.get("showUnlock") === "true") {
      setShowPaywall(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    return () => {
      if (activationTimerRef.current) window.clearTimeout(activationTimerRef.current);
    };
  }, []);

  const handleActEnter = (act) => {
    if (!canAccessAct(user, act.num)) {
      if (act.num === 4) {
        navigate("/act/4");
        return;
      }
      setShowPaywall(true);
      return;
    }

    if (act.num === 3) {
      navigate("/experiencemode/sovereign");
      return;
    }

    if (act.num === 1) {
      navigate("/act/1/entry");
      return;
    }

    const step = act.num === activeAct ? nextStepIndex : 0;
    setActivatingAct(act);
    if (activationTimerRef.current) window.clearTimeout(activationTimerRef.current);
    activationTimerRef.current = window.setTimeout(
      () => navigate(buildProtocolPath(act.num, step)),
      reducedMotion ? 70 : 760,
    );
  };

  return (
    <motion.main
      data-testid="act-gateway"
      className="ckp-launch-page"
      initial={reducedMotion ? false : "hidden"}
      animate="show"
      transition={{ staggerChildren: reducedMotion ? 0 : 0.08 }}
    >
      <div className="ckp-launch-backdrop" aria-hidden="true" />
      <motion.header className="ckp-launch-header" variants={cardMotion}>
        <h1>Chroma Key Protocol</h1>
        <p><span />Four Acts. One Reality.<span /></p>
      </motion.header>

      <motion.section className="ckp-command-frame" variants={cardMotion} aria-label="Chroma Key Protocol acts">
        <div className="ckp-frame-rail ckp-frame-rail-top" aria-hidden="true" />
        <div className="ckp-frame-rail ckp-frame-rail-bottom" aria-hidden="true" />
        <div className="ckp-frame-corner ckp-frame-corner-tl" aria-hidden="true" />
        <div className="ckp-frame-corner ckp-frame-corner-tr" aria-hidden="true" />
        <div className="ckp-frame-corner ckp-frame-corner-bl" aria-hidden="true" />
        <div className="ckp-frame-corner ckp-frame-corner-br" aria-hidden="true" />

        <div className="ckp-act-grid">
          {ACTS.map((act) => (
            <ActLaunchCard
              key={act.num}
              act={act}
              user={user}
              activeAct={activeAct}
              completedActs={completedActs}
              onEnter={handleActEnter}
            />
          ))}
        </div>
      </motion.section>

      <button type="button" className="ckp-codex-link" onClick={() => navigate("/codex")}>
        Open Codex
        <ArrowUpRight size={14} weight="bold" />
      </button>

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      <AnimatePresence>
        {activatingAct && <ActMeltTransition act={activatingAct} reducedMotion={reducedMotion} />}
      </AnimatePresence>
    </motion.main>
  );
};

export default ActModulesPage;
