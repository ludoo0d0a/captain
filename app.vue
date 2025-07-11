<template>
  <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row" :class="{ 'overflow-hidden': sidebarOpen }">
    <!-- Sidebar -->
    <AppSidebar 
      :sidebar-open="sidebarOpen"
      :view-mode="viewMode"
      @close-sidebar="sidebarOpen = false"
      @update-view-mode="viewMode = $event"
    />
    
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
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
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
  if (route.path.startsWith('/connectors')) return 'Connectors - Captain'
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
