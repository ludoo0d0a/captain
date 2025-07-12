<template>
  <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row" :class="{ 'overflow-hidden': sidebarOpen }">
    <!-- Sidebar -->
    <AppSidebar 
      :sidebar-open="sidebarOpen"
      @close-sidebar="sidebarOpen = false"
      @settings-mode-change="handleSettingsModeChange"
      @connector-selected="handleConnectorSelected"
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
            {{ getPageTitle() }}
          </div>
        </div>
        <div>
          <!-- User/Account/Help icons could go here -->
        </div>
      </header>
      <!-- Dashboard Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <!-- Settings Content -->
        <div v-if="isSettingsMode" class="flex-1 flex flex-col items-center justify-center">
          <!-- Welcome/Overview -->
          <div v-if="!selectedConnector && selectedConnectorId !== 'database' && selectedConnectorId !== 'connectors'" class="bg-white rounded shadow p-8 w-full max-w-4xl">
            <h2 class="text-2xl font-bold mb-4">Settings Overview</h2>
            <p class="text-sm text-gray-600 mb-6">
              Configure your application settings, connectors, and system preferences.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Connectors Section -->
              <div class="border rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                  <span class="i-heroicons-link mr-2" /> Connectors
                </h3>
                <p class="text-sm text-gray-600 mb-4">
                  Configure third-party integrations for your applications and deployments.
                </p>
                <div class="space-y-2">
                  <div v-for="connector in connectorTypes.slice(0, 5)" :key="connector.id" class="flex items-center text-sm">
                    <span :class="[connector.icon, 'h-4 w-4 mr-2 text-gray-500']" />
                    {{ connector.label }}
                  </div>
                  <div class="text-xs text-gray-400 mt-2">+ {{ connectorTypes.length - 5 }} more connectors</div>
                </div>
              </div>
              
              <!-- System Section -->
              <div class="border rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                  <span class="i-heroicons-cog-6-tooth mr-2" /> System
                </h3>
                <p class="text-sm text-gray-600 mb-4">
                  Manage database, connectors, and system preferences.
                </p>
                <div class="space-y-2">
                  <div class="flex items-center text-sm">
                    <span class="i-heroicons-database h-4 w-4 mr-2 text-gray-500" />
                    Database Management
                  </div>
                  <div class="flex items-center text-sm">
                    <span class="i-heroicons-link h-4 w-4 mr-2 text-gray-500" />
                    Connector Management
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connector Configuration -->
          <div v-else-if="selectedConnector" class="w-full max-w-2xl">
            <ConnectorSettingsForm 
              :connector-id="selectedConnector.id"
              @saved="handleSettingsSaved"
              @cancel="handleSettingsCancel"
            />
          </div>

          <!-- Database Management -->
          <div v-else-if="selectedConnectorId === 'database'" class="bg-white rounded shadow p-8 w-full max-w-lg">
            <h2 class="text-2xl font-bold mb-4">Database Management</h2>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <button 
                  @click="clearDatabase" 
                  :disabled="dbLoading"
                  class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {{ dbLoading ? 'Clearing...' : 'Clear Database' }}
                </button>
                <button 
                  @click="prefillDatabase" 
                  :disabled="dbLoading"
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {{ dbLoading ? 'Prefilling...' : 'Prefill with Mock Data' }}
                </button>
              </div>
              <p class="text-sm text-gray-600">
                Clear database removes all data. Prefill adds sample applications, environments, versions, and deployments for testing.
              </p>
            </div>
          </div>

          <!-- Connector Management -->
          <div v-else-if="selectedConnectorId === 'connectors'" class="bg-white rounded shadow p-8 w-full max-w-lg">
            <h2 class="text-2xl font-bold mb-4">Connector Management</h2>
            <p class="text-sm text-gray-600 mb-6">
              Manage your third-party integrations and their configurations.
            </p>
            <div class="space-y-4">
              <button 
                @click="$router.push('/connectors')"
                class="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                Manage Connectors
              </button>
              <p class="text-sm text-gray-600">
                View, add, edit, and delete connectors. Test connections and manage settings for all your integrations.
              </p>
            </div>
          </div>
        </div>

        <!-- Regular Page Content -->
        <div v-else>
          <NuxtPage />
        </div>
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

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

// Settings mode state
const isSettingsMode = ref(false)
const selectedConnectorId = ref('')
const saving = ref(false)
const dbLoading = ref(false)

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

const selectedConnector = computed(() => 
  connectorTypes.find(c => c.id === selectedConnectorId.value)
)

function handleSettingsModeChange(isSettings: boolean) {
  isSettingsMode.value = isSettings
  if (!isSettings) {
    selectedConnectorId.value = ''
  }
}

function handleConnectorSelected(connectorId: string) {
  selectedConnectorId.value = connectorId
}

function getPageTitle() {
  if (isSettingsMode.value) {
    if (selectedConnectorId.value === 'database') return 'Database Management'
    if (selectedConnectorId.value === 'connectors') return 'Connector Management'
    if (selectedConnector.value) return `${selectedConnector.value.label} Settings`
    return 'Settings'
  }
  if (route.path === '/applications') return 'Applications Dashboard'
  if (route.path === '/environments') return 'Environments Dashboard'
  if (route.path === '/features') return 'Features'
  return 'Applications Dashboard'
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
  if (isSettingsMode.value) {
    if (selectedConnectorId.value === 'database') return 'Database Management - Captain'
    if (selectedConnectorId.value === 'connectors') return 'Connector Management - Captain'
    if (selectedConnector.value) return `${selectedConnector.value.label} Settings - Captain`
    return 'Settings - Captain'
  }
  if (route.path === '/applications') return 'Applications Dashboard - Captain'
  if (route.path === '/environments') return 'Environments Dashboard - Captain'
  if (route.path === '/features') return 'Features - Captain'
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

// Settings handlers
function handleSettingsSaved() {
  showToast('Settings saved successfully!', 'success')
}

function handleSettingsCancel() {
  selectedConnectorId.value = ''
}

async function clearDatabase() {
  dbLoading.value = true
  try {
    const result = await $fetch('/api/database', { method: 'POST', body: { action: 'clear' } })
    if (result.success) {
      showToast('Database cleared successfully!', 'success')
      window.location.reload()
    } else {
      showToast('Failed to clear database', 'error')
    }
  } catch (error) {
    showToast('Failed to clear database', 'error')
  } finally {
    dbLoading.value = false
  }
}

async function prefillDatabase() {
  dbLoading.value = true
  try {
    const result = await $fetch('/api/database', { method: 'POST', body: { action: 'prefill' } })
    if (result.success) {
      showToast('Database prefilled with mock data successfully!', 'success')
      window.location.reload()
    } else {
      showToast('Failed to prefill database', 'error')
    }
  } catch (error) {
    showToast('Failed to prefill database', 'error')
  } finally {
    dbLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
