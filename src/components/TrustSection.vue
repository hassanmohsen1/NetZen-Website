<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { t, tm, rt } = useLocale()

const stats = computed(() =>
  (tm('stats.items') || []).map((stat) => ({
    value: rt(stat.value),
    suffix: rt(stat.suffix),
    display: rt(stat.display),
    label: rt(stat.label),
  }))
)

const logos = computed(() => (tm('stats.logos') || []).map((logo) => rt(logo)))

const statsEl = ref(null)
const displayValues = ref([])
const inView = ref(false)
let timers = []
let observer = null

function clearTimers() {
  timers.forEach(clearInterval)
  timers = []
}

function resetDisplay() {
  displayValues.value = stats.value.map((stat) => stat.display || '0')
}

function animateCounters() {
  clearTimers()
  stats.value.forEach((stat, i) => {
    // A literal display value ("24/7") is shown as-is, never counted up.
    if (stat.display) {
      displayValues.value[i] = stat.display
      return
    }
    const target = Number.parseFloat(stat.value)
    if (!Number.isFinite(target)) {
      displayValues.value[i] = stat.value || ''
      return
    }
    const decimals = (String(stat.value).split('.')[1] || '').length
    const steps = 60
    let step = 0
    const timer = setInterval(() => {
      step += 1
      const current = Math.min(target, (target / steps) * step)
      displayValues.value[i] = decimals
        ? current.toFixed(decimals)
        : String(Math.floor(current))
      if (step >= steps) {
        displayValues.value[i] = decimals
          ? target.toFixed(decimals)
          : String(Math.floor(target))
        clearInterval(timer)
      }
    }, 33)
    timers.push(timer)
  })
}

// Content arrives from Firestore after mount, so the counters have to be able
// to re-seed themselves rather than animating once against the bundled values.
watch(
  stats,
  () => {
    resetDisplay()
    if (inView.value) animateCounters()
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  // Without IntersectionObserver the counters would sit at zero forever, which
  // is worse than skipping the animation — so show the real numbers instead.
  if (!statsEl.value || !('IntersectionObserver' in window)) {
    inView.value = true
    animateCounters()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      inView.value = true
      animateCounters()
      observer?.disconnect()
      observer = null
    },
    { threshold: 0.2 }
  )
  observer.observe(statsEl.value)
})

onUnmounted(() => {
  observer?.disconnect()
  clearTimers()
})
</script>

<template>
  <section class="py-20 bg-surface-container-low">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <!-- Stats -->
      <div ref="statsEl" v-reveal class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
        <div
          v-for="(stat, i) in stats"
          :key="i"
          class="stat-card text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm cursor-default"
        >
          <div class="text-display-lg-mobile md:text-display-lg font-bold stat-value mb-2">
            {{ displayValues[i] }}{{ stat.display ? '' : stat.suffix }}
          </div>
          <div class="text-label-md font-medium text-on-surface-variant">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!-- Partner Logos -->
      <div v-reveal class="flex flex-col items-center">
        <p
          class="text-label-sm font-semibold text-outline mb-8 uppercase tracking-widest"
        >
          {{ t('stats.trustedBy') }}
        </p>
        <div class="flex flex-wrap justify-center gap-8 md:gap-12">
          <div
            v-for="(logo, i) in logos"
            :key="i"
            class="tech-logo text-headline-sm font-bold cursor-default"
          >
            {{ logo }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
