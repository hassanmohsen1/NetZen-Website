<script setup>
import { ref } from 'vue'
import { useAdminAuth } from '@/composables/useAdminAuth'

const { login } = useAdminAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function onSubmit() {
  if (busy.value) return
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'Enter your email and password.'
    return
  }
  busy.value = true
  error.value = (await login(email.value, password.value)) || ''
  busy.value = false
}

const inputClass =
  'w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 px-3 ' +
  'text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="text-headline-sm font-bold text-primary mb-1">NetZen</div>
        <p class="text-body-md text-on-surface-variant">Content dashboard</p>
      </div>

      <form
        class="glass-card rounded-2xl p-6 space-y-4"
        novalidate
        @submit.prevent="onSubmit"
      >
        <div>
          <label for="admin-email" class="block text-label-md font-medium text-on-surface mb-1.5">
            Email
          </label>
          <input
            id="admin-email"
            v-model="email"
            type="email"
            autocomplete="username"
            :class="inputClass"
          />
        </div>

        <div>
          <label for="admin-password" class="block text-label-md font-medium text-on-surface mb-1.5">
            Password
          </label>
          <input
            id="admin-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            :class="inputClass"
          />
        </div>

        <p v-if="error" class="text-label-md font-normal text-error" role="alert">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="busy"
          class="w-full bg-primary text-on-primary py-3 rounded-lg text-label-md font-medium hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ busy ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="text-label-sm font-normal text-on-surface-variant text-center mt-6">
        Accounts are created in the Firebase console — there is no public sign-up.
      </p>
    </div>
  </div>
</template>
