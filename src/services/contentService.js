import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured, CONTENT_COLLECTION } from '@/firebase'
import en from '@/i18n/en.js'
import ar from '@/i18n/ar.js'
import { SUPPORTED_LOCALES } from '@/i18n'
import { mergeContent, sanitizeForFirestore, stripMeta, META_KEY } from './contentMerge'

// Bundled content doubles as the fallback when Firestore is unreachable and as
// the seed the dashboard publishes on its first save.
export const defaults = { en, ar }

export { mergeContent, sanitizeForFirestore }

function contentRef(locale) {
  return doc(db, CONTENT_COLLECTION, locale)
}

/** Read one locale, merged over its bundled defaults. */
export async function fetchContent(locale) {
  if (!isFirebaseConfigured) return mergeContent(defaults[locale], {})
  const snap = await getDoc(contentRef(locale))
  if (!snap.exists()) return mergeContent(defaults[locale], {})
  return mergeContent(defaults[locale], stripMeta(snap.data()))
}

/** Write one locale. Resolves once the server has acknowledged the write. */
export async function saveContent(locale, tree, editorEmail) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.')
  }
  const payload = sanitizeForFirestore(tree)
  payload[META_KEY] = {
    updatedAt: serverTimestamp(),
    updatedBy: editorEmail || 'unknown',
  }
  await setDoc(contentRef(locale), payload)
}

/**
 * Public-site hydration. The app has already mounted against bundled content by
 * the time this runs, so a failure is deliberately non-fatal: visitors simply
 * keep the shipped copy.
 */
export async function hydrateContent(i18n) {
  if (!isFirebaseConfigured) return { hydrated: false, reason: 'not-configured' }

  const results = await Promise.allSettled(
    SUPPORTED_LOCALES.map((locale) => getDoc(contentRef(locale)))
  )

  let hydrated = false
  results.forEach((result, i) => {
    const locale = SUPPORTED_LOCALES[i]
    if (result.status !== 'fulfilled' || !result.value.exists()) return
    i18n.global.setLocaleMessage(
      locale,
      mergeContent(defaults[locale], stripMeta(result.value.data()))
    )
    hydrated = true
  })

  const failure = results.find((r) => r.status === 'rejected')
  if (failure && import.meta.env.DEV) {
    console.warn('[netzen] Content hydration failed, using bundled copy:', failure.reason)
  }

  return { hydrated, reason: hydrated ? 'ok' : 'no-documents' }
}
