import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useRef } from "react";

import CoreEnergyField from "./CoreEnergyField";
import useAudioAnalyzer from "@/hooks/useAudioAnalyzer";

import "./visualResonanceCore.css";

const RECLAMATION_CORE_EMBLEM = "/emblem/reclamation_core_emblem.png";

export default function VisualResonanceCore() {

  const audioRef = useRef(null);

  const intensity = useAudioAnalyzer(audioRef);

  return (
    <div className="vrc-shell">

      <audio
        ref={audioRef}
        src="/audio/reclamation.mp3"
        autoPlay
        controls
        style={{ display: "none" }}
      />

      <div className="vrc-background-glow" />
      <div className="vrc-grid-overlay" />

      <div className="vrc-frame-container">

        <div className="vrc-viewport">

          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={4} />
            <CoreEnergyField />
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
          DECRYPTION ACTIVE
        </motion.div>

      </div>
    </div>
  );
}
