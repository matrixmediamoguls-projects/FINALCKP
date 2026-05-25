import OrbitalNode from "./OrbitalNode";

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
    radius: 360,
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
    radius: 360,
    orbit: "outer",
    color: "#28ffd4",
    route: "/artifacts/3",
    status: "ARCHIVED",
    icon: "✦",
  },
  {
    id: "lyrics-context",
    title: "LYRICS CONTEXT MATRIX",
    subtitle: "Transmission Layer",
    angle: 150,
    radius: 360,
    orbit: "outer",
    color: "#c55cff",
    route: "/lyrics/3",
    status: "ACTIVE",
    icon: "◈",
  },
  {
    id: "vma",
    title: "VIRTUAL MATRIX ASSISTANT",
    subtitle: "Adaptive Intelligence",
    angle: 30,
    radius: 360,
    orbit: "outer",
    color: "#ff9b2f",
    route: "/vma",
    status: "ONLINE",
    icon: "⬡",
  },
];

export default function OrbitalSystem() {
  return (
    <section className="orbital-system" aria-label="Reclamation orbital operating system">
      <div className="orbit-ring orbit-ring-inner" />
      <div className="orbit-ring orbit-ring-outer" />
      <div className="orbit-signal-field" />

      {nodes.map((node) => (
        <OrbitalNode key={node.id} {...node} />
      ))}
    </section>
  );
}
