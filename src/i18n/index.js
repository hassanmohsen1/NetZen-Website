import { createI18n } from 'vue-i18n'
import en from './en.js'
import ar from './ar.js'

export const SUPPORTED_LOCALES = ['en', 'ar']
export const LOCALE_STORAGE_KEY = 'netzen-locale'

function readSavedLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    return SUPPORTED_LOCALES.includes(saved) ? saved : 'en'
  } catch {
    // Private-mode / storage-disabled browsers.
    return 'en'
  }
}

// Content here is authored by an admin in the dashboard, not by a translator
// writing ICU templates. vue-i18n's default compiler treats `@`, `|`, `{` and
// `}` as message syntax — which breaks on a value as ordinary as an email
// address ("solutions@netzen.com" parses as a linked-message reference).
// This compiler returns every message verbatim instead. Nothing in this project
// uses interpolation or pluralization, so there is nothing to give up.
function literalCompiler(message) {
  const text = typeof message === 'string' ? message : String(message ?? '')
  const fn = () => text
  fn.source = text
  return fn
}

const i18n = createI18n({
  legacy: false,
  locale: readSavedLocale(),
  fallbackLocale: 'en',
  messages: { en, ar },
  messageCompiler: literalCompiler,
  // Admin-authored content is trusted-but-arbitrary; silence the dev-only
  // warnings vue-i18n emits for keys it cannot find during a partial load.
  missingWarn: false,
  fallbackWarn: false,
})

export default i18n
