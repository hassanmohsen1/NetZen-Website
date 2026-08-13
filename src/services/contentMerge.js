// Pure content-shaping helpers, kept free of Firebase imports so they can be
// reasoned about (and tested) on their own.

// Editorial metadata rides along in the same document but must never leak into
// the message tree the components read.
export const META_KEY = '_meta'

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Overlay `patch` onto `base`. Objects merge key-by-key so a document missing a
 * field falls back to the bundled default; arrays replace wholesale so that
 * deleting a service card in the dashboard actually removes it.
 */
export function mergeContent(base, patch) {
  if (patch === undefined || patch === null) return base
  if (Array.isArray(patch) || !isPlainObject(patch)) return patch
  const out = isPlainObject(base) ? { ...base } : {}
  for (const [key, value] of Object.entries(patch)) {
    out[key] = mergeContent(out[key], value)
  }
  return out
}

/**
 * Firestore rejects `undefined`. Empty inputs in the editor can come through as
 * undefined, so normalise them to '' rather than dropping the key entirely.
 */
export function sanitizeForFirestore(value) {
  if (Array.isArray(value)) return value.map(sanitizeForFirestore)
  if (isPlainObject(value)) {
    const out = {}
    for (const [key, val] of Object.entries(value)) {
      out[key] = val === undefined ? '' : sanitizeForFirestore(val)
    }
    return out
  }
  return value === undefined ? '' : value
}

export function stripMeta(data) {
  if (!isPlainObject(data)) return data
  const { [META_KEY]: _meta, ...rest } = data
  return rest
}
