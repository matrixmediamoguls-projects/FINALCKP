export function getNextCurriculumDestination({
  lessons,
  activeLessonId,
  hallModules,
  moduleOrder,
}) {
  const activeLessonIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const nextLesson = activeLessonIndex >= 0 ? lessons[activeLessonIndex + 1] : null;

  if (nextLesson) {
    return { type: 'lesson', lessonId: nextLesson.id };
  }

  const nextModule = [...hallModules]
    .sort((first, second) => first.order - second.order)
    .find((item) => item.order > moduleOrder);

  if (nextModule) {
    return { type: 'module', slug: nextModule.slug };
  }

  return { type: 'hall' };
}

export function getCurriculumAdvanceLabel(destination) {
  if (destination.type === 'module') return 'Next Module';
  if (destination.type === 'hall') return 'Return to Hall';
  return 'Next Lesson';
}
