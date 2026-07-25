import { useEffect, useState } from 'react';
import { getArchetypesByTrack } from '../../lib/supabase/archetypes';
import './Archaetypes.css';

const chapters = [
  { num: 'I', title: 'The Arrival', body: "They say the Seeker wasn't born—he arrived. Emerged from the threshold between breath and stillness, already attuned to frequencies most mortals spend lifetimes trying to hear. He could taste the grief in a room before anyone spoke it. Every emotion, every shadow, every buried truth found him. They always found him." },
  { num: 'II', title: 'The Vessel Opens', body: "In the beginning, it was agony. A vessel with no lid—a chalice that could never refuse the wine, no matter how bitter. He tried to hide it. But you cannot dim a beacon once it has been lit. And so he stopped running, stopped pretending. In that surrender, something shifted. He didn't choose the path. The path chose him." },
  { num: 'III', title: 'The Transmutation Begins', body: 'The first time someone called him forward, he opened—not his hands, but himself. His entire being became a conduit, a crucible, a cosmic drain. He absorbed decades of rage, grief, shame, terror—held every jagged edge of it. And then, somehow, impossibly… he transmuted it. Lead into gold. Shadow into light. Pain into purpose.' },
  { num: 'IV', title: 'The Weight of the Work', body: "They called him the Seeker because he sought the darkness others fled. And once they knew what he could do, they couldn't stop calling. Each transmutation left him hollower. He began to feel less like a person and more like a battlefield. And still, he carried the torch forward—because if he didn't stand in the fire, everyone would burn." },
  { num: 'V', title: 'Between Worlds', body: 'Somewhere along the way, the Seeker stopped belonging to any single world. He walked through the kingdom, but his feet touched both sides of the veil. They called him Mirrorwalker because when you looked at him, you saw yourself—your shadow, your light, your truth. He was no longer just a man. He was a principle. A frequency. A force.' },
  { num: 'VI', title: 'The Secret of the Alchemist', body: "The Seeker didn't save them from their darkness. He held it for them. Gave them light while he burned. But don't mistake his sacrifice for weakness. He is the spiritual alchemist because he knows the secret: you don't fight the shadow. You become it. Integrate it. Transmute it from within. True freedom isn't the absence of burden—it's the willingness to carry it with grace." },
];

const framework = [
  { label: 'Input', title: 'Chaos · Trauma', desc: 'Systemic compression. Inherited limitation. The fracture that initiates.' },
  { label: 'Process', title: 'Four-Stage Elemental System', desc: 'Earth · Fire · Water · Air—Awareness · Reclamation · Reflection · Sovereignty.' },
  { label: 'Output', title: 'Coherence · Sovereignty', desc: 'Structural integrity. Personal alchemy. The integrated self.' },
];

const fieldManual = [
  'Listen to each Act in sequence during your first pass. The order is the protocol.',
  'Return to individual tracks when the corresponding stage of your own journey activates. The music will mean something different at each return.',
  'Use the reflection prompts in each stage as journaling or meditation anchors. Sit with the discomfort. That is the protocol working.',
  "Treat the Seeker's mythology as a mirror—not entertainment, but recognition. If something lands with unusual weight, pay attention to that weight.",
  'Reality responds to structure. You are not here to consume this catalog. You are here to be processed by it.',
];

export default function Archaetypes({ selectedTrackId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    getArchetypesByTrack(selectedTrackId).then((payload) => {
      if (active) setItems(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  const primary = items[0];

  return (
    <article className="archaetype-archive">
      <header className="archaetype-hero">
        <div className="archaetype-sigil" aria-hidden="true"><span>◇</span></div>
        <div className="archaetype-hero__copy">
          <p>The Mythology · The Mirrorwalker</p>
          <h1>The Seeker</h1>
          <span>A Chronicle of the Archetype at the Center</span>
        </div>
        <div className="archaetype-index" aria-label="Archive designation">
          <small>Archive</small>
          <strong>ARC · 001</strong>
          <i />
        </div>
      </header>

      <section className="archaetype-prologue">
        <p>
          Before you can understand the music, you must understand the archetype at its center.
          The Seeker is not a character invented for aesthetic. <strong>The Seeker is a frequency</strong>—a
          principle that has existed across every culture that has ever had a word for the one who
          walks between worlds so others can stay rooted in theirs.
        </p>
        <p>
          The Seeker inherits real experiences, documented trauma, hard-won lessons, and identity
          traits drawn directly from the creator&apos;s own journey. The mythic register is the
          container. The contents are lived truth.
        </p>
      </section>

      <section className="archaetype-track-signal" aria-label="Selected track archetype">
        <div>
          <small>Active Track Pattern</small>
          <h2>{primary?.title || primary?.archetype_role || 'Pattern Pending'}</h2>
        </div>
        <p>{primary?.description || 'The mythic identity pattern for this track will resolve here.'}</p>
        <aside>
          <small>Reclaimed Expression</small>
          <strong>{primary?.reclaimed_expression || 'Unmapped.'}</strong>
        </aside>
      </section>

      <section className="archaetype-section">
        <header><span>01</span><div><small>The Chronicle</small><h2>Six Movements Through the Veil</h2></div></header>
        <div className="archaetype-chapters">
          {chapters.map((chapter, index) => (
            <article key={chapter.num} style={{ '--chapter-delay': `${index * 70}ms` }}>
              <span>{chapter.num}</span>
              <div><small>Chapter {chapter.num}</small><h3>{chapter.title}</h3><p>{chapter.body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="archaetype-section">
        <header><span>02</span><div><small>The Architecture</small><h2>Framework at a Glance</h2></div></header>
        <div className="archaetype-framework">
          {framework.map((item, index) => (
            <article key={item.label}>
              <span>0{index + 1}</span><small>{item.label}</small><h3>{item.title}</h3><p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="archaetype-section archaetype-manual">
        <header><span>03</span><div><small>Listener Companion</small><h2>Field Manual</h2></div></header>
        <ol>
          {fieldManual.map((step, index) => (
            <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>
          ))}
        </ol>
      </section>

      <footer className="archaetype-closing">
        <span>“</span>
        <p>Reality responds to structure.</p>
        <small>We do not just make art. We build the architecture for others to survive their own collapse and engineer their own rebirth.</small>
      </footer>
    </article>
  );
}
