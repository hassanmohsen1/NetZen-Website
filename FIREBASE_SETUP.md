# NetZen admin dashboard — setup

The landing page now reads its content from Firestore, and `/admin` is a
password-protected dashboard for editing that content in English and Arabic.
There is no backend server: the browser talks to Firestore directly, and
`firestore.rules` is what enforces who may change what.

Until you finish these steps the site still works — it falls back to the content
bundled in `src/i18n/`. Only the dashboard and the contact form need Firebase.

Total time: about 10 minutes.

---

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and click **Create a project**.
2. Name it (e.g. `netzen`), accept the defaults, and finish. Google Analytics is
   optional and not used here.

## 2. Register a web app and copy the config

1. On the project overview page click the **`</>`** (Web) icon.
2. Give it a nickname (e.g. `netzen-web`) and click **Register app**.
   You do *not* need Firebase Hosting at this stage.
3. Firebase shows a `firebaseConfig` object. Keep this tab open.

## 3. Put the config into `.env`

In the project folder, copy the example file:

```bash
cp .env.example .env
```

Then paste each value from `firebaseConfig` into `.env`:

| `firebaseConfig` key | `.env` variable |
| --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

These keys are **not secrets** — every Firebase web app ships them in the
browser. Your data is protected by the security rules in step 6, never by
hiding these values. `.env` is gitignored mainly so different environments can
point at different projects.

## 4. Turn on Firestore

1. In the console sidebar: **Build → Firestore Database → Create database**.
2. Choose **Start in production mode** (locked down — step 6 opens exactly what
   is needed).
3. Pick the region closest to your users. **This cannot be changed later.**

## 5. Turn on email/password sign-in and create your admin user

1. **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Email/Password** and save.
3. Open the **Users** tab → **Add user**. Enter the email and password you want
   to log into the dashboard with.
4. Copy that user's **User UID** — you need it in the next step.

There is deliberately no sign-up screen. Accounts exist only when you create
them here.

## 6. Grant yourself admin and deploy the rules

Being able to sign in is not enough — an account is only an admin if it has a
document in the `admins` collection.

**a. Create the admin record**

1. **Build → Firestore Database → Start collection**.
2. Collection ID: `admins`
3. Document ID: **paste the User UID from step 5** (not the email).
4. Add one field so the document saves — e.g. field `email`, type `string`,
   value your email address. Save.

**b. Deploy the security rules**

Easiest path, no tooling:

1. **Firestore Database → Rules** tab.
2. Replace everything in the editor with the contents of `firestore.rules`.
3. Click **Publish**.

Or, with the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

> Skipping this step is the single most common cause of "Firestore denied the
> write" in the dashboard — production mode denies everything by default.

## 7. Restart and publish your content

```bash
npm run dev
```

Vite only reads `.env` at startup, so a restart is required.

1. Open <http://localhost:5173/admin> and sign in.
2. You will see the current site content already loaded.
3. Click **Publish changes** once. This writes `content/en` and `content/ar` to
   Firestore for the first time — from then on the live site reads from there.

That last click is what seeds the database; there is no separate seed script to
run.

---

## Using the dashboard

- **Page sections** in the sidebar map one-to-one to the sections of the landing
  page. Text fields show **English and العربية side by side** so translations
  never drift apart.
- Fields tagged **Both languages** (icons, image URLs, colours, numbers, link
  targets) are language-neutral and are written to both documents at once.
- Lists — service cards, stats, menu links, footer links, partners — can be
  added, removed and reordered. Reordering applies to both languages together so
  the two stay index-aligned.
- **Submissions** is the inbox for the contact form. Opening a message marks it
  read; **Reply** opens your mail client.
- Published edits appear on the site **after a page refresh**. Visitors fetch
  content once per page load rather than holding a live connection, which keeps
  read costs low.

### Colours and icons

The colour dropdown is limited to four combinations on purpose — those are the
only ones present in `tailwind.config.js`'s `safelist`, so any other value would
render as an unstyled block. Icon fields accept any name from
[Google Material Symbols (Outlined)](https://fonts.google.com/icons).

---

## Deploying the site

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` is already configured: it serves `dist/`, rewrites all routes to
`index.html` (so a direct visit to `/admin` works), and sets long cache headers
on hashed assets.

If you deploy somewhere other than Firebase Hosting (Netlify, Vercel, nginx),
configure the same SPA fallback — every path must serve `index.html`, otherwise
`/admin` returns 404 on refresh.

---

## Worth knowing

**Cost.** The Firestore free tier covers 50k document reads/day. Each page view
costs 2 reads (one per language), so roughly 25k page views/day before billing
starts.

**Spam.** The contact form has a honeypot field and the rules cap field lengths
and reject client-supplied timestamps. If you start getting automated spam,
enable [App Check](https://firebase.google.com/docs/app-check) with reCAPTCHA —
it plugs in without code changes to the form.

**Adding another admin.** Create the user under Authentication → Users, then add
a document with their UID to the `admins` collection. Nothing else is needed.

**Removing an admin.** Delete their `admins` document. They lose write access
immediately; delete the Authentication user too if they should not sign in at
all.

**Backups.** The whole site content is two Firestore documents. Firestore →
`content` → `en`/`ar` → the ⋮ menu can export them. Note that
`src/i18n/en.js` and `ar.js` remain in the repo as the fallback copy, so a total
Firestore loss degrades to the last-committed content rather than an empty page.

## Troubleshooting

| What you see | Cause |
| --- | --- |
| "Firebase isn't configured" at `/admin` | `.env` missing or the dev server was not restarted after creating it. |
| "Not authorised" after signing in | No document in `admins` with your **User UID** (a common slip is using the email as the document ID). |
| "Could not verify your account" | `firestore.rules` has not been deployed. |
| "Firestore denied the write" | Same as above — rules not deployed, or the `admins` document ID does not match your UID. |
| Edits do not show on the site | Refresh the page; content is fetched at load time. |
| `/admin` 404s after deploying | The host is not rewriting unknown paths to `index.html`. |
