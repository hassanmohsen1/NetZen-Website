import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured, SUBMISSIONS_COLLECTION } from '@/firebase'

// These caps are mirrored in firestore.rules. Client-side checks give a good
// error message; the rules are what actually enforce them.
export const LIMITS = {
  name: 100,
  email: 200,
  service: 100,
  message: 5000,
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSubmission({ name, email, message }) {
  if (!name?.trim() || !email?.trim() || !message?.trim()) return 'errorRequired'
  if (!EMAIL_PATTERN.test(email.trim())) return 'errorEmail'
  return null
}

/** Public write. Rules allow create-only for unauthenticated visitors. */
export async function submitContactForm({ name, email, service, message, locale }) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.')
  }
  await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
    name: name.trim().slice(0, LIMITS.name),
    email: email.trim().slice(0, LIMITS.email),
    service: (service || '').trim().slice(0, LIMITS.service),
    message: message.trim().slice(0, LIMITS.message),
    locale: locale || 'en',
    read: false,
    createdAt: serverTimestamp(),
  })
}

/** Admin-only read stream, newest first. */
export function subscribeSubmissions(onChange, onError) {
  if (!isFirebaseConfigured) return () => {}
  const q = query(
    collection(db, SUBMISSIONS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(200)
  )
  return onSnapshot(
    q,
    (snap) => {
      onChange(
        snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            ...data,
            // serverTimestamp() is null for the brief window before the write
            // round-trips, so guard the conversion.
            createdAt: data.createdAt?.toDate?.() || null,
          }
        })
      )
    },
    onError
  )
}

export function markSubmissionRead(id, read) {
  return updateDoc(doc(db, SUBMISSIONS_COLLECTION, id), { read })
}

export function deleteSubmission(id) {
  return deleteDoc(doc(db, SUBMISSIONS_COLLECTION, id))
}
