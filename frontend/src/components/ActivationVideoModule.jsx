import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./ActivationVideoModule.css";

export const ACT_INITIATION_VIDEO_SRC =
  "https://media.chromakeyprotocol.com/video/Act_Two_Initiation.mp4";

const getActRoman = (actNumber) => {
  const romans = ["I", "II", "III", "IV"];
  return romans[Math.max(0, Math.min(3, Number(actNumber || 1) - 1))] || "I";
};

export default function ActivationVideoModule({
  open = true,
  actNumber = 1,
  onComplete,
  onCancel,
}) {
  const videoRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const completionTimerRef = useRef(null);
  const completedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const [playBlocked, setPlayBlocked] = useState(false);
  const [warping, setWarping] = useState(false);

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearTimers();
    setWarping(true);
    completionTimerRef.current = window.setTimeout(
      () => onComplete?.(),
      reducedMotion ? 90 : 980,
    );
  }, [clearTimers, onComplete, reducedMotion]);

  const schedulePlaybackFallback = useCallback(
    (durationSeconds) => {
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      const duration = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : 22;
      fallbackTimerRef.current = window.setTimeout(
        complete,
        Math.max(12000, Math.min(90000, duration * 1000 + 900)),
      );
    },
    [complete],
  );

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.muted = false;
      await video.play();
      setPlayBlocked(false);
      schedulePlaybackFallback(video.duration);
    } catch {
      setPlayBlocked(true);
    }
  }, [schedulePlaybackFallback]);

  useEffect(() => {
    if (!open) {
      clearTimers();
      return undefined;
    }

    completedRef.current = false;
    setWarping(false);
    setPlayBlocked(false);

    const playTimer = window.setTimeout(tryPlay, 120);
    return () => {
      window.clearTimeout(playTimer);
      clearTimers();
    };
  }, [clearTimers, open, tryPlay]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="activation-video-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.22 }}
        >
          <motion.section
            className="activation-video-module"
            aria-label={`Act ${getActRoman(actNumber)} initiation`}
            initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
            animate={reducedMotion ? false : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.36, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="activation-video-topline">
              <span>Act {getActRoman(actNumber)}</span>
              <strong>Initiation Sequence</strong>
            </div>

            <div className="activation-video-frame">
              <video
                ref={videoRef}
                src={ACT_INITIATION_VIDEO_SRC}
                autoPlay
                playsInline
                controls
                preload="auto"
                onLoadedMetadata={(event) => {
                  if (!event.currentTarget.paused) {
                    schedulePlaybackFallback(event.currentTarget.duration);
                  }
                }}
                onPlay={(event) => {
                  setPlayBlocked(false);
                  schedulePlaybackFallback(event.currentTarget.duration);
                }}
                onEnded={complete}
                onError={() => schedulePlaybackFallback(3)}
              />
              <div className="activation-video-scan" aria-hidden="true" />
              {playBlocked && (
                <button className="activation-video-play" type="button" onClick={tryPlay}>
                  <Play size={16} weight="fill" />
                  Play Initiation
                </button>
              )}
            </div>

            <div className="activation-video-footer">
              <button className="activation-video-secondary" type="button" onClick={onCancel}>
                Return
              </button>
              <button className="activation-video-primary" type="button" onClick={complete}>
                Enter Codex
                <ArrowRight size={15} weight="bold" />
              </button>
            </div>

            {warping && <div className="activation-video-warp" aria-hidden="true" />}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
