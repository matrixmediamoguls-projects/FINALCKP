-- Remove empty public tables and world_regions per rebuild reset.

DROP TABLE IF EXISTS public.journal_entries CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.track_intelligence CASCADE;
DROP TABLE IF EXISTS public.tracks CASCADE;
DROP TABLE IF EXISTS public.user_node_progress CASCADE;
DROP TABLE IF EXISTS public.user_path_choices CASCADE;
DROP TABLE IF EXISTS public.user_position CASCADE;
DROP TABLE IF EXISTS public.world_regions CASCADE;

