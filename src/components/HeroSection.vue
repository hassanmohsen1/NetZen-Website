<script setup>
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { t, tm, rt, isRtl } = useLocale()

// Each floating badge picks a slot from the dashboard. Anchoring by named slot
// (rather than by array index) keeps the layout stable when an admin reorders
// or removes a badge.
const POSITIONS = {
  'top-start': { ltr: '-top-6 -left-6', rtl: '-top-6 -right-6' },
  'middle-end': { ltr: 'top-1/4 -right-10', rtl: 'top-1/4 -left-10' },
  'bottom-start': { ltr: 'bottom-10 -left-8', rtl: 'bottom-10 -right-8' },
}

const badges = computed(() =>
  (tm('hero.badges') || []).map((badge, i) => {
    const position = rt(badge.position) || 'top-start'
    const slot = POSITIONS[position] || POSITIONS['top-start']
    return {
      key: `${position}-${i}`,
      icon: rt(badge.icon),
      text: rt(badge.text),
      color: rt(badge.color),
      textColor: rt(badge.textColor),
      placement: isRtl.value ? slot.rtl : slot.ltr,
      pulse: position === 'middle-end',
      delay: `${i * 0.7}s`,
    }
  })
)
</script>

<template>
  <section
    id="home"
    class="relative min-h-screen flex items-center pt-20 overflow-hidden"
  >
    <div
      class="relative z-10 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
    >
      <div v-reveal>
        <h1
          class="text-display-lg-mobile md:text-display-lg font-bold text-on-surface mb-6 leading-tight"
        >
          {{ t('hero.titleLine1') }}<br />
          <span class="gradient-text">{{ t('hero.titleLine2') }}</span>
        </h1>
        <p class="text-body-lg text-on-surface-variant mb-10 max-w-lg">
          {{ t('hero.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="#contact" class="btn-primary">{{ t('hero.cta') }}</a>
          <a href="#services" class="btn-outline">{{ t('hero.ctaSecondary') }}</a>
        </div>
      </div>

      <div class="relative hidden md:block">
        <div class="relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl gradient-border">
          <img
            :src="t('hero.image')"
            alt="Infrastructure Visualization"
            class="w-full h-auto object-cover"
          />
        </div>

        <div
          v-for="badge in badges"
          :key="badge.key"
          class="absolute glass-card p-4 rounded-2xl flex items-center gap-3 floating z-20"
          :class="[badge.placement, badge.pulse ? 'pulse-dot' : '']"
          :style="{ animationDelay: badge.delay }"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="`bg-${badge.color} text-${badge.textColor}`"
          >
            <span class="material-symbols-outlined text-sm">{{ badge.icon }}</span>
          </div>
          <span class="text-label-md font-medium">{{ badge.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
