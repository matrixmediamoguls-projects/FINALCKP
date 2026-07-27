const SECTION_DEFINITIONS = [
  ['Hook', 'doctrine', 'hook'],
  ['Real-World 2026 Scenario', 'case-study', 'scenario'],
  ['Chroma Key / Reclamation Lens', 'activation', 'chromaLens'],
  ['Historical / Timeless Context', 'doctrine', 'timelessContext'],
  ['Practical Translation', 'exercise', 'practicalTranslation'],
  ['Why This Matters', 'warning', 'value'],
  ['Coherence Reinforcement', 'activation', 'coherence'],
];

export function buildHermeticLessonContent({
  lesson,
  lessonIndex,
  lessonCount,
  curriculumSections,
}) {
  if (!lesson || !curriculumSections?.length) return null;

  const conceptIndex = Math.min(
    curriculumSections.length - 1,
    Math.floor((lessonIndex * curriculumSections.length) / Math.max(lessonCount, 1))
  );
  const concept = curriculumSections[conceptIndex];

  return {
    intro: lesson.summary,
    sections: [
      {
        heading: 'Lesson Focus',
        type: 'doctrine',
        body: `${lesson.title} develops ${concept.title.replace(/^\d+\s*·\s*/, '')} as an observable practice rather than an abstract claim.`,
        bullets: lesson.keyPoints || [],
        callout: concept.anchor,
      },
      ...SECTION_DEFINITIONS.map(([heading, type, key]) => ({
        heading,
        type,
        body: concept[key],
      })),
    ],
    reflection: {
      prompt: `Field reflection · ${lesson.number} ${lesson.title}`,
      questions: [
        'What concrete pattern from your current life makes this lesson visible?',
        'What is signal, what is overlay, and what evidence separates them?',
        'What one observable behavior will demonstrate integration within the next twenty-four hours?',
      ],
      placeholder: 'Name the pattern, cite the evidence, and commit to one behavior you can observe and repeat…',
    },
  };
}
