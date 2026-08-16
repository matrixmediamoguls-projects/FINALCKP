/* Reclamation University — the canonical curriculum.
 *
 * Every Hermetic Hall module runs these eleven sections in this order. The ids
 * are the stable identifiers progress and analytics reference, so they must not
 * be renamed to suit a layout: presentation changes, `id` does not.
 *
 * This replaces both the earlier seven-section structure and the five-stage
 * ReclamationModuleEngine flow. Neither should be reintroduced for a Hall module.
 */

export const CURRICULUM_SECTIONS = [
  { id: 'intro',          n: '01', label: 'Intro',          phase: 'UNDERSTAND' },
  { id: 'principle',      n: '02', label: 'Principle',      phase: 'UNDERSTAND' },
  { id: 'key-concepts',   n: '03', label: 'Key Concepts',   phase: 'UNDERSTAND' },
  { id: 'why-it-matters', n: '04', label: 'Why It Matters', phase: 'CONNECT' },
  { id: 'domains',        n: '05', label: 'Domains',        phase: 'CONNECT' },
  { id: 'reclamation',    n: '06', label: 'Reclamation',    phase: 'CONNECT' },
  { id: '2026-lens',      n: '07', label: '2026 Lens',      phase: 'CONNECT' },
  { id: 'reflection',     n: '08', label: 'Reflection',     phase: 'APPLY' },
  { id: 'protocol',       n: '09', label: 'Protocol',       phase: 'APPLY' },
  { id: 'artifact',       n: '10', label: 'Artifact',       phase: 'APPLY' },
  { id: 'summary',        n: '11', label: 'Summary',        phase: 'INTEGRATE' },
];

export const SECTION_IDS = CURRICULUM_SECTIONS.map((s) => s.id);

export const SECTION_COUNT = CURRICULUM_SECTIONS.length;

export function getSectionIndex(id) {
  return SECTION_IDS.indexOf(id);
}

export function getSection(id) {
  return CURRICULUM_SECTIONS.find((s) => s.id === id) || null;
}

/* available | active | completed | locked — the four states §29 requires the
   interface to support. Completion is supplied by the module, never inferred
   from which screens happen to have been rendered. */
export function sectionState({ index, activeIndex, maxIndex, completedIds = [] }) {
  const section = CURRICULUM_SECTIONS[index];
  if (index === activeIndex) return 'active';
  if (section && completedIds.includes(section.id)) return 'completed';
  if (index > maxIndex) return 'locked';
  return 'available';
}
