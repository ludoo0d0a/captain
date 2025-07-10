<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Environments</h1>
      <div class="flex items-center gap-2">
        <button @click="refreshAll" :disabled="refreshingAll" class="p-2 rounded hover:bg-gray-100" title="Refresh all environments">
          <svg v-if="!refreshingAll" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </button>
        <NuxtLink to="/manage-environments">
          <button class="p-2 rounded hover:bg-gray-100" title="Manage Environments">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <div v-else>
      <div class="flex items-center mb-4">
        <input v-model="filter" class="border rounded px-3 py-2 text-sm w-64" placeholder="Filter by environment name or tags..." />
      </div>

      <div class="bg-white rounded shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                <th v-for="env in filteredEnvs" :key="env.id" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center gap-2">
                    <span>{{ env.name }}</span>
                    <button @click="refreshEnvironment(env.id)" :disabled="refreshingEnvId === env.id" class="p-1 rounded hover:bg-gray-100" title="Refresh environment">
                      <svg v-if="refreshingEnvId !== env.id" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <svg v-else class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-1">
                    <TagBadge v-for="tag in env.tags" :key="tag" :tag="tag" class="mr-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in getAllApplications()" :key="app.id" class="border-t">
                <td class="px-4 py-2 font-medium">{{ app.name }}</td>
                <td v-for="env in filteredEnvs" :key="env.id" class="px-4 py-2">
                  <template v-if="getDeployment(env, app.id)">
                    <span class="inline-flex items-center gap-2">
                      <span :class="[getDeployment(env, app.id)?.version?.isSnapshot ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800', 'px-2 py-1 rounded text-xs font-mono']">
                        {{ getDeployment(env, app.id)?.version?.name || 'Unknown' }}
                      </span>
                      <span :class="statusBadge(getDeployment(env, app.id)?.status)">
                        {{ getDeployment(env, app.id)?.status }}
                      </span>
                    </span>
                    <!-- Deploy icon -->
                    <NuxtLink :to="{ path: '/deploy', query: { appId: app.id, envId: env.id } }" title="Deploy new version">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 hover:text-blue-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                    </NuxtLink>
                    <!-- Promote icon (if promotable) -->
                    <template v-if="getPromotable(env, app.id).length">
                      <NuxtLink :to="{ path: '/promote', query: { appId: app.id, envId: env.id } }" title="Promote version from another environment">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 hover:text-green-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </NuxtLink>
                    </template>
                  </template>
                  <template v-else>
                    <span class="text-gray-300">—</span>
                    <!-- Deploy icon for empty deployments -->
                    <NuxtLink :to="{ path: '/deploy', query: { appId: app.id, envId: env.id } }" title="Deploy new version">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 hover:text-blue-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                    </NuxtLink>
                    <!-- Promote icon (if promotable) -->
                    <template v-if="getPromotable(env, app.id).length">
                      <NuxtLink :to="{ path: '/promote', query: { appId: app.id, envId: env.id } }" title="Promote version from another environment">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 hover:text-green-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </NuxtLink>
                    </template>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue'
import { useConnectorsStore } from '~/stores/connectors'
import TagBadge from './TagBadge.vue'

interface AggregatedEnvironment {
  id: string;
  name: string;
  tags: string[];
  applications: Array<{
    id: string;
    name: string;
    tags: string[];
    deployment: {
      id: string;
      status: string;
      deployedAt: string;
      version: {
        id: string;
        name: string;
        isSnapshot: boolean;
        createdAt: string;
      };
    } | null;
  }>;
}

const environments = ref<AggregatedEnvironment[]>([])
const loading = ref(false)
const connectorsStore = useConnectorsStore()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void
const refreshingAll = ref(false)
const refreshingEnvId = ref('')
const connectorInstances = computed(() => connectorsStore.connectorInstances.filter((c: any) => c !== null))

// Load aggregated view data
async function loadEnvironmentsView() {
  loading.value = true
  try {
    const data = await $fetch('/api/view?type=environments') as AggregatedEnvironment[]
    environments.value = data
  } catch (error) {
    console.error('Failed to load environments view:', error)
    showToast && showToast('Failed to load environments data', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEnvironmentsView()
})

async function refreshAll() {
  refreshingAll.value = true
  try {
    // Refresh connectors first
    const refreshPromises = connectorInstances.value.map(async (connector: any) => {
      if (connector && typeof connector.refresh === 'function') {
        try {
          await connector.refresh()
        } catch (error) {
          console.error(`Failed to refresh connector ${connector.constructor.name}:`, error)
        }
      }
    })
    await Promise.all(refreshPromises)
    
    // Then reload the view
    await loadEnvironmentsView()
    showToast && showToast('All environments refreshed successfully!', 'success')
  } catch (error) {
    console.error('Failed to refresh all:', error)
    showToast && showToast('Failed to refresh environments', 'error')
  } finally {
    refreshingAll.value = false
  }
}

async function refreshEnvironment(envId: string) {
  refreshingEnvId.value = envId
  try {
    // Refresh connectors for this environment
    const refreshPromises = connectorInstances.value.map(async (connector: any) => {
      if (connector && typeof connector.refresh === 'function') {
        try {
          await connector.refresh()
        } catch (error) {
          console.error(`Failed to refresh connector ${connector.constructor.name}:`, error)
        }
      }
    })
    await Promise.all(refreshPromises)
    
    // Reload the view
    await loadEnvironmentsView()
    showToast && showToast('Environment refreshed successfully!', 'success')
  } catch (error) {
    console.error('Failed to refresh environment:', error)
    showToast && showToast('Failed to refresh environment', 'error')
  } finally {
    refreshingEnvId.value = ''
  }
}

// Filter environments based on tags
const filter = ref('')
const filterTags = computed(() => {
  return filter.value.split(/[,\s]+/).map(w => w.trim().toLowerCase()).filter(Boolean)
})
function toggleFilterTag(tag: string) {
  const tags = filterTags.value.slice()
  const idx = tags.indexOf(tag.toLowerCase())
  if (idx === -1) {
    tags.push(tag.toLowerCase())
  } else {
    tags.splice(idx, 1)
  }
  filter.value = tags.join(', ')
}
const allTags = computed(() => {
  const tags = new Set<string>()
  environments.value.forEach(e => (e.tags || []).forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})
const filteredEnvs = computed(() => {
  if (!filter.value.trim()) return environments.value
  const words = filter.value.split(/[,\s]+/).map(w => w.trim().toLowerCase()).filter(Boolean)
  return environments.value.filter(env =>
    words.every(f =>
      env.name.toLowerCase().includes(f) ||
      (env.tags && env.tags.some(tag => tag.toLowerCase().includes(f)))
    )
  )
})

// Helper functions for deployment data
function getDeployment(env: AggregatedEnvironment, appId: string) {
  const app = env.applications.find(app => app.id === appId)
  return app?.deployment || null
}

function getVersionName(versionId?: string) {
  // This would need to be updated if we want to show version names
  // For now, we'll use the version ID as a fallback
  return versionId || ''
}

function isSnapshot(versionId?: string) {
  // This would need to be updated if we want to check snapshot status
  // For now, we'll return false as a fallback
  return false
}

function statusBadge(status?: string) {
  if (status === 'deployed') return 'bg-green-200 text-green-800 px-2 py-1 rounded text-xs'
  if (status === 'failed') return 'bg-red-200 text-red-800 px-2 py-1 rounded text-xs'
  if (status === 'pending') return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs'
  return 'bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs'
}

function getPromotable(env: AggregatedEnvironment, appId: string) {
  // This would need to be implemented based on the aggregated data
  // For now, return empty array
  return []
}

function getAllApplications() {
  const allApps: { id: string; name: string; tags: string[] }[] = [];
  environments.value.forEach(env => {
    env.applications.forEach(app => {
      if (!allApps.some(a => a.id === app.id)) {
        allApps.push(app);
      }
    });
  });
  return allApps;
}
</script> 