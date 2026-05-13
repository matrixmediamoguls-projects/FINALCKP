import { useNavigate } from 'react-router-dom';

const chapters = [
  { num: 'I', title: 'The Arrival', body: "They say the Seeker wasn't born — he arrived. Emerged from the threshold between breath and stillness, already attuned to frequencies most mortals spend lifetimes trying to hear. He could taste the grief in a room before anyone spoke it. Every emotion, every shadow, every buried truth found him. They always found him." },
  { num: 'II', title: 'The Vessel Opens', body: "In the beginning, it was agony. A vessel with no lid — a chalice that could never refuse the wine, no matter how bitter. He tried to hide it. But you cannot dim a beacon once it has been lit. And so he stopped running, stopped pretending. In that surrender, something shifted. He didn't choose the path. The path chose him." },
  { num: 'III', title: 'The Transmutation Begins', body: "The first time someone called him forward, he opened — not his hands, but himself. His entire being became a conduit, a crucible, a cosmic drain. He absorbed decades of rage, grief, shame, terror — held every jagged edge of it. And then, somehow, impossibly... he transmuted it. Lead into gold. Shadow into light. Pain into purpose." },
  { num: 'IV', title: 'The Weight of the Work', body: "They called him the Seeker because he sought the darkness others fled. And once they knew what he could do, they couldn't stop calling. Each transmutation left him hollower. He began to feel less like a person and more like a battlefield. And still, he carried the torch forward — because if he didn't stand in the fire, everyone would burn." },
  { num: 'V', title: 'Between Worlds', body: "Somewhere along the way, the Seeker stopped belonging to any single world. He walked through the kingdom, but his feet touched both sides of the veil. They called him Mirrorwalker because when you looked at him, you saw yourself — your shadow, your light, your truth. He was no longer just a man. He was a principle. A frequency. A force." },
  { num: 'VI', title: 'The Secret of the Alchemist', body: "The Seeker didn't save them from their darkness. He held it for them. Gave them light while he burned. But don't mistake his sacrifice for weakness. He is the spiritual alchemist because he knows the secret: you don't fight the shadow. You become it. Integrate it. Transmute it from within. True freedom isn't the absence of burden — it's the willingness to carry it with grace." },
];

const framework = [
  { label: 'Input', title: 'Chaos · Trauma', desc: 'Systemic compression. Inherited limitation. The fracture that initiates.' },
  { label: 'Process', title: 'The Four-Stage Balanced Elementals System', desc: 'Earth · Fire · Water · Air — Awareness · Reclamation · Reflection · Sovereignty' },
  { label: 'Output', title: 'Coherence · Sovereignty', desc: 'Structural integrity. Personal alchemy. The integrated self.' },
];

const howTo = [
  'Listen to each Act in sequence during your first pass. The order is the protocol.',
  'Return to individual tracks when the corresponding stage of your own journey activates. The music will mean something different at each return.',
  'Use the reflection prompts in each stage as journaling or meditation anchors. Sit with the discomfort. That is the protocol working.',
  "Treat the Seeker's mythology as a mirror — not entertainment, but recognition. If something lands with unusual weight, pay attention to that weight.",
  'Reality responds to structure. You are not here to consume this catalog. You are here to be processed by it.',
];

const SeekerPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto', maxWidth: 900, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '24px 0 40px' }}>
        <div style={{ fontSize: 48, color: 'var(--act)', opacity: 0.5, marginBottom: 12, animation: 'pulse 3s ease-in-out infinite' }}>
          &#x25C8;
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
          The Mythology · The Mirrorwalker
        </div>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--white)', margin: '0 0 12px', lineHeight: 1.2 }}>
          The Seeker
        </h1>
        <p style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 16, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 500, margin: '0 auto' }}>
          A Chronicle of the Mirrorwalker
        </p>
      </div>

      {/* Introduction */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: '3px solid var(--act)', padding: '20px 24px', marginBottom: 32 }}>
        <p style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 15, color: 'var(--white)', lineHeight: 1.75, margin: '0 0 12px' }}>
          Before you can understand the music, you must understand the archetype at its center. The Seeker is not a character invented for aesthetic. <span style={{ color: 'var(--act)' }}>The Seeker is a frequency</span> — a principle that has existed across every culture that has ever had a word for the one who walks between worlds so others can stay rooted in theirs.
        </p>
        <p style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 15, color: 'rgba(232,228,216,0.6)', lineHeight: 1.75, margin: 0 }}>
          The Seeker inherits real experiences, documented trauma, hard-won lessons, and identity traits drawn directly from the creator's own journey. The mythic register is the container. The contents are lived truth.
        </p>
      </div>

      {/* Chapters */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
          The Chronicle · Six Chapters
        </div>
        {chapters.map((ch, i) => (
          <div key={ch.num} style={{
            background: 'var(--panel)', border: '1px solid var(--border)',
            padding: '20px 24px', marginBottom: 3,
            animation: `fadeUp 0.4s ease ${i * 0.08}s both`
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', color: 'var(--act)' }}>
                Chapter {ch.num}
              </span>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 600, color: 'var(--white)', letterSpacing: '0.06em' }}>
                {ch.title}
              </span>
            </div>
            <p style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 14, color: 'rgba(232,228,216,0.65)', lineHeight: 1.75, margin: 0 }}>
              {ch.body}
            </p>
          </div>
        ))}
      </div>

      {/* Framework */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
          The Framework At A Glance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
          {framework.map((f, i) => (
            <div key={i} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '16px 14px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.3em', color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                {f.label}
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 600, color: 'var(--act)', marginBottom: 6 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(232,228,216,0.5)', lineHeight: 1.55 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Navigate */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
          Listener Companion · Field Manual
        </div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: 'var(--white)', marginBottom: 16, letterSpacing: '0.06em' }}>
          How To Navigate The Protocol
        </div>
        {howTo.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 10, background: 'var(--panel)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'var(--act)', width: 20, flexShrink: 0, textAlign: 'center' }}>
              {i + 1}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(232,228,216,0.7)', lineHeight: 1.6 }}>{step}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '24px 0 40px' }}>
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 15, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.65 }}>
          "Reality responds to structure."<br />
          We do not just make art. We build the architecture for others to survive their own collapse and engineer their own rebirth.
        </div>
        <button onClick={() => navigate('/dashboard')} style={{
          fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase',
          padding: '14px 40px', border: '1px solid var(--act)', background: 'transparent', color: 'var(--act)', cursor: 'pointer'
        }}>
          Enter The Protocol
        </button>
      </div>
    </div>
  );
};

export default SeekerPage;
