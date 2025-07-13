<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Connectors</h1>
            <p class="mt-2 text-sm text-gray-600">
              Manage your third-party integrations for applications, environments, and deployments.
            </p>
          </div>
          <button
            @click="$router.push('/connectors/new')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Connector
          </button>
        </div>
      </div>

      <!-- Connectors Grid -->
      <div class="px-4 sm:px-0">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="connector in connectors"
            :key="connector.name"
            class="bg-white overflow-hidden shadow rounded-lg"
          >
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <component :is="getConnectorIcon(connector.type)" class="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">{{ connector.name }}</h3>
                    <p class="text-sm text-gray-500">{{ getConnectorTypeLabel(connector.type) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      connector.connected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ connector.connected ? 'Connected' : 'Disconnected' }}
                  </span>
                </div>
              </div>

              <div class="mt-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Last sync:</span>
                  <span class="text-gray-900">{{ formatDate(connector.lastSync) }}</span>
                </div>
              </div>

              <div class="mt-6 flex space-x-3">
                <button
                  @click="testConnection(connector.name)"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Test
                </button>
                <button
                  @click="$router.push(`/connectors/${connector.name}/edit`)"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button
                  @click="deleteConnector(connector.name)"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="connectors.length === 0" class="text-center py-12">
          <div class="mx-auto h-12 w-12 text-gray-400">
            <LinkIcon class="h-12 w-12" />
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No connectors</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by adding your first connector to integrate with external services.
          </p>
          <div class="mt-6">
            <button
              @click="$router.push('/connectors/new')"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Connector
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, LinkIcon } from '@heroicons/vue/24/outline'

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

interface Connector {
  name: string
  type: string
  connected: boolean
  lastSync: string
  settings?: Record<string, any>
  credentials?: Record<string, any>
}

const connectors = ref<Connector[]>([])

const connectorTypes = {
  github: { label: 'GitHub', icon: CodeBracketIcon },
  gitlab: { label: 'GitLab', icon: CommandLineIcon },
  docker: { label: 'Docker', icon: CubeIcon },
  kubernetes: { label: 'Kubernetes', icon: CogIcon },
  githubactions: { label: 'GitHub Actions', icon: PlayIcon },
  http: { label: 'HTTP API', icon: GlobeAltIcon },
  jenkins: { label: 'Jenkins', icon: WrenchScrewdriverIcon },
  ssh: { label: 'SSH', icon: ComputerDesktopIcon },
  xldeploy: { label: 'XL Deploy', icon: ServerIcon },
  googleplaystore: { label: 'Google Play Store', icon: DevicePhoneMobileIcon }
}

onMounted(async () => {
  await loadConnectors()
})

async function loadConnectors() {
  try {
    const response = await $fetch('/api/connectors')
    connectors.value = response.connectors || []
  } catch (error) {
    console.error('Failed to load connectors:', error)
  }
}

function getConnectorIcon(type: string) {
  return connectorTypes[type as keyof typeof connectorTypes]?.icon || LinkIcon
}

function getConnectorTypeLabel(type: string) {
  return connectorTypes[type as keyof typeof connectorTypes]?.label || type
}

function formatDate(dateString: string) {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString()
}

async function testConnection(connectorName: string) {
  try {
    const response = await $fetch(`/api/connectors/${connectorName}/test`, {
      method: 'POST'
    })
    
    if (response.success) {
      // Update connector status
      const connector = connectors.value.find(c => c.name === connectorName)
      if (connector) {
        connector.connected = true
        connector.lastSync = new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Connection test failed:', error)
  }
}

async function deleteConnector(connectorName: string) {
  if (!confirm('Are you sure you want to delete this connector?')) return

  try {
    await $fetch(`/api/connectors/${connectorName}`, {
      method: 'DELETE'
    })
    await loadConnectors()
  } catch (error) {
    console.error('Failed to delete connector:', error)
  }
}
</script> 