<template>
  <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row" :class="{ 'overflow-hidden': sidebarOpen }">
    <!-- Sidebar -->
    <aside :class="[
      'bg-white border-r flex flex-col z-30 fixed md:static top-0 left-0 h-full w-64',
      'transition-transform duration-300 ease-in-out',
      sidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none backdrop-blur-md' : '-translate-x-full',
      'md:translate-x-0 md:w-64 md:relative md:h-auto'
    ]" tabindex="-1" aria-label="Sidebar">
      <div class="h-16 flex items-center justify-center font-bold text-xl border-b">Captain</div>
      <nav class="flex-1 p-4 space-y-2">
        <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 block md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400" @click="sidebarOpen = false" aria-label="Close sidebar">
          <span class="i-heroicons-x-mark mr-2" /> Close
        </button>
        <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" :class="{ 'bg-gray-200': viewMode === 'environment' }" @click="onNav('environment')">
          <span class="i-heroicons-globe-alt mr-2" /> Environments
        </button>
        <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" :class="{ 'bg-gray-200': viewMode === 'app' }" @click="onNav('app')">
          <span class="i-heroicons-cube mr-2" /> Applications
        </button>
      </nav>
      <div class="p-4 border-t">
        <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 block focus:outline-none focus:ring-2 focus:ring-blue-400" @click="onNav('settings')">
          <span class="i-heroicons-cog-6-tooth mr-2" /> Settings
        </button>
      </div>
    </aside>
    <!-- Sidebar overlay for mobile -->
    <transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden transition-all duration-300 ease-in-out" @click="sidebarOpen = false"></div>
    </transition>
    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Topbar -->
      <header class="h-16 flex items-center px-4 md:px-6 border-b bg-white justify-between">
        <div class="flex items-center gap-2">
          <button class="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" @click="sidebarOpen = true" aria-label="Open sidebar">
            <span class="i-heroicons-bars-3 w-6 h-6" />Menu
          </button>
          <div class="text-lg font-semibold">
            {{ viewMode === 'environment' ? 'Environments' : 'Applications' }} Dashboard
          </div>
        </div>
        <div>
          <!-- User/Account/Help icons could go here -->
        </div>
      </header>
      <!-- Dashboard Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <DashboardEnvironments v-if="$route.path === '/' && viewMode === 'environment'" />
        <DashboardApplications v-else-if="$route.path === '/' && viewMode === 'app'" />
        <NuxtPage v-else />
      </main>
      <!-- Toast Notifications -->
      <div class="fixed top-4 right-4 z-50 space-y-2">
        <div v-for="toast in toasts" :key="toast.id" :class="['px-4 py-2 rounded shadow text-white', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'
const viewMode = ref<'environment' | 'app'>('environment')
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

function onNav(target: 'environment' | 'app' | 'settings') {
  if (target === 'settings') {
    router.push('/settings')
  } else {
    viewMode.value = target
    if (route.path !== '/') router.push('/')
  }
  sidebarOpen.value = false
}

// Prevent body scroll when sidebar is open on mobile
onMounted(() => {
  watch(sidebarOpen, (open) => {
    if (open) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, { immediate: true })
})
onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

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
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
