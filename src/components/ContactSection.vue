<script setup>
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
const { t, tm, rt, isRtl } = useLocale()

const emailPlaceholder = computed(() => (isRtl.value ? 'mohammed@company.com' : 'john@company.com'))

const mapImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCMFQ53qW1ySJeYvfTfTYvVeslUAS1vtKPO9pGVLr2JJEqBnOJB2xLQx5RPp3YnjAxpe4glBC4j2PXUssV_gKIiPDKdoVadGWAkFlmdNbTnBKRMg3YG4iwPue-kLXSLGw9VEQbXly_G83YhWw7332htMETICrLTGR_QIBgGjFxA6Nv_InLBIEq63GJ2FjIaCfKdY9XsU8gTlyqP-5PXe4EEfKfAlRjJ0EJOTg08V6ZR6LfviPsZUPE3ql-jT5e10s6ACzFp6mna2do'
</script>

<template>
  <section id="contact" class="py-24 md:py-32 bg-surface">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <!-- Info Side -->
        <div v-reveal>
          <h2 class="text-headline-md font-semibold mb-8">
            {{ t('contact.title') }}
          </h2>
          <p class="text-body-md text-on-surface-variant mb-12">
            {{ t('contact.subtitle') }}
          </p>

          <div class="space-y-8">
            <!-- Email -->
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-primary">mail</span>
              </div>
              <div>
                <p class="text-label-sm font-semibold text-outline mb-1">
                  {{ t('contact.emailLabel') }}
                </p>
                <p class="text-body-md font-bold">solutions@netzen.com</p>
              </div>
            </div>
            <!-- Phone -->
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-primary">call</span>
              </div>
              <div>
                <p class="text-label-sm font-semibold text-outline mb-1">
                  {{ t('contact.phoneLabel') }}
                </p>
                <p class="text-body-md font-bold">{{ t('contact.phone') }}</p>
              </div>
            </div>
            <!-- Location -->
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-primary"
                  >location_on</span
                >
              </div>
              <div>
                <p class="text-label-sm font-semibold text-outline mb-1">
                  {{ t('contact.locationLabel') }}
                </p>
                <p class="text-body-md font-bold">{{ t('contact.location') }}</p>
              </div>
            </div>
          </div>

          <!-- Map -->
          <div
            class="mt-12 rounded-2xl overflow-hidden h-64 grayscale contrast-125 shadow-inner border border-outline-variant"
          >
            <img :src="mapImage" alt="" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Form Side -->
        <div v-reveal class="glass-card p-8 md:p-10 rounded-[32px]">
          <h3 class="text-headline-sm font-semibold mb-8">
            {{ t('contact.formTitle') }}
          </h3>
          <form class="space-y-6" @submit.prevent>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-label-md font-medium text-on-surface-variant mb-2"
                >
                  {{ t('contact.fullName') }}
                </label>
                <input
                  type="text"
                  :placeholder="t('contact.fullNamePlaceholder')"
                  class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
                />
              </div>
              <div>
                <label
                  class="block text-label-md font-medium text-on-surface-variant mb-2"
                >
                  {{ t('contact.businessEmail') }}
                </label>
                <input
                  type="email"
                  :placeholder="emailPlaceholder"
                  class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-label-md font-medium text-on-surface-variant mb-2"
              >
                {{ t('contact.serviceRequired') }}
              </label>
              <select
                class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
              >
                <option
                  v-for="(opt, i) in tm('contact.serviceOptions')"
                  :key="i"
                >
                  {{ rt(opt) }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-label-md font-medium text-on-surface-variant mb-2"
              >
                {{ t('contact.message') }}
              </label>
              <textarea
                :placeholder="t('contact.messagePlaceholder')"
                rows="4"
                class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-primary text-on-primary py-4 rounded-xl text-label-md font-medium shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98]"
            >
              {{ t('contact.submit') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
