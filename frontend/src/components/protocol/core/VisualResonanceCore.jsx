import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import CoreEnergyField from "./CoreEnergyField";
import { useAudio } from "@/context/audioprovider";
import useAudioAnalyzer from "@/hooks/useAudioAnalyzer";

import "./visualResonanceCore.css";

const RECLAMATION_CORE_EMBLEM = "/emblem/reclamation_core_emblem.png";

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const createPulse = (setter, duration = 360) => {
  setter(1);
  window.setTimeout(() => setter(0), duration);
};

export default function VisualResonanceCore({ track = null }) {
  const audio = useAudio();
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
  const fallbackImageUrl =
    track?.visual_media_fallback_image ||
    track?.background_image_url ||
    track?.act_background_image ||
    "";
  const audioElement = audio?.audioElement;
  const isTrackActive =
    audio?.currentTrack?.id === track?.id ||
    audio?.currentTrack?.track_id === track?.track_id;
  const isReactive = Boolean(audio?.isPlaying && isTrackActive);
  const analysis = useAudioAnalyzer(audioElement, isReactive);
  const time = audioElement?.currentTime || audio?.currentTime || 0;
  const duration = audio?.duration || track?.duration_seconds || 1;
  const progress = duration ? time / duration : 0;
  const bands = {
    bass: analysis.bass,
    mid: analysis.mid,
    hat: analysis.treble,
    emotionalIntensity: clamp01(analysis.intensity * 0.68 + Math.sin(progress * Math.PI) * 0.32),
  };

  const intensity = clamp01(
    bands.bass * 0.45 +
    bands.mid * 0.28 +
    bands.hat * 0.12 +
    bands.emotionalIntensity * 0.25
  );

  const particleNodes = useMemo(() => particles, [particles]);
  const scopeBars = useMemo(
    () => Array.from({ length: 36 }, (_, index) => {
      const frequencyIndex = Math.min(
        analysis.frequencies.length - 1,
        Math.floor((index / 36) * analysis.frequencies.length)
      );
      const frequencyValue =
        frequencyIndex >= 0 ? analysis.frequencies[frequencyIndex] : 0;

      return {
        id: `scope-${index}`,
        height: 14 + (frequencyValue / 255) * 82,
        delay: `${index * -0.045}s`,
      };
    }),
    [analysis.frequencies]
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
    if (!isReactive) return;

    const snareBucket = Math.floor(time * 2);
    if (snareBucket !== lastSnareRef.current && snareBucket % 4 === 2) {
      lastSnareRef.current = snareBucket;
      flashBorder();
    }

    const hatBucket = Math.floor(time * 8);
    if (hatBucket !== lastHatRef.current && bands.hat > 0.62) {
      lastHatRef.current = hatBucket;
      emitParticles();
    }

    const bassBucket = Math.floor(time * 1.025);
    if (bassBucket !== lastBassDropRef.current && bands.bass > 0.72) {
      lastBassDropRef.current = bassBucket;
      triggerShockwave();
    }
  }, [bands.bass, bands.hat, isReactive, time]);

  useEffect(() => {
    const video = mediaVideoRef.current;
    if (!video || visualMediaType !== "video") return;

    setMediaReady(false);
    setMediaFailed(false);
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    // Keep background media alive even when audio is idle.
    video.play().catch(() => {});
  }, [visualMediaType, visualMediaUrl]);

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
      {visualMediaUrl && (!mediaFailed || (mediaFailed && fallbackImageUrl)) && (
        <div
          className="vrc-media-frame"
          data-media-type={visualMediaType}
          data-ready={mediaReady ? "true" : "false"}
          aria-hidden="true"
        >
          {visualMediaType === "video" && !mediaFailed ? (
            <video
              key={visualMediaUrl}
              ref={mediaVideoRef}
              src={visualMediaUrl}
              autoPlay
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
              src={mediaFailed && fallbackImageUrl ? fallbackImageUrl : visualMediaUrl}
              alt=""
              onLoad={() => setMediaReady(true)}
              onError={() => setMediaFailed(true)}
            />
          )}
        </div>
      )}
      {visualMediaUrl && mediaFailed && (
        <div className="vrc-media-status" aria-hidden="true">
          MEDIA LOAD FAILED: {visualMediaUrl}
        </div>
      )}
      {!visualMediaUrl && (
        <div className="vrc-media-status" aria-hidden="true">
          MEDIA URL MISSING ON TRACK
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
