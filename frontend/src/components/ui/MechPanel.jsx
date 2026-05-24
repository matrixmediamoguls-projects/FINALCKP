export default function MechPanel({ children, className = "" }) {
  return (
    <div className={`mech-panel ${className}`}>
      <div className="mech-panel-inner">
        {children}

        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </div>
    </div>
  );
}
