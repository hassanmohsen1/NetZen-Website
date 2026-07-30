<script setup>
import { useLocale } from '@/composables/useLocale'
const { t, isRtl } = useLocale()
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
          <button class="btn-primary">{{ t('hero.cta') }}</button>
          <button class="btn-outline">{{ t('hero.ctaSecondary') }}</button>
        </div>
      </div>

      <div class="relative hidden md:block">
        <div class="relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl gradient-border">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR07f_CVd1i3nxTcyemndO-YpBV0A-6PUwXGj0YcrUIVKM20MO2C79pj7OoptjHjT_GvT_f01zxDChnhNfRzzsYsE4elDBoBt110uUf6QmCJZlaGgOBpPTPaMiakZVjIvUyLUijSfl98RgfTRch_NFAn9w07eJhEDHr1h9sdr-fa2IPd8Gd28FMB-sYNmFXQy27GkPQUJUyuDzg4fUy4cM2Nynu7C8FcFOWv5QAAscq9NgVD39tvlT2OJF_3puMP9b7IFeZGbInso"
            alt="Infrastructure Visualization"
            class="w-full h-auto object-cover"
          />
        </div>

        <div
          class="absolute -top-6 glass-card p-4 rounded-2xl flex items-center gap-3 floating z-20"
          :class="isRtl ? '-right-6' : '-left-6'"
        >
          <div
            class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container"
          >
            <span class="material-symbols-outlined text-sm">support_agent</span>
          </div>
          <span class="text-label-md font-medium">{{ t('hero.badge1') }}</span>
        </div>

        <div
          class="absolute top-1/4 glass-card p-4 rounded-2xl flex items-center gap-3 floating z-20 pulse-dot"
          :class="isRtl ? '-left-10' : '-right-10'"
          style="animation-delay: 1.5s"
        >
          <div
            class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container"
          >
            <span class="material-symbols-outlined text-sm">shield</span>
          </div>
          <span class="text-label-md font-medium">{{ t('hero.badge2') }}</span>
        </div>

        <div
          class="absolute bottom-10 glass-card p-4 rounded-2xl flex items-center gap-3 floating z-20"
          :class="isRtl ? '-right-8' : '-left-8'"
          style="animation-delay: 0.8s"
        >
          <div
            class="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container"
          >
            <span class="material-symbols-outlined text-sm">cloud_done</span>
          </div>
          <span class="text-label-md font-medium">{{ t('hero.badge3') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
