<script setup>
import { ref, reactive, computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { isFirebaseConfigured } from '@/firebase'
import { submitContactForm, validateSubmission } from '@/services/submissionsService'

const { t, tm, rt, locale } = useLocale()

const form = reactive({
  name: '',
  email: '',
  service: '',
  message: '',
  // Honeypot: hidden from people, irresistible to naive bots. A filled value
  // means we silently drop the submission.
  company: '',
})

const status = ref('idle') // idle | sending | success | error
const errorKey = ref('error')

const serviceOptions = computed(() => (tm('contact.serviceOptions') || []).map((o) => rt(o)))
const isSending = computed(() => status.value === 'sending')

function resetForm() {
  form.name = ''
  form.email = ''
  form.service = ''
  form.message = ''
}

async function onSubmit() {
  if (isSending.value) return

  if (form.company) {
    // Pretend it worked so the bot moves on.
    status.value = 'success'
    resetForm()
    return
  }

  const invalid = validateSubmission(form)
  if (invalid) {
    errorKey.value = invalid
    status.value = 'error'
    return
  }

  if (!isFirebaseConfigured) {
    errorKey.value = 'error'
    status.value = 'error'
    if (import.meta.env.DEV) {
      console.warn('[netzen] Contact form needs Firebase configured — see .env.example')
    }
    return
  }

  status.value = 'sending'
  try {
    await submitContactForm({ ...form, locale: locale.value })
    status.value = 'success'
    resetForm()
  } catch (err) {
    console.error('[netzen] Contact submission failed:', err)
    errorKey.value = 'error'
    status.value = 'error'
  }
}
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
                <a
                  :href="`mailto:${t('contact.email')}`"
                  class="text-body-md font-bold hover:text-primary transition-colors"
                >
                  {{ t('contact.email') }}
                </a>
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
                <span class="material-symbols-outlined text-primary">location_on</span>
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
            <img :src="t('contact.mapImage')" alt="" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Form Side -->
        <div v-reveal class="glass-card p-8 md:p-10 rounded-[32px]">
          <h3 class="text-headline-sm font-semibold mb-8">
            {{ t('contact.formTitle') }}
          </h3>
          <form class="space-y-6" novalidate @submit.prevent="onSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  for="contact-name"
                  class="block text-label-md font-medium text-on-surface-variant mb-2"
                >
                  {{ t('contact.fullName') }}
                </label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  autocomplete="name"
                  :placeholder="t('contact.fullNamePlaceholder')"
                  class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
                />
              </div>
              <div>
                <label
                  for="contact-email"
                  class="block text-label-md font-medium text-on-surface-variant mb-2"
                >
                  {{ t('contact.businessEmail') }}
                </label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  :placeholder="t('contact.businessEmailPlaceholder')"
                  class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                for="contact-service"
                class="block text-label-md font-medium text-on-surface-variant mb-2"
              >
                {{ t('contact.serviceRequired') }}
              </label>
              <select
                id="contact-service"
                v-model="form.service"
                class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
              >
                <option v-for="(opt, i) in serviceOptions" :key="i" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="contact-message"
                class="block text-label-md font-medium text-on-surface-variant mb-2"
              >
                {{ t('contact.message') }}
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                :placeholder="t('contact.messagePlaceholder')"
                rows="4"
                class="form-input w-full bg-surface-container-low rounded-xl py-3 px-4 outline-none"
              />
            </div>

            <!-- Honeypot: hidden from users and screen readers, visible to bots -->
            <div class="hidden" aria-hidden="true">
              <label for="contact-company">Company</label>
              <input
                id="contact-company"
                v-model="form.company"
                type="text"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <button
              type="submit"
              :disabled="isSending"
              class="w-full bg-primary text-on-primary py-4 rounded-xl text-label-md font-medium shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ isSending ? t('contact.sending') : t('contact.submit') }}
            </button>

            <p
              v-if="status === 'success'"
              class="text-body-md text-primary flex items-start gap-2"
              role="status"
            >
              <span class="material-symbols-outlined text-xl">check_circle</span>
              {{ t('contact.success') }}
            </p>
            <p
              v-else-if="status === 'error'"
              class="text-body-md text-error flex items-start gap-2"
              role="alert"
            >
              <span class="material-symbols-outlined text-xl">error</span>
              {{ t(`contact.${errorKey}`) }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
