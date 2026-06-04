# Auth Testing Playbook

## Overview

This app uses Supabase Auth in the browser through `@supabase/supabase-js`.

- The client is created in `frontend/src/services/supabase/client.js`.
- `AuthProvider` reads the current Supabase session and listens for auth state changes.
- `ProtectedRoute` redirects unauthenticated users to `/login` and preserves the intended destination.
- Email/password and Google OAuth both return users to the protected page they tried to open.

## Local Setup

Frontend environment must include:

- `VITE_APP_SUPABASE_URL`
- `VITE_APP_SUPABASE_ANON_KEY`

The app also accepts these fallback names:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Supabase Dashboard Checks

In the Supabase dashboard for the project referenced by `VITE_APP_SUPABASE_URL`:

- Enable Email authentication under Authentication providers.
- Enable Google only if the Google button should be active.
- Add the local site URL, for example `http://localhost:3000` or the current Vite port.
- Add redirect URLs for `/acts`, `/login`, and any deployed production domain.

## Browser Checks

1. Start the frontend.
2. Open a protected page such as `/protocol/3`.
3. Confirm the browser redirects to `/login`.
4. Sign in with a Supabase test user.
5. Confirm the browser returns to the original protected page.
6. Log out and confirm protected pages redirect back to `/login`.

## Success Indicators

- `/login` accepts a valid Supabase email/password user.
- `/register` creates or requests confirmation for a Supabase Auth user.
- Google OAuth returns to `/login?redirect=...`, then the app sends the authenticated user to the intended page.
- Protected routes do not render until the Supabase session check finishes.

## Failure Indicators

- `Supabase is not configured`: frontend env vars are missing or empty.
- `Invalid login credentials`: the Supabase user does not exist or the password is wrong.
- Redirect loop: Supabase dashboard site URL or redirect URL settings do not include the current app origin.
