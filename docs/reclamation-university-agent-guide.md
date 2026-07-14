# Reclamation University — AI Agent Completion Guide

## Mission

Finish Reclamation University as a production-ready, Supabase-backed learning experience inside `FINALCKP` without replacing the established Chroma Key Protocol design language or creating a disconnected second system.

The completed system must turn the current visual dashboard into a coherent six-faculty curriculum with persistent progress, resumable sessions, journal records, unlock logic, analytics-ready events, and secure row-level access.

## Non-Negotiable Product Intent

Reclamation University is not a generic LMS. It is the educational arm of the Chroma Key Protocol and must feel like an interactive protocol, not a collection of conventional lesson cards.

Preserve these concepts:

- Rising Seeker progression
- Shadow Code identification
- Light Code retrieval
- lyric and track-based teaching anchors
- declaration and integration rituals
- gated chambers rather than passive page scrolling
- premium red, black, gunmetal, glass, cinematic, cyber-industrial visual language
- existing routes under `/experiencemode/sovereign/reclamation-university`
- authenticated private records for journal and progress data

Do not introduce district worldbuilding. Do not turn the curriculum into generic quizzes. Do not replace existing copy unless necessary for consistency, accessibility, or correctness.

## Current Repository State

Primary repository:

- `matrixmediamoguls-projects/FINALCKP`

Existing implementation:

- `frontend/src/pages/ReclamationUniversityPage.jsx`
  - complete visual landing dashboard
  - six advertised faculties
  - hard-coded user statistics
  - routes declared for all six faculties
- `frontend/src/lib/supabase/reclamationUniversity.js`
  - reads track-linked university content from `reclamation_university`
  - upserts private user responses to `rec_uni_module_responses`
Known gap:

The replacement Foundations Module 1 has not been implemented. Dashboard statistics are placeholders rather than calculated user data.

## Supabase Environment Finding

The currently active Supabase project named `MatrixMediaMoguls@gmail.com` contains visualizer tables but no Reclamation University tables. The older project `supabase-matrx-db` appears to be inactive and could not be inspected because its database connection timed out.

Before implementing production writes, identify the actual frontend Supabase project from the repository environment configuration. Do not assume that the active visualizer project is automatically the correct production database.

Never commit a service-role key or secret. Only browser-safe publishable configuration belongs in frontend environment variables.

## Required Final Architecture

### 1. Curriculum registry

Create a single declarative curriculum registry rather than hard-coding lesson content across page components.

Recommended location:

`frontend/src/data/reclamationUniversityCurriculum.js`

Each faculty must contain:

```js
{
  id,
  slug,
  order,
  title,
  subtitle,
  description,
  accent,
  artwork,
  prerequisiteFacultyIds,
  modules: [
    {
      id,
      slug,
      order,
      title,
      subtitle,
      sourceTrackIds,
      initiationCopy,
      lyricAnchors,
      shadowCodes,
      lightMappings,
      declarationFields,
      integrationKey,
      xpReward
    }
  ]
}
```

Module content should live in this registry. Existing UI components should consume module data through props.

### 2. Six faculties

Implement these faculties as the canonical top-level curriculum:

1. Foundations of Reclamation
2. The Architecture of Identity
3. The Language Protocol
4. Thought Forms & Reality
5. The Sovereign Mind
6. Architect of the Aftermath

Each faculty must have at least one fully functional module. The architecture must support adding more modules without adding new page-level routing code.

### 3. Generic module engine

Use a reusable engine for curriculum modules that share an interaction model.

Recommended component:

`frontend/src/modules/sovereign/reclamation-university/ReclamationModuleEngine.jsx`

Responsibilities:

- load curriculum module by faculty and module slug
- load the user’s prior state
- enforce gate requirements
- restore the last active scene
- map selected Shadow Codes to allowed Light Codes
- validate declaration completion
- save progress incrementally
- save final completion record
- reveal Integration Key only after completion criteria are met
- emit analytics events through a small adapter

Keep the current components where possible:

- `ModuleBriefScene`
- `PairedTrackPortal`
- `ShadowCodeSelector`
- `LightCodeMapper`
- `DeclarationBuilder`
- `IntegrationKeyReveal`
- `RecUniJournalSave`

Rename only when a component is genuinely generic and the rename improves clarity.

### 4. Routing

Use parameterized routes instead of six unrelated hard-coded pages.

Required route pattern:

- `/experiencemode/sovereign/reclamation-university`
- `/experiencemode/sovereign/reclamation-university/:facultySlug`
- `/experiencemode/sovereign/reclamation-university/:facultySlug/:moduleSlug`

The faculty route should show faculty overview, module list, lock state, progress, and resume action.

The module route should render the reusable module engine.

Add route guards for unknown faculty or module slugs. Unknown records must render a branded not-found state with a return action, not a blank page.

### 5. Database schema

Create migrations in `supabase/migrations/`. Use normalized curriculum metadata plus private user state.

Required tables:

#### `rec_uni_faculties`

- `id uuid primary key`
- `slug text unique not null`
- `title text not null`
- `subtitle text`
- `description text`
- `faculty_order integer not null`
- `accent text`
- `artwork_url text`
- `is_published boolean default false`
- timestamps

#### `rec_uni_modules`

- `id uuid primary key`
- `faculty_id uuid references rec_uni_faculties(id) on delete cascade`
- `slug text not null`
- `title text not null`
- `subtitle text`
- `module_order integer not null`
- `content jsonb not null default '{}'`
- `xp_reward integer not null default 0`
- `is_published boolean default false`
- timestamps
- unique `(faculty_id, slug)`

#### `rec_uni_user_progress`

- `id uuid primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `module_id uuid not null references rec_uni_modules(id) on delete cascade`
- `status text` constrained to `not_started`, `in_progress`, `completed`
- `active_scene integer default 0`
- `listened_track_ids text[] default '{}'`
- `selected_shadow_codes text[] default '{}'`
- `retrieved_light_codes text[] default '{}'`
- `declaration_json jsonb default '{}'`
- `integration_key text`
- `started_at timestamptz`
- `completed_at timestamptz`
- timestamps
- unique `(user_id, module_id)`

#### `rec_uni_journal_entries`

- `id uuid primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `module_id uuid references rec_uni_modules(id) on delete set null`
- `entry_type text default 'module_completion'`
- `title text`
- `body text`
- `payload jsonb default '{}'`
- timestamps

#### `rec_uni_events`

- `id bigint generated always as identity primary key`
- `user_id uuid references auth.users(id) on delete set null`
- `faculty_slug text`
- `module_slug text`
- `event_name text not null`
- `event_payload jsonb default '{}'`
- `created_at timestamptz default now()`

Retain compatibility with `rec_uni_module_responses` during migration. Either migrate its records into `rec_uni_user_progress` or provide a temporary compatibility adapter. Do not silently discard existing user records.

### 6. Row-level security

Enable RLS on every user-data table.

Minimum policies:

- authenticated users may select only rows where `user_id = auth.uid()`
- authenticated users may insert only rows where `user_id = auth.uid()`
- authenticated users may update only rows where `user_id = auth.uid()`
- authenticated users may delete only their own journal entries
- published curriculum metadata may be selected by authenticated users
- no browser client may insert or modify published curriculum metadata

After migration, run Supabase security and performance advisors. Resolve every critical security finding before merge.

### 7. Supabase client layer

Replace the current narrow helper with a typed service layer.

Recommended file:

`frontend/src/lib/supabase/reclamationUniversity.js`

Required exports:

- `getUniversityDashboard(userId)`
- `getFacultyBySlug(slug)`
- `getModuleBySlug(facultySlug, moduleSlug)`
- `getModuleProgress(moduleId)`
- `saveModuleProgress(input)`
- `completeModule(input)`
- `saveJournalEntry(input)`
- `getUniversityJournal()`
- `recordUniversityEvent(input)`

Every function must return a consistent result shape:

```js
{ data, error }
```

No UI component should call `.from(...)` directly.

### 8. Progress and unlock rules

A module is completed only when all configured gates pass.

Published modules may configure requirements such as:

- initiation transmission completed
- both paired track signals received
- at least one Shadow Code selected
- at least one corresponding Light Code retrieved
- all declaration fields completed
- declaration sealed
- final record saved successfully

Faculty unlock behavior:

- Faculty One is available to every authenticated user.
- Later faculties unlock after the previous faculty’s required modules are completed.
- Locked cards remain visible and explain the exact prerequisite.
- Admin or development bypasses must be explicit and disabled in production.

### 9. Dashboard statistics

Remove placeholder values from `ReclamationUniversityPage.jsx`.

Calculate:

- Protocol Status: `Online` when data loads; `Offline` or `Sync Required` when it fails
- Sovereign Level: derived from completed modules or total XP
- Curriculum Progress: completed published modules divided by total published modules
- Reclamation XP: sum of `xp_reward` for completed modules

The dashboard must include loading skeletons and a recoverable error state.

### 10. Resume behavior

On module entry:

- fetch saved progress
- restore the active scene and all selections
- never force a completed user to repeat the initiation
- provide `Resume Protocol` and `Review Completed Module` states
- preserve progress after refresh and on a different authenticated device

Use debounced incremental saves after meaningful state changes. The completion save must remain explicit and transactional from the user’s perspective.

### 11. Content boundaries

The system may provide reflective prompts and symbolic language, but it must not present spiritual interpretation as verified medical, legal, financial, or factual diagnosis.

The agent must preserve user-authored terminology while keeping interface copy coherent and readable.

All lyric excerpts must come from project-owned content already supplied to the application. Do not pull copyrighted lyrics from external sources.

### 12. Accessibility

Required:

- keyboard-operable gates and selectors
- visible focus states
- semantic headings
- `aria-live` for save, completion, lock, and error feedback
- reduced-motion support
- no essential meaning communicated by color alone
- text alternatives for faculty artwork
- modal focus trapping if a modal is used
- minimum readable contrast over animated or photographic backgrounds

### 13. Performance

Required:

- lazy-load faculty and module routes
- avoid loading all curriculum artwork at initial application boot
- memoize large curriculum structures or keep them static outside components
- prevent redundant Supabase progress writes
- do not block the module UI on analytics event failure
- ensure decorative animation respects reduced-motion preferences

### 14. Testing

Add tests for:

- curriculum slug resolution
- unknown faculty and module handling
- Shadow Code to Light Code filtering
- declaration validation
- module gate progression
- progress restoration
- completion save
- locked faculty prerequisites
- dashboard progress and XP calculations
- RLS behavior through migration-level verification or Supabase tests

At minimum, the repository must pass its existing lint, build, and test commands before the PR is considered complete.

## Recommended Implementation Sequence

### Phase 1 — Audit and stabilize

1. Confirm the Supabase project used by `getSovereignSupabase()`.
2. Read `App.jsx`, auth context, environment configuration, and all existing Reclamation University components.
3. Run the current application and document broken routes, console errors, missing assets, and save failures.
4. Preserve a screenshot or written baseline of any working module behavior.

### Phase 2 — Data model

1. Add the normalized Reclamation University migration.
2. Add RLS policies and indexes.
3. Seed six faculties and initial modules using deterministic slug lookups, not hard-coded generated UUID references.
4. Add a compatibility migration for `rec_uni_module_responses`.
5. Generate updated TypeScript types even if the current frontend remains JavaScript; retain the generated file for schema reference.
6. Run Supabase advisors.

### Phase 3 — Curriculum extraction

1. Move published module content into the curriculum registry.
2. Refactor shared module behavior into `ReclamationModuleEngine`.
3. Confirm existing published modules behave as before extraction.
4. Add schema validation for curriculum objects.

### Phase 4 — Routing and faculties

1. Add parameterized faculty and module routes.
2. Build reusable faculty overview.
3. Implement the five missing faculties using the same engine.
4. Add lock, resume, completed, and unavailable states.

### Phase 5 — Persistence and dashboard

1. Implement service-layer reads and writes.
2. Restore module progress on load.
3. Add incremental save and explicit completion behavior.
4. Replace dashboard placeholders with live aggregates.
5. Add private journal browsing and module completion records.

### Phase 6 — hardening

1. Add loading, empty, offline, and retry states.
2. Add accessibility and reduced-motion support.
3. Add tests.
4. Run build, lint, tests, Supabase advisors, and route smoke tests.
5. Remove dead code only after confirming no route still imports it.

## Agent Operating Rules

The implementing agent must:

- inspect before editing
- make small, reviewable commits
- avoid destructive migration changes
- never rewrite unrelated visualizer or album code
- never commit secrets
- preserve working published-module behavior during refactoring
- report schema drift instead of guessing
- use migrations for DDL and SQL only for inspection or data verification
- use a feature branch and pull request
- include a final changed-file list and test evidence in the PR

The implementing agent must not:

- directly edit production data without a migration or explicit seed plan
- bypass RLS with frontend code
- store sensitive journal text in analytics events
- expose service-role credentials
- duplicate curriculum data in multiple components
- hard-code fake progress numbers
- mark a module completed before the persistence call succeeds

## Definition of Done

Reclamation University is finished when:

- all six faculty cards open valid experiences
- every published faculty has at least one functional module
- the module engine is data-driven
- authenticated progress survives reload and device changes
- dashboard progress and XP are live
- faculty prerequisites work
- journal entries are private and retrievable
- all user-data tables have correct RLS
- existing published-module records are preserved or migrated
- unknown routes fail gracefully
- reduced motion and keyboard navigation work
- no secrets are committed
- build, lint, and tests pass
- Supabase advisors show no unresolved critical security issue
- the pull request documents migrations, environment requirements, test evidence, and any remaining content-authoring work

## Suggested Pull Request Structure

1. `feat(rec-uni): add normalized curriculum schema and RLS`
2. `refactor(rec-uni): extract reusable module engine`
3. `feat(rec-uni): add faculty and module routing`
4. `feat(rec-uni): persist progress journal and completion`
5. `feat(rec-uni): connect dashboard statistics`
6. `test(rec-uni): cover progression persistence and locks`
7. `docs(rec-uni): document content authoring and deployment`

## Final Agent Report Template

At completion, report:

- branch and PR
- Supabase project used
- migrations added
- faculties and modules implemented
- routes added or changed
- database policies created
- compatibility handling for existing module records
- tests run and results
- build and lint results
- Supabase advisor results
- environment variables required
- remaining content that still requires human authorship
