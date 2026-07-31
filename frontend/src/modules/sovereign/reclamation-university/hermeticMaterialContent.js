export const DEFAULT_MATERIAL_CONTENT = {
  intro: {
    title: "Before the Body, the All Mind",
    lede: "Before an action becomes visible, a pattern of thought has already organized what can be noticed, believed, and chosen.",
    question: "Who was shaping your mind before you learned to shape it yourself?",
    sectionTitle: "Enter the Principle",
    paragraphs: [
      "This module begins by separating thought from truth. Familiar ideas may feel personal while still being inherited, repeated, or reinforced by the environments around you.",
      "The work is not to control every thought. It is to become conscious of which thoughts are directing you.",
    ],
  },
  principle: {
    title: "The Law of Mentalism",
    lede: "The All is Mind; the Universe is Mental.",
    paragraphs: [
      "Everything begins in mind. Before any form, action, or experience, there is thought. Mind is the source and substance of all that exists.",
      "Your outer world is shaped by the patterns through which you interpret, prioritize, and respond.",
    ],
    quote: "Mind precedes matter. Master mind, and you master direction.",
  },
  reflection: {
    prompt: "What does this principle help you notice about the ways your inner world has been shaping your outer experience?",
    supports: [
      "When have you experienced this principle without recognizing it?",
      "What pattern in your life does this lesson help explain?",
      "What challenged your assumptions?",
      "What feels different after reading this lesson?",
    ],
    closing: "Understanding begins with observation. Change begins with practice.",
  },
};

export function mergeMaterialContent(base, edits) {
  const next = { ...base };
  Object.entries(edits || {}).forEach(([section, values]) => {
    next[section] = { ...(base[section] || {}), ...(values || {}) };
  });
  return next;
}
