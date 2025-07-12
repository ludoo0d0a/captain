<template>
  <div class="min-h-screen bg-gray-50">

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <button
              @click="$router.push('/applications')"
              class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon class="h-4 w-4 mr-2" />
              Back to Applications
            </button>
            <h1 class="text-3xl font-bold text-gray-900">Edit Application</h1>
            <p class="mt-2 text-sm text-gray-600">
              Configure versions for {{ application?.name || 'Loading...' }} across environments.
            </p>
            <p class="mt-1 text-xs text-gray-400">Application ID: {{ applicationId }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="loading">Refreshing...</span>
              <span v-else>Refresh</span>
            </button>
            <button
              @click="saveChanges"
              :disabled="saving"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-gray-600">Loading application data...</p>
        </div>
      </div>

      <div v-else-if="application" class="px-4 sm:px-0">
        <!-- Application Info -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ application.name }}</h2>
              <div class="mt-2">
                <TagBadge v-for="tag in application.tags" :key="tag" :tag="tag" class="mr-1" />
                <span v-if="!application.tags || !application.tags.length" class="text-gray-400 text-sm">No tags</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Application ID</p>
              <p class="text-sm font-mono text-gray-900">{{ application.id }}</p>
            </div>
          </div>
        </div>

        <!-- Environment Versions -->
        <div class="space-y-6">
          <div class="px-6 py-4 border-b border-gray-200 bg-white shadow rounded-lg">
            <h3 class="text-lg font-medium text-gray-900">Environment Versions</h3>
            <p class="mt-1 text-sm text-gray-600">
              Select which version to deploy in each environment.
            </p>
          </div>
          
          <div v-if="environments.length === 0" class="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No environments found. Please create environments first.
          </div>
          
          <div v-else class="space-y-6">
            <div v-for="env in environments" :key="env.id" class="bg-white shadow rounded-lg p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h4 class="text-xl font-semibold text-gray-900">{{ env.name }}</h4>
                  <div class="mt-2">
                    <TagBadge v-for="tag in env.tags" :key="tag" :tag="tag" class="mr-1" />
                    <span v-if="!env.tags || !env.tags.length" class="text-gray-400 text-sm">No tags</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <NuxtLink 
                    :to="{ path: '/deploy', query: { appId: application.id, envId: env.id } }"
                    class="px-4 py-2 text-sm border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Deploy New
                  </NuxtLink>
                </div>
              </div>

              <!-- Current Deployment -->
              <div class="mb-6">
                <h5 class="text-sm font-medium text-gray-700 mb-3">Current Deployment</h5>
                <div v-if="getCurrentDeployment(env.id)" class="bg-gray-50 rounded-lg p-4 border">
                  <div class="flex items-center justify-between">
                    <div>
                      <span :class="[getCurrentDeployment(env.id)?.version?.isSnapshot ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800', 'px-2 py-1 rounded text-xs font-mono']">
                        {{ getCurrentDeployment(env.id)?.version?.name || 'Unknown' }}
                      </span>
                      <span :class="statusBadge(getCurrentDeployment(env.id)?.status)" class="ml-2">
                        {{ getCurrentDeployment(env.id)?.status }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500">
                      Deployed {{ formatDate(getCurrentDeployment(env.id)?.deployedAt) }}
                    </div>
                  </div>
                </div>
                <div v-else class="bg-gray-50 rounded-lg p-4 text-center text-gray-500 border">
                  No deployment found
                </div>
              </div>

              <!-- Version Selection -->
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-3">Available Versions</h5>
                <div v-if="getAvailableVersions().length === 0" class="text-center text-gray-500 py-6 bg-gray-50 rounded-lg border">
                  No versions found for this application.
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    v-for="version in getAvailableVersions()" 
                    :key="version.id"
                    class="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                    :class="[
                      selectedVersions[env.id] === version.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                    @click="selectVersion(env.id, version.id)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <span :class="[version.isSnapshot ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800', 'px-2 py-1 rounded text-xs font-mono']">
                          {{ version.name }}
                        </span>
                        <p class="text-xs text-gray-500 mt-2">
                          {{ formatDate(version.createdAt) }}
                        </p>
                      </div>
                      <div v-if="selectedVersions[env.id] === version.id" class="text-blue-600 ml-3">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="px-4 sm:px-0">
        <div class="bg-white shadow rounded-lg p-6 text-center">
          <p class="text-gray-500 mb-4">Application not found</p>
          <button 
            @click="loadData"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Loading
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import TagBadge from '~/components/TagBadge.vue'

const route = useRoute()
const router = useRouter()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const applicationId = route.params.id as string
const loading = ref(false)
const saving = ref(false)

const application = ref<any>(null)
const environments = ref<any[]>([])
const versions = ref<any[]>([])
const deployments = ref<any[]>([])
const selectedVersions = ref<Record<string, string>>({})

onMounted(() => {
  console.log('🚀 Edit page mounted for application:', applicationId)
  console.log('📍 Current route:', route.path)
  console.log('🔍 Route params:', route.params)
  loadData()
})

async function loadData() {
  loading.value = true
  console.log('Loading data for application:', applicationId)
  try {
    // Load application
    const apps = await $fetch('/api/applications')
    console.log('Loaded applications:', apps)
    application.value = apps.find((app: any) => app.id === applicationId)
    console.log('Found application:', application.value)
    
    if (!application.value) {
      console.log('Application not found')
      showToast && showToast('Application not found', 'error')
      return
    }

    // Load environments
    environments.value = await $fetch('/api/environments')
    console.log('Loaded environments:', environments.value)
    
    // Load versions for this application
    const allVersions = await $fetch('/api/versions')
    console.log('Loaded all versions:', allVersions)
    versions.value = allVersions.filter((v: any) => v.appId === applicationId)
    console.log('Filtered versions for app:', versions.value)
    
    // Load deployments
    const allDeployments = await $fetch('/api/deployments')
    console.log('Loaded all deployments:', allDeployments)
    deployments.value = allDeployments.filter((d: any) => d.appId === applicationId)
    console.log('Filtered deployments for app:', deployments.value)
    
    // Initialize selected versions with current deployments
    environments.value.forEach(env => {
      const deployment = getCurrentDeployment(env.id)
      if (deployment) {
        selectedVersions.value[env.id] = deployment.versionId
      }
    })
    console.log('Initialized selected versions:', selectedVersions.value)
  } catch (error) {
    console.error('Failed to load data:', error)
    showToast && showToast('Failed to load application data', 'error')
  } finally {
    loading.value = false
  }
}

async function refreshData() {
  await loadData()
  showToast('Data refreshed successfully', 'success')
}

async function saveChanges() {
  saving.value = true
  try {
    // Create new deployments for selected versions
    for (const [envId, versionId] of Object.entries(selectedVersions.value)) {
      const currentDeployment = getCurrentDeployment(envId)
      
      // Only create new deployment if version changed
      if (!currentDeployment || currentDeployment.versionId !== versionId) {
        await $fetch('/api/deployments', {
          method: 'POST',
          body: {
            id: `deployment-${Date.now()}-${Math.random()}`,
            appId: applicationId,
            envId,
            versionId,
            status: 'pending',
            deployedAt: new Date().toISOString()
          }
        })
      }
    }
    
    showToast('Changes saved successfully', 'success')
    await loadData() // Reload to show updated deployments
  } catch (error) {
    console.error('Failed to save changes:', error)
    showToast('Failed to save changes', 'error')
  } finally {
    saving.value = false
  }
}

function getCurrentDeployment(envId: string) {
  return deployments.value.find(d => d.envId === envId)
}

function getAvailableVersions() {
  return versions.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function selectVersion(envId: string, versionId: string) {
  selectedVersions.value[envId] = versionId
}

function statusBadge(status?: string) {
  if (status === 'deployed') return 'bg-green-200 text-green-800 px-2 py-1 rounded text-xs'
  if (status === 'failed') return 'bg-red-200 text-red-800 px-2 py-1 rounded text-xs'
  if (status === 'pending') return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs'
  return 'bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs'
}

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}
</script> 