<template>
  <aside :class="[
    'bg-white border-r flex flex-col z-30 fixed md:static top-0 left-0 h-full w-64',
    'transition-transform duration-300 ease-in-out',
    sidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none backdrop-blur-md' : '-translate-x-full',
    'md:translate-x-0 md:w-64 md:relative md:h-auto'
  ]" tabindex="-1" aria-label="Sidebar">
    <div class="h-16 flex items-center justify-center font-bold text-xl border-b">
      {{ isSettingsMode ? 'Settings' : 'Captain' }}
    </div>
    <nav class="flex-1 p-4 space-y-2">
      <!-- Mobile close button -->
      <button 
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 block md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400" 
        @click="$emit('close-sidebar')" 
        aria-label="Close sidebar"
      >
        <span class="i-heroicons-x-mark mr-2" /> Close
      </button>
      
      <!-- Main Menu -->
      <div v-if="!isSettingsMode">
        <!-- Dashboard Views -->
        <NuxtLink to="/environments" class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 block">
          <span class="i-heroicons-globe-alt mr-2" /> Environments
        </NuxtLink>
        <NuxtLink to="/applications" class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 block">
          <span class="i-heroicons-cube mr-2" /> Applications
        </NuxtLink>
        
        <!-- Settings Button -->
        <div class="border-t pt-2 mt-4">
          <button 
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            @click="switchToSettings"
          >
            <span class="i-heroicons-cog-6-tooth mr-2" /> Settings
          </button>
        </div>
      </div>
      
      <!-- Settings Menu -->
      <div v-else>
        <!-- Back to Main Menu -->
        <button 
          class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold mb-2" 
          @click="switchToMain"
        >
          <span class="i-heroicons-arrow-left mr-2" /> Back to Dashboard
        </button>
        
        <!-- Connector Settings -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2 px-2">Connectors</h3>
          <button
            v-for="connector in connectorTypes"
            :key="connector.id"
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm"
            :class="{ 'bg-gray-200 font-semibold': selectedConnectorId === connector.id }"
            @click="selectConnector(connector.id)"
          >
            <span :class="[connector.icon, 'h-4 w-4 mr-2 inline']" />
            {{ connector.label }}
          </button>
        </div>

        <!-- System Settings -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2 px-2">System</h3>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm"
            :class="{ 'bg-gray-200 font-semibold': selectedConnectorId === 'database' }"
            @click="selectConnector('database')"
          >
            <span class="i-heroicons-database mr-2" /> Database Management
          </button>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm"
            :class="{ 'bg-gray-200 font-semibold': selectedConnectorId === 'connectors' }"
            @click="selectConnector('connectors')"
          >
            <span class="i-heroicons-link mr-2" /> Connector Management
          </button>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  sidebarOpen: boolean
}

interface Emits {
  (e: 'close-sidebar'): void
  (e: 'settings-mode-change', isSettings: boolean): void
  (e: 'connector-selected', connectorId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const isSettingsMode = ref(false)
const selectedConnectorId = ref('')

const connectorTypes = [
  { id: 'github', label: 'GitHub', icon: 'i-heroicons-code-bracket' },
  { id: 'gitlab', label: 'GitLab', icon: 'i-heroicons-command-line' },
  { id: 'docker', label: 'Docker', icon: 'i-heroicons-cube' },
  { id: 'kubernetes', label: 'Kubernetes', icon: 'i-heroicons-cog-6-tooth' },
  { id: 'githubactions', label: 'GitHub Actions', icon: 'i-heroicons-play' },
  { id: 'http', label: 'HTTP API', icon: 'i-heroicons-globe-alt' },
  { id: 'jenkins', label: 'Jenkins', icon: 'i-heroicons-wrench-screwdriver' },
  { id: 'ssh', label: 'SSH', icon: 'i-heroicons-computer-desktop' },
  { id: 'xldeploy', label: 'XL Deploy', icon: 'i-heroicons-server' },
  { id: 'googleplaystore', label: 'Google Play Store', icon: 'i-heroicons-device-phone-mobile' }
]



function switchToSettings() {
  isSettingsMode.value = true
  emit('settings-mode-change', true)
  emit('close-sidebar')
}

function switchToMain() {
  isSettingsMode.value = false
  selectedConnectorId.value = ''
  emit('settings-mode-change', false)
  emit('close-sidebar')
}

function selectConnector(connectorId: string) {
  selectedConnectorId.value = connectorId
  emit('connector-selected', connectorId)
  emit('close-sidebar')
}
</script> 