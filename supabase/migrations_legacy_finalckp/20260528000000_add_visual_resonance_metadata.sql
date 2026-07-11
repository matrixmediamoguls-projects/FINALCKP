-- Visual Resonance metadata generated from ChromaKey_VisualResonance_Tracker (2).xlsx.
-- Adds the Act III tracker taxonomy to public.reclamation_tracks without changing audio URLs.

ALTER TABLE public.reclamation_tracks
  ADD COLUMN IF NOT EXISTS core_theme TEXT,
  ADD COLUMN IF NOT EXISTS signal_types TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS lyric_mode TEXT,
  ADD COLUMN IF NOT EXISTS visual_skin TEXT,
  ADD COLUMN IF NOT EXISTS motion_style TEXT,
  ADD COLUMN IF NOT EXISTS particle_types TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS resonance_events TEXT[] NOT NULL DEFAULT ARRAY[]::text[];

WITH visual_resonance_seed (sort_order, title, core_theme, signal_types, lyric_mode, visual_skin, motion_style, particle_types, resonance_events) AS (
  VALUES
    (1, 'This Is The Fire (Overture)', 'Initiation Through Fire', ARRAY['Invocation', 'Awakening']::text[], 'Invocation', 'emberCore', 'ceremonial', ARRAY['embers', 'ash']::text[], ARRAY['ignition', 'invocation', 'awakening', 'convergence']::text[]),
    (2, 'Reclamation (The Day Musiq Matrix Came Back)', 'Power Reclamation', ARRAY['Resurrection', 'Reclamation']::text[], 'Invocation', 'goldenSignal', 'ceremonial', ARRAY['embers', 'lightFilaments']::text[], ARRAY['ignition', 'resurrection', 'awakening', 'convergence']::text[]),
    (3, 'Know Your Names', 'Narrative Manipulation', ARRAY['Exposure', 'Warning']::text[], 'Evidence', 'buriedTruth', 'tectonic', ARRAY['glyphs', 'signalFragments']::text[], ARRAY['artifactLoaded', 'warning', 'truthImpact', 'signalLock']::text[]),
    (4, 'Hold On', 'Hope Against Collapse', ARRAY['Lament', 'Alignment']::text[], 'Reflection', 'deepMemoryVault', 'ripple', ARRAY['lightFilaments', 'dust']::text[], ARRAY['memoryEcho', 'silenceDrop', 'reflectionShift']::text[]),
    (5, 'Demonic Schemes', 'Sacred Memory', ARRAY['Memory Echo', 'Purification']::text[], 'Evidence', 'bureaucraticInferno', 'volatile', ARRAY['smoke', 'ash']::text[], ARRAY['warning', 'containmentFailure', 'shockwave']::text[]),
    (6, 'Second Edition', 'Power Reclamation', ARRAY['Reconstruction', 'Activation']::text[], 'Invocation', 'crucibleEngine', 'ember', ARRAY['glyphs', 'embers']::text[], ARRAY['artifactLoaded', 'override', 'ascensionMoment']::text[]),
    (7, 'Remember The Price (When You Speak The Name)', 'Initiation Through Fire', ARRAY['Victory Signal', 'Command Sequence']::text[], 'Archive', 'deepMemoryVault', 'ripple', ARRAY['ash', 'lightFilaments']::text[], ARRAY['memoryEcho', 'reflectionShift', 'ascensionMoment']::text[]),
    (8, 'Blueprint of the Divine', 'Divine Remembering', ARRAY['Invocation', 'Command Sequence']::text[], 'Invocation', 'celestialGrid', 'orbital', ARRAY['glyphs', 'lightFilaments']::text[], ARRAY['invocation', 'artifactLoaded', 'convergence']::text[]),
    (9, 'Hostile Rewrite', 'Narrative Manipulation', ARRAY['Indictment', 'Override']::text[], 'Evidence', 'fracturedReflection', 'chaotic', ARRAY['glass', 'signalFragments']::text[], ARRAY['override', 'systemBreak', 'truthImpact']::text[]),
    (10, 'The Witness Don''t Talk', 'Signal Transmission', ARRAY['Awakening', 'Command Sequence']::text[], 'Archive', 'deepMemoryVault', 'hypnotic', ARRAY['signalFragments', 'glyphs']::text[], ARRAY['memoryEcho', 'signalLock', 'artifactLoaded']::text[]),
    (11, 'Consecrated', 'Inner Ascension', ARRAY['Consecration', 'Ascension']::text[], 'Reflection', 'crucibleEngine', 'ceremonial', ARRAY['ash', 'embers']::text[], ARRAY['purification', 'ascensionMoment', 'convergence']::text[]),
    (12, 'Through The Fog', 'Longing', ARRAY['Memory Echo', 'Lament']::text[], 'Reflection', 'submergedSignal', 'ripple', ARRAY['smoke', 'waterDroplets']::text[], ARRAY['memoryEcho', 'silenceDrop', 'reflectionShift']::text[]),
    (13, 'Don''t Hang That Word', 'The Breaking Point', ARRAY['Reflection', 'Lament']::text[], 'Reflection', 'echoChamber', 'ripple', ARRAY['dust', 'glass']::text[], ARRAY['silenceDrop', 'reflectionShift', 'rupture']::text[]),
    (14, 'Code Red', 'Signal Transmission', ARRAY['Disruption', 'Command Sequence']::text[], 'Broadcast', 'redSignalStorm', 'volatile', ARRAY['signalFragments', 'embers']::text[], ARRAY['warning', 'pulseBurst', 'containmentFailure']::text[]),
    (15, 'Shadow Chains', 'Shadow Confrontation', ARRAY['Reflection', 'Signal Drift']::text[], 'Collapse', 'containmentFailure', 'chaotic', ARRAY['smoke', 'glass']::text[], ARRAY['systemBreak', 'rupture', 'reflectionShift']::text[]),
    (16, 'I Create As I Speak', 'Higher Self Activation', ARRAY['Command Sequence', 'Momentum Surge']::text[], 'Invocation', 'goldenSignal', 'orbital', ARRAY['lightFilaments', 'glyphs']::text[], ARRAY['invocation', 'signalLock', 'convergence']::text[]),
    (17, 'Weapons Grade Transmission', 'Signal Transmission', ARRAY['Disruption', 'Broadcast']::text[], 'Broadcast', 'divineBroadcast', 'tectonic', ARRAY['signalFragments', 'glyphs']::text[], ARRAY['truthImpact', 'pulseBurst', 'signalLock']::text[]),
    (18, 'Blood Without Stains', 'Truth Broadcast', ARRAY['Confession', 'Transmutation']::text[], 'Broadcast', 'crucibleEngine', 'volatile', ARRAY['ash', 'burningPaper']::text[], ARRAY['rupture', 'purification', 'ascensionMoment']::text[]),
    (19, 'Red Flag Parade', 'Truth Broadcast', ARRAY['Warning', 'Exposure']::text[], 'Evidence', 'redSignalStorm', 'militant', ARRAY['signalFragments', 'ash']::text[], ARRAY['warning', 'truthImpact', 'pulseBurst']::text[]),
    (20, 'Seer Broke Chains', 'Spiritual War', ARRAY['Revolt', 'Transmutation']::text[], 'Invocation', 'containmentFailure', 'volatile', ARRAY['embers', 'glass']::text[], ARRAY['systemBreak', 'rupture', 'ascensionMoment']::text[]),
    (21, 'Flip It', 'Signal Transmission', ARRAY['Transmutation', 'Alignment']::text[], 'Invocation', 'goldenSignal', 'ember', ARRAY['embers', 'lightFilaments']::text[], ARRAY['override', 'convergence', 'ascensionMoment']::text[]),
    (22, 'Misguided Priorities', 'Grief Processing', ARRAY['Reflection', 'Lament']::text[], 'Reflection', 'liquidMirror', 'ripple', ARRAY['waterDroplets', 'dust']::text[], ARRAY['reflectionShift', 'silenceDrop', 'memoryEcho']::text[]),
    (23, 'As Above, So Below', 'Signal Transmission', ARRAY['Alignment', 'Invocation']::text[], 'Invocation', 'celestialGrid', 'orbital', ARRAY['glyphs', 'lightFilaments']::text[], ARRAY['convergence', 'invocation', 'signalLock']::text[]),
    (24, 'Elemental Orchestra', 'Emotional Resurrection', ARRAY['Emotional Archive', 'Ascension']::text[], 'Reflection', 'deepMemoryVault', 'ceremonial', ARRAY['lightFilaments', 'waterDroplets']::text[], ARRAY['memoryEcho', 'ascensionMoment', 'convergence']::text[]),
    (25, 'Chosen Ones', 'Collective Awakening', ARRAY['Awakening', 'Alignment']::text[], 'Broadcast', 'goldenSignal', 'orbital', ARRAY['lightFilaments', 'glyphs']::text[], ARRAY['awakening', 'convergence', 'signalLock']::text[]),
    (26, 'Slumlord Fundamentalists', 'Institutional Corruption', ARRAY['Exposure', 'Indictment']::text[], 'Evidence', 'bureaucraticInferno', 'militant', ARRAY['ash', 'burningPaper']::text[], ARRAY['truthImpact', 'shockwave', 'systemBreak']::text[]),
    (27, 'Structured Thoughtforms', 'Signal Transmission', ARRAY['Invocation', 'Alignment']::text[], 'Archive', 'orbitalMind', 'orbital', ARRAY['glyphs', 'signalFragments']::text[], ARRAY['signalLock', 'artifactLoaded', 'convergence']::text[]),
    (28, 'The Hierophant', 'Spiritual War', ARRAY['Reflection', 'Awakening']::text[], 'Reflection', 'liquidMirror', 'hypnotic', ARRAY['glyphs', 'glass']::text[], ARRAY['reflectionShift', 'awakening', 'signalLock']::text[]),
    (29, 'Fire In My Veins', 'Power Reclamation', ARRAY['Transmutation', 'Ascension']::text[], 'Invocation', 'emberCore', 'ember', ARRAY['embers', 'ash']::text[], ARRAY['ignition', 'pulseBurst', 'ascensionMoment']::text[]),
    (30, 'Architect of the Aftermath', 'Personal Sovereignty', ARRAY['Alignment', 'Transmutation']::text[], 'Invocation', 'celestialGrid', 'tectonic', ARRAY['glyphs', 'lightFilaments']::text[], ARRAY['artifactLoaded', 'convergence', 'signalLock']::text[])
)
UPDATE public.reclamation_tracks AS rt
SET
  core_theme = seed.core_theme,
  signal_types = seed.signal_types,
  lyric_mode = seed.lyric_mode,
  visual_skin = seed.visual_skin,
  motion_style = seed.motion_style,
  particle_types = seed.particle_types,
  resonance_events = seed.resonance_events,
  updated_at = NOW()
FROM visual_resonance_seed AS seed
WHERE rt.sort_order = seed.sort_order
   OR lower(rt.title) = lower(seed.title);
