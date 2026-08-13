<script setup>
import { useLocale } from '@/composables/useLocale'
const { t, tm, rt } = useLocale()
</script>

<template>
  <section id="about" class="py-24 md:py-32">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <div class="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        <!-- Text -->
        <div class="flex-1">
          <h2 v-reveal class="text-headline-md font-semibold mb-6">
            {{ t('whyNetzen.title') }}
          </h2>
          <div class="space-y-8">
            <div
              v-for="(item, i) in tm('whyNetzen.items')"
              :key="i"
              v-reveal class="why-item flex gap-4 group cursor-default"
              :style="{ transitionDelay: `${i * 100}ms` }"
            >
              <div
                class="why-icon w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-primary">{{
                  rt(item.icon)
                }}</span>
              </div>
              <div>
                <h4 class="text-headline-sm font-semibold mb-1">
                  {{ rt(item.title) }}
                </h4>
                <p class="text-body-md text-on-surface-variant">
                  {{ rt(item.desc) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div v-reveal class="flex-1 relative">
          <div class="rounded-2xl overflow-hidden shadow-2xl">
            <img :src="t('whyNetzen.image')" alt="" class="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
