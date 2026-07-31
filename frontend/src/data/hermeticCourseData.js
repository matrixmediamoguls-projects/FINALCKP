const moduleNames = [
  ['MENTALISM', 'THE AUTHORING MIND'],
  ['CORRESPONDENCE', 'AS ABOVE, SO BELOW'],
  ['VIBRATION', 'NOTHING RESTS'],
  ['POLARITY', 'EVERYTHING IS DUAL'],
  ['RHYTHM', 'THE PENDULUM AND THE RETURN'],
  ['CAUSE AND EFFECT', 'THE LEDGER OF CONSEQUENCE'],
  ['GENDER', 'THE GENERATIVE UNION'],
];

const COURSE_MODULES = moduleNames.map(([title, subtitle], index) => ({
  id: `mod-${index + 1}`,
  number: index + 1,
  title,
  subtitle,
  law: title,
  lessons: [],
}));

const COURSE_MODULE_MAP = Object.fromEntries(COURSE_MODULES.map((module) => [module.id, module]));

export { COURSE_MODULES, COURSE_MODULE_MAP };
