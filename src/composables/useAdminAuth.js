import { ref, computed } from 'vue'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { app, db, isFirebaseConfigured, ADMINS_COLLECTION } from '@/firebase'

// Auth is initialised here rather than in firebase.js so that the Firebase Auth
// SDK is pulled into the lazily-loaded admin chunk instead of the main bundle.
const auth = isFirebaseConfigured ? getAuth(app) : null

// Module-level state: one auth listener for the whole app, shared by every
// component that calls useAdminAuth().
const user = ref(null)
const isAdmin = ref(false)
const authReady = ref(false)
const adminCheckFailed = ref(false)
let listening = false

const AUTH_ERRORS = {
  'auth/invalid-email': 'That email address is not valid.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/network-request-failed': 'Network error — check your connection.',
}

async function checkAdmin(uid) {
  try {
    const snap = await getDoc(doc(db, ADMINS_COLLECTION, uid))
    adminCheckFailed.value = false
    return snap.exists()
  } catch (err) {
    // A permission error here means the rules are not deployed yet, which is a
    // different problem from "you are not an admin" — surface it separately.
    console.error('[netzen] Admin check failed:', err)
    adminCheckFailed.value = true
    return false
  }
}

function startListening() {
  if (listening) return
  if (!isFirebaseConfigured) {
    authReady.value = true
    return
  }
  listening = true
  onAuthStateChanged(auth, async (nextUser) => {
    user.value = nextUser
    isAdmin.value = nextUser ? await checkAdmin(nextUser.uid) : false
    authReady.value = true
  })
}

export function useAdminAuth() {
  startListening()

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      return null
    } catch (err) {
      return AUTH_ERRORS[err.code] || 'Could not sign in. Please try again.'
    }
  }

  async function logout() {
    await signOut(auth)
  }

  return {
    user,
    isAdmin,
    authReady,
    adminCheckFailed,
    email: computed(() => user.value?.email || ''),
    login,
    logout,
  }
}
