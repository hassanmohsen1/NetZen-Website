<script setup>
import { computed } from 'vue'
import { getPath, setPath, siblingPath } from './paths'
import { COLOR_PAIRS } from './schema'

const props = defineProps({
  draft: { type: Object, required: true },
  field: { type: Object, required: true },
  path: { type: String, required: true },
})

const isShared = computed(() => Boolean(props.field.shared))
// Shared values (icons, URLs, numbers, colours) are language-neutral, so they
// get a single input and are written to both documents at once.
const locales = computed(() => (isShared.value ? ['en'] : ['en', 'ar']))

function read(locale) {
  const value = getPath(props.draft[locale], props.path)
  return value === undefined || value === null ? '' : value
}

function write(locale, value) {
  if (isShared.value) {
    setPath(props.draft.en, props.path, value)
    setPath(props.draft.ar, props.path, value)
    return
  }
  setPath(props.draft[locale], props.path, value)
}

const activePair = computed(
  () => COLOR_PAIRS.find((pair) => pair.color === read('en')) || COLOR_PAIRS[0]
)

// A colour choice sets the background and its matching foreground together, so
// the two can never drift out of sync.
function writeColorPair(color) {
  const pair = COLOR_PAIRS.find((p) => p.color === color) || COLOR_PAIRS[0]
  for (const locale of ['en', 'ar']) {
    setPath(props.draft[locale], props.path, pair.color)
    setPath(props.draft[locale], siblingPath(props.path, 'textColor'), pair.textColor)
  }
}

const inputClass =
  'w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 px-3 ' +
  'text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
</script>

<template>
  <div class="mb-5">
    <div class="flex items-baseline gap-2 mb-1.5">
      <label class="text-label-md font-medium text-on-surface">{{ field.label }}</label>
      <span
        v-if="isShared"
        class="text-[11px] font-semibold uppercase tracking-wide text-outline bg-surface-container px-1.5 py-0.5 rounded"
        title="Same value in both languages"
      >
        Both languages
      </span>
    </div>
    <p v-if="field.help" class="text-label-sm font-normal text-on-surface-variant mb-2">
      {{ field.help }}
    </p>

    <!-- Colour pair: one select drives background + text colour -->
    <div v-if="field.type === 'colorPair'" class="flex items-center gap-3">
      <select
        :value="activePair.color"
        :class="inputClass"
        @change="writeColorPair($event.target.value)"
      >
        <option v-for="pair in COLOR_PAIRS" :key="pair.color" :value="pair.color">
          {{ pair.label }}
        </option>
      </select>
      <span
        class="w-10 h-10 rounded-lg shrink-0 border border-outline-variant"
        :class="`bg-${activePair.color}`"
        aria-hidden="true"
      />
    </div>

    <!-- Everything else renders once per language (or once, if shared) -->
    <div v-else class="grid gap-3" :class="isShared ? 'grid-cols-1' : 'md:grid-cols-2'">
      <div v-for="locale in locales" :key="locale">
        <div
          v-if="!isShared"
          class="text-[11px] font-semibold uppercase tracking-wide text-outline mb-1"
        >
          {{ locale === 'en' ? 'English' : 'العربية' }}
        </div>

        <textarea
          v-if="field.type === 'textarea'"
          rows="3"
          :value="read(locale)"
          :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          :class="inputClass"
          @input="write(locale, $event.target.value)"
        />

        <select
          v-else-if="field.type === 'select'"
          :value="read(locale)"
          :class="inputClass"
          @change="write(locale, $event.target.value)"
        >
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <div v-else-if="field.type === 'icon'" class="flex items-center gap-3">
          <input
            type="text"
            :value="read(locale)"
            :class="inputClass"
            placeholder="e.g. shield"
            @input="write(locale, $event.target.value)"
          />
          <span
            class="w-10 h-10 rounded-lg shrink-0 bg-surface-container flex items-center justify-center text-primary"
          >
            <span class="material-symbols-outlined">{{ read(locale) }}</span>
          </span>
        </div>

        <div v-else-if="field.type === 'image'" class="space-y-2">
          <input
            type="url"
            :value="read(locale)"
            :class="inputClass"
            placeholder="https://..."
            @input="write(locale, $event.target.value)"
          />
          <img
            v-if="read(locale)"
            :src="read(locale)"
            alt=""
            class="w-full h-28 object-cover rounded-lg border border-outline-variant bg-surface-container"
          />
        </div>

        <input
          v-else
          type="text"
          :value="read(locale)"
          :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          :class="inputClass"
          @input="write(locale, $event.target.value)"
        />
      </div>
    </div>

    <p v-if="field.type === 'icon'" class="text-label-sm font-normal text-on-surface-variant mt-1.5">
      Any name from Google Material Symbols (Outlined).
    </p>
  </div>
</template>
