<script setup>
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { t, tm, rt } = useLocale()

const partners = computed(() => (tm('techEcosystem.partners') || []).map((p) => rt(p)))

// The marquee scrolls a doubled list so the loop is seamless.
const marquee = computed(() => [...partners.value, ...partners.value])
</script>

<template>
  <section class="py-24 bg-surface-container-low overflow-hidden">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto text-center">
      <h3 v-reveal class="text-headline-sm font-semibold mb-12">
        {{ t('techEcosystem.title') }}
      </h3>
      <div class="relative overflow-hidden">
        <div class="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface-container-low to-transparent z-10"></div>
        <div class="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface-container-low to-transparent z-10"></div>
        <div class="marquee-track">
          <div
            v-for="(partner, i) in marquee"
            :key="i"
            class="tech-logo text-headline-sm font-bold px-8 md:px-12 py-4 cursor-default whitespace-nowrap"
          >
            {{ partner }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
