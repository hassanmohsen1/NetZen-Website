<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@/composables/useLocale'
const { t } = useLocale()

const statsData = [
  { value: 1000, suffix: '+', key: 'problemsSolved' },
  { value: 50, suffix: '+', key: 'enterpriseClients' },
  { value: 99.9, suffix: '%', key: 'availability' },
  { value: 0, display: '24/7', key: 'expertSupport' },
]

const logos = ['TechCore', 'GlobalOps', 'InfraStream', 'DataSphere', 'CloudNet']

const displayValues = ref(statsData.map(s => s.display || '0'))
const counted = ref(false)
const statsEl = ref(null)
let observer = null

function animateCounters() {
  if (counted.value) return
  counted.value = true
  statsData.forEach((stat, i) => {
    if (stat.display) return
    const target = stat.value
    const isDecimal = target % 1 !== 0
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0
    const interval = setInterval(() => {
      step++
      current += increment
      if (step >= steps || current >= target) {
        current = target
        clearInterval(interval)
      }
      displayValues.value[i] = isDecimal ? current.toFixed(1) : String(Math.floor(current))
    }, 33)
  })
}

onMounted(() => {
  if (!statsEl.value) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters()
        observer?.disconnect()
      }
    },
    { threshold: 0.2 }
  )
  observer.observe(statsEl.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section class="py-20 bg-surface-container-low">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <!-- Stats -->
      <div ref="statsEl" v-reveal class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
        <div
          v-for="(stat, i) in statsData"
          :key="stat.key"
          class="stat-card text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm cursor-default"
        >
          <div class="text-display-lg-mobile md:text-display-lg font-bold stat-value mb-2">
            {{ stat.display ? displayValues[i] : displayValues[i] + stat.suffix }}
          </div>
          <div class="text-label-md font-medium text-on-surface-variant">
            {{ t(`stats.${stat.key}`) }}
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
        <div
          class="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          <div
            v-for="logo in logos"
            :key="logo"
            class="tech-logo text-headline-sm font-bold cursor-default"
          >
            {{ logo }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
