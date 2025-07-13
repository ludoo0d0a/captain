<template>
  <aside :class="[
    'bg-white border-r flex flex-col z-30 fixed md:static top-0 left-0 h-full w-64',
    'transition-transform duration-300 ease-in-out',
    sidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none backdrop-blur-md' : '-translate-x-full',
    'md:translate-x-0 md:w-64 md:relative md:h-auto'
  ]" tabindex="-1" aria-label="Sidebar">
    <div class="h-16 flex items-center justify-center font-bold text-xl border-b">
      {{ $route.path.startsWith('/settings') ? 'Settings' : 'Captain' }}
    </div>
    <nav class="flex-1 p-4 space-y-2">
      <!-- Mobile close button -->
      <button 
        class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 block md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400" 
        @click="$emit('close-sidebar')" 
        aria-label="Close sidebar"
      >
        <Icon name="heroicons:x-mark" class="w-4 h-4 mr-2" /> Close
      </button>
      
      <!-- Main Menu -->
      <div v-if="!$route.path.startsWith('/settings')">
        <!-- Dashboard Views -->
        <NuxtLink to="/environments" class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 block">
          <Icon name="heroicons:globe-alt" class="w-4 h-4 mr-2" /> Environments
        </NuxtLink>
        <NuxtLink to="/applications" class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 block">
          <Icon name="heroicons:cube" class="w-4 h-4 mr-2" /> Applications
        </NuxtLink>
        <NuxtLink to="/features" class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 block">
          <Icon name="heroicons:document-text" class="w-4 h-4 mr-2" /> Features
        </NuxtLink>
        
        <!-- Settings Button -->
        <div class="border-t pt-2 mt-4">
          <NuxtLink 
            to="/settings"
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 block"
            :class="{ 'bg-gray-200 font-semibold': $route.path.startsWith('/settings') }"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-4 h-4 mr-2" /> Settings
          </NuxtLink>
        </div>
      </div>
      
      <!-- Settings Menu -->
      <div v-else>
        <!-- Back to Main Menu -->
        <button 
          class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold mb-2" 
          @click="switchToMain"
        >
          <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
        <!-- Connector Settings -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2 px-2">Connector Settings</h3>
          <NuxtLink
            v-for="connector in connectorTypes"
            :key="connector.id"
            :to="`/settings/connectors/${connector.id}`"
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm flex items-center"
            :class="{ 'bg-gray-200 font-semibold': $route.params.connectorId === connector.id }"
          >
            <Icon :name="connector.icon" class="w-4 h-4 mr-2" />
            {{ connector.label }}
          </NuxtLink>
        </div>
        <!-- System Settings -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2 px-2">System</h3>
          <NuxtLink
            to="/settings/database"
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm flex items-center"
            :class="{ 'bg-gray-200 font-semibold': $route.path === '/settings/database' }"
          >
            <Icon name="heroicons:server" class="w-4 h-4 mr-2" /> Databases
          </NuxtLink>
          <NuxtLink
            to="/settings/network"
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm flex items-center"
            :class="{ 'bg-gray-200 font-semibold': $route.path === '/settings/network' }"
          >
            <Icon name="heroicons:server" class="w-4 h-4 mr-2" /> Network
          </NuxtLink>
          <NuxtLink
            to="/settings/connectors"
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm flex items-center"
            :class="{ 'bg-gray-200 font-semibold': $route.path === '/connectors' }"
          >
            <Icon name="heroicons:link" class="w-4 h-4 mr-2" /> Connectors
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
const route = useRoute()
const router = useRouter()

const selectedConnectorId = ref('')

const connectorTypes = [
  { id: 'github', label: 'GitHub', icon: 'heroicons:code-bracket' },
  { id: 'gitlab', label: 'GitLab', icon: 'heroicons:command-line' },
  { id: 'docker', label: 'Docker', icon: 'heroicons:cube' },
  { id: 'kubernetes', label: 'Kubernetes', icon: 'heroicons:cog-6-tooth' },
  { id: 'githubactions', label: 'GitHub Actions', icon: 'heroicons:play' },
  { id: 'http', label: 'HTTP API', icon: 'heroicons:globe-alt' },
  { id: 'jenkins', label: 'Jenkins', icon: 'heroicons:wrench-screwdriver' },
  { id: 'ssh', label: 'SSH', icon: 'heroicons:computer-desktop' },
  { id: 'xldeploy', label: 'XL Deploy', icon: 'heroicons:server' },
  { id: 'googleplaystore', label: 'Google Play Store', icon: 'heroicons:device-phone-mobile' },
  { id: 'jira', label: 'Jira', icon: 'heroicons:clipboard-document-list' }
]

function switchToMain() {
  selectedConnectorId.value = ''
  emit('close-sidebar')
}

function selectConnector(connectorId: string) {
  selectedConnectorId.value = connectorId
  emit('connector-selected', connectorId)
  emit('close-sidebar')
}
</script> 