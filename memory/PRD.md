# The Chroma Key Protocol — PRD

## Original Problem Statement
Build an interactive learning module called "The Chroma Key Protocol" (Musiq Matrix — Balanced Elementals) with a High-Fidelity Cyber-Noir aesthetic. Features include 4 Phase/Act cards, "The Seeker" (Prometheus) AI identity, an Immersion Protocol (sonic visualizer with synced popups), Spin Wheel (12 sections), Social/Spotify integrations, and an Admin Panel. Implement Tiered Access: Free (Act I), $17.99 License (Acts I-IV + Act III ownership), $29.99 Full Access (Everything + all ownership), and a $5.00 Admin-configurable Add-on for full ownership. A deeply interactive 5-Step Protocol Engine per Act.

## User Personas
- **Seekers**: Users going through the 4-Act self-discovery protocol
- **Admin**: Content manager who configures tracks, prices, and user tiers

## Core Requirements
- 4 Acts with elemental themes: Earth (I), Fire (II), Water (III), Air (IV)
- 5-Step Protocol Engine per Act (DomainSliders, Checklist, PillGrid, WitnessSliders, Declaration)
- AI Agent (Prometheus/Meridian/Terra/Aether) per Act for transmissions
- Tiered access gating (Free, License, Full)
- Spin Wheel (earned per completed act)
- Immersion Protocol with audio visualization
- Admin Panel for content/pricing management
- JWT + Google OAuth authentication
- Stripe payment integration

## Architecture
- Frontend: React + Tailwind + Framer Motion
- Backend: FastAPI + MongoDB
- Auth: JWT cookies + Emergent Google OAuth
- Payments: Stripe (Emergent proxy test key)
- AI: Emergent LLM Key (OpenAI GPT-5.2)

## Element Order (CONFIRMED)
- Act I: Earth — The Fractured Veil (Agent: Terra)
- Act II: Fire — Reclamation (Agent: Prometheus)
- Act III: Water — The Reflection Chamber (Agent: Meridian)
- Act IV: Air — The Crucible Code (Agent: Aether)

## What's Been Implemented
- [x] Project init, Tailwind, Framer Motion
- [x] JWT + Google OAuth authentication
- [x] Dashboard with 4 premium Act cards (custom SVGs)
- [x] Journal Entry CRUD system
- [x] Act overview pages with placeholder videos
- [x] Immersion Protocol with auto-cycling VH1-style popups
- [x] Spin Wheel (1 spin per completed act)
- [x] Backend Tier Gating (Free, License, Full)
- [x] Admin Panel (Content, Wheel, Settings, Guide tabs)
- [x] 5-Step Protocol Engine shell & DB tracking
- [x] Act I (Earth/Fractured Veil) detailed protocol logic with all metrics (Apr 6, 2026)
- [x] Act II (Fire/Reclamation) detailed protocol logic with all metrics (Apr 6, 2026)
- [x] Act III (Water/Reflection Chamber) detailed protocol logic (Apr 6, 2026)
- [x] Act 2/3 content swap — Fire is now Act II, Water is now Act III (Apr 6, 2026)
- [x] Cross-step data retrieval for Declaration prompts (step1Text, step3Text)
- [x] Dashboard 3D glowing cards with CSS perspective transforms (Apr 6, 2026)
- [x] Dashboard animated particle background (canvas-based, 4 elemental colors) (Apr 6, 2026)
- [x] Dashboard glass-morphism panels with backdrop blur (Apr 6, 2026)
- [x] Sidebar user profile section showing actual name, email, tier badge, level (Apr 6, 2026)
- [x] Protocol completion trail with animated dots on progress bar (Apr 6, 2026)
- [x] Level 0 display bug fix (using ?? instead of ||) (Apr 6, 2026)

## Prioritized Backlog

### P0 (Critical)
- Spotify Web API Integration (requires user's Spotify Developer keys)

### P1 (Important)
- Hover glow effects on elemental SVG icons
- Achievement badges for completing acts/spins

### P2 (Nice to Have)
- ESLint version cleanup (downgrade to 8.x)
- AdminPanel.js refactoring (600+ lines → components)
- Audio/music integration per Act mood

## Key API Endpoints
- POST /api/auth/register, /api/auth/login, /api/auth/google, GET /api/auth/me
- GET/POST /api/protocol/steps/{act}/{step}
- POST /api/protocol/complete-act/{act}
- POST /api/spins/use
- POST /api/protocol/chat (Prometheus LLM engine)
- GET/POST /api/reflections, GET/POST/PUT/DELETE /api/journals

## DB Schema
- users: {email, tier, spins_earned, spins_used, owns_all_albums, is_admin, act3_unlocked, current_act, completed_acts}
- protocol_steps: {user_id, act_number, step_number, data, completed}
- completed_acts: {user_id, act_number}
- journals: {user_id, title, content, related_act}

## Test Credentials
- Admin: test@demo.com / password123 (is_admin=true, tier=full, all unlocked)
