export default function OrbitalNode({
  title,
  angle
}) {
  const radius = 340;

  const x =
    Math.cos((angle * Math.PI) / 180)
    * radius;

  const y =
    Math.sin((angle * Math.PI) / 180)
    * radius;

  return (
    <div
      className="orbital-node"
      style={{
        transform:
          `translate(${x}px, ${y}px)`
      }}
    >
      <span>{title}</span>
    </div>
  );
}