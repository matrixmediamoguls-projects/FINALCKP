const responseGuidance = 'Name a concrete pattern, explain what the law reveals, and commit to one observable practice.';

const lawDefinitions = [
  {
    number: 1,
    slug: 'mentalism',
    name: 'Mentalism',
    axiom: 'The All is Mind. The Universe is Mental.',
    inquiry: 'Which repeated thought is currently shaping your experience?',
    shadowTitle: 'Unexamined Thought',
    shadowDefinition: 'A repeated mental instruction is treated as fact before it is consciously examined.',
    lightTitle: 'Conscious Authorship',
    replacementLaw: 'I witness the thought, test it, and choose the instruction I continue to animate.',
  },
  {
    number: 2,
    slug: 'correspondence',
    name: 'Correspondence',
    axiom: 'As above, so below. As below, so above.',
    inquiry: 'What inner pattern is being repeated in your outer environment?',
    shadowTitle: 'Broken Correspondence',
    shadowDefinition: 'Outer repetition is treated as random while its inner pattern remains unnamed.',
    lightTitle: 'Pattern Alignment',
    replacementLaw: 'I read the correspondence between inner law and outer form, then align both deliberately.',
  },
  {
    number: 3,
    slug: 'vibration',
    name: 'Vibration',
    axiom: 'Nothing rests. Everything moves. Everything vibrates.',
    inquiry: 'What signal are your words, choices, and attention transmitting now?',
    shadowTitle: 'Unconscious Signal',
    shadowDefinition: 'A signal is continuously transmitted without awareness of its direction or effect.',
    lightTitle: 'Deliberate Frequency',
    replacementLaw: 'I become responsible for the signal I sustain and the movement it creates.',
  },
  {
    number: 4,
    slug: 'polarity',
    name: 'Polarity',
    axiom: 'Everything is dual. Everything has poles.',
    inquiry: 'Which apparent opposite can be understood as another degree of the same thing?',
    shadowTitle: 'False Opposition',
    shadowDefinition: 'Two poles are mistaken for unrelated forces, making transformation appear impossible.',
    lightTitle: 'Conscious Transmutation',
    replacementLaw: 'I locate the spectrum, choose my direction, and move by conscious degrees.',
  },
  {
    number: 5,
    slug: 'rhythm',
    name: 'Rhythm',
    axiom: 'Everything flows, out and in. Everything has its tides.',
    inquiry: 'What cycle are you inside, and what does this phase require rather than resist?',
    shadowTitle: 'Rhythmic Captivity',
    shadowDefinition: 'A temporary swing is mistaken for a permanent identity or final condition.',
    lightTitle: 'Measured Return',
    replacementLaw: 'I recognize the cycle without surrendering authorship to it.',
  },
  {
    number: 6,
    slug: 'cause-and-effect',
    name: 'Cause and Effect',
    axiom: 'Every cause has its effect. Every effect has its cause.',
    inquiry: 'Which result in your life can be traced to a repeated choice, omission, or condition?',
    shadowTitle: 'Effect Without Cause',
    shadowDefinition: 'A result is treated as isolated while the chain of choices and conditions stays invisible.',
    lightTitle: 'Causal Agency',
    replacementLaw: 'I trace the chain honestly and introduce a cause that can produce a different effect.',
  },
  {
    number: 7,
    slug: 'gender',
    name: 'Gender',
    axiom: 'Gender is in everything. Creation holds both principles.',
    inquiry: 'Where does your process need clearer direction, deeper receptivity, or a deliberate union of both?',
    shadowTitle: 'Divided Creation',
    shadowDefinition: 'Direction and receptivity are split apart, leaving creation forced, stalled, or incomplete.',
    lightTitle: 'Generative Union',
    replacementLaw: 'I unite direction with receptivity so conception can become form.',
  },
];

const buildDeclarationFields = (law) => [
  {
    key: 'observation',
    label: 'What pattern are you observing?',
    placeholder: law.inquiry,
    feedbackCopy: responseGuidance,
  },
  {
    key: 'evidence',
    label: 'What evidence makes the pattern visible?',
    placeholder: 'Name a repeated event, choice, phrase, response, or result...',
    feedbackCopy: responseGuidance,
  },
  {
    key: 'practice',
    label: `How will you practice the Law of ${law.name}?`,
    placeholder: 'State one action you can repeat and observe...',
    feedbackCopy: responseGuidance,
  },
  {
    key: 'declaration',
    label: 'What law are you authoring now?',
    placeholder: law.replacementLaw,
    feedbackCopy: responseGuidance,
  },
];

const buildModule = (law) => ({
  id: `hermetic-law-${law.number}-${law.slug}`,
  slug: law.slug,
  order: law.number,
  title: `Law ${String(law.number).padStart(2, '0')}: ${law.name}`,
  subtitle: law.axiom,
  programLabel: 'The Hermetic Hall',
  sourceTrackIds: [`${law.slug}-axiom`, `${law.slug}-application`],
  initiationCopy: [
    `You have entered the chamber of ${law.name}.`,
    law.axiom,
    law.inquiry,
    'This module is its own Hermetic Hall transmission. Observe the law, test it against lived evidence, and convert insight into a deliberate practice.',
  ],
  learningObjectives: [
    `Explain the Law of ${law.name} in your own words without relying on abstraction.`,
    'Identify one current pattern that demonstrates the law through concrete evidence.',
    'Author one observable practice that applies the law deliberately.',
  ],
  lyricAnchors: [
    {
      key: `${law.slug}-axiom`,
      label: 'The Axiom',
      teaching: law.axiom,
      line: law.inquiry,
    },
    {
      key: `${law.slug}-practice`,
      label: 'The Practice',
      teaching: law.replacementLaw,
      line: 'A law becomes useful when it changes what you can recognize and choose.',
    },
  ],
  shadowCodes: [
    {
      id: `${law.slug}-SC-01`,
      displayId: 'SC-01',
      title: law.shadowTitle,
      definition: law.shadowDefinition,
      diagnostic: law.inquiry,
      collectiveDiagnostic: `Where does this pattern operate through our shared habits, language, or systems?`,
    },
  ],
  lightMappings: [
    {
      shadowId: `${law.slug}-SC-01`,
      shadowTitle: law.shadowTitle,
      lightId: `${law.slug}-LC-01`,
      lightTitle: law.lightTitle,
      activation: law.replacementLaw,
      replacementLaw: law.replacementLaw,
    },
  ],
  declarationFields: buildDeclarationFields(law),
  integrationKey: law.replacementLaw,
  xpReward: 700,
  estimatedMinutes: 45,
});

export const HERMETIC_HALL_FACULTY = {
  id: 'hermetic-hall',
  slug: 'hermetic-hall',
  title: 'The Hermetic Hall',
  subtitle: 'Seven laws. Seven chambers. Seven distinct practices.',
  description: 'A dedicated sequence for studying and applying the Seven Hermetic Laws.',
  accent: 'ember',
  artwork: '/reclamation-university/hermetic-hall.png',
  artworkAlt: 'The seven illuminated chambers of the Hermetic Hall',
  modules: lawDefinitions.map(buildModule),
};

export function getHermeticHallModule(moduleSlug) {
  return HERMETIC_HALL_FACULTY.modules.find((module) => module.slug === moduleSlug);
}
