import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { vReveal } from './directives/vReveal'
import './assets/main.css'

const app = createApp(App)
app.use(i18n)
app.directive('reveal', vReveal)
app.mount('#app')
