const COURSE_MODULES = [
  {
    id: "mod-1",
    number: 1,
    title: "MENTALISM",
    subtitle: "GROUND FLOOR: THE AUTHORING MIND",
    law: "Mentalism",
    stage: "Fracture",
    discipline: "Thought Architecture",
    modernApplication: "Attention sovereignty in the algorithmic age",
    centralQuestion: "What has been creating through me without my conscious authorization?",
    primaryTrack: "Thought Form",
    supportingTracks: ["Adjacent (Reroute It)", "I Create As I Speak"],
    seal: "MIND ARCHITECT",
    integrationArtifactTitle: "The Ground Floor Blueprint",
    integrationArtifactInstructions: [
      "One repeated result in your life.",
      "The governing thought form behind it.",
      "Its likely source.",
      "The behavior it produces.",
      "The cost of maintaining it.",
      "The replacement code.",
      "One environmental change.",
      "One measurable action."
    ],
    modernOutcome: "I choose what receives mental residency, and I remain responsible for what I authorize.",
    lessons: [
      {
        id: "lesson-1-1",
        number: "1.1",
        title: "The Mind as Medium",
        subtitle: "Before the visible pattern, an invisible rehearsal",
        duration: "18 min",
        summary: "This lesson explores how experience is filtered before it becomes meaning. It distinguishes between objective events and subjective interpretation, showing that the first story the mind tells is not always the truest one.",
        keyPoints: ["Perception versus event", "Thought emotion behavior sequence", "Meaning is constructed, not merely received"],
        experience: {
          screens: [
            {
              id: "signal-entry",
              kind: "choice",
              label: "Signal Entry",
              title: "When was the last thought you know for certain was completely your own?",
              copy: [
                "Not a reaction. Not an opinion you repeated. Not a conclusion supplied by a headline, a memory, a fear, or a feed.",
                "Do not force an answer. Notice how difficult it is to prove where a thought began."
              ],
              options: [
                { id: "name-it", label: "I can name one", feedback: "Hold it in mind. This lesson will ask you to trace what made it available to you." },
                { id: "not-sure", label: "I am not sure", feedback: "Uncertainty is useful here. It creates room to examine the source instead of defending the result." },
                { id: "never-asked", label: "I have never asked", feedback: "That question is the entrance. Awareness begins before agreement or change." }
              ]
            },
            {
              id: "mind-medium",
              kind: "axiom",
              label: "The First Principle",
              title: "The mind is a medium.",
              callout: "THE ALL IS MIND. THE UNIVERSE IS MENTAL.",
              copy: [
                "Before an identity becomes visible, it is rehearsed in thought. Before a choice becomes behavior, the mind has already interpreted what the moment means.",
                "Mentalism is the discipline of noticing which interpretations have become instructions, then deciding which instructions deserve embodiment.",
                "This does not mean thought magically controls every event. It means perception organizes attention, attention influences choice, and repeated choices accumulate into identity."
              ]
            },
            {
              id: "creative-brief",
              kind: "choice",
              label: "A 2026 Reality",
              title: "One sentence can become a production brief.",
              copy: [
                "A creative professional opens a platform to publish new work. The first post is a polished AI generated campaign. Before they study it, one sentence arrives: I am already behind.",
                "The sentence is not neutral. It directs the next hour."
              ],
              prompt: "What happens next?",
              options: [
                { id: "compare", label: "Compare instead of create", feedback: "The thought redirected attention before any evidence was tested." },
                { id: "imitate", label: "Imitate what is rewarded", feedback: "The thought converted platform approval into an instruction for authorship." },
                { id: "pause", label: "Pause and examine the sentence", feedback: "The pause restores a decision point between interpretation and behavior." }
              ]
            },
            {
              id: "thought-pipeline",
              kind: "pipeline",
              label: "Trace the Architecture",
              title: "A visible result has an invisible sequence.",
              copy: ["Select each stage. Watch how an event becomes a lived result without the original event ever issuing a command."],
              nodes: [
                { id: "event", label: "Event", detail: "Something occurs. At this stage, meaning has not yet been established." },
                { id: "interpretation", label: "Interpretation", detail: "The mind decides what the event means, often before conscious review." },
                { id: "attention", label: "Attention", detail: "The interpretation determines what evidence becomes visible and what gets ignored." },
                { id: "choice", label: "Choice", detail: "Available actions narrow around the meaning already assigned." },
                { id: "behavior", label: "Behavior", detail: "The chosen response creates an observable pattern." },
                { id: "identity", label: "Identity", detail: "Repeated behavior becomes evidence for the story you tell about who you are." }
              ],
              lock: "EVENT → INTERPRETATION → ATTENTION → CHOICE → BEHAVIOR → IDENTITY"
            },
            {
              id: "same-event",
              kind: "comparison",
              label: "Perception Is Not the Event",
              title: "The event is identical. The instruction is not.",
              event: "A new project receives less engagement than expected.",
              paths: [
                { id: "overlay", title: "The automatic overlay", thought: "The work has no value.", result: "Withdraw, abandon the campaign, and treat limited distribution as a verdict on identity." },
                { id: "evidence", title: "The examined interpretation", thought: "Reach is one data point. I need context before I assign meaning.", result: "Review timing, audience, distribution, message clarity, and the work itself before choosing the next action." }
              ],
              lock: "The first story the mind tells is not automatically the truest one."
            },
            {
              id: "observation-test",
              kind: "classification",
              label: "Chroma Key Lens",
              title: "Key out what was added.",
              copy: [
                "A convincing image, voice, caption, or persona can be produced in seconds. Appearance is no longer reliable proof of coherence.",
                "Separate what can be observed from the meaning placed over it."
              ],
              categories: ["Observation", "Interpretation"],
              items: [
                { id: "reply", text: "The reply arrived two days later.", answer: "Observation" },
                { id: "disrespect", text: "They waited because they wanted to disrespect me.", answer: "Interpretation" },
                { id: "views", text: "The post received 312 views.", answer: "Observation" },
                { id: "failure", text: "The number proves the project failed.", answer: "Interpretation" }
              ],
              lock: "Treat the first interpretation as an overlay, not a verdict."
            },
            {
              id: "reclamation-lens",
              kind: "album",
              label: "Reclamation Case File",
              title: "The album asks what instruction came first.",
              copy: ["Reclamation does not separate identity from the architecture that produced it. These records examine Mentalism from three connected positions."],
              tracks: [
                { id: "thought-form", title: "Thought Form", role: "Primary case", teaching: "A repeated thought becomes the medium through which evidence is interpreted and life is organized.", question: "What thought keeps becoming evidence for itself?" },
                { id: "adjacent", title: "Adjacent (Reroute It)", role: "Authorship case", teaching: "Vision precedes construction. A tool can extend the signal, but it does not originate the intention.", question: "What did you author before the mechanism helped execute it?" },
                { id: "speak", title: "I Create As I Speak", role: "Transmission case", teaching: "Speech carries mental direction into behavior, expectation, and public record.", question: "Which repeated sentence are you prepared to support through action?" }
              ]
            },
            {
              id: "mentalism-loop",
              kind: "mechanism",
              label: "The Mentalism Loop",
              title: "Reclaim the instruction before it becomes behavior.",
              copy: ["A new thought matters only when it survives contact with action. Use this sequence whenever an interpretation arrives with the force of certainty."],
              steps: [
                { number: "01", title: "Pause", detail: "Create space before reaction converts meaning into behavior." },
                { number: "02", title: "Name", detail: "State the exact instruction running in the moment." },
                { number: "03", title: "Test", detail: "Separate observation, interpretation, missing context, and supporting evidence." },
                { number: "04", title: "Choose", detail: "Author an instruction proportionate to what is actually known." },
                { number: "05", title: "Prove", detail: "Perform one observable action that gives the new instruction a behavioral record." }
              ],
              lock: "The mind authors direction. Aligned action authenticates the signal."
            },
            {
              id: "field-note",
              kind: "reflection",
              label: "Signal Audit",
              title: "Trace one thought that is currently directing you.",
              prompt: "Name the repeated thought, where you first remember learning it, and the behavior it produces now.",
              placeholder: "The thought I keep rehearsing is... I first learned or absorbed it from... When I believe it, I tend to...",
              copy: ["Do not decide whether the thought is good or bad yet. First make its source and behavioral trail visible."]
            },
            {
              id: "signal-locked",
              kind: "lock",
              label: "Signal Locked",
              title: "You are not being asked to control every circumstance.",
              copy: [
                "You are being asked to recognize the point where circumstance becomes interpretation, interpretation becomes instruction, and instruction begins directing behavior.",
                "Mentalism begins when the thought is no longer invisible. Reclamation begins when authorship returns."
              ],
              callout: "I WITNESS THE THOUGHT, TEST IT, AND CHOOSE THE INSTRUCTION I CONTINUE TO ANIMATE."
            }
          ]
        }
      },
      {
        id: "lesson-1-2",
        number: "1.2",
        title: "Inherited Code",
        summary: "Students examine beliefs inherited through family, religion, education, culture, and trauma. The lesson asks which internal scripts are still useful, which are obsolete, and who benefits from keeping them unchallenged.",
        keyPoints: ["Inherited belief systems", "Default narratives", "Conscious evaluation of old code"]
      },
      {
        id: "lesson-1-3",
        number: "1.3",
        title: "The Algorithmic Thought Form",
        summary: "This lesson shows how repeated exposure creates familiarity, and how familiarity is often mistaken for truth. Students learn to distinguish genuine interest from behavioral conditioning reinforced by digital platforms.",
        keyPoints: ["Repetition shapes belief", "Algorithms reward automaticity", "Familiarity is not proof"]
      },
      {
        id: "lesson-1-4",
        number: "1.4",
        title: "Vision Before the Tool",
        summary: "Using Adjacent (Reroute It), this lesson studies the difference between the originating human mind and the mechanism used for execution. It positions technology as an amplifier of signal, not the source of authorship.",
        keyPoints: ["Authorship versus mechanism", "Tool dependency", "Originating vision remains human"]
      },
      {
        id: "lesson-1-5",
        number: "1.5",
        title: "Speech as Construction",
        summary: "With I Create As I Speak, students examine self-description, expectation, repetition, and contradiction. Speech is treated as constructive force: it directs attention, shapes behavior, and creates behavioral commitments over time.",
        keyPoints: ["Language builds reality", "Repetition forms expectation", "Speech must align with action"]
      },
      {
        id: "lesson-1-6",
        number: "1.6",
        title: "Authorship Returns",
        summary: "Students replace one inherited operating statement with a more precise authored code. The new architecture must be supported by revised language, altered behavior, and an environment that reinforces the update.",
        keyPoints: ["Replace inherited statements", "Write authored code", "Support the update with action"]
      }
    ]
  },
  {
    id: "mod-2",
    number: 2,
    title: "CORRESPONDENCE",
    subtitle: "MIRROR ARCHITECTURE",
    law: "Correspondence",
    stage: "Archive",
    discipline: "Pattern Architecture",
    modernApplication: "Digital identity, private behavior, embodiment, and systems recognition",
    centralQuestion: "What is the outer pattern revealing about the inner structure, and what is the inner structure revealing about the outer pattern?",
    primaryTrack: "As Above, So Below",
    supportingTracks: ["Chosen Ones", "The Witness Don\u2019t Talk"],
    seal: "KEEPER OF THE MIRROR",
    integrationArtifactTitle: "The Mirror Ledger",
    integrationArtifactInstructions: [
      "Three verified correspondences found across different levels of life.",
      "One internal\u2013external contradiction.",
      "One pattern suspected but found unsupported.",
      "One alignment action.",
      "One boundary or behavioral correction."
    ],
    modernOutcome: "My private behavior, public signal, and declared values increasingly describe the same person.",
    lessons: [
      {
        id: "lesson-2-1",
        number: "2.1",
        title: "The Mirror Is Structural",
        summary: "This lesson teaches students to distinguish surface similarity from structural similarity. Students learn to identify recurring roles and emotional outcomes across different situations, recognizing the deeper rule beneath repeated patterns.",
        keyPoints: ["Pattern beneath circumstance", "Roles repeat across contexts", "Structure matters more than surface"]
      },
      {
        id: "lesson-2-2",
        number: "2.2",
        title: "As Within, So Without",
        summary: "Students investigate how internal standards influence boundaries, communication, and relationship tolerances. The lesson carefully distinguishes inner participation from moral responsibility for harms committed by others.",
        keyPoints: ["Inner standards shape outer life", "Boundaries reveal structure", "Responsibility must stay accurate"]
      },
      {
        id: "lesson-2-3",
        number: "2.3",
        title: "The Digital Mirror",
        summary: "This lesson focuses on the fracture between curated identity and private practice. It explores what digital footprints reveal about repeated interests, affiliations, and reactions over time.",
        keyPoints: ["Curated self versus lived self", "Digital traces reveal patterns", "Online behavior is diagnostic"]
      },
      {
        id: "lesson-2-4",
        number: "2.4",
        title: "Recognition, Not Prediction",
        summary: "Using Chosen Ones, students study recognition as recovery of authentic identity rather than fantasy about destiny. The lesson emphasizes that true recognition must produce changed behavior, not just emotional resonance.",
        keyPoints: ["Recognition recovers identity", "False worlds collapse", "Insight must become action"]
      },
      {
        id: "lesson-2-5",
        number: "2.5",
        title: "The Witness Archive",
        summary: "The Witness Don\u2019t Talk becomes a study in embodied pattern recognition and nervous-system memory. Students learn to separate intuition from trauma activation and from claims that still need evidence.",
        keyPoints: ["Body as archive", "Intuition versus activation", "Evidence still matters"]
      },
      {
        id: "lesson-2-6",
        number: "2.6",
        title: "Mirror Without Projection",
        summary: "This lesson trains students to distinguish verified correspondence from projection, coincidence, or forced symbolism. Interpretations are sorted into confirmed, strongly supported, possible, or unsupported categories.",
        keyPoints: ["Don\u2019t force meaning", "Use evidence bands", "Keep the mirror clean"]
      }
    ]
  },
  {
    id: "mod-3",
    number: 3,
    title: "VIBRATION",
    subtitle: "SIGNAL INTEGRITY",
    law: "Vibration",
    stage: "Voice",
    discipline: "Signal Architecture",
    modernApplication: "Communication, emotional regulation, synthetic media, and coherent identity",
    centralQuestion: "What am I transmitting, and is that transmission coherent with who I claim to be?",
    primaryTrack: "I Am the Signal",
    supportingTracks: ["Reclamation", "The Whole Cost of You"],
    seal: "SIGNAL ONLINE",
    integrationArtifactTitle: "The Sovereign Transmission",
    integrationArtifactInstructions: [
      "What I represent.",
      "What I no longer transmit.",
      "What I will no longer disguise.",
      "What I intend to amplify.",
      "The behavior that will prove the declaration."
    ],
    modernOutcome: "My signal is deliberate, attributable, and recognizable across words, actions, and time.",
    lessons: [
      {
        id: "lesson-3-1",
        number: "3.1",
        title: "Everything Transmits",
        duration: "25 min",
        summary: "This lesson introduces the law of Vibration as a total transmission field rather than mere sound or mood. Students learn that language, timing, silence, posture, digital behavior, and follow-through all communicate before explanation begins.",
        keyPoints: ["Signal is multi-channel", "Broadcast begins before speech", "Digital behavior is part of transmission"]
      },
      {
        id: "lesson-3-2",
        number: "3.2",
        title: "Signal, Noise, and Interference",
        duration: "30 min",
        summary: "Students distinguish authentic signal from absorbed noise and interference. The lesson examines emotional contagion, algorithmic amplification, and the cost of mistaking foreign frequencies for personal truth.",
        keyPoints: ["Signal versus noise", "Interference distorts meaning", "Absorbed emotion can feel personal"]
      },
      {
        id: "lesson-3-3",
        number: "3.3",
        title: "The Suppression Routine",
        duration: "35 min",
        summary: "This lesson audits suppression as learned behavior rather than personality. Students examine where silence, shrinking, and self-censorship were installed and what long-term cost that routine exacts.",
        keyPoints: ["Suppression is learned", "Silence has a price", "Audit the routine"]
      },
      {
        id: "lesson-3-4",
        number: "3.4",
        title: "Voice as Code",
        duration: "40 min",
        summary: "Voice is treated as operational force, not just self-expression. Students study testimony, naming, language precision, and the difference between affirmation and behavioral commitment.",
        keyPoints: ["Voice reshapes the field", "Naming clarifies reality", "Speech needs behavioral proof"]
      },
      {
        id: "lesson-3-5",
        number: "3.5",
        title: "Nervous-System Coherence",
        duration: "30 min",
        summary: "This lesson explores dysregulation as signal corruption and introduces a reset protocol before transmission. Students learn that coherence is not passivity but preparation for clear and responsible output.",
        keyPoints: ["Dysregulation distorts signal", "Coherence precedes transmission", "Reset before response"]
      },
      {
        id: "lesson-3-6",
        number: "3.6",
        title: "Trust in the Synthetic Age",
        duration: "35 min",
        summary: "Students confront a world of edited images, AI voices, generated text, and deepfakes. The lesson teaches verification, attribution, behavioral consistency, and creator responsibility when surface evidence can be manufactured.",
        keyPoints: ["Synthetic media complicates trust", "Verification matters", "AI-assisted work still needs authorship"]
      }
    ]
  },
  {
    id: "mod-4",
    number: 4,
    title: "POLARITY",
    subtitle: "THE TRANSMUTATION CHAMBER",
    law: "Polarity",
    stage: "Furnace",
    discipline: "Spectrum Intelligence",
    modernApplication: "Polarization, conflict, shadow integration, and cognitive flexibility",
    centralQuestion: "What becomes possible when I stop treating the opposite pole as a completely separate universe?",
    primaryTrack: "Flip It",
    supportingTracks: ["Hold On Through the Burial", "Where the Phantom Fell"],
    seal: "CODE TRANSMUTED",
    integrationArtifactTitle: "The Reversal Dossier",
    integrationArtifactInstructions: [
      "The original Shadow Code.",
      "The opposing pole.",
      "The shared underlying force.",
      "The harm that must not be minimized.",
      "The recoverable capacity hidden in the distortion.",
      "The new direction chosen.",
      "One measurable observable action."
    ],
    modernOutcome: "I can hold complexity without surrendering truth, boundaries, or conviction.",
    lessons: [
      {
        id: "lesson-4-1",
        number: "4.1",
        title: "One Continuum, Multiple Degrees",
        summary: "This lesson teaches that many apparent opposites are different degrees of one shared force. Students map how fear, reverence, anger, and protective force can sit on the same continuum without being identical.",
        keyPoints: ["Opposites share a continuum", "Degrees matter", "Mapping replaces splitting"]
      },
      {
        id: "lesson-4-2",
        number: "4.2",
        title: "The Outrage Economy",
        summary: "Students examine how digital systems reward extreme framing, certainty, and public shaming. The lesson shows why complexity collapses online and why nuance becomes both difficult and necessary.",
        keyPoints: ["Platforms reward extremes", "Nuance is costly online", "Compression of complexity drives conflict"]
      },
      {
        id: "lesson-4-3",
        number: "4.3",
        title: "Read It From the Other End",
        summary: "Using Flip It, students learn a method of directed interpretation that locates the constructive capacity hidden inside distortion. The lesson asks not only what is wrong, but what direction would make this force useful.",
        keyPoints: ["Find the useful pole", "Redirect don\u2019t romanticize", "Interpret with direction"]
      },
      {
        id: "lesson-4-4",
        number: "4.4",
        title: "Burial and Ascension",
        summary: "Hold On Through the Burial reframes difficult experiences as sites where transformation may occur. The original harm is not excused, but the student\u2019s later response can still become generative.",
        keyPoints: ["Harm remains harm", "Response can transform", "Growth may emerge after burial"]
      },
      {
        id: "lesson-4-5",
        number: "4.5",
        title: "When the Phantom Falls",
        summary: "This lesson studies the collapse of false identities, reputations, and performances. Students work through the grief of disillusionment so that the fall of illusion becomes recovery rather than collapse.",
        keyPoints: ["False identities fall", "Disillusionment can clarify", "Recover the authentic self"]
      },
      {
        id: "lesson-4-6",
        number: "4.6",
        title: "The Third Position",
        summary: "Students learn to construct a balanced position that preserves valid truths from opposing poles while refusing their distortions. The goal is not bland compromise but a truer and more workable synthesis.",
        keyPoints: ["Beyond either/or", "Preserve truth without distortion", "Build a workable synthesis"]
      }
    ]
  },
  {
    id: "mod-5",
    number: 5,
    title: "RHYTHM",
    subtitle: "THE PENDULUM AND THE RETURN",
    law: "Rhythm",
    stage: "Calibration",
    discipline: "Sustainable Cadence",
    modernApplication: "Burnout, productivity, creative cycles, recovery, and long-term execution",
    centralQuestion: "How do I remain authored while life moves through expansion, contraction, visibility, concealment, action, and rest?",
    primaryTrack: "Blueprint of the Divine",
    supportingTracks: ["Concrete Warnings", "Remember the Price", "Through the Fog"],
    seal: "PENDULUM MASTERED",
    integrationArtifactTitle: "The Return Protocol",
    integrationArtifactInstructions: [
      "Daily anchors.",
      "Weekly review.",
      "Build periods.",
      "Recovery periods.",
      "Notification rules.",
      "Emergency reset.",
      "Minimum viable action for low-capacity days.",
      "Reentry process after disruption."
    ],
    modernOutcome: "I do not demand one speed from a living system, and I know how to return without starting over.",
    lessons: [
      {
        id: "lesson-5-1",
        number: "5.1",
        title: "The Pendulum Moves",
        summary: "This lesson explores the natural cycles of expansion and contraction, visibility and concealment, activation and recovery. Students learn that living systems cannot sustain one speed forever without distortion.",
        keyPoints: ["Cycles are lawful", "One speed is unsustainable", "Cadence protects authorship"]
      },
      {
        id: "lesson-5-2",
        number: "5.2",
        title: "Pattern Etched in Pain",
        summary: "Using Concrete Warnings, students examine recurring family, relational, and emotional patterns that feel inevitable because they are familiar. The lesson helps students see how repetition becomes encoded without becoming destiny.",
        keyPoints: ["Pain creates repetition", "Patterns feel inevitable when familiar", "Recognition opens intervention"]
      },
      {
        id: "lesson-5-3",
        number: "5.3",
        title: "The Productivity Trap",
        summary: "This lesson addresses burnout as accumulated systems failure rather than moral weakness. Students study notification culture, false urgency, and the difference between motion and meaningful progress.",
        keyPoints: ["Burnout is systemic", "Urgency is often manufactured", "Motion is not the same as progress"]
      },
      {
        id: "lesson-5-4",
        number: "5.4",
        title: "Tempering Across Time",
        summary: "Remember the Price becomes a study in apprenticeship, refinement, and long-cycle growth. Students learn that real capacity is often formed during phases of invisibility, repetition, and patient shaping.",
        keyPoints: ["Tempering takes time", "Invisible phases matter", "Competence has a cost"]
      },
      {
        id: "lesson-5-5",
        number: "5.5",
        title: "Through the Fog",
        summary: "This lesson provides tools for maintaining direction during low-clarity periods. Students distinguish incubation from stagnation and learn when to wait for evidence versus when to make a directional correction.",
        keyPoints: ["Fog is not always failure", "Incubation has signals", "Discern waiting from drift"]
      },
      {
        id: "lesson-5-6",
        number: "5.6",
        title: "Acknowledge. Ascend. Release. Return.",
        summary: "Students design a repeatable operating cycle built around acknowledgment, ascent, release, and return. The emphasis is on rhythmic sustainability rather than perfectionistic continuity.",
        keyPoints: ["Build a returnable cycle", "Release compulsive control", "Restart without self-erasure"]
      }
    ]
  },
  {
    id: "mod-6",
    number: 6,
    title: "CAUSE AND EFFECT",
    subtitle: "THE LEDGER OF CONSEQUENCE",
    law: "Cause and Effect",
    stage: "Reckoning",
    discipline: "Sequence Intelligence",
    modernApplication: "Accountability, digital permanence, financial habits, systems thinking, and upstream intervention",
    centralQuestion: "What sequence produced this result, and where can the sequence be interrupted?",
    primaryTrack: "Know Your Names",
    supportingTracks: ["Welcome to the Fire", "Demonic Schemes", "Flowers", "Misguided Priorities", "The Hierophant", "The Reckoning Already Rolled"],
    seal: "LEDGER OPENED",
    integrationArtifactTitle: "The Ledger of Consequence",
    integrationArtifactInstructions: [
      "A completed causal map.",
      "The specific sequence under review.",
      "Observed outcomes.",
      "Likely upstream contributors.",
      "A practical upstream intervention plan."
    ],
    modernOutcome: "I do not only react to results. I redesign the sequence that produces them.",
    lessons: [
      {
        id: "lesson-6-1",
        number: "6.1",
        title: "Chronology Before Interpretation",
        summary: "This lesson trains students to document what happened in the order it happened before deciding what it means. Facts, inference, and evidence are kept distinct so chronology can discipline interpretation.",
        keyPoints: ["Sequence first", "Separate fact from inference", "Interpret after chronology"]
      },
      {
        id: "lesson-6-2",
        number: "6.2",
        title: "The Timeline Does Not Lie",
        summary: "Using Welcome to the Fire, students study suppressed authorship, witness participation, and delayed exposure. The lesson shows how accumulated sequences reveal truth even when the system initially hides it.",
        keyPoints: ["Timelines expose structure", "Witnesses matter", "Suppression has sequence"]
      },
      {
        id: "lesson-6-3",
        number: "6.3",
        title: "Personal Habit Loops",
        summary: "Students analyze recurring personal outcomes by tracing them back to triggers, emotions, and environmental cues. Rather than moralizing results, the lesson seeks the loop that repeatedly creates them.",
        keyPoints: ["Loops create results", "Triggers precede behavior", "Change the loop, not just the outcome"]
      },
      {
        id: "lesson-6-4",
        number: "6.4",
        title: "Relational Consequence",
        summary: "This lesson examines manipulated perception, distorted counsel, and the moral accounting of relational choices. Students see how repeated avoidance or dishonesty compounds into fractures over time.",
        keyPoints: ["Relationships have sequence", "Avoidance compounds", "Distorted counsel reshapes outcomes"]
      },
      {
        id: "lesson-6-5",
        number: "6.5",
        title: "The Mirror Becomes the Court",
        summary: "Centered on The Hierophant, this lesson reframes consequence as internal reckoning, not merely external punishment. Students study conscience, identity fracture, and the lawful reality of denied patterns.",
        keyPoints: ["Consequence is internal too", "Conscience keeps record", "The mirror becomes evidence"]
      },
      {
        id: "lesson-6-6",
        number: "6.6",
        title: "The Reckoning Already Rolled",
        summary: "This lesson treats repetition as evidence that a larger sequence is already in motion. Students learn that consequence may be active long before it becomes visible or publicly acknowledged.",
        keyPoints: ["Delayed effects are still effects", "Repetition reveals structure", "Reckoning may precede recognition"]
      },
      {
        id: "lesson-6-7",
        number: "6.7",
        title: "Upstream Intervention",
        summary: "Students work backward from results to locate the earliest realistic change point in a system. The goal is not cosmetic reaction, but intervention where the sequence can actually be redirected.",
        keyPoints: ["Trace backward", "Find the earliest viable intervention", "Redesign the sequence"]
      }
    ]
  },
  {
    id: "mod-7",
    number: 7,
    title: "GENDER",
    subtitle: "THE GENERATIVE UNION",
    law: "Gender",
    stage: "Bloom",
    discipline: "Generative Architecture",
    modernApplication: "Human-AI collaboration, creativity, incubation, action, and responsible authorship",
    centralQuestion: "What must unite within me for an idea, identity, relationship, or creation to become fully formed?",
    primaryTrack: "Art! Official!",
    supportingTracks: ["Elemental Orchestra"],
    seal: "SOVEREIGN GENERATOR",
    integrationArtifactTitle: "The Reclamation Artifact",
    integrationArtifactInstructions: [
      "A completed creative, personal, professional, or operational project.",
      "A seven-part authorship statement.",
      "An explanation of how each Hermetic law contributed to development.",
      "Clear declaration of tool role and human role where relevant."
    ],
    modernOutcome: "I use technology to extend my agency without surrendering judgment, humanity, ethics, or authorship.",
    lessons: [
      {
        id: "lesson-7-1",
        number: "7.1",
        title: "The Law of Generation",
        summary: "This lesson teaches that nothing becomes fully formed through force alone or receptivity alone. Students study creation as a sequence involving intention, space, structure, incubation, execution, release, and stewardship.",
        keyPoints: ["Generation needs complementarity", "Creation has sequence", "Formation requires stewardship"]
      },
      {
        id: "lesson-7-2",
        number: "7.2",
        title: "The Seed and the Vessel",
        summary: "Students distinguish the originating intention from the structure capable of carrying it. The lesson helps separate inspiration from system, desire from capacity, and beginnings from finished form.",
        keyPoints: ["Seed is intention", "Vessel is structure", "Ideas need containers"]
      },
      {
        id: "lesson-7-3",
        number: "7.3",
        title: "Human-AI Creative Roles",
        summary: "This lesson defines what belongs to the human creator\u2014purpose, ethics, taste, selection, context, meaning, and responsibility\u2014and what can be extended by a tool. It frames AI as support for execution rather than replacement for authorship.",
        keyPoints: ["Humans author meaning", "Tools extend capacity", "Responsibility remains human"]
      },
      {
        id: "lesson-7-4",
        number: "7.4",
        title: "Where Circuitry Meets Soul",
        summary: "Using Art! Official!, students examine synthetic performance, creative legitimacy, AI criticism, and the line between mechanism and author. The lesson insists on human signature, intention, and ethical review in assisted work.",
        keyPoints: ["Tool versus author", "Legitimacy needs intention", "Human signature matters"]
      },
      {
        id: "lesson-7-5",
        number: "7.5",
        title: "The Architect and the Witness",
        summary: "This lesson explores internal integration: the sovereign self learning to witness, validate, and direct the wounded child rather than abandon it. The wound becomes medicine when it is metabolized into generative authority.",
        keyPoints: ["Witness the inner self", "Integration supports creation", "Wounds can become medicine"]
      },
      {
        id: "lesson-7-6",
        number: "7.6",
        title: "Incubation and Action",
        summary: "Students assess whether a project currently needs privacy, research, experimentation, deadlines, feedback, technical execution, or release. The lesson helps creators identify which phase the work is actually in.",
        keyPoints: ["Name the current phase", "Don\u2019t force the wrong action", "Incubation and execution are distinct"]
      },
      {
        id: "lesson-7-7",
        number: "7.7",
        title: "Human Signature",
        summary: "This lesson establishes standards for AI-assisted work: original human intention, tool role, human revisions, rejected outputs, fact-checking, ethical review, and final authorial decision. The emphasis is transparent, responsible authorship.",
        keyPoints: ["Document human contribution", "Review and verify outputs", "Finalize with accountable authorship"]
      }
    ]
  }
];
const COURSE_MODULE_MAP = Object.fromEntries(COURSE_MODULES.map((m) => [m.id, m]));
export {
  COURSE_MODULES,
  COURSE_MODULE_MAP
};
