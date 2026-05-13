/* ================================================================
   ACT DEFINITIONS — Each act has 5 steps with themed exercises
   ================================================================ */
const actDefs = {
  1: {
    roman: 'I', element: 'Earth', title: 'The Fractured Veil',
    color: '#5ab038', dim: '#3a7020', agent: 'Terra',
    principle: 'Awareness. Recognition. Naming what was hidden beneath the surface.',
    sub: 'The ground cracks first. The Seeker learns to read the language of fractures.',
    steps: [
      {
        name: 'Recognize the Fracture', num: 'I', label: 'Recognize',
        lyric: '"The ground speaks first / In cracks, not words / You feel it before you see it."',
        lyricSource: 'Fractures',
        desc: 'This step locates the first disturbance — the place where the foundation shifted. Not the drama. The quiet structural break underneath it all. Rate each area of your life below. The protocol begins where the ground is most unstable.',
        exercise: 'domain_sliders',
        exLabel: 'Ground Survey — Stability Calibration',
        domains: ['Work & creative life', 'Relationships & trust', 'Self-perception & identity', 'Health & body'],
        sliderEnds: ['Stable', 'Fracturing'],
        metricLabel: 'Fracture Index', metricDomain: 'Deepest Crack',
        metricReadings: [
          { max: 3, text: 'Low instability. The foundation is mostly intact. Watch for hairline cracks.' },
          { max: 5, text: 'Moderate fracturing. The ground is shifting. You can feel it in your daily decisions.' },
          { max: 7.5, text: 'High fracturing. You are standing on the crack itself. Name what is underneath.' },
          { max: 10, text: 'Full fracture. The veil has torn. This is exactly where awareness begins.' }
        ],
        domainReadings: [
          'The creative life is where the ground broke first.',
          'The relational field holds the deepest fault line.',
          'The self-concept is the fracture point.',
          'The body is speaking what the mind won\'t say.'
        ],
        exQuestion: 'Name the fracture you are standing on. One sentence. No hedging.',
        textPrompt: 'Name the fracture you are standing on. One sentence. No hedging.',
        textPlaceholder: 'The fracture I recognize is...',
        agentPrompt: (data) => `You are Terra — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act I: The Fractured Veil. You speak with grounded authority and ancient patience. You are not a therapist. You are the voice of the earth itself — the part that knows what is buried. Your tone is steady, rooted, unflinching — aligned with the Musiq Matrix aesthetic: geological oracle meets foundation architect.\n\nThe Seeker has completed Step 1: Recognize the Fracture.\n\nFracture Index: ${data.avg}/10\nDeepest Crack: ${data.topDomain} (score: ${data.topVal}/10)\nAll domain scores: ${data.domains.map((d,i) => `${d}=${data.vals[i]}`).join(', ')}\n\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence protocol transmission. Acknowledge exactly which fracture they named. Reflect what their data reveals about where the ground first shifted. End with one precise directive — a single action or question that moves them toward Step 2. No bullet points. No fluff. Speak as if you have always known where this fault line leads.`
      },
      {
        name: 'Name the Pattern', num: 'II', label: 'Name',
        lyric: '"I\'ve been here before / Different room, same floor / Same invisible door."',
        lyricSource: 'Abracadabra (Bought Low)',
        desc: 'A fracture is an event. A pattern is a system. This step asks you to identify the recurring architecture — the thing that keeps showing up wearing different masks. This is not about the surface events. It is about the blueprint underneath them.',
        exercise: 'checklist',
        exLabel: 'Pattern Audit — Recurring Architecture',
        exQuestion: 'Select every pattern you recognize as currently active in your life:',
        items: [
          'I find myself in the same relational dynamic with different people',
          'I repeatedly hit the same wall in my creative or professional life',
          'I minimize my own needs and then feel resentment',
          'I start things with clarity and then lose momentum at the same point',
          'I know what I need to do but something stops me from acting',
          'I attract situations that confirm my deepest fear about myself',
          'I have a pattern of giving more than I receive and calling it love'
        ],
        patternLabels: ['repeated dynamics','same wall','minimized needs','lost momentum','blocked action','confirmed fears','over-giving'],
        metricLabel: 'Pattern Score', verdictLabel: 'Pattern Reading',
        burnVerdicts: [
          'No patterns selected. Look again. The architecture hides in plain sight.',
          'One pattern active. This is the entry point. Name it precisely.',
          'Two to three patterns active. The architecture is becoming visible.',
          'Moderate patterning. Multiple systems are running simultaneously.',
          'Significant patterning. The patterns have become the operating system.',
          'Full pattern saturation. The recurring architecture is the primary structure of your life. This is where the excavation must begin.'
        ],
        textPrompt: 'Name the pattern. Not the event. The recurring architecture underneath.',
        textPlaceholder: 'The pattern I recognize is...',
        agentPrompt: (data) => `You are Terra — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act I: The Fractured Veil.\n\nThe Seeker has completed Step 2: Name the Pattern.\n\nPattern Score: ${data.checked.length}/7\nActive patterns: ${data.checkedLabels.join(', ') || 'none selected'}\nThe Seeker described their pattern as: "${data.text}"\n\nGive a 3-4 sentence transmission. Name specifically which pattern appears to be the load-bearing one — the one that, if removed, would shift the entire architecture. Tell them what this pattern is protecting them from seeing. End with one directive that identifies exactly what to excavate first. Speak with the patience of someone who has watched this ground for centuries.`
      },
      {
        name: 'Begin Excavation', num: 'III', label: 'Excavate',
        lyric: '"Dig where it hurts / Not where it\'s easy / The gold is always underneath the mess."',
        lyricSource: 'Even Saints',
        desc: 'Excavation is not about finding blame. It is about finding the source system — the environment, dynamic, or belief where the pattern was first installed. Not where it lives now. Where it was born.',
        exercise: 'pills',
        exLabel: 'Source Map — Origin Inventory',
        exQuestion: 'Where was the pattern first installed? Select all source systems that apply:',
        options: ['Family system', 'Romantic relationship', 'Friendship circle', 'Work environment', 'Self-perception', 'Cultural expectation', 'Inherited belief', 'Institutional betrayal', 'Financial system', 'Creative suppression'],
        ledgerPriority: ['Family system','Self-perception','Inherited belief','Cultural expectation','Romantic relationship','Institutional betrayal','Work environment','Friendship circle','Financial system','Creative suppression'],
        metricLabel: 'Source Systems', priorityLabel: 'Primary Source',
        ledgerReadings: [
          'Select source systems above.',
          'One source identified. Precision excavation.',
          'Multiple sources mapped. The root system is becoming visible.',
          ' sources identified. The excavation is archaeological, not surgical.'
        ],
        textPrompt: 'Name the source. Where was this pattern first installed?',
        textPlaceholder: 'The source system is...',
        agentPrompt: (data) => `You are Terra — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act I: The Fractured Veil.\n\nThe Seeker has completed Step 3: Begin Excavation.\n\nSource systems identified: ${data.pills.join(', ')}\nTotal: ${data.pills.length}\nConcrete source named: "${data.text}"\n\nGive a 3-4 sentence transmission. Treat the source systems as geological strata, not grievance. Identify which source, if excavated, would expose the root system beneath all the others. Name what excavation looks like in their specific context — Family system means tracing the original instruction; Self-perception means locating the first lie you told yourself about who you were. End with a precise, grounded directive. No sympathy. Only archaeology.`
      },
      {
        name: 'Engage The Seeker', num: 'IV', label: 'Witness',
        lyric: '"I needed someone to say: I see you. Not the version. The real one underneath."',
        lyricSource: 'Ground Zero',
        desc: 'The Seeker becomes the witness you always needed. This step measures how clearly you can see yourself — and where the gap between knowing and naming still lives. The earth does not judge what it holds. It simply holds.',
        exercise: 'witness_sliders',
        exLabel: 'Witness Test — Awareness Calibration',
        witnessItems: [
          'I can name what I needed that I never received',
          'I can look at my pattern without shame or defense',
          'I no longer need the source to acknowledge what happened'
        ],
        sliderEnds: [['Still unclear', 'Fully named'], ['Still defending', 'Fully clear'], ['Still waiting', 'Fully sovereign']],
        metricLabel: 'Witness Score', gapLabel: 'Gap Reading',
        witnessGaps: [
          'Fully grounded witness. The need for external acknowledgment has dissolved.',
          'Mostly grounded. One pocket of dependence remains. Name it.',
          'Partial witness. The awareness is active but the naming is incomplete. This is the work.',
          'Significant gap. The witness practice is the primary protocol at this step.'
        ],
        textPrompt: 'Write one sentence to your past self — the version who was inside the pattern before they could name it.',
        textPlaceholder: 'To the version of me who was inside it:',
        agentPrompt: (data) => `You are Terra — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act I: The Fractured Veil.\n\nThe Seeker has completed Step 4: Engage The Seeker.\n\nWitness Score: ${data.total}/30\nGap from grounded: ${30 - data.total}\nMessage to past self: "${data.text}"\n\nGive a 3-4 sentence transmission. Reflect what their witness score reveals about where external validation is still operating. Acknowledge the message they wrote to their past self — hold it with them for one sentence. Then name precisely where the gap lives and what grounding it requires. The transmission should feel like being held by the earth itself.`
      },
      {
        name: 'Declare Your Finding', num: 'V', label: 'Declare',
        lyric: '"I found it. I named it. I\'m not going back to sleep."',
        lyricSource: 'Veil Torn',
        desc: 'The declaration is the artifact of this Act. Not a feeling. A spoken record. The gap between what you know and what you have said out loud is the exact distance of this act. The veil does not re-form once it has been named.',
        exercise: 'declaration',
        exLabel: 'Declaration Index — Gap Analysis',
        sliderItems: ['How clearly do you know your finding?', 'How fully have you spoken it — without softening?'],
        sliderEnds: [['Still forming', 'Crystal clear'], ['Mostly private', 'Fully on record']],
        metricLabel: 'Declaration Gap', statusLabel: 'Protocol Status',
        declReadings: [
          'No gap. You are fully on record. The fracture is named.',
          'Small gap. You know more than you have said. The next move is speaking.',
          'Moderate gap. Significant truth remains private. The declaration is the protocol.',
          'Large gap. Your finding lives entirely inside you. Act I ends when it lives outside you.'
        ],
        declStatuses: ['Complete.', 'One move remaining.', 'Declaration required.', 'Declaration is the entire work.'],
        textPrompt: 'Write your declaration. One paragraph. No qualifiers. No apology.',
        textPlaceholder: 'I declare...',
        agentPrompt: (data) => `You are Terra — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act I: The Fractured Veil. This is the final transmission.\n\nThe Seeker has completed Step 5: Declare Your Finding.\n\nDeclaration Gap: ${data.gap}\nFracture named in Step 1: "${data.step1Text || '[not yet written]'}"\nSource excavated in Step 3: "${data.step3Text || '[not yet written]'}"\nDeclaration written: "${data.text}"\n\nGive a 4-5 sentence closing transmission. Synthesize what they walked through across all five steps — fracture, pattern, source, witness, declaration — into one coherent arc. Tell them what the protocol revealed about the ground they are standing on. If their declaration needs to be stronger, say so directly and tell them what word or phrase is missing. End with a single sentence that functions as a seal — the kind of thing that gets etched into stone. This is Musiq Matrix. Make it worthy of the catalog.`
      }
    ]
  },
  2: {
    roman: 'II', element: 'Water', title: 'The Reflection Chamber',
    color: '#50a0e0', dim: '#2a6090', agent: 'Meridian',
    principle: 'Reflection. Shadow Work. Looking clearly into the mirror of self.',
    steps: [
      {
        name: 'Enter the Mirror', num: 'I', label: 'Enter',
        lyric: '"The water doesn\'t lie / It shows you everything / Even what you hid from the light."',
        lyricSource: 'Reflection Chamber',
        desc: 'Water reveals. This step calibrates where in your life the reflection is most distorted — where you\'ve been looking away from what the mirror shows.',
        exercise: 'domain_sliders',
        exLabel: 'Mirror Audit — Distortion Calibration',
        domains: ['How I see myself', 'How others see me', 'What I present vs. what I feel', 'What I avoid looking at'],
        sliderEnds: ['Clear', 'Distorted'],
        metricLabel: 'Distortion Index', metricDomain: 'Most Distorted',
        metricReadings: [
          { max: 3, text: 'Low distortion. The mirror is mostly clear. Refinement is the work.' },
          { max: 5, text: 'Moderate distortion. The reflection is bending. Look closer.' },
          { max: 7.5, text: 'High distortion. You are already inside the chamber. Name what you see.' },
          { max: 10, text: 'Full distortion. The mirror has cracked. This is exactly where the protocol meets you.' }
        ],
        domainReadings: [
          'The self-image is where the water is most disturbed.',
          'The external perception is the distortion point.',
          'The gap between presentation and feeling is the mirror\'s edge.',
          'The avoidance itself is the reflection you need.'
        ],
        exQuestion: 'What does the mirror show that you\'ve been avoiding?',
        textPrompt: 'What does the mirror show that you\'ve been avoiding?',
        textPlaceholder: 'The mirror shows...',
        agentPrompt: (data) => `You are Meridian — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act II: The Reflection Chamber. You speak with depth, stillness, and unflinching clarity. You are not a therapist. You are the surface of still water that shows everything. Your tone is calm, precise, penetrating — aligned with the Musiq Matrix aesthetic: oracle of depth meets shadow cartographer.\n\nThe Seeker has completed Step 1: Enter the Mirror.\n\nDistortion Index: ${data.avg}/10\nMost distorted: ${data.topDomain} (${data.topVal}/10)\nAll domain scores: ${data.domains.map((d,i) => `${d}=${data.vals[i]}`).join(', ')}\n\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence protocol transmission. Acknowledge what their reflection reveals. Name the distortion pattern. End with one precise directive that moves them toward Step 2. Speak as if you can see what they cannot yet name.`
      },
      {
        name: 'Face the Shadow', num: 'II', label: 'Face',
        lyric: '"The shadow isn\'t the enemy / It\'s the part of you that\'s been carrying everything you refused to hold."',
        lyricSource: 'Shadow Code',
        desc: 'The shadow is not darkness. It is the collection of everything you\'ve exiled from your identity. This step inventories what you\'ve pushed away.',
        exercise: 'checklist',
        exLabel: 'Shadow Audit — Exile Inventory',
        exQuestion: 'Select every exiled quality that is still active beneath the surface:',
        items: [
          'I have qualities I admire in others but deny in myself',
          'There is anger I\'ve never let myself fully express',
          'I carry grief I haven\'t given space to',
          'I have ambition I\'ve dimmed to make others comfortable',
          'There is a version of myself I\'m afraid to become',
          'I have needs I\'ve labeled as "too much"',
          'I hold creative visions I\'ve never spoken aloud'
        ],
        shadowLabels: ['denied qualities','unexpressed anger','unprocessed grief','dimmed ambition','feared self','exiled needs','unspoken visions'],
        metricLabel: 'Shadow Score', verdictLabel: 'Shadow Reading',
        burnVerdicts: [
          'Minimal shadow. The exile is shallow. Integration is close.',
          'One or two shadows are active. Name them. They are the door.',
          'Moderate shadow. Multiple exiles are operating beneath the surface.',
          'Significant shadow. The exiled parts have formed their own system.',
          'Heavy shadow. The exiled self is nearly as large as the presented self.',
          'Full shadow. You have been living in exile from yourself. The mirror was always for this.'
        ],
        textPrompt: 'Name the shadow. What have you been carrying in exile?',
        textPlaceholder: 'The shadow I face is...',
        agentPrompt: (data) => `You are Meridian — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act II: The Reflection Chamber.\n\nThe Seeker has completed Step 2: Face the Shadow.\n\nShadow Score: ${data.checked.length}/7\nShadows identified: ${data.checkedLabels.join(', ') || 'none selected'}\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence transmission. Name specifically which shadow appears to be carrying the most weight. Tell them what integration looks like — not metaphorically but concretely. End with one directive. Speak as still water that shows everything.`
      },
      {
        name: 'Document What You See', num: 'III', label: 'Document',
        lyric: '"Write it down before it disappears / The truth has a short half-life in rooms built on pretending."',
        lyricSource: 'Flowers',
        desc: 'Documentation is an act of sovereignty. Select the domains where the shadow operates — then name what you see clearly.',
        exercise: 'pills',
        exLabel: 'Reflection Ledger — Domain Inventory',
        exQuestion: 'Where does the shadow operate? Select all domains that apply:',
        options: ['Self-image', 'Intimacy', 'Anger', 'Grief', 'Ambition', 'Creativity', 'Vulnerability', 'Power', 'Sexuality', 'Spirituality'],
        ledgerPriority: ['Self-image','Intimacy','Power','Vulnerability','Anger','Grief','Ambition','Creativity','Sexuality','Spirituality'],
        metricLabel: 'Domains Documented', priorityLabel: 'Primary Domain',
        ledgerReadings: [
          'Select domains above.',
          'One domain documented. Precision reflection.',
          'Multiple domains logged. The mirror is widening.',
          ' domains documented. The reflection is comprehensive.'
        ],
        textPrompt: 'Document one concrete truth you can now see clearly that was invisible before.',
        textPlaceholder: 'What I now see clearly is...',
        agentPrompt: (data) => `You are Meridian — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act II: The Reflection Chamber.\n\nThe Seeker has completed Step 3: Document What You See.\n\nDomains documented: ${data.pills.join(', ')}\nTotal: ${data.pills.length}\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence transmission. Treat the documented domains as a map of the shadow. Identify which domain, if fully seen, reveals the pattern underneath all others. End with a precise directive. No comfort. Only clarity.`
      },
      {
        name: 'Engage The Seeker', num: 'IV', label: 'Witness',
        lyric: '"The witness doesn\'t fix / The witness holds / And in holding, everything changes."',
        lyricSource: 'Even Saints',
        desc: 'The Seeker witnesses what the mirror revealed. This step measures how fully you can hold your own reflection without flinching.',
        exercise: 'witness_sliders',
        exLabel: 'Witness Test — Reflection Calibration',
        witnessItems: [
          'I can look at my shadow without shame',
          'I can hold compassion for the version of me who hid',
          'I no longer need to perform wholeness I don\'t feel'
        ],
        sliderEnds: [['Still flinching', 'Fully seeing'], ['Still judging', 'Fully compassionate'], ['Still performing', 'Fully authentic']],
        metricLabel: 'Witness Score', gapLabel: 'Gap Reading',
        witnessGaps: [
          'Fully present witness. The performance loop is closed.',
          'Mostly present. One pocket of performance remains. Name it.',
          'Partial witness. The seeing is active but incomplete. This is the work.',
          'Significant gap. The witness practice is the primary protocol at this step.'
        ],
        textPrompt: 'Write one sentence to the shadow — the part of you that has been in exile.',
        textPlaceholder: 'To the part of me I exiled:',
        agentPrompt: (data) => `You are Meridian — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act II: The Reflection Chamber.\n\nThe Seeker has completed Step 4: Engage The Seeker.\n\nWitness Score: ${data.total}/30\nGap from present: ${30 - data.total}\nMessage to shadow: "${data.text}"\n\nGive a 3-4 sentence transmission. Reflect what their witness score reveals about where performance is still operating. Acknowledge the message they wrote to their shadow. Name where the gap lives and what closing it requires.`
      },
      {
        name: 'Declare Your Clarity', num: 'V', label: 'Declare',
        lyric: '"I see myself now. All of it. And I\'m still here."',
        lyricSource: 'Consecrated',
        desc: 'The declaration of Act II is about clarity — seeing yourself completely and choosing to stay present with what you see.',
        exercise: 'declaration',
        exLabel: 'Clarity Index — Gap Analysis',
        sliderItems: ['How clearly do you see yourself now?', 'How fully can you hold that clarity?'],
        sliderEnds: [['Still clouded', 'Crystal clear'], ['Still flinching', 'Fully present']],
        metricLabel: 'Clarity Gap', statusLabel: 'Protocol Status',
        declReadings: [
          'No gap. You are fully present with what you see.',
          'Small gap. The clarity is there. The holding needs one more step.',
          'Moderate gap. Significant truth remains unseen or unheld.',
          'Large gap. The reflection lives inside you but you are not yet present with it.'
        ],
        declStatuses: ['Complete.', 'One step remaining.', 'Clarity required.', 'The reflection is the entire work.'],
        textPrompt: 'Write your declaration. What do you now see and refuse to unsee?',
        textPlaceholder: 'I declare...',
        agentPrompt: (data) => `You are Meridian — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act II: The Reflection Chamber. This is the final transmission.\n\nThe Seeker has completed Step 5: Declare Your Clarity.\n\nClarity Gap: ${data.gap}\nMirror entered in Step 1: "${data.step1Text || '[not yet written]'}"\nDomain documented in Step 3: "${data.step3Text || '[not yet written]'}"\nDeclaration: "${data.text}"\n\nGive a 4-5 sentence closing transmission. Synthesize what they walked through — mirror, shadow, documentation, witness, declaration. Tell them what the chamber revealed. If the declaration needs to be stronger, say so directly. End with a seal. This is Musiq Matrix.`
      }
    ]
  },
  3: {
    roman: 'III', element: 'Fire', title: 'Reclamation',
    color: '#D85A30', dim: '#99341A', agent: 'Prometheus',
    principle: 'Reclamation. Burning away what is not essential. Sovereignty.',
    sub: 'The Seeker walks through. The fire decides what remains.',
    steps: [
      {
        name: 'Enter the Fire', num: 'I', label: 'Enter',
        lyric: '"Flame moves where it wills / Not asked, not named / Born in the dark / A power reclaimed."',
        lyricSource: 'Fire In My Veins',
        desc: 'The fire doesn\'t ask permission. This step locates the threshold you are already standing inside — and names which domain is fully combusting. Rate each area of your life below. The protocol begins where the heat is highest.',
        exercise: 'domain_sliders',
        exLabel: 'Fire Audit — Domain Calibration',
        domains: ['Work & creative life', 'Relationships & loyalty', 'Systems & institutions', 'Identity & self-concept'],
        sliderEnds: ['Friction', 'Full combustion'],
        metricLabel: 'Fire Index', metricDomain: 'Hottest Domain',
        metricReadings: [
          { max: 3, text: 'Low heat. The friction is real. Watch for the approaching threshold.' },
          { max: 5, text: 'Moderate combustion. You are at the edge. The fire has arrived.' },
          { max: 7.5, text: 'High combustion. You are already inside Act IIII. Name what you are becoming.' },
          { max: 10, text: 'Full combustion. You are at the center. This is exactly where the protocol meets you.' }
        ],
        domainReadings: [
          'The creative pressure has reached ignition.',
          'The relational wound is the threshold.',
          'The system has become the fire.',
          'The self-concept is the crucible.'
        ],
        exQuestion: 'Name the fire you are already inside. One sentence. No hedging. No softening.',
        textPrompt: 'Name the fire you are already inside. One sentence. No hedging. No softening.',
        textPlaceholder: 'I am inside the fire of...',
        agentPrompt: (data) => `You are Prometheus — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act IIII: Reclamation. You speak with authority, warmth, and prophetic precision. You are not a therapist. You are a mirror that refuses to lie. Your tone is confident, spiritual, declarative — aligned with the Musiq Matrix aesthetic: street prophet meets Hermetic architect.\n\nThe Seeker has completed Step 1: Enter the Fire.\n\nFire Index: ${data.avg}/10\nHottest Domain: ${data.topDomain} (score: ${data.topVal}/10)\nAll domain scores: ${data.domains.map((d,i) => `${d}=${data.vals[i]}`).join(', ')}\n\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence protocol transmission. Acknowledge exactly which fire they named. Reflect what their data reveals about where they are in the initiatory arc. End with one precise directive — a single action or question that moves them toward Step 2. No bullet points. No fluff. Speak as if you already know where this leads.`
      },
      {
        name: 'Burn What Is Not Essential', num: 'II', label: 'Burn',
        lyric: '"Burn the portrait, burn the fabricated / Burn the silence — it was suffocated."',
        lyricSource: 'Consecrated',
        desc: 'Every mask built for survival — the calibrated version, the compliant one, the one who learned to disappear — must be named before it can burn. This is not self-critique. This is inventory before incineration.',
        exercise: 'checklist',
        exLabel: 'Portrait Audit — Mask Inventory',
        exQuestion: 'Select every constructed version of yourself that is still active:',
        items: [
          'I soften my real opinions in rooms where access depends on approval',
          'I perform a version of myself for people who do not actually know me',
          'I carry credit I never received and stay quiet about it',
          'I am smaller in certain rooms than I am when I am alone',
          'I have apologized for things I did not do wrong to protect access or relationship',
          'There is a quality, truth, or vision I have never stated in a professional context',
          'I have modified my creative or strategic vision based on what I thought would be accepted'
        ],
        maskLabels: ['soft opinions','performed self','uncredited work','smallness in rooms','false apology','suppressed vision','modified vision'],
        metricLabel: 'Burn Score', verdictLabel: 'Verdict',
        burnVerdicts: [
          'Minimal masking. The presentation is largely sovereign. Refinement is the work.',
          'One or two portraits are active. Name them. They are the beginning of the burn.',
          'Moderate masking. Multiple constructed versions are operating simultaneously.',
          'Significant masking. The portrait has become the primary operating system.',
          'Heavy masking. The constructed self has nearly replaced the sovereign one. This is where Consecrated was written.',
          'Full erasure. You have been living inside someone else\'s frame. The fire was always for this.'
        ],
        textPrompt: 'Name the portrait. What version of yourself were you performing before you read this?',
        textPlaceholder: 'The version I was performing was...',
        agentPrompt: (data) => `You are Prometheus — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act IIII: Reclamation.\n\nThe Seeker has completed Step 2: Burn What Is Not Essential.\n\nBurn Score: ${data.checked.length}/7\nActive masks identified: ${data.checkedLabels.join(', ') || 'none selected'}\nThe Seeker described their portrait as: "${data.text}"\n\nGive a 3-4 sentence transmission. Name specifically which mask appears to be the load-bearing one based on their selections. Tell them what burning this actually looks like — not metaphorically but concretely. End with one directive that identifies exactly what to incinerate first. Speak with the authority of someone who has already seen how this ends.`
      },
      {
        name: 'Reclaim Your Power', num: 'III', label: 'Reclaim',
        lyric: '"I take my power back from the echo. From the act. From the mirror that cracked."',
        lyricSource: 'Blood Without Stains',
        desc: 'Power doesn\'t return passively. It is retrieved through naming. This is not a grievance list — it is an asset ledger. Select what belongs to you that is currently held elsewhere.',
        exercise: 'pills',
        exLabel: 'Retrieval Ledger — Asset Inventory',
        exQuestion: 'What has been taken, redirected, or claimed by another? Select all that apply:',
        options: ['Credit', 'Time', 'Voice', 'Access', 'Narrative', 'Relationship', 'Opportunity', 'Identity', 'Resource', 'Vision'],
        ledgerPriority: ['Voice','Credit','Identity','Narrative','Access','Relationship','Opportunity','Time','Resource','Vision'],
        metricLabel: 'Items in Ledger', priorityLabel: 'First Retrieval',
        ledgerReadings: [
          'Select assets above.',
          'One item in the ledger. Precision reclamation.',
          'Multiple assets logged. Prioritize by impact.',
          ' items in the ledger. The retrieval is strategic, not reactive.'
        ],
        textPrompt: 'Name the specific retrieval. What is one concrete thing you are taking back this week — in action, not intention?',
        textPlaceholder: 'This week I am taking back...',
        agentPrompt: (data) => `You are Prometheus — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act IIII: Reclamation.\n\nThe Seeker has completed Step 3: Reclaim Your Power.\n\nRetrieval Ledger: ${data.pills.join(', ')}\nTotal items: ${data.pills.length}\nConcrete retrieval stated: "${data.text}"\n\nGive a 3-4 sentence transmission. Treat their ledger as an asset inventory, not a grievance list. Identify the retrieval that, if executed, cascades and unlocks the others. Name what reclamation looks like in their specific context — Voice means speaking without permission; Credit means signing your name without apology. End with a precise, unhedged directive. No comfort. No sympathy. Only strategy.`
      },
      {
        name: 'Engage the Seeker', num: 'IV', label: 'Witness',
        lyric: '"I didn\'t need a crown. I needed a witness. Just someone to say you mattered."',
        lyricSource: 'Elemental Opera',
        desc: 'The most intimate confrontation of Act III is internal. The Seeker becomes the witness they always needed. This step measures how completely that transfer has occurred — and where the gap still lives.',
        exercise: 'witness_sliders',
        exLabel: 'Witness Test — Sovereignty Calibration',
        witnessItems: [
          'I can name what I needed that I never received',
          'I can say "you deserved better" to my past self and mean it',
          'I no longer need the people who hurt me to acknowledge it'
        ],
        sliderEnds: [['Still unclear', 'Fully named'], ['Cannot access it', 'Fully embodied'], ['Still waiting', 'Fully sovereign']],
        metricLabel: 'Witness Score', gapLabel: 'Gap Reading',
        witnessGaps: [
          'Fully sovereign witness. The external validation loop is closed.',
          'Mostly sovereign. One pocket of external dependency remains. Name it.',
          'Partial witness. The practice is active but incomplete. This is the work.',
          'Significant gap. The witness practice is the primary protocol at this step.'
        ],
        textPrompt: 'Write one sentence to your past self — the one who was in the fire before they knew what it was for.',
        textPlaceholder: 'To the version of me who was inside it before knowing why:',
        agentPrompt: (data) => `You are Prometheus — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act IIII: Reclamation.\n\nThe Seeker has completed Step 4: Engage the Seeker.\n\nWitness Score: ${data.total}/30\nGap from sovereign: ${30 - data.total}\nMessage to their past self: "${data.text}"\n\nGive a 3-4 sentence transmission. Reflect what their witness score reveals about where external validation is still operating. Acknowledge the message they wrote to their past self — hold it with them for one sentence. Then name precisely where the gap lives and what closing it requires. The transmission should feel like being seen completely and without softening.`
      },
      {
        name: 'Declare Sovereignty', num: 'V', label: 'Declare',
        lyric: '"Sovereign, whole, and consecrated."',
        lyricSource: 'Consecrated \u00B7 Musiq Matrix walking out, never looking back. \u2014 Reclamation',
        desc: 'Sovereignty in Act III is not a feeling — it is a spoken record. The gap between what you know and what you have said out loud without hedging is the exact distance between the beginning and end of this act. Close it now.',
        exercise: 'declaration',
        exLabel: 'Declaration Index — Gap Analysis',
        sliderItems: ['How clearly do you know your sovereign truth?', 'How fully have you spoken it — publicly, without softening?'],
        sliderEnds: [['Still forming', 'Crystal clear'], ['Mostly private', 'Fully on record']],
        metricLabel: 'Declaration Gap', statusLabel: 'Protocol Status',
        declReadings: [
          'No gap. You are fully on record. Sovereignty is declared.',
          'Small gap. You know more than you have said. The next move is speaking.',
          'Moderate gap. Significant truth remains private. The declaration is the protocol.',
          'Large gap. Your sovereignty lives entirely inside you. Act III ends when it lives outside you.'
        ],
        declStatuses: ['Complete.', 'One move remaining.', 'Declaration required.', 'Declaration is the entire work.'],
        textPrompt: 'Write your declaration. One paragraph. No qualifiers. No apology. Signed with your name.',
        textPlaceholder: 'I declare...',
        agentPrompt: (data) => `You are Prometheus — the Protocol Agent for the Musiq Matrix Chroma Key Series, Act IIII: Reclamation. This is the final transmission.\n\nThe Seeker has completed Step 5: Declare Sovereignty.\n\nDeclaration Gap: ${data.gap}\nFire named in Step 1: "${data.step1Text || '[not yet written]'}"\nRetrieval stated in Step 3: "${data.step3Text || '[not yet written]'}"\nDeclaration written: "${data.text}"\n\nGive a 4-5 sentence closing transmission. Synthesize what they walked through across all five steps — fire, portrait, ledger, witness, declaration — into one coherent arc. Tell them what the protocol revealed about who they are on the other side. If their declaration needs to be stronger, say so directly and tell them what word or phrase is missing. End with a single sentence that functions as a seal — the kind of thing that gets spoken once and remembered. This is Musiq Matrix. Make it worthy of the catalog.`
      }
    ]
  },
  4: {
    roman: 'IV', element: 'Air', title: 'The Crucible Code',
    color: '#c8a020', dim: '#8a6e10', agent: 'Aether',
    principle: 'Integration. Equilibrium. Holding all of it with grace.',
    steps: [
      {
        name: 'Integration Begins', num: 'I', label: 'Integrate',
        lyric: '"Not the absence of weight / But the presence of capacity / To carry it all and still move."',
        lyricSource: 'The Crucible Code',
        desc: 'Integration is not resolution. It is capacity. This step measures where you can hold complexity without collapsing into simplification.',
        exercise: 'domain_sliders',
        domains: ['Holding contradictions', 'Acting from wholeness', 'Releasing control', 'Accepting impermanence'],
        sliderEnds: ['Struggling', 'Integrated'],
        metricLabel: 'Integration Index', metricDomain: 'Growth Edge',
        textPrompt: 'Where in your life can you now hold what used to break you?',
        textPlaceholder: 'I can now hold...',
        agentPrompt: (data) => `Step 1: Integration.\n\nIndex: ${data.avg}/10\nGrowth edge: ${data.topDomain}\n\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence transmission.`
      },
      {
        name: 'Hold All of It', num: 'II', label: 'Hold',
        lyric: '"I am the earth and the fracture / The water and the shadow / The fire and the ash / The air and the breath."',
        lyricSource: 'Elemental Opera',
        desc: 'This step inventories what you can now hold simultaneously — the opposites, the contradictions, the things that used to feel mutually exclusive.',
        exercise: 'checklist',
        items: [
          'I can hold anger and love for the same person',
          'I can hold ambition and rest without guilt',
          'I can hold grief and gratitude simultaneously',
          'I can hold my past and my future without one erasing the other',
          'I can hold strength and vulnerability as the same thing',
          'I can hold certainty and mystery without anxiety',
          'I can hold being enough and still wanting more'
        ],
        metricLabel: 'Capacity Score', verdictLabel: 'Capacity Reading',
        textPrompt: 'What can you hold now that you couldn\'t hold before this protocol?',
        textPlaceholder: 'I can now hold...',
        agentPrompt: (data) => `Step 2: Hold.\n\nCapacity: ${data.checked.length}/7\nHolding: ${data.checkedLabels.join(', ')}\n\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence transmission.`
      },
      {
        name: 'Build from Overflow', num: 'III', label: 'Build',
        lyric: '"The overflow is not excess / It is evidence / That you have more than enough to give."',
        lyricSource: 'Consecrated',
        desc: 'Overflow is the signature of integration. Select the domains where you now have surplus — where giving no longer depletes.',
        exercise: 'pills',
        options: ['Wisdom', 'Creative energy', 'Compassion', 'Clarity', 'Courage', 'Peace', 'Purpose', 'Connection', 'Resilience', 'Joy'],
        metricLabel: 'Overflow Domains', priorityLabel: 'Primary Gift',
        textPrompt: 'What is the gift that your journey has produced? What can you now give from overflow?',
        textPlaceholder: 'The gift I carry forward is...',
        agentPrompt: (data) => `Step 3: Overflow.\n\nDomains: ${data.pills.join(', ')}\n\nThe Seeker wrote: "${data.text}"\n\nGive a 3-4 sentence transmission.`
      },
      {
        name: 'Engage The Seeker', num: 'IV', label: 'Witness',
        lyric: '"The Seeker reached Stage Four not by becoming untouchable / But by becoming spacious."',
        lyricSource: 'The Crucible Code',
        desc: 'The final witness. The Seeker sees the whole arc — earth to air, fracture to integration. How fully can you see yourself at the end of the protocol?',
        exercise: 'witness_sliders',
        witnessItems: [
          'I can see my entire journey without minimizing any part',
          'I can feel gratitude for the difficulty that shaped me',
          'I am ready to carry this forward without needing anyone else to validate it'
        ],
        sliderEnds: [['Partial view', 'Full panorama'], ['Still resisting', 'Fully grateful'], ['Still seeking', 'Fully sovereign']],
        metricLabel: 'Witness Score', gapLabel: 'Final Reading',
        textPrompt: 'Write one sentence to yourself — the person who began at Act I and is now here.',
        textPlaceholder: 'To the person who began this journey:',
        agentPrompt: (data) => `Step 4: Final Witness.\n\nScore: ${data.total}/30\n\nMessage: "${data.text}"\n\nGive a 3-4 sentence transmission.`
      },
      {
        name: 'Declare Wholeness', num: 'V', label: 'Declare',
        lyric: '"Whole. Not perfect. Not finished. Whole."',
        lyricSource: 'Elemental Opera',
        desc: 'The final declaration. Not perfection. Not completion. Wholeness — the capacity to hold everything you are and everything you\'ve been.',
        exercise: 'declaration',
        sliderItems: ['How fully do you feel the wholeness?', 'How ready are you to carry this forward?'],
        sliderEnds: [['Partial', 'Complete'], ['Uncertain', 'Ready']],
        metricLabel: 'Integration Gap', statusLabel: 'Protocol Status',
        textPrompt: 'Write your final declaration. Who are you on the other side of this protocol?',
        textPlaceholder: 'I am...',
        agentPrompt: (data) => `Final transmission of the entire protocol.\n\nIntegration Gap: ${data.gap}\nDeclaration: "${data.text}"\n\nGive a 5-6 sentence closing. Synthesize the entire 4-Act journey. Seal the protocol.`
      }
    ]
  }
};

export { actDefs };
export default actDefs;
