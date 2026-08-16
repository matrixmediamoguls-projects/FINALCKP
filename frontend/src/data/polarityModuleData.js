/* Reclamation University — Hermetic Hall — Module IV: Polarity
 * Structured content consumed by PolarityModuleExperience.jsx. One entry per
 * id in curriculumSections.js — the section ids are the contract; do not
 * rename them here without updating that file too. */

export const POLARITY_META = {
  numeral: "IV",
  title: "POLARITY",
  subtitle: "The Distance Between Two Things May Be Smaller Than You Think.",
  law: "The Fourth Hermetic Law",
  estimatedTime: "25–40 min",
};

export const PRINCIPLES = [
  { n: "I", name: "MENTALISM", k: "mentalism", state: "COMPLETE" },
  { n: "II", name: "CORRESPONDENCE", k: "correspondence", state: "COMPLETE" },
  { n: "III", name: "VIBRATION", k: "vibration", state: "COMPLETE" },
  { n: "IV", name: "POLARITY", k: "polarity", state: "IN PROGRESS" },
  { n: "V", name: "RHYTHM", k: "rhythm", state: "LOCKED" },
  { n: "VI", name: "CAUSE & EFFECT", k: "cause", state: "LOCKED" },
  { n: "VII", name: "GENDER", k: "gender", state: "LOCKED" },
];

export const INTRO_CONTENT = {
  question: "What if the quality you are trying to escape is not your opposite — but a position you can move from?",
  paragraphs: [
    "You can be certain in the morning and doubtful by noon. You can feel close to someone, then resentful, then close again. You can call yourself disciplined for three weeks, miss two days, and decide you were never disciplined at all.",
    "Most people experience these shifts as evidence that something is wrong with them. They treat each state as a separate identity: “I am confident.” “I am insecure.” “I am motivated.” “I am lazy.” But life rarely divides itself that cleanly.",
    "A dim room is not the opposite of a bright room — it contains less light. Warm water is not the opposite of hot water — it occupies a different point on the same scale. Courage and fear can exist in the same person at the same time; one may simply be exerting more influence in a particular moment.",
  ],
  spectrum: { left: "COLD", right: "HOT", microLabel: "OPPOSITES MAY BE SEPARATED BY DEGREE, NOT BY NATURE." },
  hardRule: "The continuum is a tool for examining relationships between conditions. It is not permission to flatten differences. Harm and safety are not interchangeable. Truth and deception are not the same. Boundaries matter.",
};

export const PRINCIPLE_CONTENT = {
  title: "The Law of Polarity",
  quote: "Everything is Dual; everything has poles; everything has its pair of opposites; like and unlike are the same; opposites are identical in nature, but different in degree; extremes meet; all truths are but half-truths; all paradoxes may be reconciled.",
  paragraphs: [
    "The fourth Hermetic Principle presents many apparent opposites as expressions of the same thing at different degrees. Hot and cold both describe temperature. Loud and quiet both describe sound. Near and far both describe distance. The poles are real. The difference matters. But the poles belong to one scale.",
    "The philosophical move is not to pretend that every contrast disappears. It is to ask a better question: what continuum am I actually standing on? Language can turn a temporary position into an identity — “I am failing,” “I am unlovable,” “I am too much” — and compress a changing situation into a total judgment. Polarity asks you to separate the condition from the conclusion.",
  ],
  translation: {
    from: "How do I become the complete opposite of who I am?",
    to: "What is one degree in the direction I want to move?",
  },
  examples: [
    { left: "FEAR", mid: "COURAGE", right: "CONFIDENCE" },
    { left: "WITHDRAWAL", mid: "CONNECTION", right: "CLOSENESS" },
  ],
  sources: {
    label: "Sources / Context",
    body: [
      "Hermetic Polarity is a philosophical framework, drawn from The Kybalion (1908) and the wider Hermetic tradition. It is not a scientific theory.",
      "Scientific continua, gradients, and measurable scales can be useful analogies for the principle; they do not scientifically prove Hermetic philosophy. Discernment belongs in the practice — a continuum is not an excuse to flatten moral, legal, factual, or safety differences.",
    ],
  },
};

export const KEY_CONCEPTS = [
  {
    n: "01",
    title: "OPPOSITES CAN SHARE A CONTINUUM",
    teaser: "Many things that feel mutually exclusive are different degrees of one underlying condition.",
    body: [
      "A continuum does not deny difference. It explains relationship.",
      "Consider trust. You can be guarded, tentative, open, or deeply trusting. These are meaningfully different experiences, but they can all describe changing degrees of vulnerability and reliance.",
    ],
    practice: "When you use an either/or label, ask: “What is the scale between these two positions?”",
  },
  {
    n: "02",
    title: "EXTREMES DISTORT YOUR OPTIONS",
    teaser: "When you only see two poles, you may miss every useful choice between them.",
    body: [
      "“All in” or “give up.” “Say nothing” or “start a fight.” “Work constantly” or “do nothing.”",
      "These are often not the only options. They are the options that become visible when pressure narrows perception.",
    ],
    practice: "Before choosing between two extremes, name three middle positions you have not considered.",
  },
  {
    n: "03",
    title: "A STATE IS A POSITION, NOT A PRISON",
    teaser: "What is dominant now can change without you becoming a different person.",
    body: [
      "A state can have history. It can have momentum. It can be difficult to shift. But difficulty is not the same thing as permanence.",
      "If irritation is active, your task is not to prove you are secretly peaceful. Your task is to identify the next available degree of steadiness before irritation determines the entire interaction.",
    ],
    practice: "Replace “I am ___” with “___ is active in me right now.”",
  },
  {
    n: "04",
    title: "INTEGRATION IS NOT COMPROMISE",
    teaser: "Holding two truths at once can produce a more accurate response than choosing one and denying the other.",
    body: [
      "You can love someone and need a boundary. You can be grateful for an opportunity and recognize it is costing too much. You can want growth and need rest.",
      "Integration does not mean accepting contradiction without thought. It means refusing false choices when reality contains more than one truth.",
    ],
    practice: "Complete: “Both ___ and ___ are true. What response honors both?”",
  },
];

export const WHY_IT_MATTERS = {
  intro: "Most people do not get trapped because they lack information. They get trapped because their language gives them only two places to stand — “I either fix everything now or I have failed,” “I either trust completely or trust no one.” If the ideal pole is unavailable, the other pole starts to feel inevitable. Polarity gives you back the middle — not as mediocrity, but as movement.",
  panels: [
    { t: "IT INTERRUPTS ALL-OR-NOTHING THINKING", b: ["A mistake becomes proof that you are incompetent. A hard day becomes proof that nothing is changing. Polarity asks: “What degree is actually true?” That question is more accurate. Accuracy creates options."] },
    { t: "IT MAKES CHANGE SMALL ENOUGH TO BEGIN", b: ["You do not need to travel from avoidance to perfect courage before acting. Send the first email. Ask the first question. Name the first boundary. A one-degree shift can be repeated — repetition turns a small correction into a direction."] },
    { t: "IT PREVENTS FALSE PEACE", b: ["Not every middle position is wise. Sometimes “balance” is used to avoid a necessary decision or excuse a harmful pattern. The question is not how to make both sides comfortable — it is what is actually true, and what movement that truth requires."] },
    { t: "IT RESTORES AGENCY WITHOUT DENYING REALITY", b: ["You may not be able to change the person, the system, or the deadline. But you can often locate the degree of response that remains available to you — not total control, not helplessness, a usable point of influence."] },
  ],
  process: [
    { k: "LABEL", v: "“I am failing.” A total judgment replaces a specific observation." },
    { k: "POLE", v: "The extreme the mind reaches for under pressure." },
    { k: "CONTINUUM", v: "What is working, strained, unfinished, improving, or changing?" },
    { k: "NEXT DEGREE", v: "What small movement is available now?" },
    { k: "CHOICE", v: "Take the action that matches the evidence." },
  ],
};

export const DOMAINS = [
  { n: "01", name: "BIOLOGY",
    obs: "Many biological measures exist across ranges rather than as simple on/off conditions: body temperature, blood pressure, blood glucose, arousal, fatigue, and pain intensity.",
    pat: "A body can move gradually toward strain before it reaches an obvious crisis.",
    why: "If you only notice “fine” and “not fine,” you may miss earlier signals that make care, rest, or support possible.",
    prac: "Ask: “What is this changing in — intensity, duration, or direction?”" },
  { n: "02", name: "PSYCHOLOGY",
    obs: "Emotions vary in intensity, duration, and influence. A feeling can be present without becoming the only thing that is true.",
    pat: "When people label themselves by their strongest current state, they can confuse a condition with identity.",
    why: "“I am anxious” can become “Anxiety is active, and I can respond to it” — a shift that creates room for support, regulation, and choice.",
    prac: "Name the feeling, rate its intensity 1–10 if useful, then ask: “What would move this one degree in a safer direction?”" },
  { n: "03", name: "TECHNOLOGY",
    obs: "Digital platforms often present binary choices: like/dislike, follow/unfollow, block/allow, online/offline.",
    pat: "The interface can make complex social decisions feel as if they have only two possible outcomes.",
    why: "You may have more options than the platform displays: mute, limit, pause, clarify, archive, set a boundary, leave quietly.",
    prac: "Ask: “What human option exists outside this interface?”" },
  { n: "04", name: "ORGANIZATIONS",
    obs: "Teams often frame decisions as speed versus quality, autonomy versus accountability, innovation versus stability.",
    pat: "A false binary can produce predictable dysfunction: rushed work, stalled work, unowned work, overcontrolled work.",
    why: "Good systems do not erase tension. They create processes capable of holding competing needs in view.",
    prac: "When a team says “we have to choose,” ask what process would represent both needs without pretending they are identical." },
  { n: "05", name: "ECONOMICS",
    obs: "Economic behavior can swing between confidence and fear. Headlines and urgency can make one emotional pole feel like the whole reality.",
    pat: "Emotional intensity can be mistaken for complete information.",
    why: "Neither optimism nor caution is automatically rational — the question is whether the degree of confidence matches the evidence.",
    prac: "Before a consequential decision, write what supports confidence and what requires caution, then name what would change your view." },
  { n: "06", name: "MUSIC",
    obs: "Music creates meaning through contrast: tension and release, loud and soft, consonance and dissonance, density and space.",
    pat: "A song does not eliminate one pole to make the other meaningful. It arranges their relationship across time.",
    why: "Unresolved tension becomes meaningful when it is placed, developed, and answered with intention — music makes Polarity audible.",
    prac: "Listen to a track you know well. Identify a moment of tension and release. Ask what makes the transition feel earned." },
];

export const RECLAMATION_CONTENT = {
  context: [
    "Reclamation is not a story about becoming untouched by contradiction. It is a story about refusing the lie that a person must choose one permanent version of themselves.",
    "The inherited self says: “You are either what happened to you or you are pretending it did not happen.” “You are either wounded or strong.” “You are either accepted or alone.” Reclamation begins when those categories lose their authority.",
  ],
  lyric: "The prism did not destroy the light. It showed what the light was already carrying.",
  analysis: [
    "A prism appears to divide one beam into many colors. But it does not create separate lights from nothing — it reveals a spectrum already carried by the beam.",
    "You are not required to choose between every part of yourself as if one must cancel the other. The disciplined part and the exhausted part. The visionary part and the doubtful part. The part that wants to be witnessed and the part that learned to hide. These are not automatically enemies — they may be signals from different points in the same human field, each carrying information, each requiring interpretation.",
  ],
  insight: "Polarity is not about becoming neutral. It is about becoming precise enough to say: “This is real. Its opposite is also real. I do not have to be split by either one.” That is not indecision. It is the beginning of integration.",
};

export const LENS = [
  { n: "01", name: "ALGORITHMIC CERTAINTY",
    now: "Search, recommendation, and generative systems can return one clean answer to questions that contain uncertainty, context, and competing values.",
    herm: "A polished answer can make one pole appear complete while obscuring the range of possibilities outside the frame.",
    prac: "When an answer arrives with total confidence, ask what assumptions, exceptions, or alternative interpretations sit outside that frame." },
  { n: "02", name: "ONLINE OUTRAGE LOOPS",
    now: "Platforms reward fast reactions. Complex events are often compressed into heroes/villains, agreement/betrayal, for us/against us.",
    herm: "A false binary can create emotional certainty while reducing actual understanding.",
    prac: "Before sharing or responding, separate what happened, what you infer, and what you feel. They may be related. They are not identical." },
  { n: "03", name: "PRODUCTIVITY IDENTITY",
    now: "Many people judge themselves through a binary of productive versus worthless. Rest can then feel like failure while exhaustion becomes evidence of commitment.",
    herm: "Effort and recovery are not enemies. They are different requirements inside sustainable performance.",
    prac: "Replace “Was I productive today?” with “What did I move forward, and what did I restore?”" },
  { n: "04", name: "DIGITAL IDENTITY",
    now: "Online profiles reward a stable, legible persona. People can feel pressure to become a brand — always certain, always coherent, always available.",
    herm: "A visible identity is a snapshot, not the entire continuum of a person.",
    prac: "Do not let the version of you that performs best online become the only version allowed to exist." },
  { n: "05", name: "MENTAL-HEALTH LANGUAGE",
    now: "Clinical and therapeutic terms are increasingly used in everyday speech, sometimes helpfully and sometimes as total labels for self or others.",
    herm: "A label can clarify a real pattern. It can also harden a complex experience into an identity.",
    prac: "Use language that increases accuracy and access to support. If you are in distress, seek qualified care — “degree” is never a reason to minimize serious risk." },
  { n: "06", name: "CREATIVE AI AND ORIGINALITY",
    now: "Generative tools have intensified a familiar question, often framed as human/machine, original/derivative, authentic/artificial.",
    herm: "The more useful questions concern degree, authorship, intention, disclosure, and responsibility — not a single incompatible pole.",
    prac: "Ask what decisions remained yours, what material was transformed, what was disclosed, and what relationship the work creates with its audience." },
];

export const LENS_SOURCES = {
  label: "Explore Sources",
  body: [
    "These six domains are Layer 2 — Contemporary Analogy: modern situations chosen to help you think with the Polarity principle, not empirical claims about how algorithms, platforms, or institutions work in every case.",
    "Where a domain touches an evidence-based claim (e.g. mental-health language, algorithmic behavior), treat it as a starting frame, not a citation — verify specifics against current, qualified sources before acting on them.",
  ],
};

export const REFLECTION_CONTENT = {
  primary: "Where have you been treating a position on a spectrum as a permanent identity — and what becomes possible when you name the next degree instead?",
  supports: [
    "What labels do you use when you are under pressure?",
    "Where do you tend to see only two options — in relationships, work, your body, your creativity, your money, or your self-image?",
    "What is true about both sides of the conflict?",
    "What would a one-degree movement look like this week? Make it observable, not aspirational.",
  ],
  finalPromptTemplate: "I do not need to become the opposite of myself. I need to move from ___ toward ___ by ___.",
};

export const PROTOCOL_WHEN = [
  "When you hear “always,” “never,” “everything,” or “nothing”",
  "When one mistake becomes proof of a total identity",
  "Before a decision driven by panic, resentment, shame, or urgency",
  "When a relationship feels trapped between silence and explosion",
  "When you think, “If I cannot do it perfectly, there is no point starting”",
];

export const PROTOCOL_STEPS = [
  { id: "poles", n: "01", t: "NAME THE POLES", d: "What are the two extremes your mind is presenting? Be specific — not “everything is terrible,” but the exact either/or your mind is offering you.", ph: "I am telling myself I must solve this completely today, or I am failing." },
  { id: "continuum", n: "02", t: "FIND THE CONTINUUM", d: "What shared condition are these extremes actually describing? Naming the continuum loosens the false choice.", ph: "Success and failure may both be describing progress toward the objective." },
  { id: "degree", n: "03", t: "LOCATE YOUR ACTUAL DEGREE", d: "Where are you really, based on evidence — not the best-case story, not the worst-case story. Use a 1–10 scale if useful. You are locating your position, not your worth.", ph: "A strong concept, two unfinished sections, a mix that needs revision." },
  { id: "bothTruths", n: "04", t: "NAME BOTH TRUTHS", d: "Complete: “It is true that ___. It is also true that ___.” This prevents false peace and false certainty.", ph: "It is true that I am exhausted. It is also true that one unfinished task does not make the whole project impossible." },
  { id: "movement", n: "05", t: "CHOOSE ONE DEGREE OF MOVEMENT", d: "Choose a response that moves you one degree toward the condition you want to strengthen. Make it observable, not aspirational.", ph: "I will state one boundary without attacking the other person." },
  { id: "evidence", n: "06", t: "RECORD THE EVIDENCE", d: "After you act, notice what changed. Did the problem disappear? Maybe not. Did you prove you can move without waiting for a perfect emotional state? That matters.", ph: "The urge to switch tasks stayed strong for ten minutes, then eased once I removed the phone." },
];

export const WORKED_EXAMPLE = [
  { k: "RECURRING THOUGHT", v: "“If I cannot make this creative project excellent, I should not release it.”" },
  { k: "THE POLES", v: "Perfect work or worthless work." },
  { k: "THE CONTINUUM", v: "Quality, development, and readiness relative to the intended release." },
  { k: "ACTUAL DEGREE", v: "A strong concept, two unfinished sections, and a mix that needs revision — not complete, and not worthless." },
  { k: "BOTH TRUTHS", v: "“It is true that I want this work to represent me well. It is also true that waiting for absolute certainty will not finish it.”" },
  { k: "ONE-DEGREE MOVE", v: "Schedule a 45-minute revision session for one unfinished section and send one reference track to the mixing engineer." },
];

export const SUMMARY_CONTENT = {
  learned: [
    "Opposites can be real while still belonging to one continuum.",
    "All-or-nothing thinking can hide the middle positions where practical choice lives.",
    "A current state is a position, not a permanent identity.",
    "Holding two truths can be more accurate than forcing a false choice.",
    "Durable change can begin with one observable degree of movement.",
  ],
  carryForward: "When you feel forced to choose between two total identities, pause and ask: “What is the continuum here — and what is one degree I can move?” You do not need to become the opposite of yourself to change your life. You need a truer location, a usable direction, and evidence that you can move.",
};
