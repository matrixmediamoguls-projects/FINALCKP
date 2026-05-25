import "../styles/orbital-system.css";
import OrbitalNode from "./OrbitalNode";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import VisualResonanceCore from "../components/protocol/core/VisualResonanceCore";

const nodes = [
  {
    id: "visual-resonance",
    title: "VISUAL RESONANCE CORE",
    subtitle: "Frequency Engine",
    angle: 270,
    radius: 245,
    orbit: "inner",
    color: "#ff4d4d",
    route: "/visualizer/3",
    status: "ACTIVE",
    icon: "◉",
  },
  {
    id: "sonic-immersion",
    title: "SONIC IMMERSION ENGINE",
    subtitle: "Guided Transmission",
    angle: 210,
    radius: 560,
    orbit: "outer",
    color: "#28b8ff",
    route: "/listen/3",
    status: "READY",
    icon: "◎",
  },
  {
    id: "sonic-artifacts",
    title: "SONIC ARTIFACTS",
    subtitle: "Recovered Signals",
    angle: 330,
    radius: 560,
    orbit: "outer",
    color: "#28ffd4",
    route: "/protocol/3?module=artifacts",
    status: "ARCHIVED",
    icon: "✦",
  },
  {
    id: "lyrics-context",
    title: "LYRICS CONTEXT MATRIX",
    subtitle: "Transmission Layer",
    angle: 150,
    radius: 560,
    orbit: "outer",
    color: "#c55cff",
    route: "/protocol/3?module=lyrics",
    status: "ACTIVE",
    icon: "◈",
  },
  {
    id: "vma",
    title: "VIRTUAL MATRIX ASSISTANT",
    subtitle: "Adaptive Intelligence",
    angle: 30,
    radius: 560,
    orbit: "outer",
    color: "#ff9b2f",
    route: "/vma",
    status: "ONLINE",
    icon: "⬡",
  },
];

export default function OrbitalSystem() {
  const navigate = useNavigate();
  const launchTimer = useRef(null);
  const [launchTarget, setLaunchTarget] = useState(null);

  useEffect(() => {
    return () => {
      if (launchTimer.current) {
        window.clearTimeout(launchTimer.current);
      }
    };
  }, []);

  const activateNode = (node) => {
    if (!node?.route || launchTarget) return;

    setLaunchTarget(node);
    launchTimer.current = window.setTimeout(() => {
      navigate(node.route);
    }, 1150);
  };

  return (
    <section
      className="orbital-system"
      aria-label="Reclamation orbital operating system"
      data-launching={launchTarget ? "true" : "false"}
    >
      <div className="orbit-ring orbit-ring-inner" />
      <div className="orbit-ring orbit-ring-outer" />
      <div className="orbit-signal-field" />

      <div className="orbital-core-viewport">
        <VisualResonanceCore />
      </div>

      {nodes.map((node) => (
        <OrbitalNode
          key={node.id}
          {...node}
          isLaunching={Boolean(launchTarget)}
          onActivate={activateNode}
        />
      ))}

      {launchTarget && (
        <div
          className="orbital-launch"
          style={{ "--launch-color": launchTarget.color }}
          aria-live="polite"
        >
          <div className="orbital-launch__aperture" />
          <div className="orbital-launch__ring orbital-launch__ring--outer" />
          <div className="orbital-launch__ring orbital-launch__ring--inner" />
          <div className="orbital-launch__beam" />
          <div className="orbital-launch__copy">
            <span>Module Transfer</span>
            <strong>{launchTarget.title}</strong>
            <em>{launchTarget.subtitle}</em>
          </div>
        </div>
      )}
    </section>
  );
}
