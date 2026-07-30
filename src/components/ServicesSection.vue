<script setup>
import { useLocale } from '@/composables/useLocale'
const { t, tm, rt } = useLocale()
</script>

<template>
  <section id="services" class="py-24 md:py-32">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <!-- Header -->
      <div v-reveal class="text-center mb-16 md:mb-20">
        <h2 class="text-headline-md font-semibold mb-4">
          {{ t('services.title') }}
        </h2>
        <p class="text-body-md text-on-surface-variant max-w-2xl mx-auto">
          {{ t('services.subtitle') }}
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div
          v-for="(item, i) in tm('services.items')"
          :key="i"
          v-reveal
          class="service-card glass-card p-8 rounded-2xl group cursor-default"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div
            class="service-icon w-14 h-14 rounded-xl flex items-center justify-center mb-6"
            :class="`bg-${rt(item.color)} text-${rt(item.textColor)}`"
          >
            <span class="material-symbols-outlined text-3xl">{{ rt(item.icon) }}</span>
          </div>
          <h3 class="text-headline-sm font-semibold mb-4">{{ rt(item.title) }}</h3>
          <p class="text-body-md text-on-surface-variant mb-6">{{ rt(item.desc) }}</p>
          <button
            class="text-primary text-label-md font-medium flex items-center gap-2 group/link"
          >
            {{ t('services.learnMore') }}
            <span
              class="material-symbols-outlined text-sm group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 transition-transform flip-rtl"
            >
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
