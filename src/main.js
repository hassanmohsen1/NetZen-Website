import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { vReveal } from './directives/vReveal'
import { hydrateContent } from './services/contentService'
import './assets/main.css'

const app = createApp(App)
app.use(i18n)
app.use(router)
app.directive('reveal', vReveal)
app.mount('#app')

// Mount first, hydrate second: the page is interactive on bundled content
// immediately, and published edits swap in as soon as Firestore answers. A
// failure here is deliberately non-fatal.
hydrateContent(i18n)
