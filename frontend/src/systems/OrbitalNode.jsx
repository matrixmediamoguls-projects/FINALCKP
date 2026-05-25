export default function OrbitalNode({
  title,
  subtitle,
  angle,
  radius,
  color,
  status,
  icon,
  orbit,
  route,
  isLaunching,
  onActivate,
}) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <button
      type="button"
      className={`orbital-node orbital-node-${orbit}${isLaunching ? ' is-launching' : ''}`}
      style={{
        '--node-color': color,
        transform: `translate3d(${x}px, ${y}px, 0px)`,
      }}
      onClick={() => onActivate({ title, subtitle, color, route })}
      disabled={isLaunching}
      aria-label={`Open ${title}`}
    >
      <div className="orbital-node__halo" />

      <div className="orbital-node__core">
        <span className="orbital-node__icon">{icon}</span>
      </div>

      <div className="orbital-node__content">
        <small>{status}</small>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </button>
  );
}
