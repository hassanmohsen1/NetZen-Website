<script setup>
import { useLocale } from '@/composables/useLocale'
const { t } = useLocale()
</script>

<template>
  <section class="py-24 md:py-32">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <div
        v-reveal class="cta-bg relative rounded-[32px] md:rounded-[40px] bg-primary overflow-hidden p-8 md:p-24 text-center"
      >
        <div class="relative z-10">
          <h2
            class="text-display-lg-mobile md:text-display-lg font-bold text-on-primary mb-6"
          >
            {{ t('cta.title') }}
          </h2>
          <p
            class="text-on-primary/80 text-body-lg mb-10 max-w-2xl mx-auto"
          >
            {{ t('cta.subtitle') }}
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button
              class="bg-on-primary text-primary px-8 py-4 rounded-xl text-label-md font-medium shadow-xl hover:bg-surface-container transition-all active:scale-95"
            >
              {{ t('cta.consultation') }}
            </button>
            <button
              class="border-2 border-on-primary text-on-primary px-8 py-4 rounded-xl text-label-md font-medium hover:bg-on-primary/10 transition-all active:scale-95"
            >
              {{ t('cta.packages') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
