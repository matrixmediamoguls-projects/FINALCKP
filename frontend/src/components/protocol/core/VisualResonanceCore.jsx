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
  const lastSnareRef = useRef(-1);
  const lastHatRef = useRef(-1);
  const lastBassDropRef = useRef(-1);
  const title = track?.title || track?.name || "DECRYPTION ACTIVE";
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

  const flashBorder = () => createPulse(setBorderFlash, 220);

  const emitParticles = () => {
    const createdAt = Date.now();
    setParticles((current) => [
      ...current.slice(-26),
      ...Array.from({ length: 6 }, (_, index) => ({
        id: `${createdAt}-${index}`,
        angle: Math.random() * 360,
        distance: 42 + Math.random() * 42,
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
      <div className="vrc-grid-overlay" />
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

        <svg
          className="vrc-frame"
          viewBox="0 0 1920 1200"
          preserveAspectRatio="none"
          style={{
            filter: `drop-shadow(
              0 0 ${10 + intensity * 40}px rgba(255,0,60,1)
            )`
          }}
        >

          <path
            d="
            M 700 20
            L 1220 20
            L 1240 60
            L 1480 60
            L 1650 60
            L 1700 120
            L 1850 120
            L 1900 180
            L 1900 450
            L 1870 480
            L 1870 720
            L 1900 750
            L 1900 1020
            L 1850 1080
            L 1700 1080
            L 1650 1140
            L 1480 1140
            L 1240 1140
            L 1220 1180
            L 700 1180
            L 680 1140
            L 440 1140
            L 270 1140
            L 220 1080
            L 70 1080
            L 20 1020
            L 20 750
            L 50 720
            L 50 480
            L 20 450
            L 20 180
            L 70 120
            L 220 120
            L 270 60
            L 440 60
            L 680 60
            Z
          "
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
          />

          <path
            d="
            M 700 45
            L 1220 45
            L 1240 85
            L 1480 85
            L 1630 85
            L 1680 145
            L 1825 145
            L 1875 205
            L 1875 450
            L 1845 480
            L 1845 720
            L 1875 750
            L 1875 995
            L 1825 1055
            L 1680 1055
            L 1630 1115
            L 1480 1115
            L 1240 1115
            L 1220 1155
            L 700 1155
            L 680 1115
            L 440 1115
            L 290 1115
            L 240 1055
            L 95 1055
            L 45 995
            L 45 750
            L 75 720
            L 75 480
            L 45 450
            L 45 205
            L 95 145
            L 240 145
            L 290 85
            L 440 85
            L 680 85
            Z
          "
            fill="none"
            stroke="#ff003c"
            strokeWidth="6"
            className="vrc-red-frame"
          />

        </svg>

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
