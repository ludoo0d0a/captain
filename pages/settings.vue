<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-white border-r flex flex-col">
      <div class="h-16 flex items-center justify-center font-bold text-xl border-b">Settings</div>
      <nav class="flex-1 p-4 space-y-2">
        <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold mb-2" @click="goHome">
          <span class="i-heroicons-arrow-left mr-2" /> Back to Dashboard
        </button>
        
        <!-- Connector Settings -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2 px-2">Connectors</h3>
          <button
            v-for="connector in connectorTypes"
            :key="connector.id"
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm"
            :class="{ 'bg-gray-200 font-semibold': selectedId === connector.id }"
            @click="selectedId = connector.id"
          >
            <component :is="connector.icon" class="h-4 w-4 mr-2 inline" />
            {{ connector.label }}
          </button>
        </div>

        <!-- System Settings -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2 px-2">System</h3>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm"
            :class="{ 'bg-gray-200 font-semibold': selectedId === 'database' }"
            @click="selectedId = 'database'"
          >
            <span class="i-heroicons-database mr-2" /> Database Management
          </button>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-sm"
            :class="{ 'bg-gray-200 font-semibold': selectedId === 'connectors' }"
            @click="selectedId = 'connectors'"
          >
            <span class="i-heroicons-link mr-2" /> Connector Management
          </button>
        </div>
      </nav>
    </aside>
    
    <main class="flex-1 flex flex-col items-center justify-center p-8">
      <!-- Connector Configuration -->
      <div v-if="selectedConnector" class="bg-white rounded shadow p-8 w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-4">{{ selectedConnector.label }} Settings</h2>
        <p class="text-sm text-gray-600 mb-6">
          Configure connection settings for {{ selectedConnector.label }}.
        </p>
        
        <form @submit.prevent="saveConnectorConfig(selectedConnector.id)">
          <!-- GitHub Settings -->
          <div v-if="selectedConnector.id === 'github'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Organization</label>
              <input v-model="form.organization" class="border rounded px-3 py-2 text-sm w-full" placeholder="my-organization" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Repository</label>
              <input v-model="form.repository" class="border rounded px-3 py-2 text-sm w-full" placeholder="my-organization/my-repo" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Personal Access Token</label>
              <input v-model="form.token" type="password" class="border rounded px-3 py-2 text-sm w-full" placeholder="ghp_..." required />
            </div>
          </div>

          <!-- GitLab Settings -->
          <div v-if="selectedConnector.id === 'gitlab'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">GitLab URL</label>
              <input v-model="form.baseUrl" type="url" class="border rounded px-3 py-2 text-sm w-full" placeholder="https://gitlab.com" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Personal Access Token</label>
              <input v-model="form.token" type="password" class="border rounded px-3 py-2 text-sm w-full" placeholder="glpat-..." required />
            </div>
          </div>

          <!-- Docker Settings -->
          <div v-if="selectedConnector.id === 'docker'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Registry URL</label>
              <input v-model="form.registryUrl" type="url" class="border rounded px-3 py-2 text-sm w-full" placeholder="https://registry.hub.docker.com" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Username</label>
              <input v-model="form.username" class="border rounded px-3 py-2 text-sm w-full" placeholder="username" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Password/Token</label>
              <input v-model="form.password" type="password" class="border rounded px-3 py-2 text-sm w-full" placeholder="password or access token" />
            </div>
          </div>

          <!-- Kubernetes Settings -->
          <div v-if="selectedConnector.id === 'kubernetes'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Cluster URL</label>
              <input v-model="form.clusterUrl" type="url" class="border rounded px-3 py-2 text-sm w-full" placeholder="https://kubernetes.example.com" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Default Namespace</label>
              <input v-model="form.namespace" class="border rounded px-3 py-2 text-sm w-full" placeholder="default" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Service Account Token</label>
              <textarea v-model="form.token" rows="4" class="border rounded px-3 py-2 text-sm w-full" placeholder="Paste your service account token here..." required></textarea>
            </div>
          </div>

          <!-- GitHub Actions Settings -->
          <div v-if="selectedConnector.id === 'githubactions'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Organization</label>
              <input v-model="form.organization" class="border rounded px-3 py-2 text-sm w-full" placeholder="my-organization" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Repository</label>
              <input v-model="form.repository" class="border rounded px-3 py-2 text-sm w-full" placeholder="my-organization/my-repo" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Personal Access Token</label>
              <input v-model="form.token" type="password" class="border rounded px-3 py-2 text-sm w-full" placeholder="ghp_..." required />
            </div>
          </div>

          <!-- HTTP Settings -->
          <div v-if="selectedConnector.id === 'http'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Base URL</label>
              <input v-model="form.baseUrl" type="url" class="border rounded px-3 py-2 text-sm w-full" placeholder="https://api.example.com" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Authentication Type</label>
              <select v-model="form.authType" class="border rounded px-3 py-2 text-sm w-full">
                <option value="">None</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="api-key">API Key</option>
              </select>
            </div>
            
            <!-- Basic Auth -->
            <div v-if="form.authType === 'basic'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-1">Username</label>
                <input v-model="form.username" class="border rounded px-3 py-2 text-sm w-full" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">Password</label>
                <input v-model="form.password" type="password" class="border rounded px-3 py-2 text-sm w-full" />
              </div>
            </div>

            <!-- Bearer Token -->
            <div v-if="form.authType === 'bearer'">
              <label class="block text-sm font-semibold mb-1">Bearer Token</label>
              <input v-model="form.token" type="password" class="border rounded px-3 py-2 text-sm w-full" />
            </div>

            <!-- API Key -->
            <div v-if="form.authType === 'api-key'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-1">Header Name</label>
                <input v-model="form.apiKeyHeader" class="border rounded px-3 py-2 text-sm w-full" placeholder="X-API-Key" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">API Key</label>
                <input v-model="form.apiKey" type="password" class="border rounded px-3 py-2 text-sm w-full" />
              </div>
            </div>
          </div>

          <!-- Jenkins Settings -->
          <div v-if="selectedConnector.id === 'jenkins'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Jenkins URL</label>
              <input v-model="form.baseUrl" type="url" class="border rounded px-3 py-2 text-sm w-full" placeholder="https://jenkins.example.com" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Username</label>
              <input v-model="form.username" class="border rounded px-3 py-2 text-sm w-full" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">API Token</label>
              <input v-model="form.apiToken" type="password" class="border rounded px-3 py-2 text-sm w-full" required />
            </div>
          </div>

          <!-- SSH Settings -->
          <div v-if="selectedConnector.id === 'ssh'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Host</label>
              <input v-model="form.host" class="border rounded px-3 py-2 text-sm w-full" placeholder="192.168.1.100" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Port</label>
              <input v-model="form.port" type="number" class="border rounded px-3 py-2 text-sm w-full" placeholder="22" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Username</label>
              <input v-model="form.username" class="border rounded px-3 py-2 text-sm w-full" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Private Key (optional)</label>
              <textarea v-model="form.privateKey" rows="4" class="border rounded px-3 py-2 text-sm w-full" placeholder="-----BEGIN PRIVATE KEY-----..."></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Password (if not using key)</label>
              <input v-model="form.password" type="password" class="border rounded px-3 py-2 text-sm w-full" />
            </div>
          </div>

          <!-- XL Deploy Settings -->
          <div v-if="selectedConnector.id === 'xldeploy'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">XL Deploy URL</label>
              <input v-model="form.baseUrl" type="url" class="border rounded px-3 py-2 text-sm w-full" placeholder="https://xldeploy.example.com" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Username</label>
              <input v-model="form.username" class="border rounded px-3 py-2 text-sm w-full" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Password</label>
              <input v-model="form.password" type="password" class="border rounded px-3 py-2 text-sm w-full" required />
            </div>
          </div>

          <!-- Google Play Store Settings -->
          <div v-if="selectedConnector.id === 'googleplaystore'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Package Name</label>
              <input v-model="form.packageName" class="border rounded px-3 py-2 text-sm w-full" placeholder="com.example.myapp" required />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Service Account Key (JSON)</label>
              <textarea v-model="form.serviceAccountKey" rows="6" class="border rounded px-3 py-2 text-sm w-full" placeholder='{"type": "service_account", "project_id": "..."}'></textarea>
            </div>
          </div>

          <button type="submit" class="mt-6 px-4 py-2 rounded text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Configuration' }}
          </button>
        </form>
      </div>

      <!-- Database Management -->
      <div v-else-if="selectedId === 'database'" class="bg-white rounded shadow p-8 w-full max-w-lg">
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
      <div v-else-if="selectedId === 'connectors'" class="bg-white rounded shadow p-8 w-full max-w-lg">
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

      <div v-else class="text-gray-400 text-lg">Select a setting to configure.</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

// Connector icons
import {
  CodeBracketIcon, // GitHub
  CommandLineIcon, // GitLab
  CubeIcon, // Docker
  CogIcon, // Kubernetes
  PlayIcon, // GitHub Actions
  GlobeAltIcon, // HTTP
  WrenchScrewdriverIcon, // Jenkins
  ComputerDesktopIcon, // SSH
  ServerIcon, // XL Deploy
  DevicePhoneMobileIcon // Google Play Store
} from '@heroicons/vue/24/outline'

const router = useRouter()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const selectedId = ref<string>('github')
const loading = ref(false)
const saving = ref(false)
const connectorConfigs = ref<any[]>([])

const connectorTypes = [
  { id: 'github', label: 'GitHub', icon: CodeBracketIcon },
  { id: 'gitlab', label: 'GitLab', icon: CommandLineIcon },
  { id: 'docker', label: 'Docker', icon: CubeIcon },
  { id: 'kubernetes', label: 'Kubernetes', icon: CogIcon },
  { id: 'githubactions', label: 'GitHub Actions', icon: PlayIcon },
  { id: 'http', label: 'HTTP API', icon: GlobeAltIcon },
  { id: 'jenkins', label: 'Jenkins', icon: WrenchScrewdriverIcon },
  { id: 'ssh', label: 'SSH', icon: ComputerDesktopIcon },
  { id: 'xldeploy', label: 'XL Deploy', icon: ServerIcon },
  { id: 'googleplaystore', label: 'Google Play Store', icon: DevicePhoneMobileIcon }
]

const selectedConnector = computed(() => 
  connectorTypes.find(c => c.id === selectedId.value)
)

const form = reactive({
  // Common fields
  baseUrl: '',
  username: '',
  password: '',
  token: '',
  
  // GitHub specific
  organization: '',
  repository: '',
  
  // Docker specific
  registryUrl: '',
  
  // Kubernetes specific
  clusterUrl: '',
  namespace: '',
  
  // HTTP specific
  authType: '',
  apiKeyHeader: '',
  apiKey: '',
  
  // Jenkins specific
  apiToken: '',
  
  // SSH specific
  host: '',
  port: 22,
  privateKey: '',
  
  // Google Play Store specific
  packageName: '',
  serviceAccountKey: ''
})

// Database management state and methods
const dbLoading = ref(false)

onMounted(async () => {
  await loadConnectorConfigs()
})

async function loadConnectorConfigs() {
  try {
    const response = await $fetch('/api/connectors/config') as any
    if (response.success) {
      connectorConfigs.value = response.connectors || []
    }
  } catch (error) {
    console.error('Failed to load connector configs:', error)
  }
}

function getConnectorConfig(connectorId: string) {
  return connectorConfigs.value.find(c => c.type === connectorId)
}

function loadConnectorForm(connectorId: string) {
  const config = getConnectorConfig(connectorId)
  
  // Reset form
  Object.keys(form).forEach(key => {
    (form as any)[key] = ''
  })
  
  if (config) {
    const settings = config.settings || {}
    const credentials = config.credentials || {}
    
    // Load common fields
    form.baseUrl = settings.baseUrl || ''
    form.username = credentials.username || ''
    form.password = credentials.password || ''
    form.token = credentials.token || ''
    
    // Load connector-specific fields
    switch (connectorId) {
      case 'github':
      case 'githubactions':
        form.organization = settings.organization || ''
        form.repository = settings.repository || ''
        break
      case 'gitlab':
        form.baseUrl = settings.baseUrl || ''
        break
      case 'docker':
        form.registryUrl = settings.registryUrl || ''
        form.username = credentials.username || ''
        form.password = credentials.password || ''
        break
      case 'kubernetes':
        form.clusterUrl = settings.clusterUrl || ''
        form.namespace = settings.namespace || ''
        form.token = credentials.token || ''
        break
      case 'http':
        form.baseUrl = settings.baseUrl || ''
        form.authType = credentials.type || ''
        form.username = credentials.credentials?.username || ''
        form.password = credentials.credentials?.password || ''
        form.token = credentials.credentials?.token || ''
        form.apiKeyHeader = credentials.credentials?.header || ''
        form.apiKey = credentials.credentials?.key || ''
        break
      case 'jenkins':
        form.baseUrl = settings.baseUrl || ''
        form.username = credentials.username || ''
        form.apiToken = credentials.apiToken || ''
        break
      case 'ssh':
        form.host = settings.host || ''
        form.port = settings.port || 22
        form.username = credentials.username || ''
        form.privateKey = credentials.privateKey || ''
        form.password = credentials.password || ''
        break
      case 'xldeploy':
        form.baseUrl = settings.baseUrl || ''
        form.username = credentials.username || ''
        form.password = credentials.password || ''
        break
      case 'googleplaystore':
        form.packageName = settings.packageName || ''
        form.serviceAccountKey = credentials.serviceAccountKey || ''
        break
    }
  }
}

// Watch for selected connector changes
watch(selectedId, (newId) => {
  if (newId && newId !== 'database' && newId !== 'connectors') {
    loadConnectorForm(newId)
  }
}, { immediate: true })

async function clearDatabase() {
  dbLoading.value = true
  try {
    const result = await $fetch('/api/database', { method: 'POST', body: { action: 'clear' } })
    if (result.success) {
      showToast && showToast('Database cleared successfully!', 'success')
      window.location.reload()
    } else {
      showToast && showToast('Failed to clear database', 'error')
    }
  } catch (error) {
    showToast && showToast('Failed to clear database', 'error')
  } finally {
    dbLoading.value = false
  }
}

async function prefillDatabase() {
  dbLoading.value = true
  try {
    const result = await $fetch('/api/database', { method: 'POST', body: { action: 'prefill' } })
    if (result.success) {
      showToast && showToast('Database prefilled with mock data successfully!', 'success')
      window.location.reload()
    } else {
      showToast && showToast('Failed to prefill database', 'error')
    }
  } catch (error) {
    showToast && showToast('Failed to prefill database', 'error')
  } finally {
    dbLoading.value = false
  }
}

function goHome() {
  router.push('/')
}

async function saveConnectorConfig(connectorId: string) {
  saving.value = true
  
  try {
    const config = getConnectorConfig(connectorId)
    const connectorName = selectedConnector.value?.label || connectorId
    
    // Prepare settings and credentials based on connector type
    let settings: any = {}
    let credentials: any = {}
    
    switch (connectorId) {
      case 'github':
      case 'githubactions':
        settings = {
          organization: form.organization,
          repository: form.repository
        }
        credentials = {
          token: form.token
        }
        break
      case 'gitlab':
        settings = {
          baseUrl: form.baseUrl
        }
        credentials = {
          token: form.token
        }
        break
      case 'docker':
        settings = {
          registryUrl: form.registryUrl
        }
        credentials = {
          username: form.username,
          password: form.password
        }
        break
      case 'kubernetes':
        settings = {
          clusterUrl: form.clusterUrl,
          namespace: form.namespace
        }
        credentials = {
          token: form.token
        }
        break
      case 'http':
        settings = {
          baseUrl: form.baseUrl
        }
        credentials = {
          type: form.authType,
          credentials: form.authType === 'basic' ? {
            username: form.username,
            password: form.password
          } : form.authType === 'bearer' ? {
            token: form.token
          } : form.authType === 'api-key' ? {
            header: form.apiKeyHeader,
            key: form.apiKey
          } : {}
        }
        break
      case 'jenkins':
        settings = {
          baseUrl: form.baseUrl
        }
        credentials = {
          username: form.username,
          apiToken: form.apiToken
        }
        break
      case 'ssh':
        settings = {
          host: form.host,
          port: form.port
        }
        credentials = {
          username: form.username,
          privateKey: form.privateKey,
          password: form.password
        }
        break
      case 'xldeploy':
        settings = {
          baseUrl: form.baseUrl
        }
        credentials = {
          username: form.username,
          password: form.password
        }
        break
      case 'googleplaystore':
        settings = {
          packageName: form.packageName
        }
        credentials = {
          serviceAccountKey: form.serviceAccountKey
        }
        break
    }
    
    if (config) {
      // Update existing connector
      const updateResponse = await $fetch(`/api/connectors/${config.id}`, {
        method: 'PUT',
        body: {
          name: connectorName,
          type: connectorId,
          settings,
          credentials
        }
      }) as any
      
      if (!updateResponse.success) {
        throw new Error(updateResponse.error || 'Failed to update connector')
      }
    } else {
      // Create new connector
      const createResponse = await $fetch('/api/connectors/config', {
        method: 'POST',
        body: {
          name: connectorName,
          type: connectorId,
          settings,
          credentials
        }
      }) as any
      
      if (!createResponse.success) {
        throw new Error(createResponse.error || 'Failed to create connector')
      }
    }
    
    // Reload configurations
    await loadConnectorConfigs()
    
    showToast && showToast(`${connectorName} configuration saved successfully!`, 'success')
  } catch (error) {
    console.error('Failed to save connector config:', error)
    showToast && showToast('Failed to save configuration', 'error')
  } finally {
    saving.value = false
  }
}
</script> 