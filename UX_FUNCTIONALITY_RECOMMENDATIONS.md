# Exact Executable Action Plan: Design + Seamless Functionality

This plan converts the prior recommendations into **implementation-ready tasks** with explicit file targets, code changes, commands, and acceptance checks.

---

## Execution Rules

- Create one branch per phase (or one PR per phase if team prefers).
- Keep each PR shippable in isolation.
- Do not mix design-system refactors with feature behavior unless the checklist explicitly says so.
- Every phase ends with a measurable validation step.

---

## Phase 1 (2–3 days): Responsiveness + Search Truthfulness + Error UX

### 1.1 Responsive App Shell

**Goal:** Desktop layout gracefully adapts to tablet/mobile with zero horizontal overflow.

**Files to change**
- `frontend/src/components/layout/AppShell.js`
- `frontend/src/index.css` (or `frontend/src/App.css`, pick one canonical location for responsive utilities)

**Implementation steps**
1. Add a `isMobile`/`isTablet` breakpoint hook (or CSS media-query driven class toggles).
2. Collapse sidebar below tablet width (icon-only rail or drawer behavior).
3. Stack topbar controls below mobile width (search becomes row 2).
4. Increase actionable text minimum size to at least 12px equivalent on small screens.
5. Ensure long profile name/email truncates correctly in all breakpoints.

**Definition of done**
- No horizontal scroll at widths: 390, 768, 1024, 1440.
- Topbar CTA and logout remain reachable on mobile.

---

### 1.2 Global Search Must Be Honest

**Goal:** Search is either functional or clearly disabled.

**Files to change**
- `frontend/src/components/layout/AppShell.js`
- Optional: create `frontend/src/lib/searchIndex.js` for local route labels and content metadata.

**Implementation steps (Option A: functional now)**
1. Add controlled state for search input.
2. Build a local in-memory index of navigable destinations:
   - Dashboard, Protocol, Seeker, Immersion, Wheel, Journal, Act I–IV.
3. On Enter/select, navigate directly to matching route.
4. Add keyboard support: ArrowUp/ArrowDown/Enter/Escape.

**Implementation steps (Option B: disable now)**
1. Set input to disabled/readOnly.
2. Add helper text: “Search coming soon”.
3. Add `aria-disabled="true"` and visual disabled style.

**Definition of done**
- No “fake interactive” control remains.
- Keyboard users can complete the flow.

---

### 1.3 User-Facing Error States for Auth/Progress

**Goal:** Failed async actions provide clear recovery path.

**Files to change**
- `frontend/src/context/AuthContext.js`
- `frontend/src/hooks/use-toast.js`
- Relevant pages triggering auth/progress actions (`frontend/src/pages/Login.js`, `Register.js`, etc.)

**Implementation steps**
1. Normalize errors returned from axios (network vs 4xx vs 5xx).
2. Surface toast messages for login/register/logout/progress failure.
3. Add retry action for transient failures.
4. Show loading disabled state on submit buttons while request is in flight.

**Definition of done**
- Every auth/progress error path produces a visible message.
- No silent failure path remains.

---

## Phase 2 (3–4 days): Motion Accessibility + Design Tokenization

### 2.1 Reduced Motion Compliance

**Goal:** Respect `prefers-reduced-motion` and reduce GPU-heavy effects.

**Files to change**
- `frontend/src/pages/Dashboard.js` (ambient canvas + 3D tilt/glow)
- Shared styles in `frontend/src/index.css`

**Implementation steps**
1. Detect reduced-motion preference via media query.
2. Disable particle animation loop and card tilt when reduced motion is enabled.
3. Remove pulsing animation from CTA for reduced-motion users.
4. Lower default particle count for all users on small screens.

**Definition of done**
- Reduced motion mode has no continuous animation.
- Dashboard remains visually coherent when animations are off.

---

### 2.2 Extract Reusable UI Tokens/Primitives

**Goal:** Reduce inline style duplication and enforce consistent interaction states.

**Files to change**
- `frontend/src/index.css` (token classes/utilities)
- `frontend/src/components/ui/button.jsx` (or app-specific button wrapper)
- `frontend/src/components/layout/AppShell.js`
- `frontend/src/pages/Dashboard.js`

**Implementation steps**
1. Define shared classes/tokens for:
   - panel surfaces
   - mono label text
   - primary/secondary buttons
   - nav row active/hover/disabled states
2. Replace repeated inline style blocks in AppShell first.
3. Repeat for Dashboard card/button patterns.
4. Keep visual diff minimal; this is structure cleanup, not redesign.

**Definition of done**
- At least 40% reduction in inline style lines in AppShell + Dashboard.
- Interaction states are consistent between nav rows and buttons.

---

## Phase 3 (2–3 days): Flow Continuity (Next-Step UX + Locked UX)

### 3.1 Adaptive “Continue Your Path” CTA

**Goal:** CTA routes to most useful next step, not only current act.

**Files to change**
- `frontend/src/components/layout/AppShell.js`
- `frontend/src/data/actDefinitions.js` (if needed for next-step mapping)

**Implementation steps**
1. Create a deterministic function `getNextBestRoute(user)` using:
   - `current_act`
   - `completed_acts`
   - `act3_unlocked`
   - tier/access state
2. Route CTA to:
   - next incomplete act, or
   - unlock flow if blocked, or
   - reflection/journal if act complete.
3. Update CTA label dynamically (e.g., “Resume Act II”, “Unlock Act III”, “Write Reflection”).

**Definition of done**
- CTA always resolves to an actionable destination for current user state.

---

### 3.2 Locked State Explainability

**Goal:** Locked features communicate rules + immediate action.

**Files to change**
- `frontend/src/components/layout/AppShell.js`
- `frontend/src/pages/LockedAct.js`
- `frontend/src/components/layout/PaywallModal.js`

**Implementation steps**
1. For locked acts, show exact unlock condition copy.
2. Add direct action button near lock message (e.g., “Unlock Access” / “Complete Prior Act”).
3. Ensure locked click behavior provides feedback (toast/modal), not just no-op or dimmed state.

**Definition of done**
- Users can understand *why* content is locked and what to do next in one interaction.

---

## Backend Support Tasks (parallel, 1–2 days)

### 4.1 Standardize Error Payloads

**Goal:** Frontend can map backend failures to user-friendly toasts consistently.

**Files to change**
- `backend/server.py`

**Implementation steps**
1. Ensure errors include a stable shape: `{ code, message, hint }`.
2. Normalize common auth/progress failure responses.
3. Keep status codes semantically correct (400/401/403/404/409/500).

**Definition of done**
- Frontend error mapper can parse all auth/progress API errors uniformly.

---

## QA Checklist (must run before merge)

### Manual checks
- Desktop/tablet/mobile visual pass for AppShell and Dashboard.
- Keyboard-only navigation pass for search + nav.
- Reduced-motion mode pass.
- Auth error scenarios (bad creds, timeout, server error).
- Locked flow scenario (non-admin and admin).

### Suggested commands
From repo root:

```bash
# Backend tests
python -m pytest backend/tests -q

# Frontend install + test/build
cd frontend
npm ci
npm test -- --watchAll=false
npm run build
```

---

## PR Breakdown (recommended)

1. **PR-1:** Responsive shell + honest search behavior
2. **PR-2:** Auth/progress error handling + toasts
3. **PR-3:** Reduced-motion + animation throttling
4. **PR-4:** AppShell/Dashboard tokenization refactor
5. **PR-5:** Adaptive CTA + locked-state explainability
6. **PR-6:** Backend error-shape normalization

Each PR should include:
- before/after screenshots for UI-affecting work
- explicit acceptance criteria mapping
- rollback notes if behavior changes

---

## Success Metrics (30 days post-release)

- 20% decrease in locked-flow drop-offs.
- 30% decrease in repeated login attempts per successful session.
- 0 critical accessibility findings for keyboard navigation/focus visibility.
- Improved mobile engagement on dashboard routes.

