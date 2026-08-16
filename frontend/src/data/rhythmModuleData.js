/* Reclamation University — Hermetic Hall — Module V: Rhythm
 *
 * Learner-facing copy transcribed from the Module V master document
 * ("Reclamation University — Hermetic Hall — Module V — Rhythm — Master Copy +
 * Interaction / UI / Production Annotations"). Only the master's LEARNER-FACING
 * COPY is represented here. Everything the master labels ANNOTATION is
 * production direction and is deliberately absent — it must never render.
 *
 * Structured exactly like polarityModuleData.js: one export per id in
 * curriculumSections.js. Those section ids are the contract; do not rename them
 * here without updating that file too.
 *
 * Module V inherits Module IV's architecture but advances the learner from
 * movement within a continuum to movement through time — so the module adds a
 * phase model, a loop, and an intervention point that Polarity has no analogue
 * for. The intervention point is the artifact's principal differentiator.
 */

export const RHYTHM_META = {
  numeral: "V",
  title: "RHYTHM",
  subtitle: "Nothing Stays At Peak. Everything Moves.",
  law: "The Fifth Hermetic Law",
  estimatedTime: "30–45 min",
  accent: "Amber",
  primaryArtifact: "Rhythm Map — My Personal Cycle",
  secondaryPractice: "Rhythm Audit",
  coreMethod: "Recognize → Map → Predict → Intervene → Recalibrate",
};

export const PRINCIPLES = [
  { n: "I", name: "MENTALISM", k: "mentalism", state: "COMPLETE" },
  { n: "II", name: "CORRESPONDENCE", k: "correspondence", state: "COMPLETE" },
  { n: "III", name: "VIBRATION", k: "vibration", state: "COMPLETE" },
  { n: "IV", name: "POLARITY", k: "polarity", state: "COMPLETE" },
  { n: "V", name: "RHYTHM", k: "rhythm", state: "IN PROGRESS" },
  { n: "VI", name: "CAUSE & EFFECT", k: "cause", state: "LOCKED" },
  { n: "VII", name: "GENDER", k: "gender", state: "LOCKED" },
];

/* The four phases. Used by the Intro cycle, the Principle phase model, the
   Protocol timeline, and the Artifact ring — one definition, four readings. */
export const PHASES = [
  {
    id: "expansion",
    label: "EXPANSION",
    mark: "Things started moving.",
    supports: "Exploration can be useful during expansion.",
    risk: "Do you keep expanding without checking capacity?",
    response: "I will define capacity boundaries before accepting new commitments.",
  },
  {
    id: "peak",
    label: "PEAK",
    mark: "Intensity and output reached a high point.",
    supports: "Execution can be valuable during peak.",
    risk: "Do you expect yourself to remain at peak?",
    response: "I will schedule recovery before I feel depleted.",
  },
  {
    id: "contraction",
    label: "CONTRACTION",
    mark: "Pressure, limitation, or friction increased.",
    supports: "Pruning can be appropriate during contraction.",
    risk: "Do you treat contraction as failure?",
    response: "I will simplify before I add more.",
  },
  {
    id: "restoration",
    label: "RESTORATION",
    mark: "Capacity, clarity, or stability returned.",
    supports: "Repair and preparation can matter during restoration.",
    risk: "Do you postpone restoration until you collapse?",
    response:
      "I will restore capacity without requiring productivity as proof that rest was justified.",
  },
];

/* ------------------------------------------------------------- 01 · INTRO -- */

export const INTRO_CONTENT = {
  question:
    "Where in your life do you keep demanding a straight line from something that has always moved in seasons?",
  blocks: [
    {
      kind: "lines",
      value: [
        "Maybe you know the pattern already.",
        "You discover a new idea.",
        "You feel a surge of motivation.",
        "You reorganize your schedule, your habits, your vision.",
        "For a few days, maybe a few weeks, everything feels aligned.",
      ],
    },
    {
      kind: "lines",
      value: [
        "Then something changes.",
        "Energy drops.",
        "Attention scatters.",
        "The same distraction returns.",
        "The same argument happens again.",
        "The same delay appears.",
        "The same doubt arrives wearing a different name.",
      ],
    },
    {
      kind: "p",
      value:
        "And eventually you ask: Why does this keep happening? Sometimes the answer is not that you failed. Sometimes you have entered another phase of the pattern.",
    },
    {
      kind: "lines",
      value: [
        "Growth does not move in a clean upward line.",
        "Effort rises and falls.",
        "Attention expands and contracts.",
        "Relationships move closer, recalibrate, and sometimes create distance.",
        "Creative work surges, strains, quiets, and returns.",
        "Recovery itself can have phases.",
        "Nothing living stays at peak.",
      ],
    },
    {
      kind: "p",
      value:
        "The problem is not that the cycle changes. The problem is that we often judge every change as if it were a verdict. A productive week becomes proof that we should always be productive. A difficult week becomes proof that everything is falling apart. A burst of confidence becomes a standard we expect ourselves to maintain indefinitely.",
    },
  ],
  reframe: {
    from: "Why can’t I stay here?",
    to: "What phase am I in, and what does this phase support?",
    then: "What usually happens next?",
  },
  afterReframe: {
    kind: "lines",
    value: [
      "That is where Rhythm becomes useful.",
      "You stop treating every moment as isolated.",
      "You start studying the sequence.",
    ],
  },
  hardRule: [
    "A recurring pattern can be natural.",
    "A recurring pattern can be conditioned.",
    "A recurring pattern can be externally imposed.",
    "A recurring pattern can be reinforced by habit.",
    "And a recurring pattern can sometimes be changed.",
    "You do not have to control every cycle. You do have to become capable of recognizing the ones that are shaping your life.",
  ],
};

/* --------------------------------------------------------- 02 · PRINCIPLE -- */

export const PRINCIPLE_CONTENT = {
  title: "The Law of Rhythm",
  quote:
    "Everything flows, out and in; everything has its tides; all things rise and fall; the pendulum-swing manifests in everything; the measure of the swing to the right is the measure of the swing to the left; rhythm compensates.",
  blocks: [
    {
      kind: "lines",
      value: [
        "The fifth Hermetic Principle presents reality through movement, alternation, return, and change.",
        "There are surges and slowdowns.",
        "Beginnings and endings.",
        "Peaks and valleys.",
        "Periods of visibility and periods of quiet.",
      ],
    },
    {
      kind: "p",
      value:
        "But the useful question is not whether everything in existence follows one universal cycle. The useful question is: “Where does recurring movement exist here, and what can I learn from its timing?”",
    },
    {
      kind: "p",
      value:
        "Rhythm is not a command to interpret every change as a mystical tide. It is an invitation to notice recurrence, timing, transition, and consequence.",
    },
  ],
  translationTitle: "THE PRACTICAL TRANSLATION",
  translationLede:
    "A single moment can tell you how you feel. A pattern can tell you how something tends to move. That difference matters.",
  contrasts: [
    "You can have a difficult day inside a healthy long-term trajectory.",
    "You can have an exciting week inside a destructive cycle.",
    "You can be exhausted without being permanently depleted.",
    "You can feel energized without being sustainably resourced.",
  ],
  translation: {
    from: "How am I doing today?",
    to: "What phase am I in, what usually follows it, and what does this phase actually support?",
    then: "Where can I influence what happens next?",
  },
  phaseNote:
    "Phases can shorten, lengthen, repeat, or be interrupted. This is a reasoning model, not a mechanical law of every life event.",
  sources: {
    label: "Sources / Context",
    body: [
      "Hermetic Rhythm is a philosophical framework, drawn from The Kybalion (1908) and the wider Hermetic tradition.",
      "Scientific rhythms and cycles are measurable phenomena in physics, biology, ecology, economics, and other disciplines. Those models can help us think about recurring patterns. They do not scientifically prove the Hermetic principle.",
      "That boundary is part of the practice.",
    ],
  },
};

/* ------------------------------------------------------ 03 · KEY CONCEPTS -- */

export const KEY_CONCEPTS = [
  {
    n: "01",
    title: "RHYTHM REVEALS WHAT IS SUSTAINABLE",
    teaser:
      "The easiest way to exhaust yourself is to demand peak performance during every phase of a cycle.",
    body: [
      "The burst of productivity after a breakthrough is not proof that you can live there permanently. It is evidence of what is possible under those conditions.",
      "The real question is what can be repeated without destroying the system that produces it.",
    ],
    practice: "“What part of this is sustainable, and what part belongs to a peak?”",
    lab: {
      kind: "output",
      prompt:
        "Estimate where your sustained capacity sits relative to your peak. This is illustrative, not scored.",
      leftLabel: "SUSTAINABLE OUTPUT",
      rightLabel: "CURRENT OUTPUT",
      reveal: "Your peak is not automatically your baseline.",
    },
  },
  {
    n: "02",
    title: "PATTERN OVER MOMENT",
    teaser:
      "A single good or bad day tells you very little about a recurring pattern.",
    body: [
      "Three difficult days may be a difficult week. They may also be the visible part of a much longer cycle.",
      "Likewise, a sudden surge of energy does not automatically mean a permanent improvement. Pattern becomes visible through repetition.",
    ],
    practice: "“What has this part of my life tended to do over months, not hours?”",
  },
  {
    n: "03",
    title: "CONTRACTION IS INFORMATION, NOT AUTOMATICALLY FAILURE",
    teaser:
      "When energy drops, creativity becomes harder, or relationships enter tension, the first interpretation is often: “I ruined it.”",
    body: [
      "Sometimes something is wrong. Sometimes a system is overloaded. Sometimes a phase is changing.",
      "Contraction is not proof of health, but it is information. It can reveal what cannot continue unchanged.",
    ],
    practice:
      "“What is tightening right now, and what is this phase showing me that the peak concealed?”",
  },
  {
    n: "04",
    title: "TIMING CHANGES WHAT WORKS",
    teaser:
      "The same behavior can have very different effects at different points in a cycle.",
    body: [
      "Exploration can be useful during expansion. Execution can be valuable during peak. Pruning can be appropriate during contraction. Repair and preparation can matter during restoration.",
      "These are tendencies, not rigid rules.",
    ],
    practice: "“What kind of move fits the phase I am actually in?”",
  },
];

/* --------------------------------------------------- 04 · WHY IT MATTERS -- */

export const WHY_IT_MATTERS = {
  intro:
    "Most people evaluate their lives by demanding constant upward movement. “I should always be improving.” “I should always feel clear.” “I should never dip.” But a straight line is the wrong tool for understanding a system that moves through phases.",
  distinctionsLede: "You need to distinguish four things.",
  distinctions: [
    { t: "STATE", d: "How you feel or perform right now." },
    { t: "PHASE", d: "The part of the recurring rhythm you appear to be inside." },
    { t: "TRAJECTORY", d: "Where repeated cycles are taking you over time." },
    {
      t: "INTERVENTION",
      d: "The point where a different response could change what happens next.",
    },
  ],
  distinctionsClose: [
    "You can be in a difficult contraction while your long-term trajectory is improving.",
    "You can be in an exciting expansion while your long-term trajectory is heading toward burnout.",
    "And you can recognize a destructive loop without knowing exactly how to change it yet. That is still progress.",
    "Recognition gives you an intervention point.",
  ],
  panels: [
    {
      t: "IT EXPOSES HIDDEN EXHAUSTION",
      b: [
        "When you treat every phase like a peak, your body and mind eventually resist the demand. Recovery disappears. Capacity falls. You begin calling collapse “mysterious” when the warning signs were visible much earlier.",
        "Rhythm helps you identify where energy is repeatedly spent without being restored.",
      ],
    },
    {
      t: "IT REDEEMS DOWN CYCLES WITHOUT ROMANTICIZING THEM",
      b: [
        "A low period is not automatically failure. It is also not automatically healing. Sometimes it is restoration. Sometimes it is overload. Sometimes it is grief. Sometimes it is a consequence that needs correction.",
        "The point is not to label every contraction positively. The point is to study it accurately.",
      ],
    },
    {
      t: "IT CLARIFIES REAL PROGRESS",
      b: [
        "Activity is not automatically growth. You can stay busy while repeating the same unresolved pattern. You can appear quiet while building something more stable underneath the surface.",
        "Rhythm asks: “Is this cycle teaching me, restoring me, or merely repeating the same damage?”",
      ],
    },
    {
      t: "IT GIVES YOU LEVERAGE OVER TIMING",
      b: [
        "You cannot control when every phase arrives. You can often influence what you do when it arrives. And the earliest intervention is often the most powerful.",
        "If your pattern is overcommitment → peak → exhaustion → avoidance → recovery → overcommitment, the intervention may not belong at exhaustion. It may belong at overcommitment.",
        "That is Rhythm translated into agency.",
      ],
    },
  ],
  process: [
    { k: "STATE", v: "How you feel or perform right now." },
    { k: "PHASE", v: "The part of the recurring rhythm you appear to be inside." },
    { k: "TRAJECTORY", v: "Where repeated cycles are taking you over time." },
    { k: "LOOP", v: "A sequence that keeps repeating and reinforcing itself." },
    { k: "INTERVENTION", v: "Where a different response could change what happens next." },
    { k: "OUTCOME", v: "What the next cycle produces once you respond differently." },
  ],
};

/* ----------------------------------------------------------- 05 · DOMAINS -- */

export const DOMAINS = [
  {
    n: "01",
    name: "BIOLOGY",
    obs: "Bodies move through recurring patterns of waking and sleep, exertion and recovery, hunger and satiation, stress and repair.",
    pat: "Systems that repeatedly spend more capacity than they restore eventually become less capable of sustaining the same output.",
    why: "If you treat your body as a machine that should produce on demand, you can interpret ordinary limits as personal failure.",
    prac: "For one week, notice one recurring relationship between exertion and recovery. Do not diagnose yourself. Observe.",
    timeline: ["EXERTION", "STRAIN", "REPAIR", "CAPACITY"],
  },
  {
    n: "02",
    name: "PSYCHOLOGY",
    obs: "Emotional states can change in intensity, duration, and influence.",
    pat: "Repeated states can become familiar enough that they begin to feel like permanent identity.",
    why: "A recurring emotional pattern is worth studying before it becomes a conclusion about who you are.",
    prac: "Track one recurring emotional pattern for several weeks: trigger → state → behavior → consequence → return point. (This is pattern recognition, not self-diagnosis.)",
    timeline: ["TRIGGER", "STATE", "BEHAVIOR", "RETURN"],
  },
  {
    n: "03",
    name: "TECHNOLOGY",
    obs: "Platforms, products, and digital systems move through adoption, hype, saturation, decline, adaptation, and sometimes renewal.",
    pat: "Attention often peaks before evidence of lasting utility has accumulated.",
    why: "A peak in attention is not the same thing as durable value.",
    prac: "Before reorganizing your life around a new technology, ask: “Is this an experiment, a hype peak, a contraction, or a stabilized utility?” Then ask: “What evidence would make me change my mind?”",
    timeline: ["ADOPTION", "HYPE", "DECLINE", "UTILITY"],
  },
  {
    n: "04",
    name: "ORGANIZATIONS",
    obs: "Teams move through phases of expansion, pressure, restructuring, consolidation, and renewal.",
    pat: "Organizations that treat every phase as expansion eventually create hidden debt in attention, trust, and capacity.",
    why: "When a system refuses to acknowledge contraction, people often absorb the cost personally.",
    prac: "Ask: “What phase is this organization actually in, and what is the smallest load I can responsibly simplify without abandoning my role?”",
    timeline: ["EXPANSION", "PRESSURE", "RESTRUCTURE", "RENEWAL"],
  },
  {
    n: "05",
    name: "ECONOMICS",
    obs: "Markets and collective attention can move through periods of excitement, speculation, correction, consolidation, and renewed interest.",
    pat: "Emotional intensity can temporarily move faster than underlying conditions.",
    why: "A current emotional phase is not the same thing as a complete assessment of value or risk.",
    prac: "When collective confidence or fear becomes extreme, ask: “What evidence would still matter after the emotion changes?”",
    timeline: ["EXCITEMENT", "SPECULATION", "CORRECTION", "CONSOLIDATION"],
  },
  {
    n: "06",
    name: "MUSIC",
    obs: "Music organizes time through repetition, variation, silence, emphasis, tension, release, and return.",
    pat: "Meaning often emerges through the relationship between what happens now and what the listener remembers happening before.",
    why: "Music makes Rhythm audible. A return means something because the listener remembers the previous state. Variation means something because a pattern has already been established.",
    prac: "Listen to a familiar track. Mark: first pattern → variation → peak → release → return. Then ask: “What changed because the pattern returned?”",
    timeline: ["PATTERN", "VARIATION", "RELEASE", "RETURN"],
  },
];

/* ------------------------------------------------------- 06 · RECLAMATION -- */

export const RECLAMATION_CONTENT = {
  context: [
    "“Concrete Warnings” lives inside a world where patterns are painful, not theoretical.",
    "The song is not a lecture about repetition. It is a record of what happens when the same harm keeps moving through the same environment.",
  ],
  contextLines: [
    "Contracts break.",
    "Trust erodes.",
    "Roles repeat.",
    "Consequences arrive.",
    "The details change.",
    "The pattern remains.",
  ],
  lyric: "History repeats, a pattern etched in pain, to the rhythm of their beat.",
  analysis: [
    "Read the line as a Rhythm map. History repeats. The repetition becomes recognizable. The pattern is etched in pain. The carving tool is recurrence.",
    "But there is another question. If a pattern keeps producing the same consequence, where does the pattern become changeable?",
    "A cycle is not automatically destiny. A repeated outcome can be reinforced by repeated choices, repeated incentives, repeated silences, or repeated conditions. That means repetition can reveal a point of intervention.",
  ],
  interventionLines: [
    "The moment everything collapses is not necessarily where the cycle should be addressed.",
    "Sometimes the real intervention happens much earlier.",
    "Before the overcommitment.",
    "Before the silence.",
    "Before the ignored warning.",
    "Before the familiar exception becomes the new rule.",
  ],
  synthesis: [
    "This is where Rhythm meets Reclamation. You stop asking only: “Why does this keep happening?” and begin asking: “What role am I playing in the pattern, what condition keeps reinforcing it, and where can that role change?”",
    "That question does not assign blame for every cycle. It restores agency where agency actually exists.",
  ],
  elsewhere: {
    title: "ELSEWHERE IN THE RECLAMATION WORLD",
    entries: [
      {
        track: "Remember the Price (When You Speak The Name)",
        note: "treats transformation as long-cycle tempering.",
      },
      {
        track: "Blueprint of the Divine",
        note: "builds a sequence of acknowledgment, ascent, release, and return.",
      },
      {
        track: "Through The Fog",
        note: "moves through waiting, distance, obscurity, and emergence.",
      },
    ],
    close:
      "Across these works, Rhythm is not merely repetition. It is repetition carrying memory. And once repetition carries memory, it can teach.",
  },
  insight:
    "A pattern becomes powerful when it repeats. It becomes useful when you can recognize where it changes.",
  /* The scrubber the master specifies for this section. Illustrative, not predictive. */
  chain: [
    { k: "EVENT", v: "Something happens. On its own it looks isolated." },
    { k: "REPEAT", v: "It happens again. The details differ." },
    { k: "PATTERN", v: "The repetition becomes recognizable." },
    { k: "CONSEQUENCE", v: "The same cost arrives on schedule." },
    { k: "INTERVENTION", v: "A role, a condition, or a response changes — and the next turn is not identical." },
  ],
};

/* --------------------------------------------------------- 07 · 2026 LENS -- */

export const LENS = [
  {
    n: "01",
    name: "ATTENTION CYCLES",
    now: "Online attention moves in waves. A topic becomes unavoidable, then disappears. A creator surges, then attention moves elsewhere. A crisis dominates, then the feed moves on.",
    herm: "Attention has phases: surge → saturation → contraction → reactivation.",
    prac: "Before deciding that something no longer matters because it left the feed, ask: “What changed in the attention cycle, and what remains true after the noise moves on?”",
    phases: ["SURGE", "SATURATION", "CONTRACTION", "REACTIVATION"],
  },
  {
    n: "02",
    name: "PRODUCTIVITY CULTURE",
    now: "Many modern environments quietly expect constant output: always-on work, endless side projects, perpetual optimization.",
    herm: "Treating yourself as a permanent peak phase creates a rhythm the system cannot sustain indefinitely.",
    prac: "Identify one routine that contains output but no planned restoration. Ask: “What would change if recovery were part of the design rather than the reward for collapse?”",
    phases: ["OUTPUT", "OUTPUT", "OUTPUT", "COLLAPSE"],
  },
  {
    n: "03",
    name: "BURNOUT LOOPS",
    now: "People can cycle through overwork → collapse → brief recovery → immediate re-entry → overwork.",
    herm: "This is not simply a cycle. It is a self-reinforcing loop.",
    prac: "Do not only study the crash. Find the earliest repeatable point where a different behavior could change the next cycle.",
    phases: ["OVERWORK", "COLLAPSE", "BRIEF RECOVERY", "RE-ENTRY"],
  },
  {
    n: "04",
    name: "CREATIVE WORK",
    now: "Creators experience cycles of idea abundance, execution, fatigue, quiet rebuilding, and renewed output.",
    herm: "A creative system becomes more sustainable when it designs for multiple phases instead of treating production as the only legitimate state.",
    prac: "Define in advance what expansion, production, contraction, and restoration look like in your creative practice. Then define what you will protect in each phase.",
    phases: ["ABUNDANCE", "EXECUTION", "FATIGUE", "REBUILDING"],
  },
  {
    n: "05",
    name: "GLOBAL NEWS CYCLES",
    now: "Stories rise to global visibility, dominate attention, and eventually leave the center of public conversation.",
    herm: "Visibility is rhythmic. Importance is not necessarily rhythmic in the same way.",
    prac: "When a story disappears from public attention, ask: “What remains true after the attention cycle ends?”",
    phases: ["RISE", "DOMINANCE", "DECLINE", "ABSENCE"],
  },
  {
    n: "06",
    name: "GROUP EMOTIONAL WAVES",
    now: "Communities can move through waves of hope, anger, fear, cynicism, urgency, and apathy.",
    herm: "Group emotion can spread through repetition, reinforcement, and social feedback.",
    prac: "Before mirroring the emotional phase of a group, ask: “Is this a tone I want to reinforce?” Then decide whether to join, redirect, wait, or step away.",
    phases: ["HOPE", "URGENCY", "CYNICISM", "APATHY"],
  },
];

export const LENS_SOURCES = {
  label: "Explore Sources",
  body: [
    "These six domains are Layer 2 — Contemporary Analogy: modern situations chosen to help you think with the Rhythm principle, not empirical claims about how platforms, markets, or communities behave in every case.",
    "This is a systems observatory, not a news feed. Where a domain touches an evidence-based claim, treat it as a starting frame rather than a citation, and verify specifics against current, qualified sources before acting on them.",
  ],
};

/* -------------------------------------------------------- 08 · REFLECTION -- */

export const REFLECTION_CONTENT = {
  primary:
    "What rhythm do you keep calling chaos — and what does it look like when you map it as a pattern?",
  note: "Do not answer with the version of yourself you wish were true. Answer with evidence.",
  supports: [
    "What area of your life seems to repeat the same sequence?",
    "What usually starts the pattern?",
    "What do you tend to do during the peak?",
    "What happens during the contraction?",
    "What restores you, and what only postpones the next cycle?",
    "What part of the pattern feels inevitable but may actually be reinforced by a choice, expectation, environment, or habit?",
  ],
  finalPrompt:
    "Where is the earliest point in the cycle where a different response could change what happens next?",
  finalPromptTemplate:
    "The pattern I keep repeating is ___. The earliest point where a different response could change it is ___.",
};

/* ---------------------------------------------------------- 09 · PROTOCOL -- */

export const PROTOCOL_PURPOSE = [
  "Stop treating every dip as disaster and every surge as destiny.",
  "The objective is not to engineer one perfect schedule. It is to learn the actual rhythm of one area of your life, identify the point where the pattern becomes predictable, and practice responding differently before the same outcome arrives again.",
];

export const PROTOCOL_WHEN = [
  "When the same burnout keeps returning",
  "When the same conflict repeats",
  "When your energy appears unpredictable",
  "Before committing to a major long-term project",
  "After a major life transition",
  "Whenever you hear yourself say, “Here we go again.”",
];

export const PROTOCOL_STEPS = [
  {
    id: "area",
    n: "01",
    t: "CHOOSE ONE AREA",
    d: "Choose one: work, creativity, relationships, finances, health routines, spiritual practice, or another recurring area. Name it clearly.",
    ph: "Creative work — finishing and releasing music.",
    workspace: "1 — WHAT AREA AM I AUDITING?",
  },
  {
    id: "cycles",
    n: "02",
    t: "MAP THE LAST THREE CYCLES",
    d: "Look back over the most useful period available and identify at least three repetitions. For each one, roughly mark expansion, peak, contraction, and restoration. You do not need perfect dates. You need enough evidence to see sequence.",
    ph: "Spring: ideas flooded in, published constantly, crashed in June, disappeared for three weeks…",
  },
  {
    id: "triggers",
    n: "03",
    t: "IDENTIFY THE TRIGGERS",
    d: "What tends to start the expansion? What tends to turn expansion into overextension? What tends to signal contraction? What actually restores capacity? This is the point where the map becomes predictive.",
    ph: "A new opportunity starts it. Saying yes twice in one week turns it into overextension.",
  },
  {
    id: "loop",
    n: "04",
    t: "NAME THE LOOP",
    d: "What usually happens next? Write the sequence in one line. Then ask which part is most costly, and which part occurs early enough to change.",
    ph: "New opportunity → overcommitment → peak output → exhaustion → avoidance → recovery → new opportunity",
    workspace: "2 — WHAT RHYTHM OR LOOP KEEPS REPEATING?",
  },
  {
    id: "expectation",
    n: "05",
    t: "FIND THE UNSUSTAINABLE EXPECTATION",
    d: "Where do you demand something that violates the actual rhythm? Do you expect yourself to remain at peak? Do you treat contraction as failure? Do you postpone restoration until you collapse? Do you keep expanding without checking capacity? Name the expectation.",
    ph: "I expect myself to stay in peak forever and judge contraction as proof that I am not really creative.",
  },
  {
    id: "intervention",
    n: "06",
    t: "IDENTIFY THE INTERVENTION POINT",
    d: "Choose the earliest realistic point where a different response could alter the next phase. Do not choose the most dramatic moment. Choose the earliest useful moment — before expansion becomes overcommitment, before irritation becomes conflict, before fatigue becomes avoidance, before a short-term win becomes an unsustainable workload.",
    ph: "When expansion turns into uncontrolled commitment — not at exhaustion.",
    workspace: "3 — WHERE IS THE EARLIEST INTERVENTION POINT?",
  },
  {
    id: "response",
    n: "07",
    t: "DESIGN THE RHYTHM-ALIGNED RESPONSE",
    d: "Choose one behavior appropriate to the phase and intervention point. Complete: “When I notice ___, I will ___ before the next phase accelerates.”",
    ph: "When I notice a third project starting, I will define the maximum number of active projects before accepting another.",
    workspace: "4 — WHAT WILL I DO DIFFERENTLY THERE?",
  },
  {
    id: "test",
    n: "08",
    t: "TEST AND RECORD THE EVIDENCE",
    d: "Run the same area through the next cycle. Record what you predicted, what actually happened, what you changed, what happened because you changed it, and what you still need to change. The purpose is not to prove the theory correct. The purpose is to learn your system more accurately.",
    ph: "I predicted the crash would arrive in week six. It arrived in week eight, after I cut one project.",
  },
];

/* Selector offered at the intervention point. No points, no badges — the choice
   is used to build the learner's next-cycle experiment. */
export const RESPONSE_KINDS = [
  "Boundary",
  "Reduce",
  "Restore",
  "Delegate",
  "Pause",
  "Prepare",
  "Communicate",
  "Resequence",
  "Other",
];

export const WORKED_EXAMPLE = [
  { k: "RECURRING AREA", v: "Creative work." },
  {
    k: "MAPPED RHYTHM",
    v: "Expansion — new ideas flood in, I feel excited, I start multiple projects. Peak — I publish constantly, I say yes to every opportunity, I feel unstoppable. Contraction — I get tired, I doubt the work, I start avoiding it. Restoration — I disappear, I consume a lot of input, I slowly begin to feel human again.",
  },
  {
    k: "LOOP",
    v: "New opportunity → overcommitment → peak → exhaustion → avoidance → recovery → new opportunity",
  },
  {
    k: "UNSUSTAINABLE EXPECTATION",
    v: "I expect myself to stay in peak forever and judge contraction as proof that I am not really creative.",
  },
  {
    k: "INTERVENTION POINT",
    v: "The pattern becomes expensive before exhaustion. It begins when expansion turns into uncontrolled commitment.",
  },
  {
    k: "RHYTHM-ALIGNED RESPONSE",
    v: "Before every major expansion, I will define the maximum number of active projects and schedule restoration before I feel broken.",
  },
  {
    k: "TEST",
    v: "Over the next cycle, I will track active projects, hours committed, restoration time, creative output, and avoidance.",
  },
  {
    k: "NEW SIGNAL",
    v: "“My creativity moves in seasons. I create with more power when I protect the conditions that let me return.”",
  },
];

/* ---------------------------------------------------------- 10 · ARTIFACT -- */

export const ARTIFACT_STAGES = [
  {
    n: "01",
    stage: "IDENTIFY",
    fields: [
      { id: "area", label: "MY AREA", q: "What area of my life am I mapping?" },
      { id: "whyArea", label: "WHY THIS AREA MATTERS", q: "What makes this rhythm worth understanding?" },
    ],
  },
  {
    n: "02",
    stage: "OBSERVE",
    fields: [
      { id: "phases", label: "MY PHASES", q: "What do expansion, peak, contraction, and restoration actually look like here?" },
      { id: "signals", label: "MY SIGNALS", q: "What tends to tell me the phase is changing?" },
    ],
  },
  {
    n: "03",
    stage: "MAP",
    fields: [
      { id: "sequence", label: "MY SEQUENCE", q: "In what order do these phases usually appear?" },
      { id: "timing", label: "MY TIMING", q: "How long do they roughly last?" },
      { id: "loop", label: "MY LOOP", q: "What sequence keeps repeating?" },
    ],
  },
  {
    n: "04",
    stage: "INTERPRET",
    fields: [
      { id: "pattern", label: "MY PATTERN", q: "What does this sequence repeatedly produce?" },
      {
        id: "expectation",
        label: "MY UNSUSTAINABLE EXPECTATION",
        q: "What am I demanding from the system that the pattern cannot reliably sustain?",
      },
    ],
  },
  {
    n: "05",
    stage: "APPLY",
    fields: [
      { id: "intervention", label: "MY INTERVENTION POINT", q: "Where can I act early enough to change the next phase?" },
      { id: "response", label: "MY RHYTHM-ALIGNED RESPONSE", q: "What will I do differently?" },
      { id: "protect", label: "WHAT I WILL PROTECT", q: "What condition, boundary, resource, or practice must be protected?" },
    ],
  },
  {
    n: "06",
    stage: "INTEGRATE",
    fields: [
      { id: "test", label: "MY TEST", q: "What observable evidence will tell me whether the new response worked?" },
      { id: "reviewPoint", label: "MY REVIEW POINT", q: "When will I review the next cycle?" },
      { id: "notes", label: "NOTES TO FUTURE ME", q: "What do I want to remember the next time this pattern begins?" },
    ],
  },
];

export const PATTERN_STATEMENT_TEMPLATE =
  "When ___ begins, I tend to ___. At peak, I ___. During contraction, I ___. During restoration, I ___. This pattern tends to produce ___.";

/* Three readings of the same learner data, not three separate artifacts — so
   the views overlap rather than partition. Stage 05 (APPLY) appears in all
   three: the intervention point is what distinguishes a Rhythm Map from Module
   IV's Polarity Map, and it should never be a view the learner has to go find.
   Between them the three views must still reach every stage. */
export const ARTIFACT_VIEWS = [
  {
    id: "cycle",
    label: "CYCLE",
    note: "The four phases as they actually run in this area.",
    stages: ["01", "02", "05"],
  },
  {
    id: "loop",
    label: "LOOP",
    note: "The sequence that keeps repeating and reinforcing itself.",
    stages: ["03", "04", "05"],
  },
  {
    id: "intervention",
    label: "INTERVENTION",
    note: "The earliest point where a different response changes the next phase.",
    stages: ["04", "05", "06"],
  },
];

/* ----------------------------------------------------------- 11 · SUMMARY -- */

export const SUMMARY_CONTENT = {
  principle: [
    "Everything moves.",
    "Some movements repeat.",
    "Some patterns restore.",
    "Some patterns deplete.",
    "Some patterns change when the conditions around them change.",
  ],
  principleClose:
    "The point is not to control every cycle. The point is to recognize the rhythm, understand the pattern, and become more intentional about where you intervene.",
  learned: [
    "Rhythm helps you distinguish a moment from a pattern.",
    "A phase is not automatically good or bad; its meaning depends on what is happening across the larger sequence.",
    "Contraction is information, not automatic failure.",
    "A recurring pattern is not the same thing as destiny.",
    "The most useful intervention often happens before the most visible consequence.",
    "Sustainable change requires practices that match timing rather than deny it.",
  ],
  discovered: [
    { id: "loop", label: "The rhythm I keep repeating" },
    { id: "expectation", label: "The expectation that keeps breaking the rhythm" },
    { id: "intervention", label: "The earliest intervention point" },
    { id: "response", label: "The practice I chose" },
  ],
  reclamationQuestion:
    "What rhythm are you choosing to cooperate with — and what demand are you finally ready to retire?",
  carryForward:
    "You are not trying to create a perfect schedule. You are learning how your life actually moves.",
};

export const SEVEN_DAY_PRACTICE = {
  title: "THE SEVEN-DAY PRACTICE",
  lede: "For the next seven days, do not try to redesign your entire life. Choose one area.",
  dailyLede: "Each day, record:",
  daily: [
    { id: "phase", label: "Current phase" },
    { id: "demanded", label: "What I demanded of myself" },
    { id: "helped", label: "What actually helped" },
    { id: "exhausted", label: "What quietly exhausted me" },
    { id: "noticed", label: "Did I notice the intervention point?" },
  ],
  reviewLede: "At the end of seven days, review:",
  review: [
    "What did I predict?",
    "What actually happened?",
    "What changed because I responded differently?",
    "What should I carry into the next cycle?",
  ],
};

export const COMPLETION_STATES = [
  "REFLECTION RECORDED",
  "PROTOCOL COMPLETED",
  "RHYTHM MAP SAVED",
  "SEVEN-DAY PRACTICE READY",
];
