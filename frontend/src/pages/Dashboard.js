import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./LaunchDashboard.css";

import act1Orb from "../public/emblems/act_one_emblem.gif";
import act2Orb from "../public/emblems/act_two_emblem.gif";
import act3Orb from "../public/emblems/act_three_emblem.gif";
import act4Orb from "../public/emblems/act_four_emblem.gif";

/* ── Warp Overlay ────────────────────────────────────────────── */

const WarpOverlay = ({ active, onComplete }) => {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onComplete, 1400);
    return () => clearTimeout(t);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="warp-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="warp-tunnel"
            initial={{ scale: 0.1, rotate: 0, opacity: 1 }}
            animate={{ scale: 30, rotate: 720, opacity: 0 }}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.div
            className="warp-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Footer icon dot ─────────────────────────────────────────── */

const FootIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
    <circle cx="5" cy="5" r="3.5" />
  </svg>
);

/* ── Pillar data ─────────────────────────────────────────────── */

const PILLARS = [
  {
    actNum: 1,
    actLabel: "ACT ONE",
    titleLines: ["THE", "FRACTURED", "VEIL"],
    subtitle: "AWAKENING",
    colorClass: "pillar-green",
    tagline: "REALITY IS\nNOT AS IT SEEMS.",
    footerItems: ["DISRUPT", "DISCOVER", "DECODE"],
    path: "/protocol/1",
    orbSrc: act1Orb,
  },
  {
    actNum: 2,
    actLabel: "ACT TWO",
    titleLines: ["THE", "REFLECTION", "CHAMBER"],
    subtitle: "CONFRONTATION",
    colorClass: "pillar-orange",
    tagline: "SEE YOURSELF.\nBREAK THE PATTERN.",
    footerItems: ["ANALYZE", "REFLECT", "TRANSCEND"],
    path: "/protocol/2",
    orbSrc: act2Orb,
  },
  {
    actNum: 3,
    actLabel: "ACT THREE",
    titleLines: ["RECLAMATION"],
    subtitle: "EMPOWERMENT",
    colorClass: "pillar-blue",
    tagline: "RECLAIM WHO YOU ARE.\nREWRITE THE SYSTEM.",
    footerItems: ["ADAPT", "FLOW", "CONTROL"],
    path: "/protocol/3",
    orbSrc: act3Orb,
  },
  {
    actNum: 4,
    actLabel: "ACT FOUR",
    titleLines: ["THE", "CRUCIBLE", "CODE"],
    subtitle: "TRANSCENDENCE",
    colorClass: "pillar-gold",
    tagline: "CODE YOUR REALITY.\nENGINEER THE FUTURE.",
    footerItems: ["CREATE", "ENGINEER", "EVOLVE"],
    path: "/protocol/4",
    orbSrc: act4Orb,
  },
];

/* ── Pillar component ─────────────────────────────────────────── */

const LaunchPillar = ({ pillar, onLaunch, index }) => {
  const { actLabel, titleLines, subtitle, colorClass, tagline, footerItems, orbSrc } = pillar;
  const isSingleLine = titleLines.length === 1;

  return (
    <motion.div
      className={`launch-pillar ${colorClass}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: "easeOut" }}
    >
      {/* Act number */}
      <div className="launch-act-label">{actLabel}</div>

      {/* Title */}
      <div className={`launch-title ${isSingleLine ? "launch-title-xl" : "launch-title-lg"}`}>
        {titleLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {/* Subtitle */}
      <div className="launch-subtitle">— {subtitle} —</div>

      {/* Divider */}
      <div className="launch-divider" />

      {/* Orb */}
      <div className="launch-orb-wrap">
        <div className="launch-orb-ring" />
        <div className="launch-orb-inner">
          <img src={orbSrc} alt="" aria-hidden="true" />
        </div>
      </div>

      {/* Tagline */}
      <p className="launch-tagline">
        {tagline.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < tagline.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>

      {/* Spacer pushes button to bottom */}
      <div className="launch-pillar-spacer" />

      {/* Launch button */}
      <button
        type="button"
        className="launch-button"
        onClick={() => onLaunch(pillar.actNum)}
        aria-label={`Launch ${titleLines.join(" ")} protocol`}
      >
        <span className="launch-play-wrap">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="#f3bd42">
            <polygon points="0,0 10,6 0,12" />
          </svg>
        </span>
        LAUNCH PROTOCOL
      </button>

      {/* Footer icons */}
      <div className="launch-foot-row">
        {footerItems.map((label) => (
          <div key={label} className="launch-foot-item">
            <div className="launch-foot-dot">
              <FootIcon />
            </div>
            <span className="launch-foot-label">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ── Dashboard (main export) ─────────────────────────────────── */

const Dashboard = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [warping, setWarping] = useState(false);
  const [warpDest, setWarpDest] = useState(null);

  const pollPaymentStatus = useCallback(
    async (sessionId, attempts = 0) => {
      if (attempts >= 5) return;
      try {
        const res = await axios.get(`/payments/status/${sessionId}`);
        if (res.data.payment_status === "paid") await checkAuth();
        else if (res.data.status !== "expired")
          setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
      } catch {
        /* Payment polling is best-effort */
      }
    },
    [checkAuth],
  );

  useEffect(() => {
    const sid = searchParams.get("session_id");
    if (sid) {
      pollPaymentStatus(sid);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, pollPaymentStatus, setSearchParams]);

  const handleLaunch = useCallback((actNum) => {
    setWarpDest(actNum);
    setWarping(true);
  }, []);

  const handleWarpComplete = useCallback(() => {
    navigate(`/launch-sequence/${warpDest}`);
  }, [navigate, warpDest]);

  return (
    <>
      <WarpOverlay active={warping} onComplete={handleWarpComplete} />
      <div className="launch-screen">
        <div className="launch-grid">
          {PILLARS.map((pillar, i) => (
            <LaunchPillar
              key={pillar.actNum}
              pillar={pillar}
              index={i}
              onLaunch={(actNum) => handleLaunch(actNum)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
