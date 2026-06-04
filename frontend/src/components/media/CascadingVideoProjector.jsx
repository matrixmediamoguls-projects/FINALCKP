import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  RadioTower,
  Video,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useActThreeVideos from "../../modules/ImmersiveProtocol/useActThreeVideos";
import "./CascadingVideoProjector.css";

const formatDate = (value) => {
  if (!value) return "UNSTAMPED";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "UNSTAMPED";
  return date.toLocaleDateString(undefined, { month: "short", day: "2-digit" }).toUpperCase();
};

export default function CascadingVideoProjector({
  open,
  onOpen,
  onClose,
  contextTitle = "ACT III",
}) {
  const videoRef = useRef(null);
  const projectorRef = useRef(null);
  const minimizeTimerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { videos, loading, error } = useActThreeVideos();
  const [activeIndex, setActiveIndex] = useState(0);
  const [playBlocked, setPlayBlocked] = useState(false);

  const activeVideo = videos[activeIndex] || null;
  const hasVideos = videos.length > 0;

  useEffect(() => {
    if (activeIndex >= videos.length) setActiveIndex(0);
  }, [activeIndex, videos.length]);

  useEffect(() => {
    if (!open) {
      setPlayBlocked(false);
      if (minimizeTimerRef.current) window.clearTimeout(minimizeTimerRef.current);
      videoRef.current?.pause();
    }
  }, [open]);

  const title = activeVideo?.title || (loading ? "Acquiring media" : "No video linked");
  const progressLabel = hasVideos ? `${String(activeIndex + 1).padStart(2, "0")}/${String(videos.length).padStart(2, "0")}` : "--/--";

  const spring = useMemo(
    () => reducedMotion
      ? { duration: 0.01 }
      : {
        type: "spring",
        stiffness: 120,
        damping: 24,
        mass: 0.82,
      },
    [reducedMotion]
  );

  const minimize = () => {
    if (minimizeTimerRef.current) window.clearTimeout(minimizeTimerRef.current);
    onClose?.();
  };

  const scheduleMinimize = () => {
    if (minimizeTimerRef.current) window.clearTimeout(minimizeTimerRef.current);
    minimizeTimerRef.current = window.setTimeout(minimize, reducedMotion ? 100 : 1200);
  };

  const tryPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setPlayBlocked(false);
    } catch {
      setPlayBlocked(true);
    }
  };

  const move = (direction) => {
    if (!videos.length) return;
    setActiveIndex((current) => (current + direction + videos.length) % videos.length);
    setPlayBlocked(false);
  };

  const expandFullscreen = () => {
    const target = projectorRef.current;
    if (!target?.requestFullscreen) return;
    target.requestFullscreen().catch(() => {});
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            className="cvp-dock"
            onClick={onOpen}
            title="Open Act III video projector"
            aria-label="Open Act III video projector"
            initial={reducedMotion ? false : { opacity: 0, y: -16 }}
            animate={reducedMotion ? false : { opacity: 1, y: 0 }}
            exit={reducedMotion ? false : { opacity: 0, y: -10 }}
          >
            <RadioTower size={16} />
            <span>{loading ? "SYNC" : hasVideos ? progressLabel : "OFFLINE"}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cvp-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.22 }}
          >
            <motion.section
              ref={projectorRef}
              className="cvp-projector"
              aria-label="Act III cascading video projector"
              initial={reducedMotion ? false : { y: "-112%", opacity: 0.5, scaleY: 0.78 }}
              animate={reducedMotion ? false : { y: 0, opacity: 1, scaleY: 1 }}
              exit={reducedMotion ? false : { y: "-104%", opacity: 0, scaleY: 0.72 }}
              transition={spring}
            >
              <header className="cvp-header">
                <div>
                  <span>{contextTitle}</span>
                  <strong>{title}</strong>
                </div>
                <nav aria-label="Video projector controls">
                  <button type="button" onClick={() => move(-1)} disabled={!hasVideos} title="Previous video" aria-label="Previous video">
                    <ChevronLeft size={17} />
                  </button>
                  <button type="button" onClick={tryPlay} disabled={!activeVideo} title="Play video" aria-label="Play video">
                    <Play size={17} />
                  </button>
                  <button type="button" onClick={() => move(1)} disabled={!hasVideos} title="Next video" aria-label="Next video">
                    <ChevronRight size={17} />
                  </button>
                  <button type="button" onClick={minimize} title="Minimize projector" aria-label="Minimize projector">
                    <Minimize2 size={17} />
                  </button>
                  <button type="button" onClick={minimize} title="Close projector" aria-label="Close projector">
                    <X size={17} />
                  </button>
                </nav>
              </header>

              <div className="cvp-rig" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>

              <div className="cvp-screen">
                {activeVideo ? (
                  <video
                    key={activeVideo.id}
                    ref={videoRef}
                    src={activeVideo.sourceUrl}
                    controls
                    playsInline
                    preload="metadata"
                    onCanPlay={() => setPlayBlocked(false)}
                    onEnded={scheduleMinimize}
                    onError={() => setPlayBlocked(true)}
                  />
                ) : (
                  <div className="cvp-empty">
                    <Video size={28} />
                    <span>{loading ? "Loading Supabase media feed" : error || "No Act III videos found"}</span>
                  </div>
                )}
                <div className="cvp-scan" aria-hidden="true" />
                {playBlocked && (
                  <button className="cvp-play-fallback" type="button" onClick={tryPlay}>
                    <Play size={16} />
                    Start feed
                  </button>
                )}
              </div>

              <footer className="cvp-footer">
                <span>{progressLabel}</span>
                <span>{activeVideo?.r2_bucket || "SUPABASE"} / {activeVideo?.r2_key || "WAITING"}</span>
                <span>{formatDate(activeVideo?.created_at)}</span>
                <button type="button" onClick={expandFullscreen} title="Expand projector" aria-label="Expand projector">
                  <Maximize2 size={14} />
                </button>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
