export default function MainframeCore({
  color = '#ff4d4d',
  title = 'RECLAMATION CORE',
  subtitle = 'ACT III MAINFRAME',
  integrity = 64,
  emblem = '/emblem/reclamation_module_emblem.gif',
}) {
  return (
    <section className="mainframe-core" style={{ '--core-color': color }} aria-label={title}>
      <div className="mainframe-core__halo mainframe-core__halo--outer" />
      <div className="mainframe-core__halo mainframe-core__halo--inner" />
      <div className="mainframe-core__scan" />

      <div className="mainframe-core__emblem-shell">
        <img className="mainframe-core__emblem" src={emblem} alt="Reclamation module emblem" />
      </div>

      <div className="mainframe-core__copy">
        <span>{subtitle}</span>
        <h2>{title}</h2>
        <p>Protocol Integrity {integrity}%</p>
      </div>
    </section>
  );
}
