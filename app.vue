<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar and main dashboard only on root -->
    <template v-if="$route.path === '/'">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r flex flex-col">
        <div class="h-16 flex items-center justify-center font-bold text-xl border-b">Captain</div>
        <nav class="flex-1 p-4 space-y-2">
          <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100" :class="{ 'bg-gray-200': viewMode === 'environment' }" @click="viewMode = 'environment'">
            <span class="i-heroicons-globe-alt mr-2" /> Environments
          </button>
          <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100" :class="{ 'bg-gray-200': viewMode === 'app' }" @click="viewMode = 'app'">
            <span class="i-heroicons-cube mr-2" /> Applications
          </button>
        </nav>
        <div class="p-4 border-t">
          <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 block" @click="goToSettings">
            <span class="i-heroicons-cog-6-tooth mr-2" /> Settings
          </button>
        </div>
      </aside>
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Topbar -->
        <header class="h-16 flex items-center px-6 border-b bg-white">
          <div class="flex-1 text-lg font-semibold">
            {{ viewMode === 'environment' ? 'Environments' : 'Applications' }} Dashboard
          </div>
          <div>
            <!-- User/Account/Help icons could go here -->
          </div>
        </header>
        <!-- Dashboard Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <DashboardEnvironments v-if="viewMode === 'environment'" />
          <DashboardApplications v-else />
        </main>
      </div>
    </template>
    <!-- All other routes: render NuxtPage (management, deploy, promote, etc) -->
    <template v-else>
      <NuxtPage />
    </template>
    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div v-for="toast in toasts" :key="toast.id" :class="['px-4 py-2 rounded shadow text-white', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
const viewMode = ref<'environment' | 'app'>('environment')
const router = useRouter()
const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/') {
    return viewMode.value === 'environment' ? 'Environments Dashboard - Captain' : 'Applications Dashboard - Captain'
  }
  if (route.path.startsWith('/settings')) return 'Settings - Captain'
  if (route.path.startsWith('/manage-applications')) return 'Manage Applications - Captain'
  if (route.path.startsWith('/manage-environments')) return 'Manage Environments - Captain'
  if (route.path.startsWith('/deploy')) return 'Deploy - Captain'
  if (route.path.startsWith('/promote')) return 'Promote - Captain'
  return 'Captain'
})

useHead({ title: pageTitle })

// Toast system
const toasts = ref<{ id: number, message: string, type: 'success' | 'error' }[]>([])
function showToast(message: string, type: 'success' | 'error' = 'success') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}
provide('showToast', showToast)

function goToSettings() {
  router.push('/settings')
}
</script>
