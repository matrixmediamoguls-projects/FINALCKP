import { useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, Clock3, Headphones, ListChecks } from 'lucide-react';

const MODULE_STEPS = [
  ['01', 'Receive the signal', 'Listen to each paired track and identify its teaching.'],
  ['02', 'Name the pattern', 'Choose the Shadow Code that describes the restriction.'],
  ['03', 'Retrieve the law', 'Translate that pattern into a usable Light Code.'],
  ['04', 'Write your declaration', 'Put the recovered law into your own words.'],
  ['05', 'Integrate and save', 'Receive the Integration Key and preserve your record.'],
];

const MENTALISM_INTRO = {
  title: 'Module I - Mentalism: Before the Body, The ALL-Mind',
  overview: [
    'Module I, "Mentalism: Before the Body, The ALL-Mind," is the opening architecture of Reclamation University and the first act in the Mentalism sequence. It moves the student from passive understanding of "mind" as an abstract concept into conscious reclamation of authorship over perception, interpretation, and identity. The module treats the mind not as a brain-bound organ but as a medium, a field, and a primary creative interface through which all experience is interpreted before it becomes behavior.',
    'Across six lessons and a capstone audit, students travel from invisible influence to intentional authorship. Each lesson integrates hermetic philosophy (the Principle of Mentalism), modern information environments (algorithms, AI, social media), and case studies from the Reclamation album to demonstrate how thought-forms precede worlds, how inherited code writes lives, and how language and tools extend, rather than originate, vision.',
  ],
  objectives: [
    'Articulate the Principle of Mentalism as a first cause: "The ALL is Mind; the universe is mental," and distinguish events from interpretations.',
    'Recognize hidden influences shaping perception, including conditioning, media environments, and digital systems.',
    'Identify inherited beliefs and thought-forms that operate as unconscious code in daily decisions.',
    'Understand how repeated thinking, emotional memory, and reinforcement crystallize into stable thought-forms and identity patterns.',
    'Evaluate the role of tools, technology, and language as extensions of prior vision instead of autonomous authors.',
    'Begin reclaiming authorship through reflection, protocol exercises, and a structured thirty-day plan.',
  ],
  pageQuestions: [
    'What is this?',
    'Why does it matter?',
    'Where do I already see this?',
    'How does it actually work?',
    'How does this connect to the Reclamation album?',
    'How can I apply it?',
    'What should I observe after finishing this page?',
  ],
};

function MentalismIntroBrief({ onCross }) {
  return (
    <main className="module-brief" aria-labelledby="module-brief-title">
      <div className="module-brief-glow" aria-hidden="true" />

      <header className="module-brief-header">
        <p className="rec-module-kicker">Reclamation University · Module Introduction</p>
        <h1 id="module-brief-title">{MENTALISM_INTRO.title}</h1>
      </header>

      <section className="module-brief-curriculum" aria-labelledby="module-overview-title">
        <div className="module-brief-section-heading">
          <h2 id="module-overview-title">Module Overview</h2>
        </div>
        <div className="module-transmission-copy">
          {MENTALISM_INTRO.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="module-brief-roadmap" aria-labelledby="module-objectives-title">
        <div className="module-brief-section-heading">
          <h2 id="module-objectives-title">Educational Objectives</h2>
          <p>By the end of this module, students should be able to:</p>
        </div>
        <ol>
          {MENTALISM_INTRO.objectives.map((objective, index) => (
            <li key={objective}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><p>{objective}</p></div>
              <Check size={16} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section className="module-brief-roadmap" aria-labelledby="module-questions-title">
        <div className="module-brief-section-heading">
          <h2 id="module-questions-title">Every page of the module is designed to answer at least one of the following:</h2>
        </div>
        <ol>
          {MENTALISM_INTRO.pageQuestions.map((question, index) => (
            <li key={question}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><p>{question}</p></div>
              <Check size={16} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <footer className="module-brief-footer">
        <p><strong>Progress saves automatically.</strong> Begin when you are ready.</p>
        <button type="button" className="rec-module-action" onClick={onCross}>
          Begin Module <ArrowRight size={18} />
        </button>
      </footer>
    </main>
  );
}

export default function ModuleBriefScene({ copy = [], module, onCross }) {
  const [showTransmission, setShowTransmission] = useState(false);
  const trackCount = module?.sourceTrackIds?.length || 0;

  if (module?.slug === 'mentalism') {
    return <MentalismIntroBrief onCross={onCross} />;
  }

  return (
    <main className="module-brief" aria-labelledby="module-brief-title">
      <div className="module-brief-glow" aria-hidden="true" />

      <header className="module-brief-header">
        <p className="rec-module-kicker">{module?.programLabel || 'Reclamation University'} · Module Brief</p>
        <h1 id="module-brief-title">{module?.title || 'Module Brief'}</h1>
        <p>{module?.subtitle || 'Cross the threshold where authorship returns.'}</p>
      </header>

      <div className="module-brief-meta" aria-label="Module details">
        <span><Clock3 size={17} /><strong>{module?.estimatedMinutes || 45}</strong> minutes</span>
        <span><Headphones size={17} /><strong>{trackCount}</strong> track signals</span>
        <span><ListChecks size={17} /><strong>5</strong> guided steps</span>
      </div>

      <section className="module-brief-outcome" aria-labelledby="module-outcome-title">
        <span className="module-brief-icon"><BookOpen size={23} /></span>
        <div>
          <p className="rec-module-kicker">Your outcome</p>
          <h2 id="module-outcome-title">Turn one restrictive pattern into a law you can live by.</h2>
          <p>Your work saves as you move through the sequence. You can leave and return at any point.</p>
        </div>
      </section>

      {module?.learningObjectives?.length > 0 && (
        <section className="module-brief-roadmap" aria-labelledby="module-objectives-title">
          <div className="module-brief-section-heading">
            <p className="rec-module-kicker">Performance targets</p>
            <h2 id="module-objectives-title">By the end of this module, you can</h2>
          </div>
          <ol>
            {module.learningObjectives.map((objective, index) => (
              <li key={objective}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><p>{objective}</p></div>
                <Check size={16} aria-hidden="true" />
              </li>
            ))}
          </ol>
        </section>
      )}

      {module?.curriculumSections?.length > 0 && (
        <section className="module-brief-curriculum" aria-labelledby="module-curriculum-title">
          <div className="module-brief-section-heading">
            <p className="rec-module-kicker">Core transmission</p>
            <h2 id="module-curriculum-title">{module.curriculumTitle || 'The law through the Chroma Key lens'}</h2>
          </div>
          <div className="module-curriculum-sections">
            {module.curriculumSections.map((section) => (
              <article key={section.title} className="module-curriculum-section">
                <header>
                  <h3>{section.title}</h3>
                  <p>{section.anchor}</p>
                </header>
                {[
                  ['Hook', section.hook],
                  ['Real-world 2026 scenario', section.scenario],
                  ['Chroma Key / Reclamation lens', section.chromaLens],
                  ['Historical / timeless context', section.timelessContext],
                  ['Practical translation', section.practicalTranslation],
                  ['Why this matters', section.value],
                  ['Coherence reinforcement', section.coherence],
                ].map(([label, content]) => (
                  <div key={label}>
                    <h4>{label}</h4>
                    <p>{content}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="module-brief-roadmap" aria-labelledby="module-roadmap-title">
        <div className="module-brief-section-heading">
          <p className="rec-module-kicker">The sequence</p>
          <h2 id="module-roadmap-title">What you will do</h2>
        </div>
        <ol>
          {MODULE_STEPS.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <div><strong>{title}</strong><p>{description}</p></div>
              <Check size={16} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section className={`module-transmission ${showTransmission ? 'is-open' : ''}`}>
        <button
          type="button"
          className="module-transmission-toggle"
          onClick={() => setShowTransmission((current) => !current)}
          aria-expanded={showTransmission}
        >
          <span><strong>Opening transmission</strong><small>{copy.length} short readings · optional before beginning</small></span>
          <ChevronDown size={19} />
        </button>
        {showTransmission && (
          <div className="module-transmission-copy">
            {copy.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 18)}`}>{paragraph}</p>)}
          </div>
        )}
      </section>

      <footer className="module-brief-footer">
        <p><strong>Progress saves automatically.</strong> Begin when you are ready.</p>
        <button type="button" className="rec-module-action" onClick={onCross}>
          Begin Module <ArrowRight size={18} />
        </button>
      </footer>
    </main>
  );
}
