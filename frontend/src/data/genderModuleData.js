/* Reclamation University — Hermetic Hall — Module VII: Gender
 *
 * Learner-facing copy transcribed from the Module VII master document
 * ("Master Copy · Interaction · UI · Markup Specification"). Only learner-facing
 * copy is represented here — everything the master brackets as [EDITORIAL],
 * [UI], [INTERACTION], [VISUAL], [SYSTEM] or [QA] annotation is production
 * direction and must never render as instructional text.
 *
 * Shaped like causeEffectModuleData.js: one export per id in
 * curriculumSections.js. Those section ids are the contract.
 *
 * The master's central editorial correction: Gender here is GENERATIVE
 * RELATIONSHIP, not personality balance and not a binary. The module must never
 * prescribe gender identity or social roles, and the historical Hermetic
 * terminology is contextualized rather than adopted uncritically.
 */

export const GENDER_META = {
  numeral: "VII",
  title: "GENDER",
  subtitle: "Nothing Generates Alone.",
  law: "The Seventh Hermetic Law",
  estimatedTime: "35–50 min",
  accent: "Crimson Copper",
  primaryArtifact: "Creative Integration Map",
  secondaryPractice: "Force Dialogue",
  visualLanguage: "Generative forces · complementary currents · synthesis · dialogue · emergence",
};

export const PRINCIPLES = [
  { n: "I", name: "MENTALISM", k: "mentalism", state: "COMPLETE" },
  { n: "II", name: "CORRESPONDENCE", k: "correspondence", state: "COMPLETE" },
  { n: "III", name: "VIBRATION", k: "vibration", state: "COMPLETE" },
  { n: "IV", name: "POLARITY", k: "polarity", state: "COMPLETE" },
  { n: "V", name: "RHYTHM", k: "rhythm", state: "COMPLETE" },
  { n: "VI", name: "CAUSE & EFFECT", k: "cause", state: "COMPLETE" },
  { n: "VII", name: "GENDER", k: "gender", state: "IN PROGRESS" },
];

/* The three states of the dual-current diagram. Definitions must be reachable
   without touching the diagram, so they live here and render as text too. */
export const CURRENT_STATES = [
  { id: "initiate", label: "INITIATE", role: "One force begins. It projects possibility, sets direction, and opens the field." },
  { id: "receive", label: "RECEIVE", role: "Another force takes in what has begun. It listens, develops, and gives possibility form." },
  { id: "create", label: "CREATE", role: "Neither is complete in isolation. The generative act occurs in the relationship between them." },
];

/* -------------------------------------------------------------- 01 · INTRO -- */

export const INTRO_CONTENT = {
  question: "Where in your life have you been trying to create with only half of what you actually are?",
  blocks: [
    { kind: "p", value: "You may already recognize the pattern." },
    {
      kind: "lines",
      value: [
        "You are told to be strong.",
        "You are told to be soft.",
        "You are told to push.",
        "You are told to surrender.",
        "You are told to speak.",
        "You are told to listen.",
      ],
    },
    {
      kind: "lines",
      value: [
        "Eventually, these become identities.",
        "Strong or gentle.",
        "Logical or intuitive.",
        "Decisive or receptive.",
        "Independent or connected.",
      ],
    },
    { kind: "p", value: "But creation does not work that way." },
  ],
  lensTitle: "A DIFFERENT LENS",
  lens: [
    "The Hermetic Principle of Gender offers a different lens. It describes reality as generative.",
  ],
  lensLines: [
    "Something initiates.",
    "Something receives.",
    "Something shapes.",
    "Something responds.",
    "Something gives form to what has begun.",
  ],
  lensClose: [
    "These are not fixed identities. They are creative functions.",
    "They exist within you. They exist between people. They exist inside relationships, systems, art, technology, and ideas.",
  ],
  exileTitle: "THE USUAL PROBLEM",
  exileLede:
    "The problem is rarely that one force is missing. More often, one has been overdeveloped while another has been exiled.",
  exileLines: [
    "You force what needs time.",
    "You analyze what needs to be felt.",
    "You protect what needs to move.",
    "You move what first needs to be received.",
  ],
  reframe: {
    from: "Which side am I?",
    to: "Which forces are creating through me — and which have I stopped allowing into the room?",
  },
  microLabel: "CREATION NEEDS MORE THAN ONE FORCE.",
};

/* ---------------------------------------------------------- 02 · PRINCIPLE -- */

export const PRINCIPLE_CONTENT = {
  title: "The Law of Gender",
  quote:
    "Gender is in everything; everything has its Masculine and Feminine Principles; Gender manifests on all planes.",
  blocks: [
    {
      kind: "p",
      value:
        "The seventh Hermetic Principle presents reality as generative rather than inert. Creation requires relationship between forces.",
    },
    {
      kind: "lines",
      value: [
        "One force initiates.",
        "Another receives.",
        "One projects possibility.",
        "Another gives possibility form.",
        "Neither is complete in isolation.",
      ],
    },
  ],
  /* The master requires the historical formulation to be stated and then
     immediately contextualized — it must not be read with today's meanings. */
  frameTitle: "A NOTE ON THE HISTORICAL LANGUAGE",
  frameLines: [
    "This does not mean that one force belongs to men and another belongs to women.",
    "It does not mean that people have only one creative mode.",
    "And it does not prescribe social roles.",
  ],
  frameClose:
    "Here, “Masculine” and “Feminine” are being used as traditional Hermetic language for complementary creative principles. The practical question is not “Which one are you?” It is “How do these forces operate through you?”",
  patternTitle: "YOU MAY SEE THE PATTERN WHEN",
  patterns: [
    "A vision meets sustained care and becomes a project.",
    "A decision meets listening and becomes a relationship that can evolve.",
    "An impulse to create meets revision and becomes finished work.",
    "A boundary meets compassion and becomes protection without cruelty.",
    "A new idea meets patience and becomes something capable of surviving its first excitement.",
  ],
  notLines: ["Not identity.", "Not hierarchy.", "Not stereotype.", "Generative relationship."],
  translationTitle: "THE PRACTICAL TRANSLATION",
  translationLede: "Stop trying to create through one mode of power alone. Creation needs:",
  needs: [
    "Initiation and receptivity.",
    "Direction and responsiveness.",
    "Structure and adaptation.",
    "Vision and nurture.",
    "Expression and listening.",
  ],
  translationClose: "The deeper question is: what forces in me are creating — and which have I exiled?",
};

/* ------------------------------------------------------- 03 · KEY CONCEPTS -- */

export const KEY_CONCEPTS = [
  {
    n: "01",
    id: "capacities",
    title: "CREATIVE FORCES ARE CAPACITIES",
    teaser: "You are not assigned one creative force and denied another.",
    body: [
      "You contain capacities for initiation, direction, reception, adaptation, nurture, discernment, and transformation.",
    ],
    practice: [
      "Where do you initiate naturally?",
      "Where do you receive naturally?",
      "Where have you confused one with weakness?",
    ],
  },
  {
    n: "02",
    id: "exile",
    title: "EXILE CREATES DISTORTION",
    teaser: "When one mode becomes the only acceptable version of yourself, the others do not disappear.",
    body: ["They return indirectly."],
    bodyLines: [
      "Suppressed feeling can become resentment.",
      "Suppressed agency can become passivity.",
      "Suppressed receptivity can become rigidity.",
      "Suppressed direction can become drift.",
    ],
    practice: [
      "Complete the sentence: “I am the kind of person who never…”",
      "Then ask: is that actually a value — or is it a defense?",
    ],
  },
  {
    n: "03",
    id: "dialogue",
    title: "CREATION REQUIRES DIALOGUE",
    teaser: "The generative act occurs in the relationship.",
    body: ["Push without receptivity becomes force.", "Receptivity without direction becomes drift."],
    practice: [
      "Choose one current project. Ask: what needs to be initiated?",
      "Then: what needs to be received, developed, or allowed to mature?",
    ],
  },
  {
    n: "04",
    id: "integration",
    title: "INTEGRATION IS NOT COMPROMISE",
    teaser: "Integration does not mean giving every force equal control.",
    body: [
      "It means allowing the right force to participate at the right moment.",
      "Sometimes direction must lead. Sometimes receptivity must lead. Wisdom is knowing which one the situation requires — and refusing to exile the other.",
    ],
    practice: ["Ask: what needs to lead here?", "Then: what needs to remain present beside it?"],
  },
];

/* ---------------------------------------------------- 04 · WHY IT MATTERS -- */

export const WHY_IT_MATTERS = {
  intro: "You can survive for a long time by overusing one part of yourself.",
  introLines: [
    "You can become extremely good at pushing.",
    "Or analyzing.",
    "Or caring.",
    "Or controlling.",
    "Or adapting.",
    "Or disappearing.",
  ],
  introClose:
    "The problem appears when the strategy that once protected you becomes the only way you know how to create.",
  /* Revealed one stage at a time — the master requires this diagram to be
     educational rather than decorative, so each stage carries both its
     definition and a worked expansion. */
  sequence: [
    {
      id: "exile",
      label: "EXILE",
      definition: "A capacity is pushed outside the acceptable version of yourself.",
      example: "“I don't need anyone.”",
    },
    {
      id: "imbalance",
      label: "IMBALANCE",
      definition: "The remaining capacity takes on too much responsibility.",
      example: "Everything depends on self-sufficiency.",
    },
    {
      id: "distortion",
      label: "DISTORTION",
      definition: "The overused force begins producing consequences it was never designed to carry alone.",
      example: "Receiving support begins to feel like failure.",
    },
    {
      id: "breakdown",
      label: "BREAKDOWN",
      definition: "The system eventually exhausts itself.",
      example: "Connection becomes harder to sustain.",
    },
    {
      id: "integration",
      label: "INTEGRATION",
      definition: "The exiled capacity is allowed back into the creative process.",
      example: "Independence remains — but receptivity becomes available.",
    },
  ],
  question:
    "What have you become exceptionally good at doing because you stopped allowing yourself to do something else?",
};

/* ------------------------------------------------------------ 05 · DOMAINS -- */

export const DOMAINS = [
  {
    n: "01",
    name: "INNER LIFE",
    obsLines: ["Thinking and feeling.", "Vision and vulnerability.", "Clarity and uncertainty."],
    pattern: "One mode becomes trustworthy while another becomes suspect.",
    why: "A decision made without feeling may be efficient but disconnected. Feeling without decision may be authentic but directionless.",
    practice: ["What part of you gets a vote in major decisions?", "What part gets silenced?"],
  },
  {
    n: "02",
    name: "RELATIONSHIPS",
    obs: "Relationships require initiation and receptivity.",
    obsLines: ["Someone reaches.", "Someone responds.", "Someone names.", "Someone listens.", "Healthy relationships allow these positions to move."],
    pattern: "When one person permanently directs and another permanently accommodates, relationship becomes role.",
    why: "Rigid roles eventually produce resentment, dependence, avoidance, or control.",
    practice: ["Where do you initiate?", "Where do you receive?", "Where have those positions become fixed?"],
  },
  {
    n: "03",
    name: "TEAMS & ORGANIZATIONS",
    obs: "Organizations need vision and infrastructure.",
    obsLines: ["Direction creates movement.", "Sustaining systems make movement possible."],
    pattern: "Organizations often celebrate the person who starts things while overlooking the people who make continuation possible.",
    why: "A vision without sustaining structure becomes a recurring beginning.",
    practice: ["What does your environment reward?", "What does it rely upon but fail to honor?"],
  },
  {
    n: "04",
    name: "CREATIVE WORK",
    obs: "Creation moves through emergence, development, revision, and release.",
    pattern: "Some creators become addicted to beginnings. Others become trapped in refinement.",
    why: "A work becomes real when inspiration can survive contact with development.",
    practice: [
      "Separate your initiating time from your receptive or editing time.",
      "Do not demand that both modes perform simultaneously.",
    ],
  },
  {
    n: "05",
    name: "HEALING",
    obs: "Healing requires agency and receptivity.",
    obsLines: ["You act.", "You allow.", "You seek.", "You receive."],
    pattern: "Doing everything alone can become avoidance of being supported. Feeling everything without action can become another form of paralysis.",
    why: "Integration makes healing participatory rather than performative.",
    practice: ["Where do you need to act?", "Where do you need to allow?"],
  },
  {
    n: "06",
    name: "CULTURE",
    obs: "Every culture rewards some forms of behavior more heavily than others.",
    pattern: "Assertion may be rewarded while care is invisible. Or care may be expected while agency is punished.",
    why: "A culture can exile an entire category of creative capacity.",
    practice: ["What does your environment reward you for being?", "What does it make difficult for you to become?"],
  },
];

/* -------------------------------------------------------- 06 · RECLAMATION -- */

export const RECLAMATION_CONTENT = {
  title: "Art! Official! · Elemental Orchestra",
  contextLede: "The Reclamation world repeatedly refuses false binaries.",
  binaries: [
    "Machine and soul.",
    "Technology and spirit.",
    "Wound and witness.",
    "Need and becoming.",
    "Artist and instrument.",
  ],
  contextClose:
    "The question is not which side wins. The question is what becomes possible when they enter relationship.",
  tracks: [
    {
      track: "Art! Official!",
      body: [
        "In “Art! Official!”, technology does not replace authorship. The tool expands the field through which authorship can operate.",
        "The important distinction is not human versus machine. It is: who is generating the vision? The machine can execute, transform, extend, and respond. The artist provides intention, meaning, selection, interpretation, and authorship. The creation emerges through relationship.",
      ],
    },
    {
      track: "Elemental Orchestra",
      body: [
        "In “Elemental Orchestra,” the same architecture moves inward.",
      ],
      lines: ["Wound and witness.", "Need and bloom.", "Child and architect.", "Receiving and becoming."],
      close:
        "The song does not require one force to eliminate the other. It allows them to become part of the same composition.",
    },
  ],
  lyric: "That’s A.I. but the vision is mine, where circuitry meets soul.",
  lyricSource: "ART! OFFICIAL!",
  analysisLede: "Read the line through Gender.",
  analysis: [
    { k: "CIRCUITRY", lines: ["Capacity.", "Execution.", "Extension.", "Structure."] },
    { k: "VISION", lines: ["Intention.", "Direction.", "Meaning."] },
    { k: "SOUL", lines: ["Experience.", "Feeling.", "Interpretation.", "Meaning made personal."] },
  ],
  analysisClose: [
    "The principle appears in the relationship. The machine does not become the artist. The artist does not pretend the machine does nothing. The creative act occurs between capacities.",
    "That distinction matters far beyond artificial intelligence. It applies whenever creation involves something outside yourself:",
  ],
  beyond: [
    "A collaborator.", "A tool.", "A relationship.", "A system.",
    "A community.", "A process.", "A part of yourself you previously refused to hear.",
  ],
  insight:
    "The reclamation is not choosing one side. It is recovering the capacity to let previously separated forces participate in the same creation.",
  insightQuestion:
    "What have you been treating as mutually exclusive that may actually be capable of collaboration?",
};

/* ---------------------------------------------------------- 07 · 2026 LENS -- */

export const LENS_LEDE = {
  intro:
    "The ancient language remains useful when it helps us see patterns inside systems we are currently building.",
  from: "What does Gender mean in 2026?",
  to: "Where are complementary creative forces being combined, separated, rewarded, or suppressed in the systems around us?",
};

export const LENS = [
  {
    n: "01",
    name: "HUMAN + MACHINE CREATIVITY",
    now: "Human beings increasingly create with generative AI.",
    herm: "Human intention and machine capability enter a generative relationship.",
    pracLede: "Do not ask only “Did AI make this?” Ask:",
    prac: ["Where does intention originate?", "Where does interpretation happen?", "What remains authored by me?"],
  },
  {
    n: "02",
    name: "LEADERSHIP",
    now: "Leadership is increasingly being examined through questions of power, listening, psychological safety, accountability, and care.",
    herm: "Directive force and receptive capacity must interact.",
    pracLede: "Ask:",
    prac: ["What needs direction?", "What information am I required to receive before directing?"],
  },
  {
    n: "03",
    name: "DIGITAL SELF-PRESENTATION",
    now: "People construct public identities while managing vulnerability, privacy, performance, reach, and safety.",
    herm: "Expression and receptivity are constantly negotiating.",
    pracLede: "Ask:",
    prac: ["Am I expressing myself — or performing a version of myself that I think will be rewarded?"],
  },
  {
    n: "04",
    name: "CARE INFRASTRUCTURE",
    now: "Emotional labor, caregiving, maintenance, and community support remain essential while often receiving less visibility than achievement.",
    herm: "Sustaining forces are part of creation.",
    pracLede: "Ask:",
    prac: ["What does your system depend upon that it does not adequately recognize?"],
  },
  {
    n: "05",
    name: "BOUNDARIES + ACCESS",
    now: "Modern life continually negotiates openness, privacy, accessibility, protection, and participation.",
    herm: "Receiving does not mean unlimited access. Giving does not mean unlimited availability.",
    pracLede: "Remember:",
    prac: ["Integrated generosity includes boundaries."],
  },
  {
    n: "06",
    name: "CROSS-DISCIPLINARY CREATION",
    now: "Art meets technology. Science meets design. Story meets data. Music meets computation.",
    herm: "Novel creation often emerges when different capacities enter relationship without erasing their differences.",
    pracLede: "Do not ask “Which discipline is right?” Ask:",
    prac: ["What can become possible between them?"],
  },
];

/* --------------------------------------------------------- 08 · REFLECTION -- */

export const REFLECTION_CONTENT = {
  primary: "What forces in you have been told they cannot coexist?",
  note: "Do not answer with the person you wish you were. Answer with evidence.",
  supports: [
    {
      n: "01",
      q: "Where have you been performing only one side of yourself?",
      lines: [
        "Always strong.", "Always capable.", "Always independent.", "Always caring.",
        "Always rational.", "Always available.", "Always in control.",
      ],
    },
    {
      n: "02",
      q: "What capacity have you exiled because someone taught you it was:",
      lines: ["“Too much.”", "“Not enough.”", "“Weak.”", "“Selfish.”", "“Unnecessary.”", "“Not who you are.”"],
    },
    {
      n: "03",
      q: "Where does this exile produce a recognizable pattern?",
      lines: ["In your relationships?", "Your work?", "Your creativity?", "Your boundaries?", "Your decisions?"],
    },
    { n: "04", q: "What would change if that capacity were allowed one small vote?", lines: [] },
  ],
  finalPrompt:
    "What integration are you willing to practice — not as a performance, but as a new baseline?",
  finalPromptTemplate:
    "The forces I have been told cannot coexist are ___. The one I exile first under pressure is ___.",
};

/* ----------------------------------------------------------- 09 · PROTOCOL -- */

export const PROTOCOL_PURPOSE = [
  "Stop allowing one mode of power to make every decision alone.",
  "The goal is not perfect balance. The goal is participation.",
];

export const PROTOCOL_WHEN = [
  "You feel trapped between extremes.",
  "A familiar pattern keeps repeating.",
  "You are about to make an emotionally loaded decision.",
  "You notice yourself becoming rigid.",
  "You notice yourself disappearing.",
  "You are creating something important.",
];

/* Name → Dialogue → Exile → Integrate → Practice → Observe. Step 07 closes the
   feedback loop: the master requires evidence, not merely intention. */
export const PROTOCOL_STEPS = [
  {
    id: "forces",
    n: "01",
    t: "NAME THE FORCES",
    d: "Choose two forces that are active, and name the situation they are speaking about. Examples: clarity and emotion. Boundary and compassion. Vision and patience. Action and receptivity. Independence and connection.",
    fields: [
      {
        id: "situation",
        label: "THE SITUATION",
        ph: "A friend repeatedly crosses my boundaries.",
        workspace: "2 · WHAT SITUATION ARE THEY SPEAKING ABOUT?",
      },
      {
        id: "forces",
        label: "THE TWO FORCES",
        ph: "Boundary and compassion.",
        workspace: "1 · WHAT TWO FORCES AM I PUTTING INTO DIALOGUE?",
      },
    ],
  },
  {
    id: "speak",
    n: "02",
    t: "LET EACH SPEAK",
    d: "Ask what each force wants. Then ask what each force needs. Do not make either one wrong.",
    fields: [
      { id: "forceOne", label: "THE FIRST FORCE SAYS", ph: "I need my time and energy to be respected." },
      { id: "forceTwo", label: "THE SECOND FORCE SAYS", ph: "I understand that they are struggling." },
    ],
  },
  {
    id: "exile",
    n: "03",
    t: "IDENTIFY EXILE",
    d: "Which force do you usually silence first? When pressure rises, which voice disappears?",
    ph: "Compassion has historically overridden the boundary.",
  },
  {
    id: "generative",
    n: "04",
    t: "FIND THE GENERATIVE RELATIONSHIP",
    d: "Do not ask which force should win. Ask what could become possible if both were allowed to participate.",
    ph: "How can care exist without self-erasure?",
  },
  {
    id: "joint",
    n: "05",
    t: "DESIGN THE JOINT RESPONSE",
    d: "Create one response that honors the legitimate information contained in both forces. A boundary with care. An action with room for feeling. A vision with a sustainable process. A yes with conditions. A no without punishment.",
    ph: "I will communicate a clear limit on how often I am available and offer one specific way I can support them within that limit.",
    workspace: "3 · WHAT JOINT RESPONSE WILL I PRACTICE?",
  },
  {
    id: "practice",
    n: "06",
    t: "COMMIT TO ONE SMALL PRACTICE",
    d: "Choose one behavior. Not a personality transformation. One behavior. For example: “Before responding, I will identify both the need and the limit.” “I will allow myself to receive assistance without interpreting it as failure.” “I will create before I edit.” “I will pause before overriding what I actually feel.”",
    ph: "I will say no once this week where I would previously have said yes from guilt.",
  },
  {
    id: "observe",
    n: "07",
    t: "OBSERVE",
    d: "After acting, record what changed. What became easier? What became uncomfortable? What did you learn? What force became more available?",
    ph: "What happened after I allowed both forces to participate?",
  },
];

export const WORKED_EXAMPLE = [
  { k: "SITUATION", v: "A friend repeatedly crosses your boundaries." },
  { k: "FORCE ONE · BOUNDARY", v: "“I need my time and energy to be respected.”" },
  { k: "FORCE TWO · COMPASSION", v: "“I understand that they are struggling.”" },
  { k: "EXILE", v: "Compassion has historically overridden the boundary." },
  { k: "GENERATIVE QUESTION", v: "How can care exist without self-erasure?" },
  {
    k: "JOINT RESPONSE",
    v: "“I will communicate a clear limit on how often I am available and offer one specific way I can support them within that limit.”",
  },
  { k: "SMALL PRACTICE", v: "“I will say no once this week where I would previously have said yes from guilt.”" },
  { k: "OBSERVATION", v: "What happened after I allowed both forces to participate?" },
];

/* ----------------------------------------------------------- 10 · ARTIFACT -- */

export const ARTIFACT_STAGES = [
  {
    n: "01",
    stage: "IDENTIFY",
    fields: [{ id: "forces", label: "MY FORCES", q: "Which forces am I learning to integrate?" }],
  },
  {
    n: "02",
    stage: "OBSERVE",
    fields: [
      {
        id: "pattern",
        label: "MY PATTERN",
        q: "How have these forces been operating separately? Where does one dominate? Where does the other disappear?",
      },
    ],
  },
  {
    n: "03",
    stage: "MAP",
    fields: [{ id: "situations", label: "MY SITUATIONS", q: "Where does this pattern appear most often?" }],
  },
  {
    n: "04",
    stage: "INTERPRET",
    fields: [
      {
        id: "impact",
        label: "MY IMPACT",
        q: "What has this pattern produced — in your inner life, relationships, creative work, decision-making, boundaries, and capacity to receive?",
      },
      { id: "statement", label: "PATTERN STATEMENT", q: "The shape of the pattern in your own words.", generated: true },
    ],
  },
  {
    n: "05",
    stage: "APPLY",
    fields: [
      {
        id: "practice",
        label: "MY JOINT PRACTICE",
        q: "What specific behavior will keep these forces in dialogue?",
      },
    ],
  },
  {
    n: "06",
    stage: "INTEGRATE",
    fields: [
      {
        id: "evidence",
        label: "EVIDENCE I WILL WATCH FOR",
        q: "What observable evidence would tell me that integration is becoming real?",
      },
      { id: "notes", label: "NOTES TO FUTURE ME", q: "What do you want to remember when you find this again?" },
    ],
  },
];

export const EVIDENCE_EXAMPLES = [
  "“I notice myself asking for help sooner.”",
  "“I can set a boundary without withdrawing.”",
  "“I finish projects instead of endlessly revising them.”",
  "“I can act without suppressing what I feel.”",
];

export const PATTERN_STATEMENT_TEMPLATE =
  "When I let only ______ operate, I tend to ______, which produces ______. When I let both participate, I begin to ______, which creates ______.";

/* ------------------------------------------------------------ 11 · SUMMARY -- */

export const SUMMARY_CONTENT = {
  principleLede: "Creation requires relationship between forces.",
  principle: [
    "You were never meant to reduce yourself to one acceptable mode of being.",
  ],
  principleFrom: "Which version of me is allowed?",
  principleTo: "How will I allow my forces to participate in the same creation?",
  learned: [
    "Hermetic Gender describes generative relationship rather than prescribing identity.",
    "Directive and receptive capacities exist across human experience.",
    "Exiling one capacity can distort the way the remaining capacity operates.",
    "Integration is dynamic, not a perfect 50/50 balance.",
    "You can practice integration by naming forces, allowing them to speak, and creating a joint response.",
  ],
  discovered: [
    { id: "forces", label: "THE FORCES I AM INTEGRATING" },
    { id: "pattern", label: "THE PATTERN I RECOGNIZED" },
    { id: "situations", label: "THE SITUATION WHERE IT APPEARS" },
    { id: "practice", label: "THE JOINT PRACTICE I CHOSE" },
    { id: "evidence", label: "THE EVIDENCE I WILL WATCH FOR" },
  ],
  carryForwardTitle: "CARRY FORWARD",
  carryForwardLede:
    "For the next seven days, notice one situation where you would normally respond from only one force. Record:",
  carryForward: [
    "Which force takes over.",
    "Which force disappears.",
    "What happens when you bring both into dialogue.",
  ],
  carryForwardClose: [
    "You are not trying to become someone else.",
    "You are practicing the ability to let more of yourself participate.",
  ],
  reclamationQuestion: "What part of you are you finally willing to invite back into creation?",
};

/* Progress must represent meaningful learning actions, never tab-opening.
   These are the master's own minimum criteria, section by section. */
export const COMPLETION_CONDITIONS = [
  { id: "intro", kind: "visit", label: "Intro viewed" },
  { id: "principle", kind: "visit", label: "Principle viewed" },
  { id: "key-concepts", kind: "engagement", label: "Concept interaction completed" },
  { id: "why-it-matters", kind: "engagement", label: "Process interaction viewed" },
  { id: "domains", kind: "engagement", label: "At least one domain explored" },
  { id: "reclamation", kind: "engagement", label: "Case study opened" },
  { id: "2026-lens", kind: "engagement", label: "At least one application explored" },
  { id: "reflection", kind: "input", label: "Response saved" },
  { id: "protocol", kind: "input", label: "Protocol completed" },
  { id: "artifact", kind: "input", label: "Artifact synthesized and saved" },
  { id: "summary", kind: "visit", label: "Summary viewed" },
];

export const COMPLETION_STATES = [
  "REFLECTION RECORDED",
  "PROTOCOL COMPLETED",
  "CREATIVE INTEGRATION MAP SAVED",
  "ARTIFACT ADDED TO MY ARTIFACTS",
];
