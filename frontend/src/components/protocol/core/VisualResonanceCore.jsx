import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import CoreEnergyField from "./CoreEnergyField";
import { useAudio } from "@/context/AudioProvider";

import "./visualResonanceCore.css";

const RECLAMATION_CORE_EMBLEM = "/emblem/reclamation_core_emblem.png";

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const createPulse = (setter, duration = 360) => {
  setter(1);
  window.setTimeout(() => setter(0), duration);
};

export default function VisualResonanceCore({ track = null }) {
  const audio = useAudio();
  const [bands, setBands] = useState({ bass: 0, mid: 0, hat: 0, emotionalIntensity: 0 });
  const [borderFlash, setBorderFlash] = useState(0);
  const [shockwave, setShockwave] = useState(0);
  const [particles, setParticles] = useState([]);
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const lastSnareRef = useRef(-1);
  const lastHatRef = useRef(-1);
  const lastBassDropRef = useRef(-1);
  const mediaVideoRef = useRef(null);
  const title = track?.title || track?.name || "DECRYPTION ACTIVE";
  const visualMediaUrl =
    track?.visual_media_url ||
    track?.background_video ||
    track?.visual_video ||
    track?.video_url ||
    track?.background_image_url ||
    track?.act_background_image ||
    "";
  const visualMediaType =
    track?.visual_media_type ||
    (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(visualMediaUrl) ? "video" : "image");
  const audioElement = audio?.audioElement;
  const isTrackActive =
    audio?.currentTrack?.id === track?.id ||
    audio?.currentTrack?.track_id === track?.track_id;
  const isReactive = Boolean(audio?.isPlaying && isTrackActive);

  const intensity = clamp01(
    bands.bass * 0.45 +
    bands.mid * 0.28 +
    bands.hat * 0.12 +
    bands.emotionalIntensity * 0.25
  );

  const particleNodes = useMemo(() => particles, [particles]);
  const scopeBars = useMemo(
    () => Array.from({ length: 36 }, (_, index) => ({
      id: `scope-${index}`,
      height: 18 + ((index * 23) % 76),
      delay: `${index * -0.045}s`,
    })),
    []
  );

  const flashBorder = () => createPulse(setBorderFlash, 220);

  const emitParticles = () => {
    const createdAt = Date.now();
    setParticles((current) => [
      ...current.slice(-42),
      ...Array.from({ length: 12 }, (_, index) => ({
        id: `${createdAt}-${index}`,
        angle: Math.random() * 360,
        distance: 58 + Math.random() * 74,
        size: 2 + Math.random() * 4,
      })),
    ]);
    window.setTimeout(() => {
      setParticles((current) => current.filter((particle) => particle.id.split("-")[0] !== String(createdAt)));
    }, 620);
  };

  const triggerShockwave = () => createPulse(setShockwave, 520);

  useEffect(() => {
    let frameId;

    const tick = () => {
      const time = audioElement?.currentTime || audio?.currentTime || 0;
      const duration = audio?.duration || track?.duration_seconds || 1;
      const progress = duration ? time / duration : 0;
      const energy = isReactive ? 1 : 0.18;

      const beat = time * 2.05;
      const bass = clamp01(Math.pow(Math.max(0, Math.sin(beat * Math.PI * 2)), 2.4) * energy);
      const mid = clamp01((0.35 + Math.max(0, Math.sin(time * Math.PI * 3.1)) * 0.65) * energy);
      const hat = clamp01(Math.pow(Math.max(0, Math.sin(time * Math.PI * 16)), 9) * energy);
      const emotionalIntensity = clamp01((0.32 + Math.sin(progress * Math.PI) * 0.68) * energy);

      setBands({ bass, mid, hat, emotionalIntensity });

      const snareBucket = Math.floor(time * 2);
      if (isReactive && snareBucket !== lastSnareRef.current && snareBucket % 4 === 2) {
        lastSnareRef.current = snareBucket;
        flashBorder();
      }

      const hatBucket = Math.floor(time * 8);
      if (isReactive && hatBucket !== lastHatRef.current && hat > 0.74) {
        lastHatRef.current = hatBucket;
        emitParticles();
      }

      const bassBucket = Math.floor(time * 1.025);
      if (isReactive && bassBucket !== lastBassDropRef.current && bass > 0.86) {
        lastBassDropRef.current = bassBucket;
        triggerShockwave();
      }

      frameId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [audio?.currentTime, audio?.duration, audioElement, isReactive, track?.duration_seconds]);

  useEffect(() => {
    const video = mediaVideoRef.current;
    if (!video) return;

    setMediaReady(false);
    setMediaFailed(false);
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    if (isReactive) {
      video.play().catch(() => {});
      return;
    }

    video.pause();
  }, [isReactive, visualMediaUrl]);

  useEffect(() => {
    const video = mediaVideoRef.current;
    if (!video || !visualMediaUrl || visualMediaType !== "video") return;

    video.load();
  }, [visualMediaType, visualMediaUrl]);

  return (
    <div
      className="vrc-shell"
      data-reactive={isReactive ? "true" : "false"}
      style={{
        "--vrc-bass": bands.bass,
        "--vrc-mid": bands.mid,
        "--vrc-hat": bands.hat,
        "--vrc-emotional": bands.emotionalIntensity,
        "--vrc-flash": borderFlash,
        "--vrc-shockwave": shockwave,
      }}
    >
      <div className="vrc-background-glow" />
      {visualMediaUrl && !mediaFailed && (
        <div
          className="vrc-media-frame"
          data-media-type={visualMediaType}
          data-ready={mediaReady ? "true" : "false"}
          aria-hidden="true"
        >
          {visualMediaType === "video" ? (
            <video
              key={visualMediaUrl}
              ref={mediaVideoRef}
              src={visualMediaUrl}
              autoPlay={isReactive}
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setMediaReady(true)}
              onPlaying={() => setMediaReady(true)}
              onError={() => setMediaFailed(true)}
            />
          ) : (
            <img
              src={visualMediaUrl}
              alt=""
              onLoad={() => setMediaReady(true)}
              onError={() => setMediaFailed(true)}
            />
          )}
        </div>
      )}
      {visualMediaUrl && mediaFailed && (
        <div className="vrc-media-status" aria-hidden="true">
          Media signal unavailable
        </div>
      )}
      <div className="vrc-grid-overlay" />
      <div className="vrc-reactive-sweep" />
      <div className="vrc-reactor-rings" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="vrc-scope-bars" aria-hidden="true">
        {scopeBars.map((bar) => (
          <span
            key={bar.id}
            style={{
              "--scope-height": `${bar.height}%`,
              "--scope-delay": bar.delay,
            }}
          />
        ))}
      </div>
      <div className="vrc-shockwave" />
      <div className="vrc-particle-field" aria-hidden="true">
        {particleNodes.map((particle) => (
          <span
            key={particle.id}
            style={{
              "--particle-angle": `${particle.angle}deg`,
              "--particle-distance": `${particle.distance}px`,
              "--particle-size": `${particle.size}px`,
            }}
          />
        ))}
      </div>

      <div className="vrc-frame-container">

        <div className="vrc-viewport">

          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={4 + bands.bass * 6} />
            <CoreEnergyField
              bass={bands.bass}
              mid={bands.mid}
              emotionalIntensity={bands.emotionalIntensity}
              shockwave={shockwave}
            />
          </Canvas>

          <img
            className="vrc-core-emblem"
            src={RECLAMATION_CORE_EMBLEM}
            alt="Reclamation core emblem"
          />

          <div className="vrc-scanlines" />
          <div className="vrc-vignette" />

        </div>

        <div
          className="vrc-top-left"
          style={{
            opacity: 0.6 + intensity * 0.4
          }}
        >
          <div>FREQ: 44.1 KHZ</div>
          <div>RES: 24 BIT</div>
        </div>

        <div
          className="vrc-top-right"
          style={{
            opacity: 0.6 + intensity * 0.4
          }}
        >
          <div>SIGNAL: STRONG</div>
          <div>SOURCE: CKP CORE</div>
        </div>

        <motion.div
          className="vrc-title"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [
              1,
              1 + intensity * 0.05,
              1
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          {title}
        </motion.div>

      </div>
    </div>
  );
}
