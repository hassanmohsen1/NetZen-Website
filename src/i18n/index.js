import { createI18n } from 'vue-i18n'
import en from './en.js'
import ar from './ar.js'

const savedLocale = typeof localStorage !== 'undefined'
  ? localStorage.getItem('netzen-locale') || 'en'
  : 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, ar },
})

export default i18n
