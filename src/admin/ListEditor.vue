<script setup>
import { ref, computed } from 'vue'
import FieldEditor from './FieldEditor.vue'
import { getPath, setPath, deepClone } from './paths'

const props = defineProps({
  draft: { type: Object, required: true },
  list: { type: Object, required: true },
})

// One item expanded at a time — these lists get long (eight service cards,
// twelve partners) and an accordion keeps the page navigable.
const openIndex = ref(-1)

const isStringList = computed(() => props.list.itemType === 'string')

const items = computed(() => getPath(props.draft.en, props.list.path) || [])

/**
 * The English and Arabic arrays are kept index-aligned: every structural change
 * is applied to both, so item 3 always means the same card in both languages.
 */
function localeArrays() {
  return ['en', 'ar'].map((locale) => {
    let arr = getPath(props.draft[locale], props.list.path)
    if (!Array.isArray(arr)) {
      setPath(props.draft[locale], props.list.path, [])
      arr = getPath(props.draft[locale], props.list.path)
    }
    return arr
  })
}

function addItem() {
  localeArrays().forEach((arr) => arr.push(deepClone(props.list.newItem)))
  openIndex.value = items.value.length - 1
}

function removeItem(index) {
  const label = itemTitle(index) || `item ${index + 1}`
  if (!window.confirm(`Remove "${label}"? This applies to both languages.`)) return
  localeArrays().forEach((arr) => arr.splice(index, 1))
  openIndex.value = -1
}

function moveItem(index, delta) {
  const target = index + delta
  if (target < 0 || target >= items.value.length) return
  localeArrays().forEach((arr) => {
    const [moved] = arr.splice(index, 1)
    arr.splice(target, 0, moved)
  })
  if (openIndex.value === index) openIndex.value = target
}

function itemTitle(index) {
  if (isStringList.value) return getPath(props.draft.en, `${props.list.path}.${index}`)
  return getPath(props.draft.en, `${props.list.path}.${index}.${props.list.itemTitle}`)
}

function toggle(index) {
  openIndex.value = openIndex.value === index ? -1 : index
}

// String lists reuse FieldEditor by handing it a one-off descriptor.
const stringField = computed(() => ({
  label: '',
  type: 'text',
  shared: Boolean(props.list.shared),
}))
</script>

<template>
  <section class="mb-10">
    <div class="flex items-center justify-between gap-4 mb-1">
      <h3 class="text-headline-sm font-semibold text-on-surface">
        {{ list.label }}
        <span class="text-label-md font-normal text-outline">({{ items.length }})</span>
      </h3>
      <button
        type="button"
        class="flex items-center gap-1 text-label-md font-medium text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
        @click="addItem"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        Add
      </button>
    </div>
    <p v-if="list.help" class="text-label-sm font-normal text-on-surface-variant mb-3">
      {{ list.help }}
    </p>

    <p
      v-if="!items.length"
      class="text-body-md text-on-surface-variant bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-6 text-center"
    >
      Nothing here yet — use Add to create the first one.
    </p>

    <ul class="space-y-2">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="border border-outline-variant rounded-xl bg-surface-container-lowest overflow-hidden"
      >
        <div class="flex items-center gap-1 px-2 py-2">
          <button
            type="button"
            class="flex-1 flex items-center gap-2 text-start px-2 py-1.5 rounded-lg hover:bg-surface-container transition-colors min-w-0"
            @click="toggle(index)"
          >
            <span
              class="material-symbols-outlined text-lg text-outline transition-transform shrink-0"
              :class="openIndex === index ? 'rotate-90' : ''"
            >
              chevron_right
            </span>
            <span class="text-label-md font-medium text-on-surface truncate">
              {{ itemTitle(index) || `Item ${index + 1}` }}
            </span>
          </button>

          <button
            type="button"
            class="p-1.5 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            :disabled="index === 0"
            title="Move up"
            @click="moveItem(index, -1)"
          >
            <span class="material-symbols-outlined text-lg">arrow_upward</span>
          </button>
          <button
            type="button"
            class="p-1.5 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            :disabled="index === items.length - 1"
            title="Move down"
            @click="moveItem(index, 1)"
          >
            <span class="material-symbols-outlined text-lg">arrow_downward</span>
          </button>
          <button
            type="button"
            class="p-1.5 rounded-lg text-outline hover:bg-error-container hover:text-error transition-colors"
            title="Remove"
            @click="removeItem(index)"
          >
            <span class="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>

        <div
          v-if="openIndex === index"
          class="px-4 pb-4 pt-3 border-t border-outline-variant bg-surface-container-low"
        >
          <FieldEditor
            v-if="isStringList"
            :draft="draft"
            :field="stringField"
            :path="`${list.path}.${index}`"
          />
          <FieldEditor
            v-for="itemField in list.itemFields"
            v-else
            :key="itemField.key"
            :draft="draft"
            :field="itemField"
            :path="`${list.path}.${index}.${itemField.key}`"
          />
        </div>
      </li>
    </ul>
  </section>
</template>
