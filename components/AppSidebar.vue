<template>
  <aside :class="[
    'bg-white border-r flex flex-col z-30 fixed md:static top-0 left-0 h-full w-64',
    'transition-transform duration-300 ease-in-out',
    sidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none backdrop-blur-md' : '-translate-x-full',
    'md:translate-x-0 md:w-64 md:relative md:h-auto'
  ]" tabindex="-1" aria-label="Sidebar">
    <div class="h-16 flex items-center justify-center font-bold text-xl border-b">Captain</div>
    <nav class="flex-1 p-4 space-y-2">
      <!-- Mobile close button -->
      <button 
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 block md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400" 
        @click="$emit('close-sidebar')" 
        aria-label="Close sidebar"
      >
        <span class="i-heroicons-x-mark mr-2" /> Close
      </button>
      
      <!-- Dashboard Views -->
      <button 
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        :class="{ 'bg-gray-200': viewMode === 'environment' }" 
        @click="onNav('environment')"
      >
        <span class="i-heroicons-globe-alt mr-2" /> Environments
      </button>
      <button 
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        :class="{ 'bg-gray-200': viewMode === 'app' }" 
        @click="onNav('app')"
      >
        <span class="i-heroicons-cube mr-2" /> Applications
      </button>
      
      <!-- Integrations -->
      <div class="border-t pt-2 mt-4">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Integrations</h3>
        <button 
          class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" 
          @click="onNav('connectors')"
        >
          <span class="i-heroicons-link mr-2" /> Connectors
        </button>
      </div>
    </nav>
    
    <!-- Settings -->
    <div class="p-4 border-t">
      <button 
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 block focus:outline-none focus:ring-2 focus:ring-blue-400" 
        @click="onNav('settings')"
      >
        <span class="i-heroicons-cog-6-tooth mr-2" /> Settings
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  sidebarOpen: boolean
  viewMode: 'environment' | 'app'
}

interface Emits {
  (e: 'close-sidebar'): void
  (e: 'update-view-mode', mode: 'environment' | 'app'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

function onNav(target: 'environment' | 'app' | 'settings' | 'connectors' | 'manage-environments' | 'manage-applications') {
  if (target === 'settings') {
    router.push('/settings')
  } else if (target === 'connectors') {
    router.push('/connectors')
  } else if (target === 'manage-environments') {
    router.push('/manage-environments')
  } else if (target === 'manage-applications') {
    router.push('/manage-applications')
  } else {
    emit('update-view-mode', target)
    if (router.currentRoute.value.path !== '/') router.push('/')
  }
  emit('close-sidebar')
}
</script> 