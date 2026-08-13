<script setup>
import { ref } from 'vue'
import AdminLogin from '@/admin/AdminLogin.vue'
import ContentEditor from '@/admin/ContentEditor.vue'
import SubmissionsInbox from '@/admin/SubmissionsInbox.vue'
import { SECTIONS } from '@/admin/schema'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { isFirebaseConfigured } from '@/firebase'

const { user, isAdmin, authReady, adminCheckFailed, email, logout } = useAdminAuth()

const activeTab = ref('content') // content | submissions
const activeSection = ref(SECTIONS[0].id)
const sidebarOpen = ref(false)

function selectSection(id) {
  activeSection.value = id
  activeTab.value = 'content'
  sidebarOpen.value = false
}

function selectSubmissions() {
  activeTab.value = 'submissions'
  sidebarOpen.value = false
}

const navItemClass =
  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-label-md font-medium transition-colors text-start'
</script>

<template>
  <!-- The dashboard chrome is English-only, so it stays LTR even when the site
       locale is Arabic. Arabic content inputs set their own direction. -->
  <div dir="ltr" class="min-h-screen bg-background text-on-surface">
    <!-- 1. No Firebase project attached yet -->
    <div
      v-if="!isFirebaseConfigured"
      class="min-h-screen flex items-center justify-center px-4"
    >
      <div class="max-w-lg glass-card rounded-2xl p-8">
        <h1 class="text-headline-sm font-semibold mb-3">Firebase isn't configured</h1>
        <p class="text-body-md text-on-surface-variant mb-4">
          The landing page is running on its bundled content. To enable this dashboard,
          create a Firebase project and add its keys:
        </p>
        <ol class="text-body-md text-on-surface-variant list-decimal ps-5 space-y-2 mb-4">
          <li>Copy <code class="text-primary">.env.example</code> to <code class="text-primary">.env</code></li>
          <li>Paste your Firebase web config values into it</li>
          <li>Restart the dev server</li>
        </ol>
        <p class="text-body-md text-on-surface-variant">
          Full walkthrough in <code class="text-primary">FIREBASE_SETUP.md</code>.
        </p>
      </div>
    </div>

    <!-- 2. Resolving the session -->
    <div v-else-if="!authReady" class="min-h-screen flex items-center justify-center">
      <p class="text-body-md text-on-surface-variant">Loading…</p>
    </div>

    <!-- 3. Signed out -->
    <AdminLogin v-else-if="!user" />

    <!-- 4. Signed in but not on the admin allowlist -->
    <div v-else-if="!isAdmin" class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-lg glass-card rounded-2xl p-8 text-center">
        <span class="material-symbols-outlined text-4xl text-tertiary mb-3">lock</span>
        <h1 class="text-headline-sm font-semibold mb-3">
          {{ adminCheckFailed ? 'Could not verify your account' : 'Not authorised' }}
        </h1>
        <p v-if="adminCheckFailed" class="text-body-md text-on-surface-variant mb-6">
          Firestore refused the permission check. Make sure
          <code class="text-primary">firestore.rules</code> has been deployed to your project.
        </p>
        <p v-else class="text-body-md text-on-surface-variant mb-6">
          <strong>{{ email }}</strong> is signed in but is not an admin. In the Firebase
          console, add a document to the <code class="text-primary">admins</code> collection
          whose ID is this account's User UID.
        </p>
        <button
          type="button"
          class="text-label-md font-medium text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
          @click="logout"
        >
          Sign out
        </button>
      </div>
    </div>

    <!-- 5. The dashboard -->
    <div v-else class="flex">
      <!-- Mobile backdrop -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/40 z-30 md:hidden"
        @click="sidebarOpen = false"
      />

      <aside
        class="fixed md:sticky top-0 z-40 h-screen w-64 shrink-0 bg-surface-container-lowest border-e border-outline-variant flex flex-col transition-transform md:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="px-4 py-5 border-b border-outline-variant">
          <div class="text-headline-sm font-bold text-primary">NetZen</div>
          <div class="text-label-sm font-normal text-on-surface-variant">Content dashboard</div>
        </div>

        <nav class="flex-1 overflow-y-auto p-3 space-y-1">
          <div
            class="text-label-sm font-semibold uppercase tracking-wide text-outline px-3 py-2"
          >
            Page sections
          </div>
          <button
            v-for="section in SECTIONS"
            :key="section.id"
            type="button"
            :class="[
              navItemClass,
              activeTab === 'content' && activeSection === section.id
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant hover:bg-surface-container',
            ]"
            @click="selectSection(section.id)"
          >
            <span class="material-symbols-outlined text-xl">{{ section.icon }}</span>
            {{ section.label }}
          </button>

          <div class="pt-3">
            <button
              type="button"
              :class="[
                navItemClass,
                activeTab === 'submissions'
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container',
              ]"
              @click="selectSubmissions"
            >
              <span class="material-symbols-outlined text-xl">inbox</span>
              Submissions
            </button>
          </div>
        </nav>

        <div class="p-3 border-t border-outline-variant space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            :class="[navItemClass, 'text-on-surface-variant hover:bg-surface-container']"
          >
            <span class="material-symbols-outlined text-xl">open_in_new</span>
            View site
          </a>
          <button
            type="button"
            :class="[navItemClass, 'text-on-surface-variant hover:bg-surface-container']"
            @click="logout"
          >
            <span class="material-symbols-outlined text-xl">logout</span>
            Sign out
          </button>
          <p class="text-label-sm font-normal text-outline px-3 pt-2 truncate" :title="email">
            {{ email }}
          </p>
        </div>
      </aside>

      <main class="flex-1 min-w-0">
        <button
          type="button"
          class="md:hidden fixed bottom-5 end-5 z-20 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center"
          @click="sidebarOpen = true"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="max-w-3xl mx-auto px-6">
          <ContentEditor v-show="activeTab === 'content'" :section-id="activeSection" />
          <SubmissionsInbox v-if="activeTab === 'submissions'" />
        </div>
      </main>
    </div>
  </div>
</template>
