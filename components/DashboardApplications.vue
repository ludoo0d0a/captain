<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Applications</h1>
      <div class="flex items-center gap-2">
        <button @click="refreshAll" :disabled="refreshingAll" class="p-2 rounded hover:bg-gray-100" title="Refresh all applications">
          <svg v-if="!refreshingAll" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </button>
        <NuxtLink to="/manage-applications">
          <button class="p-2 rounded hover:bg-gray-100" title="Manage Applications">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
        <QuickFilter
          v-model="filter"
          :all-tags="allTags"
          :selected-tags="selectedTags"
          @update:selectedTags="val => selectedTags = val"
          placeholder="Filter by application name or tags..."
          class="w-full max-w-xl"
        />
      </div>

      <div class="space-y-6">
        <div v-for="app in filteredApps" :key="app.id" class="bg-white rounded shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="text-lg font-semibold">{{ app.name }}</div>
            <div class="flex items-center gap-2">
              <button @click="refreshApplication(app.id)" :disabled="refreshingAppId === app.id" class="p-1 rounded hover:bg-gray-100" title="Refresh application">
                <svg v-if="refreshingAppId !== app.id" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </button>
              <NuxtLink to="/manage-applications">
                <button class="p-1 rounded hover:bg-gray-100" title="Manage Applications">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </NuxtLink>
            </div>
          </div>
          <div class="mb-2">
            <TagBadge v-for="tag in app.tags" :key="tag" :tag="tag" class="mr-1" />
            <span v-if="!app.tags || !app.tags.length" class="inline-block text-gray-300 text-xs">—</span>
          </div>
          <table class="w-full text-sm mt-2">
            <thead>
              <tr>
                <th class="text-left px-2 py-1 font-semibold">Environment</th>
                <th class="text-left px-2 py-1 font-semibold">Version</th>
                <th class="text-left px-2 py-1 font-semibold">Status</th>
                <th class="text-left px-2 py-1 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="env in getAllEnvironments()" :key="env.id" class="border-t">
                <td class="px-2 py-1">{{ env.name }}</td>
                <td class="px-2 py-1">
                  <template v-if="getDeployment(app, env.id)">
                    <span :class="[getDeployment(app, env.id)?.version?.isSnapshot ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800', 'px-2 py-1 rounded text-xs font-mono']">
                      {{ getDeployment(app, env.id)?.version?.name || 'Unknown' }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="text-gray-300">—</span>
                  </template>
                </td>
                <td class="px-2 py-1">
                  <template v-if="getDeployment(app, env.id)">
                    <span :class="statusBadge(getDeployment(app, env.id)?.status)">
                      {{ getDeployment(app, env.id)?.status }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="text-gray-300">—</span>
                  </template>
                </td>
                <td class="px-2 py-1">
                  <!-- Deploy icon -->
                  <NuxtLink :to="{ path: '/deploy', query: { appId: app.id, envId: env.id } }" title="Deploy new version">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 hover:text-blue-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </NuxtLink>
                  <!-- Promote icon (if promotable) -->
                  <template v-if="getPromotable(app, env.id).length">
                    <NuxtLink :to="{ path: '/promote', query: { appId: app.id, envId: env.id } }" title="Promote version from another environment">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 hover:text-green-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </NuxtLink>
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
import QuickFilter from './QuickFilter.vue'

interface AggregatedApplication {
  id: string;
  name: string;
  tags: string[];
  environments: Array<{
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

const applications = ref<AggregatedApplication[]>([])
const loading = ref(false)
const connectorsStore = useConnectorsStore()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void
const refreshingAll = ref(false)
const refreshingAppId = ref('')
const connectorInstances = computed(() => connectorsStore.connectorInstances.filter((c: any) => c !== null))

// Filter state
const filter = ref('')
const selectedTags = ref<string[]>([])

// Load aggregated view data
async function loadApplicationsView() {
  loading.value = true
  try {
    const data = await $fetch('/api/view?type=applications') as AggregatedApplication[]
    applications.value = data
  } catch (error) {
    console.error('Failed to load applications view:', error)
    showToast && showToast('Failed to load applications data', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadApplicationsView()
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
    await loadApplicationsView()
    showToast && showToast('All applications refreshed successfully!', 'success')
  } catch (error) {
    console.error('Failed to refresh all:', error)
    showToast && showToast('Failed to refresh applications', 'error')
  } finally {
    refreshingAll.value = false
  }
}

async function refreshApplication(appId: string) {
  refreshingAppId.value = appId
  try {
    // Refresh connectors for this application
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
    await loadApplicationsView()
    showToast && showToast('Application refreshed successfully!', 'success')
  } catch (error) {
    console.error('Failed to refresh application:', error)
    showToast && showToast('Failed to refresh application', 'error')
  } finally {
    refreshingAppId.value = ''
  }
}

// Filter applications based on tags
const allTags = computed(() => {
  const tags = new Set<string>()
  applications.value.forEach(a => (a.tags || []).forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})
const filteredApps = computed(() => {
  const f = filter.value.trim().toLowerCase()
  return applications.value.filter(app => {
    const tags = app.tags || []
    const matchesText = !f || app.name.toLowerCase().includes(f) || tags.some(tag => tag.toLowerCase().includes(f))
    const matchesTags = selectedTags.value.length === 0 || selectedTags.value.every(tag => tags.includes(tag))
    return matchesText && matchesTags
  })
})

// Helper functions for deployment data
function getDeployment(app: AggregatedApplication, envId: string) {
  const env = app.environments.find(env => env.id === envId)
  return env?.deployment || null
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

function getPromotable(app: AggregatedApplication, envId: string) {
  // This would need to be implemented based on the aggregated data
  // For now, return empty array
  return []
}

function getAllEnvironments() {
  const allEnvs: { id: string; name: string; tags: string[] }[] = [];
  applications.value.forEach(app => {
    app.environments.forEach(env => {
      if (!allEnvs.some(e => e.id === env.id)) {
        allEnvs.push(env);
      }
    });
  });
  return allEnvs;
}
</script> 