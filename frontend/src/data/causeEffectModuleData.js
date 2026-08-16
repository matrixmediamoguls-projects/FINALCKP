/* Reclamation University — Hermetic Hall — Module VI: Cause & Effect
 *
 * Learner-facing copy transcribed from the Module VI master document
 * ("Master Copy · Interaction · UI · Markup Specification"). Only the master's
 * LEARNER-FACING COPY is represented here. Everything the master labels
 * [ANNOTATION] is production direction and is deliberately absent — the master
 * is explicit that annotations "must not be rendered as instructional text."
 *
 * Shaped like rhythmModuleData.js: one export per id in curriculumSections.js.
 * Those section ids are the contract; do not rename them here without updating
 * that file too.
 *
 * Four things this master requires that Modules IV and V do not:
 *   1. Sections stay directly accessible — progression must not lock content.
 *   2. Progress reflects meaningful engagement, never mere navigation.
 *   3. The artifact requires real learner input, not page completion.
 *   4. Generated interpretation is labelled a DRAFT and must be rejectable.
 */

export const CAUSE_EFFECT_META = {
  numeral: "VI",
  title: "CAUSE & EFFECT",
  subtitle: "Nothing Is Random. Every Outcome Has Machinery.",
  law: "The Sixth Hermetic Law",
  estimatedTime: "35–50 min",
  accent: "Cause & Effect Green",
  primaryArtifact: "Causal Pattern Map",
  secondaryPractice: "Causal Trace",
  visualLanguage: "Chains · Nodes · Cascades · Consequences · Feedback · Systems · Intervention",
};

export const PRINCIPLES = [
  { n: "I", name: "MENTALISM", k: "mentalism", state: "COMPLETE" },
  { n: "II", name: "CORRESPONDENCE", k: "correspondence", state: "COMPLETE" },
  { n: "III", name: "VIBRATION", k: "vibration", state: "COMPLETE" },
  { n: "IV", name: "POLARITY", k: "polarity", state: "COMPLETE" },
  { n: "V", name: "RHYTHM", k: "rhythm", state: "COMPLETE" },
  { n: "VI", name: "CAUSE & EFFECT", k: "cause", state: "IN PROGRESS" },
  { n: "VII", name: "GENDER", k: "gender", state: "LOCKED" },
];

/* The Intro chain. Six nodes; the master is explicit that their labels must not
   all be exposed at once, so the diagram reveals one at a time. */
export const CHAIN_NODES = [
  { id: "condition", label: "CONDITION", note: "A circumstance that made the outcome more likely." },
  { id: "choice", label: "CHOICE", note: "A decision taken inside those conditions." },
  { id: "action", label: "ACTION", note: "What was actually done." },
  { id: "omission", label: "OMISSION", note: "What was not done, and mattered." },
  { id: "pattern", label: "PATTERN", note: "The repetition that made the chain durable." },
  { id: "effect", label: "EFFECT", note: "The visible event — usually the final link." },
];

/* The Principle cascade. Roles are drawn from the module's own learner copy —
   CONDITIONS, ACTIONS/OMISSIONS and FEEDBACK from the Key Concepts definitions,
   EFFECTS from the Principle text, CHOICES and CONSEQUENCES from the decision
   chain and the Reclamation questions. */
export const CASCADE = [
  {
    id: "conditions",
    label: "CONDITIONS",
    role: "A circumstance that makes an outcome more or less likely. It is not necessarily the action that produces the effect.",
  },
  {
    id: "choices",
    label: "CHOICES",
    role: "A decision taken inside those conditions. A decision changes a relationship; the changed relationship changes behavior.",
  },
  {
    id: "actions",
    label: "ACTIONS / OMISSIONS",
    role: "What was done — and what was not done that nonetheless affects the chain. Not every omission is causal, but some are.",
  },
  {
    id: "effects",
    label: "EFFECTS",
    role: "What emerges from the conditions, actions, reactions, decisions, omissions, relationships, environments, and patterns that precede it.",
  },
  {
    id: "consequences",
    label: "CONSEQUENCES",
    role: "What the effect costs, who absorbs that cost, and what becomes normalized afterward.",
  },
  {
    id: "feedback",
    label: "FEEDBACK",
    role: "When an effect returns to influence the conditions that produce future effects. The effect becomes part of the next cause.",
  },
];

/* -------------------------------------------------------------- 01 · INTRO -- */

export const INTRO_CONTENT = {
  question: "How many times have you called something “bad luck” that was actually the end of a long chain?",
  blocks: [
    {
      kind: "lines",
      value: [
        "A relationship does not usually collapse in the moment you finally leave.",
        "A project does not usually fail on the day the failure becomes visible.",
        "A habit does not usually return the day you notice it again.",
        "The visible event is often the final link.",
      ],
    },
    {
      kind: "lines",
      value: [
        "Before it came:",
        "A choice.",
        "A condition.",
        "A pattern.",
        "A signal.",
        "An omission.",
        "Another choice.",
        "Then another.",
        "Then the effect.",
      ],
    },
    {
      kind: "lines",
      value: [
        "This is where Cause & Effect begins.",
        "Not with blame.",
        "With tracing.",
      ],
    },
    {
      kind: "lines",
      value: [
        "When something in your life feels sudden, ask: Where did this actually begin?",
        "The argument had a history.",
        "The burnout had a history.",
        "The distance had a history.",
        "The opportunity had a history.",
        "The consequence had a history.",
      ],
    },
    {
      kind: "p",
      value:
        "The difficulty is that we usually experience life from the level of effects. We notice the collapse, the conflict, the loss, the breakthrough. We rarely stop to examine the machinery underneath.",
    },
  ],
  reframe: {
    from: "Why is this happening?",
    to: "What conditions, choices, actions, omissions, and patterns helped produce this?",
    then: "Where can it change?",
  },
  hardRule: [
    "That question does not make everything your fault.",
    "It makes the chain visible.",
    "And once a chain becomes visible, you can begin asking the question that matters most: Where can it change?",
  ],
  microLabel: "TRACE THE CHAIN.",
};

/* ---------------------------------------------------------- 02 · PRINCIPLE -- */

export const PRINCIPLE_CONTENT = {
  title: "The Law of Cause and Effect",
  quote:
    "Every Cause Has Its Effect; Every Effect Has Its Cause; Everything Happens According to Law.",
  blocks: [
    {
      kind: "p",
      value:
        "The sixth Hermetic Principle presents reality as lawful rather than arbitrary. An event does not exist in isolation. It emerges from conditions, actions, reactions, decisions, omissions, relationships, environments, and patterns that precede it.",
    },
    {
      kind: "p",
      value:
        "That does not mean every event has one simple cause. Real systems are rarely that clean.",
    },
    {
      kind: "lines",
      value: [
        "One effect can become the cause of another.",
        "A decision changes a relationship.",
        "The changed relationship changes behavior.",
        "The behavior changes trust.",
        "The loss of trust changes future decisions.",
        "The chain continues.",
      ],
    },
    {
      kind: "p",
      value:
        "This is why Cause & Effect is more than “do something and something happens.” It is the study of how conditions produce possibilities, how choices move through systems, and how consequences can reinforce or interrupt what comes next.",
    },
  ],
  frameTitle: "THE HERMETIC FRAME",
  frame: [
    "Hermetic Cause & Effect is a philosophical framework. Scientific causality belongs to empirical disciplines that use observation, experimentation, statistical modeling, and other methods to establish causal relationships.",
    "The two can inform one another conceptually. They should not be confused.",
    "The existence of a Hermetic principle does not scientifically prove that every event is predetermined, morally deserved, or spiritually assigned.",
  ],
  frameLines: [
    "A person can experience suffering without having caused it.",
    "A person can benefit from circumstances they did not create.",
    "Systems can constrain choices.",
    "Other people possess agency.",
    "Chance and uncertainty exist.",
  ],
  frameClose:
    "Cause & Effect does not erase these realities. It asks a different question: given the conditions that exist, what forces are producing this outcome — and where, if anywhere, can they be changed?",
  translationTitle: "THE PRACTICAL TRANSLATION",
  translationLede:
    "Stop treating your life as a collection of isolated moments. Begin seeing it as a network of relationships between conditions, choices, actions, effects, and feedback.",
  participates: [
    "Your habits participate in chains.",
    "Your relationships participate in chains.",
    "Your language participates in chains.",
    "Your creative decisions participate in chains.",
    "Your institutions participate in chains.",
    "Your silence participates in chains.",
  ],
  translationClose: [
    "The purpose is not to find someone to blame.",
    "The purpose is to find the structure.",
    "Because if you can see the structure, you can begin to find the lever.",
  ],
};

/* ------------------------------------------------------- 03 · KEY CONCEPTS -- */

export const KEY_CONCEPTS_LEDE =
  "Cause & Effect becomes useful when you can name what you are looking at.";

export const KEY_CONCEPTS = [
  {
    n: "01",
    id: "condition",
    title: "CONDITION",
    teaser: "A circumstance that makes an outcome more or less likely.",
    body: [
      "It is not necessarily the action that produces the effect.",
      "A workplace that rewards constant availability creates a condition in which burnout becomes more likely.",
    ],
    practice: "What conditions are shaping what can happen here?",
  },
  {
    n: "02",
    id: "cause",
    title: "CAUSE",
    teaser: "A factor that contributes to producing an effect.",
    body: [
      "Most meaningful outcomes have more than one.",
      "A single conversation may matter, but so may the history behind it, the surrounding conditions, and what happens afterward.",
    ],
    practice: "What actually contributed to this outcome?",
  },
  {
    n: "03",
    id: "omission",
    title: "OMISSION",
    teaser: "Something not done that nonetheless affects the chain.",
    body: [
      "A boundary never stated. A warning ignored. A conversation postponed. A repair never attempted.",
      "Not every omission is causal, but some are.",
    ],
    practice: "What did not happen that should be included in this chain?",
  },
  {
    n: "04",
    id: "feedback",
    title: "FEEDBACK",
    teaser: "When an effect returns to influence the conditions that produce future effects.",
    body: [
      "Silence creates distance. Distance creates distrust. Distrust creates more silence.",
      "The effect becomes part of the next cause.",
    ],
    practice: "Is this outcome feeding the conditions that recreate it?",
  },
  {
    n: "05",
    id: "delay",
    title: "DELAY",
    teaser: "Some causes do not produce visible effects immediately.",
    body: [
      "A skill practiced for months may suddenly appear as opportunity.",
      "A neglected problem may remain invisible until a threshold is crossed.",
    ],
    practice: "What may already be in motion even though the effect is not visible yet?",
  },
  {
    n: "06",
    id: "intervention",
    title: "INTERVENTION",
    teaser: "A deliberate change introduced into a causal chain.",
    body: [
      "You may not control the entire system. You may control one input.",
      "One boundary. One decision. One behavior. One condition.",
    ],
    practice: "Where can I realistically change the chain?",
  },
];

/* The micro-exhibit beneath the concepts: causality is dynamic, not merely
   linear — the chain returns to a new condition rather than terminating. */
export const CONCEPT_EXHIBIT = [
  { id: "condition", label: "CONDITION", note: "What made this outcome more likely before anyone acted." },
  { id: "cause", label: "CAUSE", note: "The factors that contributed. Usually more than one." },
  { id: "effect", label: "EFFECT", note: "The outcome that became visible." },
  { id: "feedback", label: "FEEDBACK", note: "The effect returning to influence what comes next." },
  { id: "new-condition", label: "NEW CONDITION", note: "The chain does not end. It sets up the next one." },
];

/* ---------------------------------------------------- 04 · WHY IT MATTERS -- */

export const WHY_IT_MATTERS = {
  intro:
    "Most people tell their lives from the level of effects. “I got blindsided.” “It came out of nowhere.” “They changed.” “Everything fell apart.”",
  introClose:
    "Those statements may describe what happened. They rarely explain how it happened. Cause & Effect teaches you to move upstream.",
  panels: [
    {
      t: "IT REVEALS THE STRUCTURE BEHIND THE STORY",
      b: ["You stop looking only at what happened. You begin asking what made it possible."],
    },
    {
      t: "IT SEPARATES AGENCY FROM BLAME",
      b: [
        "Agency asks: where could my choices influence the chain? Blame asks: who deserves responsibility for everything that happened? They are not the same question.",
      ],
      lines: [
        "You can have agency without causing the entire situation.",
        "You can be affected by another person's choices without being responsible for them.",
        "You can inherit a condition without having created it.",
        "You can still have a decision to make inside it.",
      ],
    },
    {
      t: "IT PREVENTS REPEAT COLLAPSES",
      b: [
        "If you only repair the visible effect, the underlying conditions may remain. Change the scenery and the pattern can rebuild itself. Trace the chain and you may discover what actually needs to change.",
      ],
    },
    {
      t: "IT MAKES ACCOUNTABILITY PRACTICAL",
      b: ["Accountability is not endlessly punishing yourself for the past. It is becoming precise enough to say:"],
      lines: [
        "This was outside my control.",
        "This was influenced by others.",
        "This was influenced by me.",
        "This is the part I can change now.",
      ],
      close: "That distinction is power.",
    },
  ],
  /* The four terms the master marks interactive. Distinctions are drawn from
     this module's own copy rather than newly authored definitions. */
  terms: [
    {
      id: "control",
      label: "CONTROL",
      body: "What you can directly determine. Much of a chain sits outside it: systems can constrain choices, other people possess agency, and chance and uncertainty exist. Naming that accurately is precision, not excuse.",
    },
    {
      id: "influence",
      label: "INFLUENCE",
      body: "Where your choices could move the chain without determining it. You can have agency without causing the entire situation.",
    },
    {
      id: "contribution",
      label: "CONTRIBUTION",
      body: "A factor that helped produce the effect. Most meaningful outcomes have more than one, so contribution is rarely the same as fault.",
    },
    {
      id: "intervention",
      label: "INTERVENTION",
      body: "A deliberate change introduced into the chain. You may not control the entire system. You may control one input.",
    },
  ],
  upstream: [
    { k: "VISIBLE EFFECT", v: "What you noticed. Usually the final link." },
    { k: "IMMEDIATE CAUSE", v: "The action or event closest to the outcome." },
    { k: "PATTERN", v: "The repetition that made it durable." },
    { k: "CONDITIONS", v: "What made the outcome likely before anyone acted." },
    { k: "STRUCTURE", v: "The incentives, norms, and history holding the conditions in place." },
  ],
};

/* ------------------------------------------------------------ 05 · DOMAINS -- */

export const DOMAINS_LEDE =
  "Cause & Effect is not confined to personal behavior. It appears wherever conditions, actions, systems, and consequences interact.";

export const DOMAINS = [
  {
    n: "01",
    name: "SELF",
    obs: "Repeated behavior influences repeated states. Sleep, attention, environment, habits, stress, and recovery interact over time.",
    causal: "A repeated input can become part of a repeated outcome.",
    complexity:
      "The same input does not guarantee the same result. Biology, circumstance, genetics, environment, and other variables matter.",
    transfer: "What recurring outcome in your life has recurring inputs?",
  },
  {
    n: "02",
    name: "RELATIONSHIPS",
    obs: "Relational patterns emerge through repeated interactions. Avoidance can create distance. Repair can rebuild trust. Consistency can create predictability.",
    causal: "Small behaviors can accumulate into relational conditions.",
    complexity: "No relationship is controlled by one person alone. Another person's agency remains part of the system.",
    transfer: "What are your repeated actions teaching another person to expect?",
  },
  {
    n: "03",
    name: "LANGUAGE",
    obs: "Words can alter interpretation, attention, emotion, and behavior.",
    causal:
      "A statement can become an input into another person's decisions and into the larger narrative surrounding an event.",
    complexity:
      "Language does not produce identical effects in every context. Meaning depends on audience, history, power, medium, and circumstance.",
    transfer: "What effects are your words designed to produce?",
  },
  {
    n: "04",
    name: "TECHNOLOGY",
    obs: "Digital systems respond to patterns of interaction. Clicks, searches, viewing behavior, sharing, and other signals can influence what systems subsequently present.",
    causal: "Your behavior can become an input into an environment that then shapes your future behavior.",
    complexity:
      "You are not the sole cause of what an algorithm shows you. Platform design, business incentives, other users, and model behavior also matter.",
    transfer: "What are you repeatedly teaching the systems around you to give back?",
  },
  {
    n: "05",
    name: "INSTITUTIONS",
    obs: "Institutions create incentives, permissions, restrictions, and norms.",
    causal: "What gets rewarded can become repeated behavior. What gets tolerated can become normalized.",
    complexity: "Institutional outcomes usually emerge from many interacting actors and historical conditions.",
    transfer: "What behavior does this system reward, and what behavior does it make costly?",
  },
  {
    n: "06",
    name: "ECONOMY & SOCIETY",
    obs: "Economic and social outcomes emerge from policies, incentives, resource flows, historical conditions, collective behavior, and institutional structures.",
    causal: "Structures can reproduce patterns across time.",
    complexity: "A visible outcome rarely has one cause.",
    transfer: "When you see a persistent social outcome, what upstream conditions help reproduce it?",
  },
];

/* -------------------------------------------------------- 06 · RECLAMATION -- */

export const RECLAMATION_CONTENT = {
  title: "When the Archive Becomes a Causal Map",
  context: [
    "The Reclamation world is concerned with what happens when buried history becomes visible.",
  ],
  archive: [
    "Receipts.", "Records.", "Memories.", "Names.",
    "Contracts.", "Messages.", "Choices.", "Consequences.",
  ],
  contextClose: [
    "The archive is not valuable simply because it proves that something happened. It becomes valuable when it helps reveal how something happened.",
    "That is the difference between collecting evidence and understanding a system.",
  ],
  musicTitle: "THE MUSIC AS CAUSAL RECORD",
  musicLede:
    "Across the Reclamation narrative, several tracks work through the movement from hidden cause to visible consequence.",
  tracks: [
    { track: "Welcome To The Fire", note: "establishes the atmosphere of suppression, conflict, and consequence." },
    { track: "Know Your Names", note: "turns chronology into an instrument of accountability, tracing links rather than accepting disconnected narratives." },
    { track: "Demonic Schemes", note: "explores manipulation, distorted perception, and the relational consequences produced by them." },
    { track: "Flowers", note: "examines memory, recognition, erasure, and what remains after something has been carried for too long." },
    { track: "Misguided Priorities", note: "examines the consequences that emerge when control, status, or winning displace healing." },
  ],
  lyric: "This isn't a curse, it's cause and effect.",
  lyricSource: "THE HIEROPHANT",
  analysis: [
    "That line matters because it rejects one kind of explanation. A curse implies that an outcome can be reduced to arbitrary punishment. Cause & Effect asks for a chain.",
  ],
  chainQuestions: [
    "What happened?",
    "What preceded it?",
    "What conditions allowed it?",
    "Who acted?",
    "Who did not act?",
    "Who benefited?",
    "Who absorbed the cost?",
    "What became normalized?",
    "What happened next?",
  ],
  shiftTitle: "THE RECLAMATION SHIFT",
  shift: [
    "Reclamation is not the fantasy that every wrong will automatically be balanced by the universe. It is the decision to stop allowing false narratives to erase causality.",
  ],
  shiftLines: [
    "You do not need to believe that every consequence is deserved to recognize that consequences exist.",
    "You do not need to blame yourself for what others did to identify where you still possess agency.",
    "You do not need revenge to understand a pattern.",
    "And you do not need to control the entire system to change one part of the chain.",
  ],
  /* The four distinctions the master requires this section to establish. */
  distinctions: [
    { a: "AGENCY", b: "BLAME" },
    { a: "CONSEQUENCE", b: "PUNISHMENT" },
    { a: "PATTERN", b: "FATE" },
    { a: "EVIDENCE", b: "REVENGE" },
  ],
  insightLines: [
    "The archive can tell you what happened.",
    "The causal map asks: What produced it?",
    "The intervention asks: What can change now?",
  ],
  insight: "That is where reclamation becomes practical.",
};

/* ---------------------------------------------------------- 07 · 2026 LENS -- */

export const LENS_LEDE = {
  lines: [
    "The systems surrounding you are increasingly responsive.",
    "They watch.",
    "They measure.",
    "They predict.",
    "They adapt.",
    "They feed information back.",
  ],
  close:
    "That means your environment is not merely something you inhabit. In many cases, your behavior becomes one of its inputs.",
};

export const LENS = [
  {
    n: "01",
    name: "ALGORITHMIC AMPLIFICATION",
    now: "Digital platforms use many signals to determine what content receives attention and distribution.",
    question: "What behaviors are being rewarded? What does increased engagement cause the system to do next?",
    complication:
      "The user is not the only causal force. Platform design, business incentives, ranking systems, advertisers, creators, and other users participate in the chain.",
    intervention:
      "Change what you reward. Change what you amplify. Change what you repeatedly consume. Then observe what changes downstream.",
    trace: ["What you watch and share", "Ranking picks it up", "More of it returns", "Your feed narrows", "Change what you amplify"],
  },
  {
    n: "02",
    name: "BURNOUT SYSTEMS",
    now: "Some environments reward constant availability and treat exhaustion as commitment.",
    question: "What policies and incentives repeatedly produce overwork?",
    complication: "Individual habits matter, but they do not explain institutional burnout by themselves.",
    intervention:
      "Trace the conditions. Not only “How do I become more resilient?” but “What is this system repeatedly asking people to do?”",
    trace: ["Always-on availability", "Availability is rewarded", "It becomes the norm", "Capacity falls", "Change what the system asks"],
  },
  {
    n: "03",
    name: "ECONOMIC INEQUALITY",
    now: "Persistent economic differences can emerge from interacting historical policies, access to capital, geography, labor markets, institutions, education, discrimination, and other factors.",
    question: "Which upstream structures reproduce the visible outcome?",
    complication: "A complex social outcome should not be reduced to one cause or one person's choices.",
    intervention: "Identify the structure that must change if a different outcome is desired.",
    trace: ["Historical policy", "Unequal access", "Compounding advantage", "Persistent gap", "Change the structure"],
  },
  {
    n: "04",
    name: "DIGITAL REPUTATION",
    now: "Repeated public behavior can shape how people interpret future actions.",
    question: "What does consistency cause others to expect?",
    complication: "Reputation is influenced by audiences, context, misinformation, platform dynamics, and chance.",
    intervention: "Build patterns rather than relying on isolated performances.",
    trace: ["Repeated public behavior", "Others form expectations", "Future acts read through them", "Reputation hardens", "Build a pattern"],
  },
  {
    n: "05",
    name: "HABIT LOOPS",
    now: "Repeated cues and responses can create behavioral loops.",
    question: "What condition reliably precedes the behavior? What reward keeps it going?",
    complication: "Human behavior is not a perfectly predictable machine.",
    intervention:
      "Change one part of the loop. Change the cue. Change the environment. Change the response. Change the reward. Then observe.",
    trace: ["A cue appears", "The response runs", "A reward lands", "The loop strengthens", "Change one part"],
  },
  {
    n: "06",
    name: "COMMUNITY TRUST",
    now: "Trust can accumulate through repeated transparency, reliability, repair, and accountability. It can also erode through repeated contradiction, secrecy, broken commitments, and unresolved conflict.",
    question: "What repeated conditions are producing the current level of trust?",
    complication: "Communities contain multiple actors with competing histories and interpretations.",
    intervention: "Change one repeated behavior that contributes to the pattern.",
    trace: ["Commitments kept or broken", "The group updates", "Behavior adjusts", "Trust shifts", "Change one repeated behavior"],
  },
];

export const LENS_TRACE_STEPS = ["INPUT", "SYSTEM RESPONSE", "FEEDBACK", "EFFECT", "INTERVENTION"];

export const LENS_SOURCES = {
  label: "Explore Sources",
  body: [
    "These cases are contemporary analogies chosen to build causal literacy — identifying plausible mechanisms, competing explanations, feedback, and intervention points. They are not empirical claims about how any particular platform, market, or institution behaves in every case.",
    "Correlation alone does not establish causation. Where a case touches an evidence-based claim, treat it as a starting frame rather than a citation, and verify specifics against current, qualified sources before acting on them.",
  ],
};

/* --------------------------------------------------------- 08 · REFLECTION -- */

export const REFLECTION_CONTENT = {
  eyebrow: "TRACE WHAT YOU HAVE BEEN CALLING RANDOM.",
  lede: [
    "Think of one recurring outcome in your life.",
    "Not the biggest event you have ever experienced.",
    "Choose something you can actually examine.",
    "Something that repeats.",
    "Something that has a history.",
  ],
  primary: "Where have you been telling an effect story — and what changes when you trace the cause?",
  note: "Do not answer with the version of yourself you wish were true. Answer with evidence.",
  supports: [
    "What outcome have you been describing as mysterious, inevitable, unfair, or random?",
    "What are the earliest three links you can identify in its chain?",
    "What conditions existed before the outcome became visible?",
    "Where did your own agency enter the chain? Include action, inaction, tolerance, or reinforcement.",
  ],
  distinction: ["What was yours?", "What was not yours?", "What remains changeable?"],
  finalPrompt:
    "If you could change only one cause in this chain, which one would give you the greatest leverage?",
  finalPromptTemplate:
    "The outcome I have been calling random is ___. The earliest links I can identify are ___.",
};

/* ----------------------------------------------------------- 09 · PROTOCOL -- */

export const PROTOCOL_PURPOSE = [
  "Stop treating an outcome as an isolated event. Trace the machinery around it.",
  "The goal is not to prove that you caused everything. The goal is to distinguish what happened from what produced it from what you can influence next.",
];

export const PROTOCOL_WHEN = [
  "A pattern keeps repeating.",
  "An outcome feels sudden.",
  "You are preparing to rebuild something that previously collapsed.",
  "You are stuck asking “Why me?”",
  "You need to identify where intervention is possible.",
];

/* The four buckets Step 05 divides the chain into. Kept as separate stored
   fields so "uncertain" stays a real answer rather than an empty one. */
export const AGENCY_BUCKETS = [
  { id: "agencyOutside", label: "OUTSIDE MY CONTROL", ph: "What no decision of mine could have determined." },
  { id: "agencyMine", label: "INFLUENCED BY ME", ph: "Where my action, inaction, or tolerance moved the chain." },
  { id: "agencyOthers", label: "INFLUENCED BY OTHERS", ph: "Choices other people made, which remain theirs." },
  { id: "agencyUncertain", label: "UNCERTAIN", ph: "What you genuinely cannot attribute yet." },
];

export const PROTOCOL_STEPS = [
  {
    id: "effect",
    n: "01",
    t: "NAME THE EFFECT",
    d: "Describe the outcome in one concrete sentence. Do not explain it yet. Name it.",
    ph: "I keep ending up in projects where the scope quietly doubles.",
    workspace: "1 · WHAT EFFECT AM I TRACING?",
  },
  {
    id: "timeline",
    n: "02",
    t: "EXTEND THE TIMELINE",
    d: "When did the earliest signs appear? Look backward. What happened before the outcome became undeniable?",
    ph: "The first extra request came in week two. I said yes without asking what it displaced.",
  },
  {
    id: "causes",
    n: "03",
    t: "IDENTIFY VISIBLE CAUSES",
    d: "List the actions, decisions, conditions, and events you can reasonably connect to the outcome. Do not force certainty — use language such as “contributed to” when the relationship is plausible but not proven.",
    ph: "Accepting changes without renegotiating the deadline contributed to the overload.",
    workspace: "2 · WHAT CONDITIONS, CAUSES, OMISSIONS, AND FEEDBACK HAVE BEEN BUILDING IT?",
  },
  {
    id: "omissions",
    n: "04",
    t: "IDENTIFY OMITTED CAUSES",
    d: "What did not happen? What conversation was postponed? What boundary was never established? What warning was ignored? What repair was avoided? An omission belongs on the map when it plausibly altered the chain.",
    ph: "I never stated a scope limit in writing.",
  },
  {
    id: "agency",
    n: "05",
    t: "SEPARATE AGENCY FROM BLAME",
    d: "Divide the chain into four. Not everything in the chain belongs to you. Not everything outside your control is irrelevant. The purpose is precision.",
    buckets: AGENCY_BUCKETS,
  },
  {
    id: "feedback",
    n: "06",
    t: "IDENTIFY THE FEEDBACK",
    d: "Did the effect become part of the next cause? For example: avoidance → conflict → distrust → more avoidance. Or: practice → competence → opportunity → more practice. Look for the loop.",
    ph: "Absorbing the extra scope proved I would absorb it, so more arrived.",
  },
  {
    id: "lever",
    n: "07",
    t: "FIND ONE LEVER",
    d: "You do not need to control the whole system. Choose one point you can realistically influence: a behavior, a boundary, a decision, a condition, a conversation, a habit, a signal.",
    ph: "The moment a new request arrives, before I answer.",
    workspace: "3 · WHAT ONE LEVER WILL I CHANGE?",
  },
  {
    id: "newCause",
    n: "08",
    t: "DESIGN A DIFFERENT CAUSE",
    d: "Write one specific action that would alter the chain when the pattern appears again. Make it observable. Not “I will do better,” but “When X happens, I will do Y.”",
    ph: "When a new request arrives, I will name what it displaces before agreeing to it.",
  },
];

export const WORKED_EXAMPLE = [
  { k: "NAMED EFFECT", v: "“I keep ending up in relationships where my needs are not considered.”" },
  {
    k: "TIMELINE",
    v: "Early signs appeared long before the relationship ended. I regularly said “yes” when I meant “no.” I avoided difficult conversations. I overfunctioned to maintain peace. I interpreted discomfort as something I needed to solve rather than information I needed to examine.",
  },
  {
    k: "VISIBLE CAUSES",
    v: "I accepted behavior that repeatedly left my needs unmet. I did not communicate clearly enough. I stayed after patterns became visible.",
  },
  {
    k: "OMITTED CAUSES",
    v: "I did not state my needs early. I did not ask whether the other person had the capacity to reciprocate. I did not treat repeated dismissal as meaningful information.",
  },
  {
    k: "AGENCY",
    v: "Some of the relationship's behavior was outside my control. My own boundaries and decisions were not.",
  },
  {
    k: "FEEDBACK",
    v: "Silence reduced immediate conflict. Reduced conflict made silence easier. The pattern became normal.",
  },
  { k: "ONE LEVER", v: "State needs early and observe the response." },
  {
    k: "DESIGNED CAUSE",
    v: "“When an important need appears, I will communicate it directly rather than hoping the other person will infer it. I will treat repeated dismissal as information about the relationship rather than as a problem I must personally solve.”",
  },
];

/* ----------------------------------------------------------- 10 · ARTIFACT -- */

export const ARTIFACT_LEDE = [
  "You are not creating a confession.",
  "You are creating a record.",
  "A map of one system you were willing to examine closely.",
];

export const ARTIFACT_STAGES = [
  {
    n: "01",
    stage: "IDENTIFY",
    fields: [{ id: "outcome", label: "NAMED OUTCOME", q: "What effect are you mapping?" }],
  },
  {
    n: "02",
    stage: "OBSERVE",
    fields: [
      { id: "timeline", label: "TIMELINE", q: "When did the first signs appear? What changed over time?" },
    ],
  },
  {
    n: "03",
    stage: "MAP",
    fields: [
      { id: "causes", label: "CONDITIONS & CAUSES", q: "What visible causes entered the chain? What conditions shaped the outcome?" },
      { id: "omissions", label: "OMITTED CAUSES", q: "What omissions mattered?" },
      { id: "agency", label: "AGENCY", q: "What was outside your control, influenced by you, influenced by others, and what remains uncertain?" },
    ],
  },
  {
    n: "04",
    stage: "INTERPRET",
    fields: [
      { id: "feedback", label: "FEEDBACK", q: "Did the effect become part of the next cause?" },
      { id: "pattern", label: "MY PATTERN", q: "How do you tend to move through this system?", generated: true },
    ],
  },
  {
    n: "05",
    stage: "APPLY",
    fields: [
      { id: "lever", label: "MY LEVER", q: "What one point can you realistically influence?" },
      { id: "newCause", label: "MY DESIGNED CAUSE", q: "What one cause will you change the next time this pattern appears?" },
    ],
  },
  {
    n: "06",
    stage: "INTEGRATE",
    fields: [
      {
        id: "evidence",
        label: "WHAT I WILL WATCH FOR",
        q: "What observable evidence would tell you the chain is beginning to change? Do not promise an outcome — define what you will watch.",
      },
      { id: "notes", label: "NOTES TO FUTURE ME", q: "What do you want to remember the next time this pattern begins?" },
    ],
  },
];

export const PATTERN_STATEMENT_TEMPLATE =
  "When I move through this system, I tend to ________, which contributes to ________, and eventually produces ________.";

/* ------------------------------------------------------------ 11 · SUMMARY -- */

export const SUMMARY_CONTENT = {
  principleLines: [
    "Effects do not exist in isolation.",
    "They emerge through conditions, choices, actions, omissions, relationships, systems, and feedback.",
  ],
  principleClose:
    "The useful question is not simply “What happened?” It is “What helped produce it?” And then: “Where can I intervene?”",
  learned: [
    "Visible effects are often the final link in a longer chain.",
    "Conditions shape what becomes possible.",
    "Omissions can matter when what was not done changes the chain.",
    "Effects can become causes through feedback.",
    "Complex outcomes rarely have one cause.",
    "Agency does not mean responsibility for everything.",
    "A causal map becomes useful when it reveals an intervention point.",
  ],
  discovered: [
    { id: "outcome", label: "THE EFFECT I TRACED" },
    { id: "causes", label: "THE CAUSES I NAMED" },
    { id: "agency", label: "THE AGENCY I IDENTIFIED" },
    { id: "lever", label: "THE LEVER I CHOSE" },
  ],
  carryForwardTitle: "CARRY FORWARD",
  carryForwardLede:
    "For the next seven days, choose one recurring outcome. When it appears, record:",
  carryForward: [
    "What happened?",
    "What cause can I see now?",
    "What condition was already present?",
    "What part was outside my control?",
    "What part can I influence?",
    "What lever am I willing to move?",
  ],
  carryForwardClose: [
    "You are not rewriting the past.",
    "You are not pretending that everything was your fault.",
    "You are learning to see the machinery clearly enough to participate differently in what comes next.",
  ],
  reclamationQuestion:
    "What outcome are you ready to stop calling random — and what cause are you willing to examine?",
};

/* The master requires progress to represent meaningful learning, and names the
   minimum condition for each section. `engagement` is the flag the experience
   must set; `visit` sections complete on being read. */
export const COMPLETION_CONDITIONS = [
  { id: "intro", kind: "visit", label: "Intro encountered" },
  { id: "principle", kind: "visit", label: "Principle viewed" },
  { id: "key-concepts", kind: "engagement", label: "Concepts engaged" },
  { id: "why-it-matters", kind: "visit", label: "Why It Matters viewed" },
  { id: "domains", kind: "engagement", label: "Domain engaged" },
  { id: "reclamation", kind: "visit", label: "Reclamation viewed" },
  { id: "2026-lens", kind: "engagement", label: "Contemporary case engaged" },
  { id: "reflection", kind: "input", label: "Substantive response saved" },
  { id: "protocol", kind: "input", label: "Causal Trace completed" },
  { id: "artifact", kind: "input", label: "Causal Pattern Map saved" },
  { id: "summary", kind: "visit", label: "Summary reviewed" },
];

export const COMPLETION_STATES = [
  "REFLECTION RECORDED",
  "CAUSAL TRACE COMPLETED",
  "CAUSAL PATTERN MAP SAVED",
  "ARTIFACT ADDED TO MY ARTIFACTS",
];
