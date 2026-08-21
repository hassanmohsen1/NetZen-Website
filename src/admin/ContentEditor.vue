<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import FieldEditor from './FieldEditor.vue'
import ListEditor from './ListEditor.vue'
import { SECTIONS } from './schema'
import { deepClone, deepEqual } from './paths'
import { fetchContent, saveContent } from '@/services/contentService'
import { useAdminAuth } from '@/composables/useAdminAuth'

const props = defineProps({
  sectionId: { type: String, required: true },
})

const { email } = useAdminAuth()
//test
const draft = reactive({ en: {}, ar: {} })
const original = ref(null)
const loading = ref(true)
const loadError = ref('')
const saving = ref(false)
const saveError = ref('')
const savedAt = ref(null)

const section = computed(() => SECTIONS.find((s) => s.id === props.sectionId))
const isDirty = computed(
  () => Boolean(original.value) && !deepEqual({ en: draft.en, ar: draft.ar }, original.value)
)

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const [en, ar] = await Promise.all([fetchContent('en'), fetchContent('ar')])
    draft.en = en
    draft.ar = ar
    original.value = deepClone({ en, ar })
  } catch (err) {
    console.error('[netzen] Failed to load content:', err)
    loadError.value =
      err?.code === 'permission-denied'
        ? 'Firestore denied the read. Check that firestore.rules is deployed.'
        : 'Could not load content. Check your connection and try again.'
  } finally {
    loading.value = false
  }
}

async function save() {
  if (saving.value || !isDirty.value) return
  saving.value = true
  saveError.value = ''
  try {
    // Both languages are written together so the two documents can never end up
    // with mismatched list lengths.
    await Promise.all([
      saveContent('en', draft.en, email.value),
      saveContent('ar', draft.ar, email.value),
    ])
    original.value = deepClone({ en: draft.en, ar: draft.ar })
    savedAt.value = new Date()
  } catch (err) {
    console.error('[netzen] Failed to save content:', err)
    saveError.value =
      err?.code === 'permission-denied'
        ? 'Firestore denied the write. Your account needs a document in the "admins" collection.'
        : 'Could not save. Check your connection and try again.'
  } finally {
    saving.value = false
  }
}

function resetChanges() {
  if (!original.value) return
  if (!window.confirm('Discard all unsaved changes?')) return
  draft.en = deepClone(original.value.en)
  draft.ar = deepClone(original.value.ar)
}

function onBeforeUnload(event) {
  if (!isDirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

watch(isDirty, (dirty) => {
  if (dirty) savedAt.value = null
})

onMounted(() => {
  load()
  window.addEventListener('beforeunload', onBeforeUnload)
})

onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload))
</script>

<template>
  <div>
    <!-- Sticky action bar -->
    <div
      class="sticky top-0 z-10 -mx-6 px-6 py-3 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex flex-wrap items-center gap-3"
    >
      <div class="flex-1 min-w-0">
        <h2 class="text-headline-sm font-semibold text-on-surface truncate">
          {{ section?.label }}
        </h2>
        <p class="text-label-sm font-normal text-on-surface-variant">
          <span v-if="isDirty" class="text-tertiary font-semibold">Unsaved changes</span>
          <span v-else-if="savedAt">
            Published — live on the site after a refresh
          </span>
          <span v-else>All changes published</span>
        </p>
      </div>

      <button
        v-if="isDirty"
        type="button"
        class="text-label-md font-medium text-on-surface-variant hover:bg-surface-container px-4 py-2 rounded-lg transition-colors"
        @click="resetChanges"
      >
        Discard
      </button>
      <button
        type="button"
        :disabled="!isDirty || saving"
        class="bg-primary text-on-primary text-label-md font-medium px-6 py-2.5 rounded-lg transition-all hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        @click="save"
      >
        <span v-if="saving" class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
        {{ saving ? 'Publishing…' : 'Publish changes' }}
      </button>
    </div>

    <div class="py-6">
      <p
        v-if="saveError"
        class="mb-6 text-body-md text-error bg-error-container border border-error/20 rounded-xl px-4 py-3"
        role="alert"
      >
        {{ saveError }}
      </p>

      <p v-if="loading" class="text-body-md text-on-surface-variant py-12 text-center">
        Loading content…
      </p>

      <div v-else-if="loadError" class="py-12 text-center">
        <p class="text-body-md text-error mb-4">{{ loadError }}</p>
        <button
          type="button"
          class="text-label-md font-medium text-primary hover:bg-primary/5 px-4 py-2 rounded-lg"
          @click="load"
        >
          Try again
        </button>
      </div>

      <template v-else-if="section">
        <FieldEditor
          v-for="field in section.fields"
          :key="field.path"
          :draft="draft"
          :field="field"
          :path="field.path"
        />

        <ListEditor
          v-for="list in section.lists || []"
          :key="list.path"
          :draft="draft"
          :list="list"
        />
      </template>
    </div>
  </div>
</template>
