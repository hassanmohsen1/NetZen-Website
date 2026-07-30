<script setup>
import { useLocale } from '@/composables/useLocale'
const { t, tm, rt } = useLocale()
</script>

<template>
  <footer
    class="w-full py-12 bg-surface-container-lowest border-t border-outline-variant"
  >
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-gutter px-4 md:px-margin-desktop max-w-container-max mx-auto"
    >
      <!-- Brand -->
      <div class="space-y-6">
        <div class="text-headline-sm font-bold text-on-surface">NetZen</div>
        <p class="text-body-md text-on-surface-variant">
          {{ t('footer.tagline') }}
        </p>
        <div class="flex gap-4">
          <div
            v-for="icon in ['public', 'groups', 'rss_feed']"
            :key="icon"
            class="social-icon w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">{{ icon }}</span>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div>
        <h4
          class="text-label-md font-medium text-on-surface mb-6 uppercase tracking-wider"
        >
          {{ t('footer.servicesTitle') }}
        </h4>
        <ul class="space-y-4">
          <li v-for="(link, i) in tm('footer.servicesLinks')" :key="i">
            <a
              href="#"
              class="text-on-surface-variant hover:text-primary transition-colors text-body-md"
            >
              {{ rt(link) }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Company -->
      <div>
        <h4
          class="text-label-md font-medium text-on-surface mb-6 uppercase tracking-wider"
        >
          {{ t('footer.companyTitle') }}
        </h4>
        <ul class="space-y-4">
          <li v-for="(link, i) in tm('footer.companyLinks')" :key="i">
            <a
              href="#"
              class="text-on-surface-variant hover:text-primary transition-colors text-body-md"
            >
              {{ rt(link) }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <h4
          class="text-label-md font-medium text-on-surface mb-6 uppercase tracking-wider"
        >
          {{ t('footer.newsletterTitle') }}
        </h4>
        <p class="text-body-md text-on-surface-variant mb-6">
          {{ t('footer.newsletterDesc') }}
        </p>
        <div class="flex gap-2">
          <input
            type="email"
            :placeholder="t('footer.emailPlaceholder')"
            class="bg-surface-container-high border-none rounded-lg py-2 px-3 text-body-md focus:ring-1 focus:ring-primary w-full"
          />
          <button
            class="bg-primary text-on-primary p-2 rounded-lg hover:bg-primary-container transition-colors"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div
      class="max-w-container-max mx-auto px-4 md:px-margin-desktop mt-12 md:mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-6"
    >
      <p class="text-label-sm font-semibold text-on-surface-variant text-center">
        {{ t('footer.copyright') }}
      </p>
      <div class="flex flex-wrap justify-center gap-4 md:gap-8">
        <a
          v-for="link in [
            'privacyPolicy',
            'terms',
            'cookiePolicy',
            'sitemap',
          ]"
          :key="link"
          href="#"
          class="text-label-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          {{ t(`footer.${link}`) }}
        </a>
      </div>
    </div>
  </footer>
</template>
