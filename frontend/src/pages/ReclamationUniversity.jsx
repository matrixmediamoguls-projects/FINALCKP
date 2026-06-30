import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, Flame, GraduationCap, Library, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getSupabaseClient } from "../services/supabase/client";
import "./ReclamationUniversity.css";

const FALLBACK_LESSONS = [
  {
    id: "fallback-01",
    lesson_title: "Enter The Fire Consciously",
    lesson_type: "light_code",
    primary_light_code: "The fire reveals what is ready to be reclaimed.",
    summary: "The opening lesson establishes Act III as a focused path of identity, clarity, and creative return.",
    lesson_body: "Reclamation University frames the album as a learning system. Each lesson connects a track to a core idea, a practical reflection, and a clear next step. The user is guided to read the music as a signal map rather than passive content.",
    reflection_prompt: "What part of your life is asking to be reclaimed with clarity?",
    unlock_order: 1,
    difficulty_level: 2,
    estimated_minutes: 7,
    is_required: true,
    tracks: { track_order: 1, title: "Welcome To The Fire", core_theme: "Initiation", signal_type: "Overture" }
  },
  {
    id: "fallback-02",
    lesson_title: "Remember Who You Are",
    lesson_type: "light_code",
    primary_light_code: "Reclamation is return, not reinvention.",
    summary: "This lesson teaches the difference between identity and adaptation.",
    lesson_body: "The user is invited to separate the self they chose from the self they built under pressure. The goal is not to become acceptable. The goal is to become accurate.",
    reflection_prompt: "Which version of yourself is ready to step forward now?",
    unlock_order: 2,
    difficulty_level: 3,
    estimated_minutes: 9,
    is_required: true,
    tracks: { track_order: 2, title: "Reclamation", core_theme: "Identity Return", signal_type: "Declaration" }
  },
  {
    id: "fallback-09",
    lesson_title: "The Sun Don’t Invoice",
    lesson_type: "doctrine",
    primary_light_code: "Your existence is not a debt.",
    summary: "This lesson separates worth from output, approval, and performance.",
    lesson_body: "The sun does not ask permission to shine. This doctrine restores the original order: being first, action second. Productivity can express purpose, but it cannot create worth.",
    reflection_prompt: "Where have you been trying to earn what was already yours?",
    unlock_order: 9,
    difficulty_level: 4,
    estimated_minutes: 11,
    is_required: true,
    tracks: { track_order: 9, title: "Blueprint Of The Divine", core_theme: "Divine Design", signal_type: "Doctrine" }
  }
];

const COURSE_MAP = ["Light Codes", "Core Lesson", "Recovered Signal", "Reflection", "Integration"];

function getTrack(lesson) {
  return Array.isArray(lesson.tracks) ? lesson.tracks[0] : lesson.tracks;
}

function formatType(type) {
  return String(type || "light_code").replace(/_/g, " ").toUpperCase();
}

function stars(level = 0) {
  const safe = Math.max(0, Math.min(5, Number(level) || 0));
  return "★".repeat(safe) + "☆".repeat(5 - safe);
}

export default function ReclamationUniversity() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessons, setLessons] = useState(FALLBACK_LESSONS);
  const [activeId, setActiveId] = useState(FALLBACK_LESSONS[0].id);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("fallback");

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseClient();
    if (!supabase) return undefined;

    supabase
      .from("reclamation_university")
      .select(`
        id,
        track_id,
        lesson_title,
        lesson_type,
        primary_light_code,
        lesson_body,
        summary,
        reflection_prompt,
        unlock_order,
        difficulty_level,
        estimated_minutes,
        is_required,
        tracks:track_id ( id, track_order, title, core_theme, signal_type, cover_image_url )
      `)
      .order("unlock_order", { ascending: true })
      .then(({ data, error }) => {
        if (!mounted || error || !Array.isArray(data) || data.length === 0) return;
        setLessons(data);
        setActiveId(data[0].id);
        setSource("supabase");
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return lessons;
    return lessons.filter((lesson) => {
      const track = getTrack(lesson);
      return [lesson.lesson_title, lesson.primary_light_code, lesson.summary, track?.title, track?.core_theme]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [lessons, query]);

  const active = filtered.find((lesson) => lesson.id === activeId) || filtered[0] || lessons[0];
  const activeTrack = getTrack(active);
  const completion = Math.min(100, Math.round((lessons.length / 30) * 100));
  const userName = user?.name || user?.email?.split("@")[0] || "Seeker";

  return (
    <main className="ru-page">
      <div className="ru-grid" aria-hidden="true" />
      <div className="ru-orb ru-orb-a" aria-hidden="true" />
      <div className="ru-orb ru-orb-b" aria-hidden="true" />

      <header className="ru-header">
        <button type="button" onClick={() => navigate("/experiencemode/sovereign")}>
          <ArrowLeft /> Sovereign OS
        </button>
        <div>
          <span>Chroma Key Protocol</span>
          <h1>Reclamation University</h1>
        </div>
        <aside>
          <ShieldCheck />
          <span>{source === "supabase" ? "Supabase Live" : "Fallback Curriculum"}</span>
          <strong>{userName}</strong>
        </aside>
      </header>

      <section className="ru-shell">
        <aside className="ru-panel ru-library">
          <div className="ru-panel-title"><Library /><span>Lesson Library</span></div>
          <label className="ru-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search light codes" /></label>
          <div className="ru-course-map">
            {COURSE_MAP.map((item, index) => <div key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></div>)}
          </div>
          <div className="ru-lessons">
            {filtered.map((lesson) => {
              const track = getTrack(lesson);
              return (
                <button key={lesson.id} type="button" className={lesson.id === active.id ? "is-active" : ""} onClick={() => setActiveId(lesson.id)}>
                  <small>{String(lesson.unlock_order || track?.track_order || 0).padStart(2, "0")}</small>
                  <span>{lesson.lesson_title}</span>
                  <b>{track?.title || "Reclamation Track"}</b>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="ru-core">
          <div className="ru-core-kicker"><span>Primary Light Code</span><b>RU-{String(active.unlock_order || activeTrack?.track_order || 0).padStart(2, "0")}</b></div>
          <h2>{active.lesson_title}</h2>
          <div className="ru-track-chip"><Flame /><span>Track {String(activeTrack?.track_order || active.unlock_order || 0).padStart(2, "0")}</span><strong>{activeTrack?.title || "Reclamation"}</strong></div>
          <blockquote>{active.primary_light_code}</blockquote>
          <article><span>Lesson Summary</span><p>{active.summary}</p></article>
          <article><span>Lesson Body</span><p>{active.lesson_body}</p></article>
          <div className="ru-signal"><BookOpen /><div><span>Recovered Signal</span><p>This lesson connects to the track signal: <strong>{activeTrack?.signal_type || "Doctrine"}</strong>. The user identifies the central idea and carries it into action.</p></div></div>
          <div className="ru-reflection"><span>Reflection Prompt</span><strong>{active.reflection_prompt}</strong></div>
        </section>

        <aside className="ru-panel ru-meta">
          <div className="ru-seal"><GraduationCap /><span>University Status</span><strong>Unlocked</strong></div>
          <div className="ru-meta-grid">
            <div><span>Difficulty</span><strong>{stars(active.difficulty_level)}</strong></div>
            <div><span>Estimated Time</span><strong>{active.estimated_minutes || 8} Min</strong></div>
            <div><span>Element</span><strong>Fire</strong></div>
            <div><span>Lesson Type</span><strong>{formatType(active.lesson_type)}</strong></div>
            <div><span>Track</span><strong>{activeTrack?.title || "Act III"}</strong></div>
            <div><span>Core Theme</span><strong>{activeTrack?.core_theme || "Reclamation"}</strong></div>
          </div>
          <div className="ru-progress"><div><span>Course Loaded</span><strong>{completion}%</strong></div><i><b style={{ width: `${completion}%` }} /></i></div>
          <div className="ru-related"><span>Related Signals</span><button>Blueprint Of The Divine</button><button>Consecrated</button><button>Architect Of The Aftermath</button></div>
        </aside>
      </section>

      <footer className="ru-footer"><div><CheckCircle2 /><span>Module Status</span><strong>Operational</strong></div><div><BookOpen /><span>Lessons Loaded</span><strong>{lessons.length}</strong></div></footer>
    </main>
  );
}
