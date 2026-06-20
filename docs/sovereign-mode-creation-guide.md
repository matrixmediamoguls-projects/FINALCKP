# Sovereign Mode Creation Guide

Build Sovereign Mode around one rule:

`selectedTrackId` controls everything.

When the user chooses a track, every module updates from that same track: lyrics, visualizer, university lesson, vibe prompt, artifact data, archetype, and elemental codex.

## Core route

`/experiencemode/sovereign`

## Main shell file

`src/pages/experience/SovereignMode.tsx`

## Shared state

- `selectedTrackId`
- `selectedModuleKey`
- `currentUser`
- `currentAct`
- `isPlaying`
- `activeTrackData`

## Layout

Center: `AudioVisualizerCore`

Left rail:

- `SonicArtifacts`
- `ElementalCodex`
- `Archaetypes`

Right rail:

- `LyricalCodex`
- `ReclamationUniversity`
- `VibesAndScribes`

Bottom:

- Media controls
- Progress bar
- Track carousel

## Internal module keys

- `audio_visualizer_core`
- `sonic_artifacts`
- `elemental_codex`
- `archaetypes`
- `lyrical_codex`
- `reclamation_university`
- `vibes_and_scribes`

---

## Elemental Codex

Purpose: Decode the elemental force behind the selected track, act, or node.

Create:

- `src/modules/sovereign/ElementalCodex.tsx`
- `src/components/codex/ElementalCodexCard.tsx`
- `src/lib/supabase/elementalCodex.ts`

Core UI:

Show the current element, color, act connection, shadow meaning, reclaimed meaning, and activation prompt.

Supabase retrieve:

From `acts`:

- `element`
- `color_hex`
- `color_key`
- `title`
- `subtitle`
- `description`

From `tracks`:

- `act_id`
- `core_theme`
- `energy_level`
- `signal_type`
- `visual_skin`

Table: `elemental_codex`

Fields:

- `id`
- `element_key`
- `title`
- `summary`
- `shadow_expression`
- `reclaimed_expression`
- `activation_prompt`
- `visual_rules jsonb`
- `color_hex`
- `sort_order`

Frontend behavior:

When `selectedTrackId` changes, fetch the track, get its `act_id`, retrieve the act, then retrieve the codex entry matching the act's element.

---

## Lyrical Codex

Purpose: Decode the lyrics, not just display them.

Create:

- `src/modules/sovereign/LyricalCodex.tsx`
- `src/components/lyrics/LyricRevealPanel.tsx`
- `src/components/lyrics/KeyLinesRail.tsx`
- `src/components/lyrics/TimestampLyricsFeed.tsx`
- `src/lib/supabase/lyricsProtocol.ts`

Core UI:

Full lyrics, clean lyrics, key lines, section breakdown, hidden meaning, primary light code, and synced lyric mode.

Supabase retrieve from `lyrics_protocol`:

- `track_id`
- `lyrics_full`
- `lyrics_clean`
- `section_map`
- `key_lines`
- `primary_light_code`
- `lyric_summary`
- `hidden_meaning`
- `evidence_lines`
- `timestamp_sync`
- `display_mode`

Frontend behavior:

Fetch by `selectedTrackId`.

Display modes:

- `static`: full lyrics
- `karaoke`: timestamp synced
- `codex`: lyric plus interpretation
- `reveal`: line-by-line unlock

---

## Sonic Artifacts

Purpose: Turn each track into a collectible protocol object.

Create:

- `src/modules/sovereign/SonicArtifacts.tsx`
- `src/components/artifacts/SonicArtifactCard.tsx`
- `src/components/artifacts/ArtifactMetadataPanel.tsx`
- `src/lib/supabase/sonicArtifacts.ts`

Core UI:

Track title, order, cover image, BPM, key, energy, signal type, core theme, credits, audio preview, artifact summary.

Supabase retrieve from `tracks`:

- `id`
- `track_order`
- `title`
- `artist`
- `songwriter`
- `producer`
- `duration_seconds`
- `bpm`
- `key_signature`
- `energy_level`
- `core_theme`
- `signal_type`
- `lyric_mode`
- `visual_skin`
- `audio_url`
- `cover_image_url`
- `is_single`
- `is_featured`
- `release_date`

Table: `sonic_artifacts`

Fields:

- `id`
- `track_id`
- `artifact_title`
- `artifact_type`
- `artifact_summary`
- `symbolic_function`
- `emotional_frequency`
- `narrative_position`
- `rarity_level`
- `display_badges jsonb`

Frontend behavior:

Default to showing the selected track as the active artifact. Also allow carousel navigation through all Act Three tracks.

---

## Archaetypes

Purpose: Show the mythic identity pattern behind the track.

Create:

- `src/modules/sovereign/Archaetypes.tsx`
- `src/components/archetypes/ArchetypeCard.tsx`
- `src/components/archetypes/ShadowReclaimPanel.tsx`
- `src/lib/supabase/archetypes.ts`

Core UI:

Archetype title, symbol, role, shadow expression, reclaimed expression, reflection prompt.

Table: `archetypes`

Fields:

- `id`
- `slug`
- `title`
- `archetype_role`
- `shadow_expression`
- `reclaimed_expression`
- `symbol_key`
- `description`
- `reflection_prompt`
- `visual_config jsonb`
- `sort_order`

Join table: `track_archetypes`

Fields:

- `id`
- `track_id`
- `archetype_id`
- `relationship_type`
- `sort_order`

Frontend behavior:

Fetch archetypes connected to `selectedTrackId`. If none exist, fallback to track `core_theme` and `signal_type`.

---

## Audio Visualizer Core

Purpose: The central live system. This is the core of Sovereign Mode.

Create:

- `src/modules/sovereign/AudioVisualizerCore.tsx`
- `src/components/visualizer/CentralVisualizerViewport.tsx`
- `src/components/visualizer/ReactiveSpectrum.tsx`
- `src/components/visualizer/WaveformPulse.tsx`
- `src/components/visualizer/TrackCarousel.tsx`
- `src/components/visualizer/VisualizerControls.tsx`
- `src/lib/audio/useAudioAnalyzer.ts`
- `src/lib/supabase/visualizerRequirements.ts`

Core UI:

Clear video viewport, audio player, radial spectrum, waveform, reactive rings, lyric feed, track controls, progress bar.

Supabase retrieve from `visualizer_requirements`:

- `track_id`
- `visualizer_mode`
- `background_style`
- `primary_color`
- `secondary_color`
- `accent_color`
- `spectrum_intensity`
- `waveform_intensity`
- `particle_density`
- `camera_motion`
- `emblem_visible`
- `center_viewport_clear`
- `video_url`
- `loop_visual_url`
- `reactive_elements`

Also retrieve from `tracks`:

- `audio_url`
- `cover_image_url`
- `title`

Critical rule:

`center_viewport_clear` must stay true. Do not cover the central video with an emblem.

Frontend behavior:

When user plays a track, load `audio_url`, connect it to the Web Audio API, and use analyzer data to drive spectrum and waveform.

---

## Vibes And Scribes

Purpose: User reflection, emotional response, and journaling.

Create:

- `src/modules/sovereign/VibesAndScribes.tsx`
- `src/components/scribes/VibePromptCard.tsx`
- `src/components/scribes/ScribeEntryComposer.tsx`
- `src/components/scribes/MoodBeforeAfter.tsx`
- `src/lib/supabase/vibesAndScribes.ts`
- `src/lib/supabase/userScribeEntries.ts`

Core UI:

Vibe name, mood tags, writing prompt, context, mood before, mood after, private journal entry.

Supabase retrieve from `vibes_and_scribes`:

- `track_id`
- `vibe_name`
- `vibe_category`
- `mood_tags`
- `scribe_prompt`
- `scribe_context`
- `response_type`
- `intensity_level`
- `recommended_duration`
- `unlock_condition`

Save to `user_scribe_entries`:

- `user_id`
- `vibe_scribe_id`
- `track_id`
- `entry_text`
- `mood_before`
- `mood_after`
- `is_private`

Frontend behavior:

Fetch prompt by `selectedTrackId`. Save journal entry tied to user and track.

---

## Reclamation University

Purpose: The lesson/teaching module.

Create:

- `src/modules/sovereign/ReclamationUniversity.tsx`
- `src/components/university/LessonCard.tsx`
- `src/components/university/LightCodePanel.tsx`
- `src/components/university/ReflectionPrompt.tsx`
- `src/lib/supabase/reclamationUniversity.ts`

Core UI:

Lesson title, lesson type, primary light code, summary, lesson body, reflection prompt, estimated minutes, difficulty level.

Supabase retrieve from `reclamation_university`:

- `track_id`
- `lesson_title`
- `lesson_type`
- `primary_light_code`
- `lesson_body`
- `summary`
- `reflection_prompt`
- `unlock_order`
- `difficulty_level`
- `estimated_minutes`
- `is_required`

Also update `user_progress`:

- `user_id`
- `track_id`
- `module_key`
- `experience_mode = sovereign`
- `completion_status`
- `progress_percent`
- `completed_at`

Frontend behavior:

When the user opens or completes the lesson, update `user_progress`.

---

## Sovereign Mode Parent Page

Create:

`src/pages/experience/SovereignMode.tsx`

Responsibilities:

- Load all Act Three tracks.
- Set first track as default.
- Store `selectedTrackId`.
- Render all seven modules.
- Pass selected track into every module.
- Control play/pause state.
- Track progress.
- Retrieve user progress.

Supabase retrieve:

- `tracks`
- `module_cards`
- `protocol_modules`
- `experience_modes`
- `user_progress`

Basic structure:

```tsx
<SovereignModeShell>
  <LeftRail>
    <SonicArtifacts selectedTrackId={selectedTrackId} />
    <ElementalCodex selectedTrackId={selectedTrackId} />
    <Archaetypes selectedTrackId={selectedTrackId} />
  </LeftRail>

  <CenterStage>
    <AudioVisualizerCore
      selectedTrackId={selectedTrackId}
      onTrackChange={setSelectedTrackId}
    />
  </CenterStage>

  <RightRail>
    <LyricalCodex selectedTrackId={selectedTrackId} />
    <ReclamationUniversity selectedTrackId={selectedTrackId} />
    <VibesAndScribes selectedTrackId={selectedTrackId} />
  </RightRail>
</SovereignModeShell>
```

---

## Design rules

Use dark gunmetal panels. Use red as the Act Three dominant accent. Use glass/neoglass layering, but keep it controlled. Module cards should be bold, minimal, and premium. Do not overload cards with text. Each module should expand or open into detail when selected. The center visualizer must stay visually dominant. All panels should feel connected to the same operating system.

## Build order

1. Create `SovereignMode.tsx` shell.
2. Connect tracks and get selected track state working.
3. Build `AudioVisualizerCore`.
4. Build `LyricalCodex`, `ReclamationUniversity`, and `VibesAndScribes` because their Supabase tables already exist.
5. Create missing Supabase tables for `elemental_codex`, `archetypes`, `track_archetypes`, and `sonic_artifacts`.
6. Build the final left rail modules.
7. Add user progress tracking across all modules.

## Final architecture

`tracks` is the anchor.

Everything connects back to:

`selectedTrackId`

That is what keeps Sovereign Mode from feeling like seven random panels. It becomes one living system where every module reacts to the same sonic artifact.
