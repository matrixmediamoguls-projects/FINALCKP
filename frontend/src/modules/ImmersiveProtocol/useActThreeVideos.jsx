import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../../services/supabase/client";

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value || "");

const cleanSegment = (value) => String(value || "").replace(/^\/+|\/+$/g, "");

const buildR2Url = (baseUrl, key) => {
  if (!key) return "";
  if (isAbsoluteUrl(key)) return key;
  if (/^\/\//.test(key)) return `https:${key}`;

  const base = String(baseUrl || "").replace(/\/$/, "");
  const path = String(key).replace(/^\/+/, "");
  if (!base) return "";
  return `${base}/${path}`;
};

const buildSupabasePublicUrl = (supabase, bucket, key) => {
  if (!supabase || !bucket || !key || isAbsoluteUrl(key)) return "";

  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return data?.publicUrl || "";
  } catch {
    return "";
  }
};

const normalizeVideo = (row, config, supabase) => {
  const bucket = cleanSegment(row.r2_bucket || "medioa");
  const key = String(row.r2_key || "").replace(/^\/+/, "");
  const r2Url = buildR2Url(config.r2BaseUrl, key);
  const supabasePublicUrl = buildSupabasePublicUrl(supabase, bucket, key);

  return {
    id: row.id,
    title: row.title || "Untitled Act III transmission",
    created_at: row.created_at,
    r2_bucket: bucket,
    r2_key: key,
    sourceUrl: r2Url || supabasePublicUrl,
  };
};

export default function useActThreeVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const config = useMemo(
    () => ({
      r2BaseUrl: import.meta.env.VITE_APP_ACT_THREE_VIDEO_BASE_URL ||
        import.meta.env.VITE_APP_R2_PUBLIC_BASE_URL ||
        "",
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;

    const loadVideos = async () => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setLoading(false);
        setError("Supabase credentials missing.");
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("act_three_videos")
          .select("id,r2_bucket,r2_key,title,created_at")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        if (cancelled) return;

        const normalized = (data || [])
          .map((row) => normalizeVideo(row, config, supabase))
          .filter((video) => video.sourceUrl);

        setVideos(normalized);
        setError(normalized.length ? "" : "No Act III video media resolved.");
      } catch (loadError) {
        if (!cancelled) {
          setVideos([]);
          setError(loadError?.message || "Unable to load Act III video media.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, [config]);

  return { videos, loading, error };
}
