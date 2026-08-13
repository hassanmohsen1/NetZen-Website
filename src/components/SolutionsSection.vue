<script setup>
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { tm, rt } = useLocale()

// The bento layout is driven by each card's `size`: "large" spans two columns
// and shows a description plus a solid button, "small" is a single column with
// a text link. Adding a card in the dashboard just extends the grid.
const items = computed(() =>
  (tm('solutions.items') || []).map((item) => ({
    image: rt(item.image),
    title: rt(item.title),
    desc: rt(item.desc),
    cta: rt(item.cta),
    large: rt(item.size) === 'large',
  }))
)
</script>

<template>
  <section id="solutions" class="py-24 bg-surface-container-lowest">
    <div class="px-4 md:px-margin-desktop max-w-container-max mx-auto">
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[250px] md:auto-rows-[300px]"
      >
        <div
          v-for="(item, i) in items"
          :key="i"
          v-reveal
          class="bento-card relative group rounded-2xl"
          :class="item.large ? 'md:col-span-2' : ''"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"
          />
          <img
            :src="item.image"
            alt=""
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute bottom-0 start-0 p-6 md:p-10 z-20">
            <h3
              class="text-on-primary font-semibold mb-2"
              :class="item.large ? 'text-headline-sm md:text-headline-md' : 'text-headline-sm'"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.desc"
              class="text-on-primary/80 text-body-md mb-4 md:mb-6 max-w-lg hidden sm:block"
            >
              {{ item.desc }}
            </p>
            <a
              v-if="item.cta"
              href="#contact"
              class="inline-block"
              :class="
                item.large
                  ? 'bg-primary text-on-primary px-6 py-3 rounded-xl text-label-md font-medium'
                  : 'text-on-primary text-label-md font-medium border-b border-white/40'
              "
            >
              {{ item.cta }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
