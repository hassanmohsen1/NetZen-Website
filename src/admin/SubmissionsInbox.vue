<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  subscribeSubmissions,
  markSubmissionRead,
  deleteSubmission,
} from '@/services/submissionsService'

const submissions = ref([])
const loading = ref(true)
const error = ref('')
const showUnreadOnly = ref(false)
const openId = ref(null)
let unsubscribe = null

const unreadCount = computed(() => submissions.value.filter((s) => !s.read).length)

const visible = computed(() =>
  showUnreadOnly.value ? submissions.value.filter((s) => !s.read) : submissions.value
)

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatDate(date) {
  return date ? dateFormatter.format(date) : 'Just now'
}

async function toggleOpen(item) {
  openId.value = openId.value === item.id ? null : item.id
  // Opening an unread message marks it read, the way an inbox should behave.
  if (openId.value === item.id && !item.read) {
    try {
      await markSubmissionRead(item.id, true)
    } catch (err) {
      console.error('[netzen] Could not mark as read:', err)
    }
  }
}

async function toggleRead(item) {
  try {
    await markSubmissionRead(item.id, !item.read)
  } catch (err) {
    console.error('[netzen] Could not update read state:', err)
    error.value = 'Could not update that message.'
  }
}

async function remove(item) {
  if (!window.confirm(`Permanently delete the message from ${item.name}?`)) return
  try {
    await deleteSubmission(item.id)
  } catch (err) {
    console.error('[netzen] Could not delete submission:', err)
    error.value = 'Could not delete that message.'
  }
}

function mailtoLink(item) {
  const subject = encodeURIComponent(`Re: ${item.service || 'Your enquiry'} — NetZen`)
  return `mailto:${item.email}?subject=${subject}`
}

onMounted(() => {
  unsubscribe = subscribeSubmissions(
    (rows) => {
      submissions.value = rows
      loading.value = false
      error.value = ''
    },
    (err) => {
      console.error('[netzen] Submissions stream failed:', err)
      loading.value = false
      error.value =
        err?.code === 'permission-denied'
          ? 'Firestore denied access. Your account needs a document in the "admins" collection, and firestore.rules must be deployed.'
          : 'Could not load submissions.'
    }
  )
})

onUnmounted(() => unsubscribe?.())
</script>

<template>
  <div>
    <div
      class="sticky top-0 z-10 -mx-6 px-6 py-3 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex flex-wrap items-center gap-3"
    >
      <div class="flex-1 min-w-0">
        <h2 class="text-headline-sm font-semibold text-on-surface">Submissions</h2>
        <p class="text-label-sm font-normal text-on-surface-variant">
          {{ submissions.length }} total
          <span v-if="unreadCount"> · {{ unreadCount }} unread</span>
        </p>
      </div>
      <label class="flex items-center gap-2 text-label-md font-medium text-on-surface-variant cursor-pointer">
        <input v-model="showUnreadOnly" type="checkbox" class="accent-primary w-4 h-4" />
        Unread only
      </label>
    </div>

    <div class="py-6">
      <p
        v-if="error"
        class="mb-6 text-body-md text-error bg-error-container border border-error/20 rounded-xl px-4 py-3"
        role="alert"
      >
        {{ error }}
      </p>

      <p v-if="loading" class="text-body-md text-on-surface-variant py-12 text-center">
        Loading submissions…
      </p>

      <p
        v-else-if="!visible.length"
        class="text-body-md text-on-surface-variant bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-10 text-center"
      >
        {{ showUnreadOnly ? 'No unread messages.' : 'No messages yet. Submissions from the contact form land here.' }}
      </p>

      <ul v-else class="space-y-2">
        <li
          v-for="item in visible"
          :key="item.id"
          class="border rounded-xl bg-surface-container-lowest overflow-hidden transition-colors"
          :class="item.read ? 'border-outline-variant' : 'border-primary/40'"
        >
          <button
            type="button"
            class="w-full flex items-center gap-3 px-4 py-3 text-start hover:bg-surface-container transition-colors"
            @click="toggleOpen(item)"
          >
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :class="item.read ? 'bg-transparent' : 'bg-primary'"
              :title="item.read ? 'Read' : 'Unread'"
            />
            <span class="min-w-0 flex-1">
              <span
                class="block text-label-md text-on-surface truncate"
                :class="item.read ? 'font-medium' : 'font-semibold'"
              >
                {{ item.name }}
              </span>
              <span class="block text-label-sm font-normal text-on-surface-variant truncate">
                {{ item.email }}<span v-if="item.service"> · {{ item.service }}</span>
              </span>
            </span>
            <span class="text-label-sm font-normal text-outline shrink-0 hidden sm:block">
              {{ formatDate(item.createdAt) }}
            </span>
          </button>

          <div
            v-if="openId === item.id"
            class="px-4 pb-4 pt-3 border-t border-outline-variant bg-surface-container-low"
          >
            <p
              class="text-body-md text-on-surface whitespace-pre-wrap mb-4"
              :dir="item.locale === 'ar' ? 'rtl' : 'ltr'"
            >
              {{ item.message }}
            </p>
            <p class="text-label-sm font-normal text-outline mb-4 sm:hidden">
              {{ formatDate(item.createdAt) }}
            </p>
            <div class="flex flex-wrap gap-2">
              <a
                :href="mailtoLink(item)"
                class="flex items-center gap-1.5 text-label-md font-medium text-on-primary bg-primary px-4 py-2 rounded-lg hover:bg-primary-container transition-colors"
              >
                <span class="material-symbols-outlined text-lg">reply</span>
                Reply
              </a>
              <button
                type="button"
                class="flex items-center gap-1.5 text-label-md font-medium text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-lg transition-colors"
                @click="toggleRead(item)"
              >
                <span class="material-symbols-outlined text-lg">
                  {{ item.read ? 'mark_email_unread' : 'mark_email_read' }}
                </span>
                Mark {{ item.read ? 'unread' : 'read' }}
              </button>
              <button
                type="button"
                class="flex items-center gap-1.5 text-label-md font-medium text-error hover:bg-error-container px-4 py-2 rounded-lg transition-colors"
                @click="remove(item)"
              >
                <span class="material-symbols-outlined text-lg">delete</span>
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
