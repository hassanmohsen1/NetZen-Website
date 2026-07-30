<script setup>
import { useLocale } from '@/composables/useLocale'
const { t } = useLocale()

const partners = [
  'Cisco',
  'VMware',
  'Microsoft',
  'Linux',
  'AWS',
  'Google Cloud',
  'Dell',
  'Fortinet',
  'Veeam',
  'Juniper',
  'Palo Alto',
  'NetApp',
]
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
            v-for="partner in [...partners, ...partners]"
            :key="partner"
            class="tech-logo text-headline-sm font-bold px-8 md:px-12 py-4 cursor-default whitespace-nowrap"
          >
            {{ partner }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
