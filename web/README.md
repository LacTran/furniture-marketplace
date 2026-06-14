# Web Skeleton — Step 1b: Login/Register UI

Next.js 14 (App Router) + TypeScript + Tailwind. Connects to the .NET API
from the previous step (`register`, `login`, `me`).

## What this proves

This is the "full loop" checkpoint from the build order: a real browser session
calling your real API, with a real JWT, against your real Neon database.
Once register → login → home page (showing `/api/auth/me` response) all work,
the foundation is solid and we move on to the Posts feature.

## 1. Install dependencies

Make sure your .NET API from the previous step is **already running**
(`dotnet run`, listening on `http://localhost:5000`).

In a **separate terminal**, in this `web/` folder:

```bash
npm install
```

## 2. Configure the API URL

```bash
cp .env.local.example .env.local
```

The default (`http://localhost:5000`) should already match your API's HTTP port
from `launchSettings.json`. No changes needed unless you customized that.

## 3. Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## 4. Try the flow

1. Go to `/register`, create an account (display name, email, password 8+ chars)
2. You should be redirected to `/` and see "Welcome back, <name>" plus the raw
   JSON response from `/api/auth/me` — this confirms the JWT is being generated,
   sent, and validated correctly across the whole stack.
3. Click "Log out", then go to `/login` and log back in with the same credentials
   — should work the same way.

## If something goes wrong

**CORS error in browser console** (`has been blocked by CORS policy`):
Check `Api/appsettings.json` → `Cors:AllowedOrigins` includes `"http://localhost:3000"`
(it does by default in the skeleton). Restart the API after any appsettings change.

**"Failed to reach the API"**: Make sure the .NET API is running and
`NEXT_PUBLIC_API_URL` in `.env.local` matches the HTTP (not HTTPS) URL shown in
the API's console output — using plain HTTP locally avoids dev-certificate
issues between Next.js and the API.

**401 on /api/auth/me right after login**: Double-check the token is being stored —
open browser DevTools → Application → Local Storage → `auth-storage`, should contain
a `token` field with a long JWT string.

## Next step

Once this works end-to-end, we add the **Posts feature**: new EF Core entities on
the API side (Post, Favorite), new endpoints (create/browse/favorite posts), and
corresponding pages here (`/posts/new`, `/posts` browse page).
