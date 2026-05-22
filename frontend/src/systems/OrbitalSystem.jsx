import OrbitalNode from "./OrbitalNode";

const nodes = [
  {
    title: "SONIC ARTIFACTS",
    angle: 0
  },

  {
    title: "MEMORY VAULT",
    angle: 72
  },

  {
    title: "LORE ARCHIVE",
    angle: 144
  },

  {
    title: "TRACK NETWORK",
    angle: 216
  },

  {
    title: "PROTOCOL GUIDE",
    angle: 288
  }
];

export default function OrbitalSystem() {
  return (
    <div className="orbital-system">

      {nodes.map((node) => (
        <OrbitalNode
          key={node.title}
          {...node}
        />
      ))}

    </div>
  );
}