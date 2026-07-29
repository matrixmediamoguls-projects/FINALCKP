import { useEffect, useMemo, useState } from "react";
import { Disc3, Music2 } from "lucide-react";
import { getSovereignSupabase } from "../../../lib/supabase/sovereignHelpers";
import "./reclamationLessonMedia.css";

const R2_PUBLIC_BASE_URL = (
  import.meta.env.VITE_APP_R2_PUBLIC_BASE_URL || "https://media.chromakeyprotocol.com"
).replace(/\/+$/, "");

function buildAssetUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${R2_PUBLIC_BASE_URL}/${String(value).replace(/^\/+/, "")}`;
}

function normalizeTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatDuration(durationMs) {
  const seconds = Math.round(Number(durationMs || 0) / 1000);
  if (!seconds) return "Not listed";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function findParagraph(body, title) {
  const normalizedTitle = normalizeTitle(title);
  return (
    String(body || "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .find((paragraph) => normalizeTitle(paragraph).includes(normalizedTitle)) || ""
  );
}

async function loadReclamationTracks() {
  const supabase = getSovereignSupabase();
  if (!supabase) return [];

  const { data: tracks, error: tracksError } = await supabase
    .from("tracks")
    .select(
      "id, title, artist, album, duration_ms, bpm, queue_index, r2_audio_key, r2_cover_key",
    )
    .order("queue_index", { ascending: true });

  if (tracksError) throw tracksError;
  if (!tracks?.length) return [];

  const { data: covers, error: coversError } = await supabase
    .from("track_cover_art")
    .select(
      "track_id, source_url, r2_object_key, alt_text, is_active, updated_at",
    )
    .in(
      "track_id",
      tracks.map((track) => track.id),
    )
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (coversError) {
    console.error("Unable to load curriculum cover art.", coversError);
  }

  const coversByTrack = new Map();
  (covers || []).forEach((cover) => {
    if (!coversByTrack.has(cover.track_id)) coversByTrack.set(cover.track_id, cover);
  });

  return tracks.map((track) => {
    const cover = coversByTrack.get(track.id);
    return {
      ...track,
      audio_url: buildAssetUrl(track.r2_audio_key),
      cover_url:
        cover?.source_url ||
        buildAssetUrl(cover?.r2_object_key) ||
        buildAssetUrl(track.r2_cover_key),
      cover_alt: cover?.alt_text || `${track.title} album artwork`,
    };
  });
}

export default function ReclamationLessonMedia({
  lesson,
  contextBody,
  fallbackTitles = [],
  referenceAnnotations = [],
}) {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    let active = true;

    loadReclamationTracks()
      .then((tracks) => {
        if (active) setCatalog(tracks);
      })
      .catch((loadError) => {
        console.error("Unable to load Reclamation curriculum tracks.", loadError);
        if (active) setError("The audio reference library is temporarily unavailable.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredTracks = useMemo(() => {
    const body = normalizeTitle(contextBody);
    const directlyReferenced = catalog
      .map((track) => ({
        track,
        position: body.indexOf(normalizeTitle(track.title)),
      }))
      .filter(({ position }) => position >= 0)
      .sort((a, b) => a.position - b.position)
      .map(({ track }) => track);

    if (directlyReferenced.length) return directlyReferenced.slice(0, 3);

    const fallbackMatches = fallbackTitles
      .map((title) => {
        const normalized = normalizeTitle(title);
        return catalog.find((track) => {
          const trackTitle = normalizeTitle(track.title);
          return trackTitle === normalized || trackTitle.includes(normalized) || normalized.includes(trackTitle);
        });
      })
      .filter(Boolean);

    return [...new Map(fallbackMatches.map((track) => [track.id, track])).values()].slice(0, 3);
  }, [catalog, contextBody, fallbackTitles]);

  useEffect(() => {
    if (!featuredTracks.length) return;
    if (!featuredTracks.some((track) => track.title === selectedTitle)) {
      setSelectedTitle(featuredTracks[0].title);
    }
  }, [featuredTracks, selectedTitle]);

  const selectedTrack =
    featuredTracks.find((track) => track.title === selectedTitle) ||
    featuredTracks[0];

  const annotation = useMemo(() => {
    if (!selectedTrack) return "";
    const authoredAnnotation = referenceAnnotations.find((item) => {
      const label = normalizeTitle(item.label);
      const title = normalizeTitle(selectedTrack.title);
      return label === title || label.includes(title) || title.includes(label);
    });
    const lessonParagraph = findParagraph(contextBody, selectedTrack.title);

    return (
      lessonParagraph ||
      authoredAnnotation?.teaching ||
      authoredAnnotation?.line ||
      lesson?.summary ||
      "This track provides an applied Reclamation reference for the principle studied in this chamber."
    );
  }, [contextBody, lesson?.summary, referenceAnnotations, selectedTrack]);

  return (
    <aside className="rlm-root" aria-label="Reclamation album lesson reference">
      <header className="rlm-header">
        <div>
          <span><Disc3 size={15} /> Reclamation Album Reference</span>
          <h4>Hear the principle in context</h4>
        </div>
        <b>{lesson?.number || "RU"}</b>
      </header>

      {loading && <div className="rlm-status">Loading selected album references…</div>}
      {!loading && error && <div className="rlm-status is-error">{error}</div>}
      {!loading && !error && !selectedTrack && (
        <div className="rlm-status">
          No Supabase track currently matches this lesson reference.
        </div>
      )}

      {selectedTrack && (
        <>
          {featuredTracks.length > 1 && (
            <nav className="rlm-track-tabs" aria-label="Featured lesson tracks">
              {featuredTracks.map((track) => (
                <button
                  type="button"
                  key={track.id}
                  className={track.title === selectedTrack.title ? "is-active" : ""}
                  onClick={() => setSelectedTitle(track.title)}
                >
                  {track.title}
                </button>
              ))}
            </nav>
          )}

          <div className="rlm-grid">
            <figure className="rlm-artwork">
              {selectedTrack.cover_url ? (
                <img src={selectedTrack.cover_url} alt={selectedTrack.cover_alt} />
              ) : (
                <div><Music2 size={30} /><span>Artwork pending</span></div>
              )}
            </figure>

            <section className="rlm-player-panel">
              <p className="rlm-eyebrow">Featured transmission</p>
              <h5>{selectedTrack.title}</h5>
              <p>{selectedTrack.artist || "Musiq Matrix"}</p>
              {selectedTrack.audio_url ? (
                <audio
                  key={selectedTrack.audio_url}
                  controls
                  preload="metadata"
                  src={selectedTrack.audio_url}
                >
                  Your browser does not support audio playback.
                </audio>
              ) : (
                <div className="rlm-audio-unavailable">Audio source pending</div>
              )}
              <dl className="rlm-metadata">
                <div><dt>Album</dt><dd>{selectedTrack.album || "Chroma Key Act Three: Reclamation"}</dd></div>
                <div><dt>Track</dt><dd>{selectedTrack.queue_index || "—"}</dd></div>
                <div><dt>Duration</dt><dd>{formatDuration(selectedTrack.duration_ms)}</dd></div>
                <div><dt>BPM</dt><dd>{selectedTrack.bpm || "Not listed"}</dd></div>
              </dl>
            </section>

            <section className="rlm-annotation">
              <span>Lesson annotation</span>
              <h5>Why this song belongs here</h5>
              <p>{annotation}</p>
            </section>
          </div>
        </>
      )}
    </aside>
  );
}
