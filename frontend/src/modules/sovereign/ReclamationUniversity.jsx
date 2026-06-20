import { useEffect, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getReclamationUniversityByTrack } from '../../lib/supabase/reclamationUniversity';

export default function ReclamationUniversity({ selectedTrackId }) {
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    let active = true;
    getReclamationUniversityByTrack(selectedTrackId).then((payload) => {
      if (active) setLesson(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  return (
    <SovereignModulePanel eyebrow="Reclamation University" title={lesson?.lesson_title || 'Lesson Pending'}>
      <p className="text-zinc-400">{lesson?.summary || 'Teaching module data will appear here for the selected sonic artifact.'}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
        <span>{lesson?.lesson_type || 'Protocol Lesson'}</span>
        <span>{lesson?.estimated_minutes ? `${lesson.estimated_minutes} min` : '— min'}</span>
      </div>
    </SovereignModulePanel>
  );
}
