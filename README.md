# StudyLock — Web

The public site and authenticated dashboard for StudyLock: an all-in-one study
planner and distraction blocker. Built with Vite + React + React Router +
Firebase (Auth + Firestore).

> Finish your work. Earn your free time.

---

## What's inside

```
src/
  main.jsx                 App entry + providers
  App.jsx                  All routes
  config.js                External URLs (installer, extension stores, Stripe)
  firebase.js              Firebase init (reads .env)
  styles/tokens.css        Design tokens + shared classes
  context/AuthContext.jsx  Auth state, signup/login/logout, account deletion
  lib/db.js                Firestore CRUD: tasks, schedules, blocklists,
                           devices, browser pairing, data deletion
  components/              Layouts, nav, footer, dashboard shell, UI atoms
  pages/
    public/                Landing, Pricing, Download, Extension, Help,
                           Privacy, Terms
    auth/                  Login, Signup (+ shared AuthShell)
    dashboard/             Overview, Tasks, Schedules, Blocklists, Devices,
                           Browsers, Settings, Billing
firestore.rules            Security rules (per-user data + pairing codes)
firebase.json              Hosting (SPA rewrites) + Firestore rules
.env.example               Copy to .env and fill in
```

### Routes

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | public | Landing page (your original component) |
| `/pricing` `/download` `/extension` | public | Product pages |
| `/help` `/privacy` `/terms` | public | Support + legal |
| `/login` `/signup` | public | Account access |
| `/dashboard` | protected | Overview |
| `/dashboard/tasks` | protected | Planner + homework, proof-of-work |
| `/dashboard/schedules` | protected | Recurring focus sessions |
| `/dashboard/blocklists` | protected | Apps / sites / URLs to lock |
| `/dashboard/devices` | protected | Linked devices |
| `/dashboard/browsers` | protected | Extension pairing |
| `/dashboard/settings` | protected | Profile + account deletion |
| `/dashboard/billing` | protected | Plan + billing portal |

---

## 1. Install

Requires Node.js 18+.

```bash
npm install
```

## 2. Configure Firebase

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Sign-in method:** enable **Email/Password** and **Google**.
3. **Firestore Database:** create a database (production mode is fine — rules are provided).
4. **Project settings → General → Your apps:** add a **Web app** and copy its config.
5. Copy `.env.example` to `.env` and paste the values:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Product links (safe to leave blank during development)
VITE_WINDOWS_INSTALLER_URL=
VITE_CHROME_EXTENSION_URL=
VITE_EDGE_EXTENSION_URL=
VITE_STRIPE_PORTAL_URL=
```

> If Firebase isn't configured, the app still runs — auth pages show a setup
> notice instead of throwing, so you can preview the UI immediately.

## 3. Run locally

```bash
npm run dev
```

Open <http://localhost:5173>.

## 4. Deploy the security rules

The Firestore rules lock every user to their own data. Deploy them with the
Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # select your project
firebase deploy --only firestore:rules
```

## 5. Build & host

```bash
npm run build               # outputs to dist/
```

**Option A — Firebase Hosting** (config included):

```bash
firebase deploy --only hosting
```

**Option B — Vercel / Netlify:** import the repo, framework preset **Vite**,
build command `npm run build`, output dir `dist`. Add a rewrite of all routes to
`/index.html` so client-side routing works on refresh (Firebase Hosting already
does this via `firebase.json`).

Add your `VITE_*` variables in the host's environment settings.

**Option C — GitHub Pages** (workflow included): see the next section.

---

## Deploying to GitHub Pages

This project is already set up for Pages. Three things make an SPA like this work
there, and all three are done for you:

- **`base` path** — `vite.config.js` sets `base: "/studylock-web/"`. Pages serves
  a project site at `https://<user>.github.io/<repo>/`, so this **must match your
  repo name**. Rename it if your repo isn't called `studylock-web`. (Use `"/"` for
  a `<user>.github.io` user page or a custom domain.)
- **Routing** — the app uses `HashRouter` (`src/main.jsx`). Pages can't rewrite
  deep links to `index.html`, so hash routing avoids 404s on refresh. URLs look
  like `.../#/dashboard/tasks`.
- **Build + deploy workflow** — `.github/workflows/deploy.yml` builds and
  publishes on every push to `main` using the official Pages actions.

### Steps

1. **Push the repo to GitHub** with `main` as the default branch.
2. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
3. **Settings → Secrets and variables → Actions → New repository secret:** add each
   of these (values from your Firebase web config and product URLs):
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
     `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
     `VITE_FIREBASE_APP_ID`
   - optionally `VITE_WINDOWS_INSTALLER_URL`, `VITE_CHROME_EXTENSION_URL`,
     `VITE_EDGE_EXTENSION_URL`, `VITE_STRIPE_PORTAL_URL`
4. **Push to `main`** (or run the workflow from the Actions tab). When it finishes,
   your site is live at `https://<user>.github.io/<repo>/`.

### Don't skip: authorize the domain in Firebase

Login and Google sign-in will silently fail on a domain Firebase doesn't trust.
In the Firebase console go to **Authentication → Settings → Authorized domains**
and add `<user>.github.io`. (Custom domain? Add that too.)

### Notes & limits on Pages

- **`firebase.json` hosting rewrites don't apply on Pages** — that file is only
  for Firebase Hosting. Firestore rules still deploy via the Firebase CLI
  (`firebase deploy --only firestore:rules`), independent of where the site is hosted.
- Firebase web config keys are **not secrets** — they're public by design and end
  up in any client bundle. Your Firestore security rules are what protect data.
- Google sign-in uses a popup, which works on Pages. If you ever switch to
  `signInWithRedirect`, revisit the authorized-domains setup.

---

## Data model

All records live under `users/{uid}/…` so the security rules can scope access to
the signed-in owner.

- `users/{uid}/tasks` — `{ title, course, due, isHomework, done, proof, createdAt }`
- `users/{uid}/schedules` — `{ label, days[], start, durationMin, blocklistId, enabled }`
- `users/{uid}/blocklists` — `{ name, items: [{ kind, value, locked }] }`
- `users/{uid}/devices` — `{ name, platform, lastSeen }` (written by the Windows app)
- `users/{uid}/browsers` — `{ name, engine }` (written by the extension on pairing)
- `pairingCodes/{code}` — `{ uid, claimed, expiresAt }` (short-lived, top-level)

### How pairing works

1. The dashboard **Browsers** page calls `createPairingCode(uid)` → writes
   `pairingCodes/{CODE}` and shows the 6-character code (expires in 10 min).
2. The extension (signed into the same account) reads that code doc, then:
   - writes a doc under `users/{uid}/browsers`, and
   - sets `claimed: true` on the pairing code.
3. The dashboard is listening on the code doc and confirms the pairing, and the
   new browser appears in the list.

The Windows app follows the same idea for `users/{uid}/devices`, updating
`lastSeen` on each check-in.

---

## Connecting the native clients

This repo is the **web** side. To fully close the loop you'll wire your existing
clients to the same Firebase project:

- **Windows app** — sign in with Firebase Auth, read `schedules`/`blocklists`,
  enforce blocking locally, and upsert its own `devices/{deviceId}` doc with a
  fresh `lastSeen` timestamp.
- **Browser extension** — sign in, implement the pairing claim above, and read
  the owner's blocklists to enforce site/URL/tab blocking.

The client SDKs share the same collection layout documented above, so the
dashboard reflects their data live via the `watch*` listeners in `lib/db.js`.

---

## Notes

- No ads, and the app never deletes user software — blocking only closes apps and
  sites during focus, matching the product promise.
- `Privacy` and `Terms` pages are **templates**; have them reviewed before launch.
- Pricing amounts are placeholders; wire real checkout through your billing
  provider and point `VITE_STRIPE_PORTAL_URL` at the customer portal.
