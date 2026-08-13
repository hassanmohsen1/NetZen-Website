<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { t, tm, rt, toggleLocale } = useLocale()
const mobileOpen = ref(false)
const scrolled = ref(false)

const navLinks = computed(() =>
  (tm('nav.links') || []).map((link) => ({
    label: rt(link.label),
    href: rt(link.href),
  }))
)

const activeLink = ref('#home')

function setActive(href) {
  activeLink.value = href
  mobileOpen.value = false
}

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed top-0 w-full z-50 border-b border-white/20 h-20 transition-all duration-500"
    :class="scrolled ? 'navbar-scrolled backdrop-blur-xl' : 'bg-surface/40 backdrop-blur-xl shadow-sm'"
  >
    <nav
      class="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-full"
    >
      <!-- Logo -->
      <a
        href="#home"
        class="text-headline-sm font-bold text-primary logo-text cursor-pointer"
        @click="setActive('#home')"
      >
        {{ t('nav.brand') }}
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex gap-8 items-center">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-label-md font-medium transition-all duration-300 relative"
          :class="
            activeLink === link.href
              ? 'text-primary'
              : 'text-on-surface-variant hover:text-primary'
          "
          @click="setActive(link.href)"
        >
          {{ link.label }}
          <span
            class="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-primary transition-transform duration-300 origin-left"
            :class="activeLink === link.href ? 'scale-x-100' : 'scale-x-0'"
          ></span>
        </a>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          class="text-label-md font-medium text-secondary px-3 py-1 rounded-lg hover:bg-secondary-container transition-all duration-300 hover:scale-105"
          @click="toggleLocale"
        >
          {{ t('nav.langToggle') }}
        </button>
        <a href="#contact" class="hidden sm:block btn-primary !py-2.5 !px-6 !shadow-lg">
          {{ t('nav.getQuote') }}
        </a>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="material-symbols-outlined">
            {{ mobileOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden bg-surface/95 backdrop-blur-xl border-b border-outline-variant shadow-lg"
      >
        <div class="flex flex-col gap-1 p-4">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-label-md font-medium px-4 py-3 rounded-xl transition-all duration-300"
            :class="
              activeLink === link.href
                ? 'text-primary bg-primary/5'
                : 'text-on-surface-variant hover:bg-surface-container'
            "
            @click="setActive(link.href)"
          >
            {{ link.label }}
          </a>
          <a
            href="#contact"
            class="mt-2 btn-primary sm:hidden !py-3 text-center"
            @click="mobileOpen = false"
          >
            {{ t('nav.getQuote') }}
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>
