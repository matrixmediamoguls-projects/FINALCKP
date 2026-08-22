# FinalCKP → Sovereign OS: Architecture

This is the canonical architecture document for the Chroma Key Protocol app. It
defines two things:

1. **The current architecture** (what is actually running today).
2. **The target architecture** (what the Sovereign OS migration is moving
   toward, per the FINALCKP → SOVEREIGN OS Implementation & Migration Guide).

Where the two differ, this doc says so explicitly. Do not assume the target
state is already implemented — check `SOVEREIGN_STATE_MAP.md` (Phase 2) and
the migration status notes below before relying on any target-architecture
component described here.

## Migration status

This repo has completed **Phase 1 (Repository Sanitization)** and **Phase 2
(State Inventory)** of the Sovereign OS migration. Nothing described under
"Target architecture" below has been built yet. The **current architecture**
section reflects the real, active system as of this phase and is the one to
trust for day-to-day development until later phases land.

Phase 2 produced `docs/SOVEREIGN_STATE_MAP.md`, a full inventory of every
existing state store (module progress, journal, declarations, audio state,
auth, curriculum registry, etc.) and its owner/persistence/consumers. It
found significant duplication — most notably **seven independent,
incompatible Reclamation-University progress-tracking systems** and **two
independently-writable stores for a user's `current_act`/`completed_acts`**
(Supabase Auth metadata vs. backend Postgres `users`), where the live UI
only writes one of them. Read that doc before designing the Sovereign
Runtime (Phase 3) — it exists specifically so Phase 3 isn't designed against
assumption.

## Current architecture (active today)

```
Frontend                        Backend                         Data / Infra
─────────                       ───────                         ────────────
React + Vite                    FastAPI (backend/server.py,      Supabase
React Router v7                 the single canonical API —        - Postgres (primary datastore)
Tailwind + shadcn tokens        backend/app/main.py is a          - Auth (frontend authenticates
Tone.js / Web Audio             one-line shim re-exporting it,      directly against Supabase,
                                 backend/app/routes|services are     not via the backend)
                                 legacy/dead code, not mounted)
                                                                  Cloudflare
                                 Responsibilities:                 - Pages (hosts the built frontend)
                                 - Supabase access-token             - R2 (audio/media storage, via
                                   verification                        boto3 S3-compatible client)
                                 - Cloudflare R2 object storage     - R2 Worker (frontend/r2-worker,
                                   (audio streaming/downloads)        proxies/serves R2 media)
                                 - Stripe-style checkout /
                                   license-key flows
                                 - Redis-backed rate limiting /
                                   session state
                                 - Protocol acts/journal/
                                   reflections/spins endpoints
```

Auth is Supabase-first: `frontend/src/context/AuthContext.jsx` authenticates
directly against Supabase Auth in the browser and gates routes on that state.
The FastAPI backend validates the Supabase access token passed from the
frontend for its own owned resources — it does not issue a competing
session. See `API_CONTRACT.md` for the backend's own bearer-token endpoint
contracts, and `CLAUDE.md` for the full architecture writeup this summarizes.

Existing state (module/scene progress, journal, declarations, listened
tracks, audio state, curriculum registry, etc.) is currently owned
independently by several different components/hooks — there is no single
runtime that owns state today. Phase 2 (`SOVEREIGN_STATE_MAP.md`) inventories
this in detail; that inventory, not this doc, is the source of truth for
"who owns what" until the Sovereign Runtime (Phase 3) exists.

## Target architecture (Sovereign OS — not yet built)

```
FinalCKP
│
├── Experience Layer
│   ├── Sovereign OS
│   ├── Reclamation University
│   └── Experience Mode
│
├── Runtime Layer
│   ├── SovereignRuntime
│   ├── Event Bus
│   ├── Media Runtime
│   └── Synthesis Runtime
│
├── State Layer
│   ├── Local State
│   ├── Supabase
│   └── Realtime
│
├── Infrastructure
│   ├── Cloudflare Pages
│   ├── Cloudflare Workers
│   └── Cloudflare R2
│
└── External Integrations
    ├── Spotify
    └── AI/VMA
```

Target stack, once migrated:

- **Frontend**: React + Vite, React Router, Tailwind / existing design
  system, Tone.js / Web Audio.
- **State**: Sovereign Runtime (React context/hooks) with local persistence
  and Supabase persistence.
- **Backend / Infrastructure**: Supabase (identity, database, RLS,
  persistent state, realtime) + Cloudflare (Pages, Workers, R2) for
  delivery, edge execution, and media. **FastAPI is removed completely** in
  the target state — Cloudflare Workers take over any edge/protected-API
  logic the backend currently owns.
- **External Media**: Spotify integration where appropriate.
- **AI**: VMA / AI services operate as consumers of Sovereign State (a
  read-only `SovereignContext`), not as an independent chatbot bolted onto
  the app.

The full phased path from current → target architecture (state inventory,
Sovereign Runtime, 11-step curriculum state machine, local-first autosave,
event bus, Supabase persistence, Reclamation University migration, media
runtime, concept graph, domain matrix, reflection/synthesis/artifact
pipeline, OS shell, visual layer, Cloudflare consolidation, VMA, testing,
and finally deleting the legacy architecture) is tracked phase-by-phase as
migration work proceeds. Each phase should only begin once the phase before
it is real and working — do not build a downstream layer (e.g. the Artifact
UI) on top of an upstream layer that's only faked (e.g. Synthesis State that
doesn't actually exist yet).

## Repository FastAPI/backend reference audit (Phase 1.1)

As of this phase, mentions of FastAPI/the Python backend across the repo
were classified as follows:

| Location | Classification | Action |
|---|---|---|
| `backend/server.py`, `backend/app/main.py`, `backend/run.py`, `backend/requirements.txt`, `backend/tests/*` | Active code | Untouched — still the canonical, running backend |
| `CLAUDE.md`, `README.md`, `API_CONTRACT.md` | Active, accurate documentation of the currently-running system | Kept, annotated with a pointer to this doc as the target architecture |
| `APP_FLOW_INFRA_ANALYSIS.md` | Historical analysis; the specific "two FastAPI patterns" split-brain it describes has already been resolved (`backend/app/main.py` is now a one-line shim) | Kept as history, annotated as resolved/historical |
| `memory/PRD.md` | Historical/original PRD (predates Supabase; still says "MongoDB") | Left as-is — historical record, not live guidance |
| `supabase/config.toml` | Unrelated — Supabase CLI's own auto-generated comment about its API server (PostgREST), not the FastAPI backend | No action |
| `frontend/src/services/certificates/bloomCertificateGenerator.js` | Active code; generic comment ("backend API"), not FastAPI-specific | No action |

Nothing was deleted in this pass. FastAPI removal is Phase 20 of the
migration guide and depends on every phase before it actually replacing its
responsibilities first.
