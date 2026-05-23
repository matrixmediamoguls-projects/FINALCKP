import { useNavigate } from 'react-router-dom';

const acts = [
  { num: 1, roman: 'ONE', title: 'The Fractured Veil', subtitle: 'Awakening', statement: 'Reality is not as it seems.', tags: ['Disrupt', 'Discover', 'Decode'], color: '#ff3526', glow: 'rgba(255,53,38,0.42)', emblem: '/emblem/act_one_module_emblem.gif', route: '/protocol/1' },
  { num: 2, roman: 'TWO', title: 'The Reflection Chamber', subtitle: 'Confrontation', statement: 'See yourself. Break the pattern.', tags: ['Analyze', 'Reflect', 'Transcend'], color: '#24b7ff', glow: 'rgba(36,183,255,0.42)', emblem: '/emblem/act_two_module_emblem.gif', route: '/protocol/2' },
  { num: 3, roman: 'THREE', title: 'Reclamation', subtitle: 'Empowerment', statement: 'Reclaim who you are. Rewrite the system.', tags: ['Adapt', 'Flow', 'Control'], color: '#8cff36', glow: 'rgba(140,255,54,0.38)', emblem: '/emblem/act_three_module_emblem.gif', route: '/protocol/3' },
  { num: 4, roman: 'FOUR', title: 'The Crucible Code', subtitle: 'Transcendence', statement: 'Code your reality. Engineer the future.', tags: ['Create', 'Engineer', 'Evolve'], color: '#ffd21f', glow: 'rgba(255,210,31,0.42)', emblem: '/emblem/act_four_module_emblem.gif', route: '/protocol/4' },
];

function ActCard({ act }) {
  const navigate = useNavigate();
  return (
    <article onClick={() => navigate(act.route)} data-testid={`act-card-${act.num}`} style={{ position: 'relative', minHeight: 620, padding: '28px 24px 24px', cursor: 'pointer', overflow: 'hidden', border: `1px solid ${act.color}`, background: `radial-gradient(circle at 50% 45%, ${act.glow}, transparent 31%), linear-gradient(180deg, rgba(8,12,18,0.94), rgba(2,4,7,0.98))`, boxShadow: `0 0 34px ${act.glow}, inset 0 0 38px rgba(0,0,0,0.82)`, clipPath: 'polygon(5% 0,95% 0,100% 5%,100% 95%,95% 100%,5% 100%,0 95%,0 5%)' }}>
      <div style={{ position: 'absolute', inset: 10, border: `1px solid ${act.color}55`, pointerEvents: 'none', clipPath: 'polygon(5% 0,95% 0,100% 5%,100% 95%,95% 100%,5% 100%,0 95%,0 5%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.09), transparent 18%, transparent 82%, rgba(255,255,255,0.06))', pointerEvents: 'none' }} />
      <div style={{ textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.28em', color: act.color, textTransform: 'uppercase', fontSize: 14 }}>Act {act.roman}</div>
      <h2 style={{ margin: '18px 0 0', minHeight: 126, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.02, textTransform: 'uppercase', color: act.color, textShadow: `0 0 18px ${act.glow}` }}>{act.title}</h2>
      <div style={{ textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.38em', color: act.color, textTransform: 'uppercase', fontSize: 12, marginTop: 6 }}>{act.subtitle}</div>
      <div style={{ height: 215, margin: '28px auto 24px', maxWidth: 260, display: 'grid', placeItems: 'center', borderRadius: '50%', border: `2px solid ${act.color}`, boxShadow: `0 0 28px ${act.glow}, inset 0 0 40px rgba(0,0,0,0.88)`, background: `radial-gradient(circle, ${act.glow}, rgba(0,0,0,0.84) 58%)` }}>
        <img src={act.emblem} alt={`${act.title} emblem`} style={{ width: '82%', height: '82%', objectFit: 'contain', filter: `drop-shadow(0 0 18px ${act.color})` }} />
      </div>
      <p style={{ minHeight: 46, margin: '0 auto 22px', maxWidth: 270, textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f5f0e6', fontSize: 13, lineHeight: 1.45 }}>{act.statement}</p>
      <button data-testid={`act-enter-${act.num}`} onClick={(event) => { event.stopPropagation(); navigate(act.route); }} style={{ width: '100%', height: 58, border: `1px solid ${act.color}`, background: `linear-gradient(90deg, transparent, ${act.glow}, transparent)`, color: act.color, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, letterSpacing: '0.13em', textTransform: 'uppercase', boxShadow: `0 0 18px ${act.glow}` }}>▶ Launch Protocol</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 22 }}>{act.tags.map((tag) => <span key={tag} style={{ flex: 1, textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: '0.08em', color: act.color, textTransform: 'uppercase' }}>{tag}</span>)}</div>
    </article>
  );
}

export default function ActNavigation() {
  return (
    <main style={{ minHeight: '100vh', padding: '32px 42px 48px', color: '#f5f0e6', overflow: 'auto', background: 'radial-gradient(circle at 20% 10%, rgba(0,96,180,0.28), transparent 22%), radial-gradient(circle at 78% 0%, rgba(0,96,180,0.2), transparent 24%), linear-gradient(180deg, #02060b, #020204 62%, #000)' }}>
      <section style={{ maxWidth: 1840, margin: '0 auto', border: '1px solid rgba(210,230,255,0.32)', boxShadow: '0 0 42px rgba(0,130,255,0.18), inset 0 0 60px rgba(0,0,0,0.9)', background: 'linear-gradient(180deg, rgba(8,15,24,0.74), rgba(0,0,0,0.58))', padding: '34px 36px 44px', clipPath: 'polygon(2% 0,98% 0,100% 4%,100% 96%,98% 100%,2% 100%,0 96%,0 4%)' }}>
        <header style={{ textAlign: 'center', marginBottom: 34 }}>
          <h1 data-testid="home-hero-title" style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: 'clamp(38px, 5vw, 76px)', lineHeight: 1, letterSpacing: '0.08em', color: '#e9edf2', textTransform: 'uppercase', textShadow: '0 0 24px rgba(210,230,255,0.5)' }}>Chroma Key Protocol</h1>
          <div style={{ marginTop: 12, fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.54em', textTransform: 'uppercase', color: '#d7e7ff', fontSize: 'clamp(13px, 1.3vw, 22px)' }}>Four Acts. One Reality.</div>
        </header>
        <div data-testid="roadmap" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', gap: 22 }}>{acts.map((act) => <ActCard key={act.num} act={act} />)}</div>
      </section>
    </main>
  );
}
