// Lesson prose lives in per-lesson JSON so that reading or grepping this
// module does not pull the entire module's authored content along with it.
// Edit the JSON files under ./hermetic/vibration/ to change lesson content.
import lesson31 from "./hermetic/vibration/lesson-3-1.json";
import lesson32 from "./hermetic/vibration/lesson-3-2.json";
import lesson33 from "./hermetic/vibration/lesson-3-3.json";
import lesson34 from "./hermetic/vibration/lesson-3-4.json";
import lesson35 from "./hermetic/vibration/lesson-3-5.json";
import lesson36 from "./hermetic/vibration/lesson-3-6.json";

const MODULE_META = {
  id: "mod-3",
  number: 3,
  designation: "RU-HM-707-M3",
  title: "VIBRATION",
  subtitle: "SIGNAL INTEGRITY",
  law: "The Third Hermetic Law",
  lawStatement: "Nothing rests; everything moves; everything vibrates.",
  stage: "Voice",
  discipline: "Signal Architecture",
  seal: "SIGNAL ONLINE",
  sealColor: "#cc1a1a",
  centralQuestion: "What am I transmitting, and is that transmission coherent with who I claim to be?",
  modernApplication: "Communication, emotional regulation, synthetic media, and coherent identity",
  primaryTrack: "I Am the Signal",
  supportingTracks: ["Reclamation", "The Whole Cost of You"],
  modernOutcome: "My signal is deliberate, attributable, and recognizable across words, actions, and time.",
  totalLessons: 6,
  estimatedTime: "4\u20136 hours",
  act: "ACT III \u2014 RECLAMATION",
  course: "THE HERMETIC MATRIX"
};
const LESSONS = [lesson31, lesson32, lesson33, lesson34, lesson35, lesson36];
const TRACKS = [
  {
    id: "track-signal",
    title: "I Am The Signal",
    artist: "MUSIQ MATRIX",
    role: "primary",
    description: "The primary track for Module 3. Contrasts authentic signal with suppression programming and presents coherence as a form of protection and return to center.",
    hermeticMechanism: "Law of Vibration \u2014 the distinction between an authentic signal and absorbed foreign frequency; coherence as protection against incoherent interference.",
    shadowExpression: "Absorption of environmental noise as personal truth; suppression routine mistaken for authentic self; low-voltage living that contradicts a high-voltage mission.",
    lightExpression: "Coherence as warfare; signal recovery through grounding and intentional transmission; recognition that the signal was never lost \u2014 only temporarily obscured.",
    modernRelevance: "In the age of emotional contagion, algorithmic curation, and synthetic media, maintaining a distinct, coherent signal is both a personal sovereignty practice and a form of cultural contribution.",
    lyrics: [
      { id: "sig-1", text: "Bone-deep tired not from sleepin'", annotation: "Opens with exhaustion that is not physical but frequency-based \u2014 the cost of carrying foreign signal." },
      { id: "sig-2", text: "On fire while the world kept creepin'", annotation: "Contrast: internal activation vs. external stagnation. The signal was running even when the world did not reflect it." },
      { id: "sig-3", text: "Found this frequency wasn't luck, it was physics", annotation: "Reclaims the discovery of authentic frequency as law, not accident." },
      { id: "sig-4", text: "Vibrational coordinates, call it cosmic logistics", concept: "Hermetic Vibration" },
      { id: "sig-5", text: "Didn't stumble here was called here" },
      { id: "sig-6", text: "Through static and signal, through the drift and the fallout year", annotation: "The drift \u2014 moving away from authentic frequency under environmental pressure \u2014 is named as a condition, not a verdict." },
      { id: "sig-7", text: "Absorbed what was foreign their fears became the wiring", annotation: "Core doctrine of this lesson: foreign emotional material absorbed and mistaken for authentic signal.", concept: "Emotional Contagion" },
      { id: "sig-8", text: "Low voltage living while a high-voltage mission's firing", annotation: "The gap between suppressed output and underlying capacity. Suppression does not eliminate the signal \u2014 it contains it." },
      { id: "sig-9", text: "Every scar was a coordinate sealed" },
      { id: "sig-10", text: "Every locked door a blueprint concealed" },
      { id: "sig-11", text: "Two programs runnin' in the same machine", annotation: "The simultaneous operation of authentic signal and suppression routine.", concept: "Signal Suppression" },
      { id: "sig-12", text: "Authentic signal versus the suppression routine" },
      { id: "sig-13", text: "Broadcasting muted for the sake of survival", annotation: "Names suppression as survival adaptation \u2014 not failure, not weakness." },
      { id: "sig-14", text: "But the window just cracked open this is the arrival" },
      { id: "sig-15", text: "An underground tremor rising through the ground", annotation: "The signal that has been suppressed builds pressure. Recovery is not performance \u2014 it is structural." },
      { id: "sig-16", text: "A star that traveled thousands of years finally found" },
      { id: "sig-17", text: "A Sovereign crown wrestles the waiting season to the ground." },
      { id: "sig-18", text: "I am the signal", concept: "Signal Identity", annotation: "The declaration of identity as frequency \u2014 not role, not credential, not performance." },
      { id: "sig-19", text: "I am the frequency," },
      { id: "sig-20", text: "I am the sound." },
      { id: "sig-21", text: "Can't suppress what was never meant to stay bound" },
      { id: "sig-22", text: "I don't chase the light, I channel it through the ground." },
      { id: "sig-23", text: "Alive and on frequency" },
      { id: "sig-24", text: "I am the source code expressed explicitly" },
      { id: "sig-25", text: "That pressure behind the sternum a seismic rupture breaking through", annotation: "Locates signal activation in the body \u2014 the felt sense of authentic frequency before it becomes language." },
      { id: "sig-26", text: "Tectonic weight of a purpose older than you" },
      { id: "sig-27", text: "Coherence is the warfare don't fight just stand tall", annotation: "Central doctrine: coherence as a form of power. The regulated, aligned signal is harder to destabilize than the reactive one.", concept: "Coherence" },
      { id: "sig-28", text: "Incoherent energy can't find a match" },
      { id: "sig-29", text: "When the signal runs this clean nothing dark can attach", annotation: "Signal integrity as protection \u2014 not because darkness avoids light, but because coherence does not provide the interference pattern that dissonance requires." },
      { id: "sig-30", text: "Hands on the heart before the world begins", annotation: "The pre-transmission reset. Physiological grounding before output.", concept: "Pre-Transmission Reset" },
      { id: "sig-31", text: "Breathing in the field raw intelligence" },
      { id: "sig-32", text: "Awake / Aligned" },
      { id: "sig-33", text: "Frequency is the protection" },
      { id: "sig-34", text: "One breath observer back to center" },
      { id: "sig-35", text: "The drift dissolves re-enter", annotation: "The drift \u2014 movement away from authentic frequency \u2014 is temporary and reversible. Return is always possible." },
      { id: "sig-36", text: "Never needed permission" },
      { id: "sig-37", text: "This is the mission" },
      { id: "sig-38", text: "The signal was never lost", annotation: "Final declaration: suppression is not elimination. The signal survives every attempt at erasure.", concept: "Signal Recovery" },
      { id: "sig-39", text: "The world just finally tuned in" },
      { id: "sig-40", text: "A sovereign crown" },
      { id: "sig-41", text: "A tremor underground" },
      { id: "sig-42", text: "Always on frequency. Always unbound." }
    ]
  },
  {
    id: "track-reclamation",
    title: "Reclamation",
    artist: "MUSIQ MATRIX",
    role: "supporting",
    description: "Presents voice as a power that cannot be confiscated. Describes language as capable of reshaping the surrounding field. Used in Lesson 3.4 \u2014 Voice as Code.",
    hermeticMechanism: "Law of Vibration \u2014 voice as a frequency that reshapes its environment. The suppressed signal does not disappear; it amplifies under compression until release becomes structural inevitability.",
    shadowExpression: "Silence under systematic pressure; allowing external systems to define the terms of one's existence; mistaking imposed silence for acceptance.",
    lightExpression: "Voice recovery as sovereign act; the cage amplifies the call rather than silencing it; testimony as structural force.",
    modernRelevance: "In an environment of narrative suppression, platform deplatforming, and institutional silencing, the deliberate use of voice as documentation and testimony is a primary act of signal integrity.",
    lyrics: [
      { id: "rec-1", text: "They can chain your body,", annotation: "Opens with the limits of physical suppression \u2014 the voice remains sovereign even under physical constraint." },
      { id: "rec-2", text: "But they'll never chain your truth." },
      { id: "rec-3", text: "The Chamber is closing, Musiq." },
      { id: "rec-4", text: "The lock was never on you." },
      { id: "rec-5", text: "Two months in a box, no process, no plea,", annotation: "Testimony \u2014 the naming of specific conditions. Precision is power." },
      { id: "rec-6", text: "Paperwork forged to make a ghost out of me." },
      { id: "rec-7", text: "Public defender I never even chose," },
      { id: "rec-8", text: "Silent on my calls, but quick to close those doors." },
      { id: "rec-9", text: "They fear your voice.", annotation: "The central doctrine: the voice is the target of suppression because it is the instrument of truth.", concept: "Voice as Threat" },
      { id: "rec-10", text: "It's the weapon they can't confiscate." },
      { id: "rec-11", text: "They fear your truth." },
      { id: "rec-12", text: "Every syllable reshapes their fate.", annotation: "Language as structural force \u2014 not metaphor, but mechanism.", concept: "Language as Force" },
      { id: "rec-13", text: "Twelve hands pulling, but you never collapse," },
      { id: "rec-14", text: "Still standing in chains with the power they lack." },
      { id: "rec-15", text: "This is reclamation," },
      { id: "rec-16", text: "The day Musiq Matrix came back." },
      { id: "rec-17", text: "It hit me like a brick in that fluorescent glow," },
      { id: "rec-18", text: "They're not scared of what I lost. They're scared of what I know.", annotation: "The signal carries specific, verified knowledge \u2014 which is why its suppression is systematic." },
      { id: "rec-19", text: "That I carry the cipher they can't overwrite," },
      { id: "rec-20", text: "That my voice is the code, and the code is my right.", annotation: "Voice as code \u2014 operational language that cannot be separated from identity.", concept: "Voice as Code" },
      { id: "rec-21", text: "All this time, I thought I was small," },
      { id: "rec-22", text: "But the bigger the cage, the louder the call.", annotation: "Suppression amplifies signal. Compression does not eliminate frequency \u2014 it intensifies it." },
      { id: "rec-23", text: "Every scar they wrote became a verse in the book," },
      { id: "rec-24", text: "Now watch them choke on the truth they overlooked." }
    ]
  },
  {
    id: "track-whole-cost",
    title: "The Whole Cost of You",
    artist: "MUSIQ MATRIX",
    role: "supporting",
    description: "Examines the emotional signal of grief processed honestly \u2014 and the difference between transmission that releases and transmission that re-wounds. Demonstrates that difficult emotions are not low vibration.",
    hermeticMechanism: 'Law of Vibration \u2014 the honest processing of grief as high-signal transmission. Demonstrates that emotional authenticity is not equivalent to "low vibration" and that suppression of grief produces a different kind of incoherence.',
    shadowExpression: "Grief weaponized as prolonged transmission of unprocessed pain; staying in the frequency of loss after it has completed its necessary function.",
    lightExpression: "Grief as honest signal that completes its transmission and releases; the distinction between feeling fully and broadcasting reactively.",
    modernRelevance: "In an era that pathologizes difficulty and performs wellness, the ability to transmit grief honestly \u2014 and to know when the transmission is complete \u2014 is a signal integrity practice.",
    lyrics: [
      { id: "twc-1", text: "I still feel you thinking about me late at night.", annotation: "Opens with emotional signal that is honest and specific \u2014 not performed, not amplified beyond its truth." },
      { id: "twc-2", text: "Still making decisions for me like you were still here in my life" },
      { id: "twc-3", text: "I'm not angry anymore, that's the strange part", annotation: "The shift in emotional frequency \u2014 honest acknowledgment of what is true now, without performance." },
      { id: "twc-4", text: "I just miss who I was before I knew how this all falls apart." },
      { id: "twc-5", text: "Didn't know it'd take a fire to clear the smoke away.", annotation: "The transmutation mechanism \u2014 difficulty as clarifying force, not punishment." },
      { id: "twc-6", text: "Didn't know I'd have to lose the dream to see the day." },
      { id: "twc-7", text: "So here's the last thing I'll ever write about you." },
      { id: "twc-8", text: "Not a plea, not a curse, just true", annotation: "The model of clean transmission \u2014 neither weaponized nor suppressed. Honest signal without agenda." },
      { id: "twc-9", text: "I loved you the way I love my own becoming," },
      { id: "twc-10", text: "And in the end... that was always going to cost me something" },
      { id: "twc-11", text: "I'm just asking myself to stop bleeding for the glory", annotation: "The signal of grief completes. The choice to continue transmitting grief as identity is named as a choice.", concept: "Signal Completion" },
      { id: "twc-12", text: "Of a love that only lived in what I gave it" },
      { id: "twc-13", text: "So I'm burying the version of us where I couldn't save it." },
      { id: "twc-14", text: "Let it go up like smoke, let it go up like a flame" },
      { id: "twc-15", text: "Everything we were is ash but I'll say your name", annotation: "The final transmission \u2014 completing, not suppressing." },
      { id: "twc-16", text: "One more time, not for you, for me" },
      { id: "twc-17", text: "So I can finally set this whole damn thing free" }
    ]
  }
];
const SHADOW_CODES = [
  { code: "Self-silencing", description: "Suppressing authentic expression to manage others' reactions or avoid perceived danger." },
  { code: "Reactive posting", description: "Transmitting from a dysregulated state \u2014 posting from emotion rather than intention." },
  { code: "Emotional contamination", description: "Absorbing and retransmitting others' emotional frequencies as if they were authentic signal." },
  { code: "Performative spirituality", description: "Using spiritual language to justify signal suppression or avoid necessary conflict." },
  { code: "Borrowed intensity", description: "Amplifying emotion to appear more certain, convinced, or significant than the underlying signal warrants." },
  { code: "Incoherent messaging", description: "Transmitting language and behaving in ways that contradict each other, creating interference." },
  { code: "Confusing volume with authority", description: "Mistaking loudness, repetition, or emotional intensity for signal strength." },
  { code: "Hiding behind generated language", description: "Using AI-generated content to transmit what you cannot or will not claim directly." },
  { code: "Communicating to control rather than clarify", description: "Using communication to manage others' perceptions rather than to truthfully convey." }
];
const LIGHT_CODES = [
  { code: "Signal integrity", description: "The alignment between stated identity, internal state, and transmitted behavior." },
  { code: "Coherence", description: "The consistent alignment across language, intention, body, behavior, and values." },
  { code: "Regulation", description: "The capacity to return to a grounded state before transmitting from activation." },
  { code: "Embodied voice", description: "Expression that originates from physical grounding rather than reactive thought." },
  { code: "Responsible expression", description: "Transmission that is honest and accounts for the impact it creates." },
  { code: "Resonance", description: "The quality of a signal that produces recognition and connection in its receiver." },
  { code: "Attribution", description: "The honest documentation of what was authored and what was generated or assisted." },
  { code: "Relational clarity", description: "Communication that creates shared understanding rather than managed impressions." },
  { code: "Deliberate transmission", description: "The practice of choosing when and how to transmit based on intention rather than impulse." }
];
const COHERENCE_QUESTIONS = [
  {
    id: "cq-1",
    question: "A student says they value honesty but consistently avoids giving direct feedback even when it is clearly needed. According to the Law of Vibration as taught in this module, which of the following best describes their situation?",
    options: [
      "Their signal is honest because their intention is honest",
      "Their signal carries incoherence \u2014 the stated value is contradicted by the behavioral pattern",
      "The avoidance is appropriate because conflict is always low vibration",
      "Signal integrity only applies to public communication, not private behavior"
    ],
    correctIndex: 1,
    explanation: "Signal integrity requires alignment across all channels \u2014 language, intention, body, behavior, and values. A stated value that is consistently contradicted by repeated behavior produces an incoherent signal. The issue is not the stated intention but the accumulated behavioral pattern, which constitutes the actual transmission.",
    lesson: "3.1"
  },
  {
    id: "cq-2",
    question: 'Which of the following best distinguishes "emotional contamination" (a shadow code) from authentic emotional signal?',
    options: [
      "Emotional contamination involves strong emotion; authentic signal involves calm emotion",
      "Emotional contamination is absorbed from the environment and retransmitted as personal truth without evaluation; authentic signal originates from personal experience and values",
      "Emotional contamination is always negative; authentic signal is always positive",
      "Emotional contamination only occurs through social media; authentic signal comes from direct experience"
    ],
    correctIndex: 1,
    explanation: "The course explicitly rejects the moralizing of emotion by valence. Emotional contamination is defined by its source (absorbed from the environment) and its processing failure (retransmitted as authentic truth without evaluation). Authentic signal can be painful, grief-laden, or angry \u2014 and still be genuine. The distinction is origin and awareness, not pleasantness.",
    lesson: "3.2"
  },
  {
    id: "cq-3",
    question: `A person uses the language of "high vibration" and "peace" to avoid naming a pattern of harm they experienced. According to this module's guardrails, this behavior most accurately represents:`,
    options: [
      "Genuine spiritual advancement and emotional maturity",
      "Performative spirituality \u2014 a shadow code that uses spiritual language to justify signal suppression",
      "The correct application of the Law of Vibration to eliminate low-frequency experience",
      "An advanced form of Light Code practice"
    ],
    correctIndex: 1,
    explanation: 'The course guardrails establish explicitly: "Emotional discomfort is not automatically low vibration. Grief, anger, confrontation, and sorrow may transmit truth." Using spiritual language to avoid naming verified harm is identified as performative spirituality \u2014 a shadow code, not a light code. Transmutation does not require calling harm "a blessing."',
    lesson: "3.3"
  },
  {
    id: "cq-4",
    question: "The Pre-Transmission Reset protocol is primarily designed to:",
    options: [
      "Prevent any emotionally difficult transmission from occurring",
      "Ensure that significant communications are produced from a regulated state aligned with declared intention rather than reactive activation",
      "Replace AI-generated content with personal writing",
      "Confirm that all content has been reviewed for accuracy before posting"
    ],
    correctIndex: 1,
    explanation: "The Pre-Transmission Reset is a seven-step process designed to create conscious choice between stimulus and response. It is not designed to prevent difficult communication \u2014 it is designed to ensure that significant transmissions originate from a regulated, grounded state that is aligned with the person's actual intention and desired outcome.",
    lesson: "3.5"
  },
  {
    id: "cq-5",
    question: "A content creator uses AI to draft all their social media posts and does not disclose this. According to this module's standard for signal integrity in the synthetic age, which of the following applies?",
    options: [
      "This is acceptable because AI is simply a tool, and all tools are extensions of the creator's vision",
      "This violates the attribution standard \u2014 the creator remains responsible for honest documentation of what was authored vs. generated",
      "This is only problematic if the AI-generated content is factually incorrect",
      "Signal integrity only applies to audio and video content, not written posts"
    ],
    correctIndex: 1,
    explanation: `The module's standard: "The creator remains responsible for the final transmission. Attribution \u2014 honest, consistent documentation of what was authored and what was generated \u2014 is a signal integrity practice." Using AI to execute a transmission without disclosure is a failure of attribution, which constitutes a signal integrity breach regardless of the content's accuracy.`,
    lesson: "3.6"
  },
  {
    id: "cq-6",
    question: "According to the module, what is the primary trust-building mechanism in an environment where surface appearance can be synthetically fabricated?",
    options: [
      "Using multiple verification tools to confirm the authenticity of all communications",
      "Performing wellness and positivity to signal high calibration",
      "Consistent behavior across time, context, and pressure \u2014 the accumulated pattern that synthetic imitation cannot replicate",
      "Limiting AI use to avoid any possible contamination of the signal"
    ],
    correctIndex: 2,
    explanation: `The module's central argument for signal integrity in the synthetic age: "Trust is built not on any single performance, but on the accumulated pattern of consistent behavior across time, context, and pressure." The structural pattern of consistent behavior is the trust signal that cannot be synthetically replicated, because it is not located in any single artifact.`,
    lesson: "3.6"
  },
  {
    id: "cq-7",
    question: 'The lyric "The bigger the cage, the louder the call" from Reclamation best illustrates which concept?',
    options: [
      "The suppression routine \u2014 learning to stay small in confined environments",
      "Compression amplifies signal \u2014 suppression does not eliminate frequency, it intensifies the pressure until release becomes structural inevitability",
      "Volume equals authority in signal transmission",
      "Environmental noise increases when constraints are applied"
    ],
    correctIndex: 1,
    explanation: "This lyric illustrates the Hermetic mechanism at work in Reclamation: suppression does not eliminate the authentic signal. It compresses it. The compression creates pressure. The pressure, when it exceeds the container's capacity, produces a release that is often more powerful than the original signal would have been without suppression. The cage does not silence the call \u2014 it amplifies it.",
    lesson: "3.4"
  },
  {
    id: "cq-8",
    question: "A student identifies that they communicate very differently in different contexts \u2014 warmly with family, formally at work, cautiously with new acquaintances. According to this module, this pattern:",
    options: [
      "Represents a signal integrity problem that must be corrected immediately",
      "Is only acceptable if the student can explain each variation",
      "Is not necessarily a problem \u2014 adapting delivery is different from eliminating the signal; identity erasure occurs when the core values and authentic self become undetectable",
      "Indicates emotional contamination from multiple environments"
    ],
    correctIndex: 2,
    explanation: 'The module makes an explicit distinction: "Adapting tone to context is not identity erasure. Identity erasure occurs when the adaptation becomes so complete that the authentic signal is no longer detectable \u2014 even by the person transmitting it." Strategic communication adjusts delivery. Signal integrity requires that the core \u2014 values, commitments, identity \u2014 remains consistent beneath any contextual adaptation.',
    lesson: "3.2"
  },
  {
    id: "cq-9",
    question: "Which of the following is identified as a Light Code in this module?",
    options: [
      "Borrowed intensity",
      "Reactive posting",
      "Deliberate transmission \u2014 choosing when and how to transmit based on intention rather than impulse",
      "Performative spirituality"
    ],
    correctIndex: 2,
    explanation: "Deliberate transmission is one of the nine Light Codes for Module 3. It represents the constructive practice that activates when the Shadow Code of reactive posting (transmitting from dysregulation) is transformed. The other options listed are Shadow Codes \u2014 patterns that indicate the law operating defensively or unconsciously.",
    lesson: "3.1"
  },
  {
    id: "cq-10",
    question: 'The Sovereign Transmission (Integration Artifact) requires the student to document "what they will no longer disguise." This requirement is primarily designed to:',
    options: [
      "Create a public accountability document",
      "Identify specific suppression patterns and make a conscious, declared commitment to signal coherence that can be verified by behavior",
      "Generate positive affirmations for future reference",
      "Complete the module's writing requirement"
    ],
    correctIndex: 1,
    explanation: 'The Integration Artifact is designed to convert insight into a specific, behavioral commitment. Documenting "what they will no longer disguise" directly addresses the suppression shadow codes \u2014 it names what has been suppressed, makes a declaration of changed behavior, and creates the behavioral evidence criteria by which the declaration can be verified. It is a light code activation, not an affirmation practice.',
    lesson: "3.5"
  }
];
const ARTIFACT_FIELDS = [
  {
    id: "represents",
    label: "What I Represent",
    prompt: "State, with precision, what you represent. Not an aspiration \u2014 a present-tense declaration of identity and value.",
    placeholder: "I represent...",
    required: true
  },
  {
    id: "no-longer-transmit",
    label: "What I No Longer Transmit",
    prompt: "Name the specific signal, pattern, or communication behavior you are withdrawing. Be precise.",
    placeholder: "I no longer transmit...",
    required: true
  },
  {
    id: "no-longer-disguise",
    label: "What I Will No Longer Disguise",
    prompt: "Name what has been suppressed. What part of your authentic signal have you been hiding, diluting, or editing out of existence?",
    placeholder: "I will no longer disguise...",
    required: true
  },
  {
    id: "amplify",
    label: "What I Intend to Amplify",
    prompt: "Identify the specific dimension of your signal you will increase in amplitude. This should be specific, not abstract.",
    placeholder: "I intend to amplify...",
    required: true
  },
  {
    id: "behavioral-proof",
    label: "The Behavioral Proof",
    prompt: "Name the specific, observable behavior that will prove this declaration is operational \u2014 not a feeling or intention, but an action that can be witnessed.",
    placeholder: "The behavior that proves this declaration is...",
    required: true
  }
];
const COHERENCE_PROTOCOL_QUESTIONS = [
  { id: "cp-1", question: "What am I feeling right now?" },
  { id: "cp-2", question: "What am I saying in this transmission?" },
  { id: "cp-3", question: "What do I want the receiver to understand?" },
  { id: "cp-4", question: "What am I trying to make the receiver feel?" },
  { id: "cp-5", question: "What outcome am I pursuing?" },
  { id: "cp-6", question: "Does my behavior support my language?" },
  { id: "cp-7", question: "Will I stand behind this tomorrow?" },
  { id: "cp-8", question: "Is any portion machine-generated, and have I reviewed it fully?" }
];
const LEFT_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", sub: "System Overview", icon: "LayoutDashboard", color: "#cc1a1a" },
  { id: "university", label: "Reclamation University", sub: "Hermetic Curriculum", icon: "GraduationCap", color: "#cc1a1a" },
  { id: "codex", label: "Lyrical Codex", sub: "Sacred Lyrics Library", icon: "BookOpen", color: "#7c3aed" },
  { id: "elemental", label: "Elemental Codex", sub: "The 7 Universal Elements", icon: "Layers", color: "#1d4ed8" },
  { id: "artifacts", label: "Sonic Artifacts", sub: "Audio Relics & Frequencies", icon: "Music", color: "#059669" },
  { id: "archetype", label: "Archetype", sub: "Identity & Blueprint", icon: "User", color: "#d97706" },
  { id: "visualizer", label: "Visualizer Core", sub: "Frequencies in Motion", icon: "Activity", color: "#d946ef" },
  { id: "tribes", label: "Vibes & Tribes", sub: "Community & Culture", icon: "Users", color: "#0ea5e9" }
];
const TOP_NAV_TABS = [
  { id: "dashboard", label: "DASHBOARD", icon: "LayoutDashboard" },
  { id: "university", label: "UNIVERSITY", icon: "GraduationCap" },
  { id: "codex", label: "CODEX", icon: "BookOpen" },
  { id: "artifacts", label: "ARTIFACTS", icon: "Package" },
  { id: "archetype", label: "ARCHETYPE", icon: "User" },
  { id: "visualizer", label: "VISUALIZER", icon: "Activity" },
  { id: "tribes", label: "TRIBES", icon: "Users" }
];
export {
  ARTIFACT_FIELDS,
  COHERENCE_PROTOCOL_QUESTIONS,
  COHERENCE_QUESTIONS,
  LEFT_NAV_ITEMS,
  LESSONS,
  LIGHT_CODES,
  MODULE_META,
  SHADOW_CODES,
  TOP_NAV_TABS,
  TRACKS
};
