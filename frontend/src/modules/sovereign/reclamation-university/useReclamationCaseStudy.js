import { useCallback, useEffect, useState } from "react";

const EMPTY_CASE_STUDY = {
  song_title: "",
  track_number: null,
  album_title: "Reclamation",
  artist_name: "Musiq Matrix",
  artwork_url: "",
  audio_url: "",
  narration_url: "",
  context: "",
  lyric_excerpt: "",
  analysis: "",
  reclamation_insight: "",
};

/**
 * Loads the Reclamation editorial case study for the active lesson.
 * The caller supplies the project's existing Supabase client so this hook
 * does not create a second client or duplicate environment configuration.
 */
export function useReclamationCaseStudy({ supabase, lessonId, enabled = true }) {
  const [caseStudy, setCaseStudy] = useState(EMPTY_CASE_STUDY);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled || !supabase || !lessonId) return;

    setStatus("loading");
    setError(null);

    const { data, error: queryError } = await supabase
      .from("reclamation_case_studies")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("is_published", true)
      .maybeSingle();

    if (queryError) {
      setError(queryError);
      setStatus("error");
      return;
    }

    setCaseStudy({ ...EMPTY_CASE_STUDY, ...(data || {}) });
    setStatus(data ? "ready" : "empty");
  }, [enabled, lessonId, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (changes) => {
      if (!supabase || !lessonId) {
        return { error: new Error("Supabase client and lessonId are required.") };
      }

      setStatus("saving");
      const payload = {
        ...caseStudy,
        ...changes,
        lesson_id: lessonId,
        updated_at: new Date().toISOString(),
      };

      const { data, error: saveError } = await supabase
        .from("reclamation_case_studies")
        .upsert(payload, { onConflict: "lesson_id" })
        .select("*")
        .single();

      if (saveError) {
        setError(saveError);
        setStatus("error");
        return { error: saveError };
      }

      setCaseStudy({ ...EMPTY_CASE_STUDY, ...data });
      setStatus("ready");
      return { data };
    },
    [caseStudy, lessonId, supabase],
  );

  return {
    caseStudy,
    setCaseStudy,
    status,
    error,
    reload: load,
    save,
  };
}
