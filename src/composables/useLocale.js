import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { locale, t, tm, rt } = useI18n()

  const isRtl = computed(() => locale.value === 'ar')
  const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))

  function toggleLocale() {
    const next = locale.value === 'en' ? 'ar' : 'en'
    locale.value = next
    localStorage.setItem('netzen-locale', next)
  }

  watch(
    locale,
    (val) => {
      const html = document.documentElement
      html.setAttribute('lang', val)
      html.setAttribute('dir', val === 'ar' ? 'rtl' : 'ltr')
      document.body.style.fontFamily =
        val === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif"
    },
    { immediate: true }
  )

  return { locale, isRtl, dir, t, tm, rt, toggleLocale }
}
