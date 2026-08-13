import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// The landing page must render from its bundled content even with no Firebase
// project attached, so every consumer checks this flag before touching `app` or
// `db` instead of assuming they exist.
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId)

let app = null
let db = null

if (isFirebaseConfigured) {
  app = initializeApp(config)
  db = getFirestore(app)
} else if (import.meta.env.DEV) {
  console.info(
    '[netzen] Firebase is not configured — using bundled content. ' +
      'Copy .env.example to .env and fill in your project keys to enable the admin dashboard.'
  )
}

// Note: Firebase Auth is deliberately NOT initialised here. Only the admin
// dashboard signs anyone in, and the dashboard is a lazily-loaded route — see
// composables/useAdminAuth.js, which keeps the auth SDK out of the bundle a
// normal visitor downloads.
export { app, db }

// Firestore layout used across the app.
export const CONTENT_COLLECTION = 'content'
export const SUBMISSIONS_COLLECTION = 'submissions'
export const ADMINS_COLLECTION = 'admins'
