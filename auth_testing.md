# Auth Testing Playbook

## Overview

This app now uses local email/password authentication through the backend:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Authenticated browser sessions are stored in the `session_token` cookie, which contains a backend-issued JWT.

## Local Setup

Backend environment must include:

- `JWT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_KEY`

Frontend environment must include:

- `REACT_APP_BACKEND_URL`

## Manual API Checks

```bash
# Register
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login and store cookies
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Read current session
curl -X GET "http://localhost:8000/api/auth/me" \
  -b cookies.txt

# Logout
curl -X POST "http://localhost:8000/api/auth/logout" \
  -b cookies.txt
```

## Browser / E2E Setup

Use the backend login endpoint first, then reuse the cookie jar in the browser context.

```javascript
await page.goto("http://localhost:3000/login");
await page.getByTestId("login-email-input").fill("test@example.com");
await page.getByTestId("login-password-input").fill("password123");
await page.getByTestId("login-submit-btn").click();
await page.waitForURL("**/dashboard");
```

## Direct Database Checks

Verify the `users` table contains:

- `user_id`
- `email`
- `name`
- hashed `password`

There is no separate OAuth/session table in the current auth model.

## Success Indicators

- `/api/auth/login` returns `200`
- `/api/auth/me` returns the logged-in user
- Browser lands on `/dashboard`
- Logout clears the session and `/api/auth/me` returns `401`

## Failure Indicators

- `401 Invalid credentials`
- `500` due to missing `JWT_SECRET` or Supabase config
- Redirect loop back to `/login`
