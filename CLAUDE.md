# CLAUDE.md — Chroma Key Protocol / FINALCKP

Operating contract for Claude Code in this repository.
Primary objective: **maximum completed work per usage credit.**

---

## 0. PRIME DIRECTIVE: CREDIT EFFICIENCY

This file exists so you do not have to rediscover the repository every session.
Treat sections 2–4 as already-verified fact. Do not re-derive them with searches.

**Default loop:** LOCATE → READ (ranges only) → EDIT (smallest coherent change) → VERIFY (narrowest useful check) → REPORT (compact).
Skip any step that does not move the requested task forward.

**Never:**
- Re-read a whole file when a symbol search or line range answers the question.
- Re-run a search whose answer is already in this file or earlier in the session.
- Grep for prose/content strings in `frontend/src/data/*.js` — those files are enormous walls of
  lesson copy and will flood context. Grep for `id:`/`slug:`/`export` there, never for body text.
- Scan the repo broadly for a small, localized change.
- Touch unrelated files "while you're here."
- Re-explain a plan after execution has started.
- Ask permission for routine decisions already covered by this file.

**Always:**
- Start from the narrowest identifier you have (component, route, export, table, CSS var).
- Reuse prior command output instead of re-running an equivalent command.
- Prefer `grep -n` + targeted `sed -n 'A,Bp'` over full-file reads on the large files listed in §4.

---

## 1. PROJECT IDENTITY

Chroma Key Protocol (CKP) — `chromakeyprotocol.com`. An immersive, narrative, role-based
learning/experience platform in the Musiq Matrix creative ecosystem: Act-based narrative
architecture, guided audio, curriculum ("Reclamation University"), an audio-reactive visualizer,
an AI "Protocol" chat, and elemental/thematic systems.

It is **not** a conventional dashboard app. Preserve the immersive identity while improving
technical quality.

---

## 2. STACK (VERIFIED — do not assume otherwise)

| Layer | Actual |
|---|---|
| Frontend | **React 18 + Vite** (NOT Next.js — there is no `app/`, no `pages/`, no RSC, no `next.config`) |
| Routing | `react-router-dom` v7, one central route table |
| Styling | Tailwind + shadcn-style Radix primitives + custom brand token layer |
| 3D / visualizer | **three.js + @react-three/fiber + @react-three/drei** (NOT Babylon.js) |
| Audio | Tone.js / Web Audio |
| Backend | **None — retired.** The app is Supabase-direct. `backend/` is dead code (see §4) |
| Data / auth | Supabase (Postgres + Auth) — called straight from the browser |
| Media | Cloudflare R2, served via `VITE_APP_R2_PUBLIC_BASE_URL` + the `frontend/r2-worker/` Worker |
| Hosting / deploy | **Cloudflare Pages** via `.github/workflows/deploy.yml` (NOT Vercel — `vercel` is a stale dependency in `frontend/package.json`) |

Before adding a dependency: check the existing stack solves it, prefer existing project
utilities/components, and do not upgrade packages as a side effect of unrelated work.

---

## 3. COMMANDS

Frontend (`frontend/`):
```bash
npm install --prefix frontend
npm run dev --prefix frontend     # Vite on :3000 (runs restore-env first)
npm run build --prefix frontend   # -> frontend/build
npm test --prefix frontend        # ONLY runs src/context/authUserNormalizer.test.js
cd frontend && npx vitest run src/path/to/file.test.js   # any other single test
```
Root `package.json` just shells out to `--prefix frontend` (`bootstrap|start|build|test`).

**No lint script exists.** `eslint` is a devDependency but there is no `eslint.config.*` and no
`npm run lint`. Do not offer to "run lint" — it will fail.

**There is no backend to run.** The FastAPI service is retired — do not start it, install
`backend/requirements.txt`, or run `backend/tests/`. See §4.

Lyrics alignment (`scripts/lyrics-alignment/`) is a standalone Python 3.11 / WhisperX pipeline with
its own venv, unrelated to app runtime. It only emits reviewed SQL to `outputs/lyrics-alignment/`;
it never writes to Supabase.

CI runs **build + deploy only** — there is no test or lint gate.

---

## 4. ARCHITECTURE MAP (use this instead of exploring)

### There is no backend — `backend/` is dead code
The FastAPI service is **retired**. `backend/` still sits in the tree (`server.py`, `run.py`,
`db_client.py`, `app/`, `api/`, `tests/`, `requirements.txt`) but nothing runs or deploys it:
`.github/workflows/deploy.yml` builds and ships **only** `frontend/build` to Cloudflare Pages.

Do not read, run, test, fix, or extend anything under `backend/`. If a task seems to need a server
endpoint, the answer is Supabase (client SDK, RLS, RPC, or an Edge Function) — not `server.py`.

**Stale docs — do not treat as current:** `API_CONTRACT.md` (documents the retired `/api/auth/*`
contracts) and the backend half of `APP_FLOW_INFRA_ANALYSIS.md`.

Vestigial frontend references, all inert — leave them alone unless explicitly asked to clean up:
- `frontend/src/services/apiClient.js` — axios instance pointed at `VITE_APP_BACKEND_URL`.
  `AuthContext.jsx` imports it for its side effect only and **discards its export**.
- `ActProtocol.jsx:7` and `GuidedListen.jsx:7` declare `const API_URL = …BACKEND_URL` and
  **never reference it again**.
- `VITE_APP_BACKEND_URL` is still passed as a build secret in `deploy.yml`.

### Auth — browser-direct to Supabase
`frontend/src/context/AuthContext.jsx` + `services/supabase/client.js`: `onAuthStateChange`,
normalized into the app user shape by `authUserNormalizer.js` (`toAppUser` maps `user_metadata` →
`current_act`/`completed_acts`/`level`, `app_metadata` → `tier`/`is_admin`/`act3_unlocked`).
`ProtectedRoute` in `App.jsx` gates on that Supabase-derived `user`/`loading`. There is no
server-side session and no `/auth/me`. Manual playbook: `auth_testing.md`.

### Routing
`frontend/src/App.jsx` (~480 lines) — one large route table, almost everything lazy-loaded, most
wrapped in `ProtectedRoute`. Names reflect several renaming passes: `/sovereign`, `/seeker`,
`/reclamation-university`, `/self-directed-sovereign-mode`, `/reclamation_pathway` are largely
`<Navigate>` redirects. **Check for a `<Navigate>` before assuming a path is live.**
Canonical live paths are under `/acts` and `/experiencemode/...`, e.g.
`/experiencemode/sovereign`, `/experiencemode/sovereign/reclamation-university/:facultySlug/:moduleSlug`.

`AppWithBackground` derives an elemental theme (`earth`/`water`/`fire`/`air`) from the path to drive
`ElementalBackground`; Act III / Reclamation University / Sovereign Mode / Visualizer render as `fire`.

### Key directories
- `src/acts/` — per-act experience code (Act II, III, IV, Reclamation)
- `src/modules/sovereign/`, `src/modules/ImmersiveProtocol/` — Sovereign Mode / immersive protocol
- `src/modules/sovereign/reclamation-university/` — the RU module engine and per-principle experiences
- `src/lib/supabase/` — one file per Supabase domain (tracks, journal/"vibesAndScribes", archetypes,
  elemental codex, "matrxAlchemizr" lyric tagging, sonic artifacts, reclamationUniversity)
- `src/services/supabase/client.js` — the Supabase singleton; every data path goes through here
  or through `src/lib/supabase/*` (`src/services/apiClient.js` is inert — see above)
- `src/context/audioprovider.jsx`, `src/lib/audio/useAudioAnalyzer.js` — shared playback/analysis
- `frontend/r2-worker/` — separate Cloudflare Worker (own wrangler + node_modules)

### Large files — read ranges, never whole
```
1830  modules/sovereign/reclamation-university/VibrationModuleExperience.jsx
1456  modules/sovereign/reclamation-university/CauseEffectModuleExperience.jsx
1403  modules/sovereign/reclamation-university/RhythmModuleExperience.jsx
1399  data/visualResonanceManifest.js
1374  modules/sovereign/reclamation-university/GenderModuleExperience.jsx
 888  modules/sovereign/reclamation-university/PolarityModuleExperience.jsx
 864  data/causeEffectModuleData.js       ← prose-heavy, never full-text grep
 828  data/hermeticVibrationModuleData.js ← prose-heavy, never full-text grep
 813  components/layout/AppShell.jsx
 802  data/rhythmModuleData.js            ← prose-heavy
 709  data/genderModuleData.js            ← prose-heavy
```
Also never dump: `node_modules/`, `frontend/build/`, `frontend/public/**` binaries (many 2–3 MB
PNG/SVG/GIF assets), `ckp-changes.bundle`, `docs/*.xlsx`.

### Data layer
Supabase Postgres is primary. **Two migration systems — check which owns a table first:**
- `supabase/migrations/` — current history (latest: Act III "matrx alchemizr" lyric tagging + seed)
- `supabase/migrations_legacy_finalckp/` — archived, do not extend
- `backend/migrations/` — **orphaned.** One SQL file (immersive protocol tracks) that was applied by
  the retired backend. Nothing applies it now; do not add migrations here.

### Env vars
Frontend only (`frontend/.env`, see `.env.example`) — `backend/.env.example` is obsolete:
- `VITE_APP_SUPABASE_URL`/`VITE_SUPABASE_URL`,
  `VITE_APP_SUPABASE_ANON_KEY`/`VITE_SUPABASE_PUBLISHABLE_KEY` (both naming variants accepted),
  `VITE_APP_GOOGLE_CLIENT_ID`, `VITE_APP_R2_PUBLIC_BASE_URL`.
- `VITE_APP_BACKEND_URL` still exists but points at nothing. It is not a live config value.
- The Supabase **anon/publishable** key is the only key the frontend may ever hold. There is no
  longer any server-side context in this repo — a service-role key must never appear in it.
- `frontend/scripts/restore-env.mjs` runs before `dev`/`start` — check it before assuming `.env` is
  untouched between runs.

---

## 5. CURRENT IA IS THE SOURCE OF TRUTH

**The current architecture is the 7-module / 11-tab Hermetic system. Do not revert to the older
6-faculty structure.**

Current — 7 modules, one per Hermetic principle (registry: `HermeticHallViewport.jsx`):
`mentalism`, `correspondence`, `vibration`, `polarity`, `rhythm`, `cause-effect`, `gender`.

Current — 11 tabs per module, in 4 phases (canonical `TABS` array, `VibrationModuleExperience.jsx`):

| Phase | Tabs |
|---|---|
| UNDERSTAND | `intro`, `principle`, `concepts` |
| CONNECT | `why`, `domains`, `reclamation`, `lens` |
| APPLY | `reflection`, `protocol`, `artifact` |
| INTEGRATE | `summary` |

Legacy — the 6-faculty structure still physically present in
`frontend/src/data/reclamationUniversityCurriculum.js` (`foundations`, `identity`, `language`,
`thought-forms`, `sovereign-mind`, `aftermath`) plus historical global departments (Foundations,
Curriculum, Light Codes, Case Studies, Research Archive, Field Exercises, Protocol Labs,
Examinations, Graduation). This file is **reference material for content and lesson logic — not the
current information architecture.** The `:facultySlug` route segment is a surviving legacy name;
it does not mean the 6-faculty IA is current.

When reusing older work: extract the interaction model / state logic / content model / component
behavior and adapt it to the 7-module / 11-tab system. Do not transplant old navigation, do not
rename current modules or tabs to match the old system, and do not change architecture unless the
user explicitly asks.

> OLD = source of reusable behavior. CURRENT = source of truth for information architecture.

---

## 6. LEGACY REUSE RULE

Classify before porting:
- **A. Behavior** — tab switching, lesson progression, persistence, interactive cards, audio sync,
  modals, content unlocking, visual feedback, progress tracking → **port freely.**
- **B. Data model** — lesson schemas, curriculum metadata, module relationships, progression state
  → **port freely, adapt naming.**
- **C. Presentation** → port **only** if it fits the current visual system.
- **D. Obsolete architecture** — old navigation, faculty hierarchy, old routes, duplicate global
  state, conflicting styling → **never port** unless explicitly requested.

Legacy code is evidence, not authority. Never copy a whole legacy module because "it works."
When comparing branches, more code ≠ better; classify each difference as worth porting vs.
obsolete/duplicate/dead. The current branch stays authoritative.

---

## 7. DESIGN LANGUAGE

Premium, cinematic, futuristic. Preserve unless explicitly asked to change:
metallic/gunmetal presentation; dark cinematic environments; red/neon energy accents where already
established; act-specific elemental color systems; Musiq Matrix + CKP branding; central emblem /
energy-core language; audio-reactive presentation; strong hierarchy and deliberate spacing.

**Token system is dual-layer:**
- shadcn-style HSL CSS variables (`bg-primary`, `bg-background`, …) in `src/index.css`
- custom brand tokens (`bg-brand-*`, `text-brand-*`) in `frontend/tailwind.config.js`
  under `extend.colors.brand`

Do **not** mix legacy `chroma-*` classes with the current `brand-*` system.
Tailwind config changes require a dev server restart.

Typography: Inter is the global family (`tailwind.config.js`); **Cinzel is scoped to Reclamation
University CSS only** (`recUniSystem.css`, `hermeticJourneyTabs.css`, per-module `*.css`) — do not
promote it globally.

Do not replace the custom visual system with generic Bootstrap/SaaS-dashboard/default-shadcn
layouts, arbitrary gradients, new icon libraries, excessive cards, or gratuitous rounded containers.
Match the existing system before creating new UI.

---

## 8. NAMED SYSTEMS

Musiq Matrix · Chroma Key Protocol · Acts · Experience Mode · Guided Immersion · Sovereign Mode ·
Reclamation University · Sonic Artifacts · Core Visualizer / Lyrics Window · Matrix Maestro AI
Protocol Assistant (VMA) · Audio PLAY/FW/RW Control Panel · Five Core Thematics · Lyrical Codex ·
Elemental Codex · Visualizer Core · Vibes and Tribes.

Do not invent replacement routes or names when an existing concept already covers the location.

---

## 9. EDITING RULES

Before editing: know which file owns the behavior, its immediate dependencies, and whether state is
local, URL-driven, shared, or server-backed.

When editing: focused changes; preserve working behavior and public interfaces; no gratuitous
refactors; no reformatting unrelated files; no unrelated design-token changes; no package version
changes unless required. If a refactor is genuinely necessary, keep it localized and say why.

**Scope = exactly what was asked.** "Fix the tab interaction" ≠ redesign the app.
"Port this interaction" ≠ rewrite the module. "Fix this component" ≠ upgrade dependencies.
Do not clean up unrelated debt during feature work unless it blocks completion.

**No duplicate systems.** CKP has accumulated multiple generations of architecture — duplicates are
especially dangerous here. Before creating a component, hook, utility, context, route, Supabase
query, CSS variable, or state mechanism, search for an existing equivalent and extend it.
Never create two sources of truth for one concept, and do not add a global state library to solve a
local component problem.

---

## 10. VISUALIZER, AUDIO & PERFORMANCE

Before changing visualizer behavior, locate: the rendering lifecycle, the existing animation loop,
the audio analysis source (`useAudioAnalyzer.js` / `audioprovider.jsx`), cleanup/disposal, and
whether the component is client-only.

Avoid: duplicate animation loops, unnecessary new `AudioContext`s, repeatedly attached listeners,
leaked WebGL resources, expensive scene objects recreated per React render, per-frame React state
updates. Prefer refs / imperative animation state for high-frequency data.

Performance is first-class (render frequency, re-renders, WebGL lifecycle, asset loading, route-level
code splitting, request duplication) — but **inspect the actual path before optimizing.** No blind
optimization.

---

## 11. SUPABASE

Treat it as a live production data layer. Before changing DB logic: inspect the specific
schema/query/function, confirm the data doesn't already exist, avoid duplicate tables/columns,
avoid destructive migrations, don't casually change auth behavior. Narrow queries and targeted
schema inspection only. **Never print or retrieve secrets; never hardcode credentials.**

---

## 12. BUGS, ERRORS, VALIDATION

Bug fixing: identify the failure path → find the root cause → fix the root cause → verify that path
→ check only closely related regressions. Do not rewrite a feature over one bug, and do not fire off
five speculative fixes. Test the cheapest, highest-signal hypothesis first.

Error handling: no broad catches, no fake success states, no silently swallowed exceptions to make a
page look functional. Prefer explicit errors and real user-facing fallback states.

Validation: use the **smallest meaningful** check — a targeted vitest file for logic, a focused
inspection for UI, a build only for build/routing issues. Do not run expensive validation after every
tiny edit. If a full build is warranted, run it **once**, after the changes are complete.

---

## 13. GIT SAFETY

Never reset user work, discard uncommitted changes, force-push, overwrite unrelated work, or stage
unrelated files. Before committing: check `git status`, review the relevant diff, stage only intended
files. Do not assume all working-tree changes belong to your task. Publishing requires explicit
authorization.

---

## 14. COMMUNICATION & DONE

Be direct: state what you found, state what you'll change, execute, report. No tutorials unless
asked. Do not narrate every shell command. Do not repeatedly ask "should I continue?" on an already-
clear task. If a decision genuinely blocks progress, ask **one** focused question naming the exact
decision; otherwise take the safest interpretation consistent with this file and proceed.

Compact report format for routine work:
> Implemented X in Y. Reused Z from the existing system. Verified with A. No unrelated files changed.

Expand only for a real architectural decision, failure, or unresolved issue.

**Done** = requested behavior exists, integrated into the current architecture, existing behavior
still works, no obvious duplicate system introduced, narrowest useful validation passes, and the
final response states what changed. Then stop.

---

## 15. CONFLICT PRIORITY

1. Explicit user request
2. The repository's current working implementation
3. This CLAUDE.md
4. Legacy implementations
5. Speculation

Never let legacy code silently override the current architecture.

**Every action must answer:** does this materially move the requested CKP task toward completion?
If not, don't spend the credit.
