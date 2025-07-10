<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Environments</h1>
      <div class="flex items-center gap-2">
        <button @click="refreshAll" :disabled="refreshingAll" class="p-2 rounded hover:bg-gray-100" title="Refresh all environments">
          <svg v-if="!refreshingAll" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 12l1.5 1.5m0 0l1.5-1.5m-1.5 1.5V6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V13.5" />
          </svg>
          <svg v-else class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
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
    <div class="flex flex-col mb-4 gap-2">
      <div class="flex items-center">
        <input v-model="filter" class="border rounded px-2 py-1 text-sm w-64" placeholder="Quick filter by name or tag" />
      </div>
      <div v-if="allTags.length" class="flex flex-wrap gap-2 mt-1">
        <span class="text-xs text-gray-400 mr-2">Suggestions:</span>
        <TagBadge v-for="tag in allTags" :key="tag" :tag="tag" class="cursor-pointer hover:opacity-80"
          :class="{ 'ring-2 ring-blue-400': filterTags.includes(tag.toLowerCase()) }"
          @click="toggleFilterTag(tag)" />
      </div>
    </div>
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Environments Overview</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left font-semibold">Application</th>
              <th v-for="env in filteredEnvs" :key="env.id" class="px-4 py-2 text-left font-semibold">
                <div class="flex items-center gap-2">
                  <span>{{ env.name }}</span>
                  <button @click="refreshEnv(env)" :disabled="refreshingEnvId === env.id" class="p-1 rounded hover:bg-gray-100" title="Refresh environment">
                    <svg v-if="refreshingEnvId !== env.id" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 12l1.5 1.5m0 0l1.5-1.5m-1.5 1.5V6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V13.5" />
                    </svg>
                    <svg v-else class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  </button>
                  <TagBadge v-for="tag in env.tags || []" :key="tag" :tag="tag" />
                  <span v-if="!env.tags || !env.tags.length" class="inline-block text-gray-300 text-xs">—</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app.id" class="border-t">
              <td class="px-4 py-2 font-medium">{{ app.name }}</td>
              <td v-for="env in filteredEnvs" :key="env.id" class="px-4 py-2">
                <template v-if="getDeployment(app.id, env.id)">
                  <span class="inline-flex items-center gap-2">
                    <span :class="[isSnapshot(getDeployment(app.id, env.id)?.versionId) ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800', 'px-2 py-1 rounded text-xs font-mono']">
                      {{ getVersionName(getDeployment(app.id, env.id)?.versionId) }}
                    </span>
                    <span :class="statusBadge(getDeployment(app.id, env.id)?.status)">
                      {{ getDeployment(app.id, env.id)?.status }}
                    </span>
                  </span>
                  <!-- Deploy icon -->
                  <NuxtLink :to="{ path: '/deploy', query: { appId: app.id, envId: env.id } }" title="Deploy new version">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 hover:text-blue-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </NuxtLink>
                  <!-- Promote icon (if promotable) -->
                  <template v-if="getPromotable(app.id, env.id).length">
                    <NuxtLink :to="{ path: '/promote', query: { appId: app.id, envId: env.id } }" title="Promote version from another environment">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 hover:text-green-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </NuxtLink>
                  </template>
                </template>
                <template v-else>
                  <span class="text-gray-300">—</span>
                  <!-- Deploy icon -->
                  <NuxtLink :to="{ path: '/deploy', query: { appId: app.id, envId: env.id } }" title="Deploy new version">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500 hover:text-blue-700 inline ml-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </NuxtLink>
                  <!-- Promote icon (if promotable) -->
                  <template v-if="getPromotable(app.id, env.id).length">
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
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '~/stores/applications'
import { useEnvironmentsStore } from '~/stores/environments'
import { useDeploymentsStore } from '~/stores/deployments'
import { useVersionsStore } from '~/stores/versions'
import { useConnectorsStore } from '~/stores/connectors'
import TagBadge from './TagBadge.vue'

const { applications } = storeToRefs(useApplicationsStore())
const { environments } = storeToRefs(useEnvironmentsStore())
const { deployments } = storeToRefs(useDeploymentsStore())
const { versions } = storeToRefs(useVersionsStore())
const connectorsStore = useConnectorsStore()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void
const refreshingAll = ref(false)
const refreshingEnvId = ref('')
async function refreshAll() {
  refreshingAll.value = true
  try {
    const results = await connectorsStore.refreshAll({})
    showToast && showToast('All connectors refreshed!', 'success')
    // Optionally handle results
  } catch (e) {
    showToast && showToast('Refresh failed', 'error')
  } finally {
    refreshingAll.value = false
  }
}
async function refreshEnv(env: any) {
  refreshingEnvId.value = env.id
  try {
    const results = await connectorsStore.refreshAll({ envId: env.id })
    showToast && showToast(`Refreshed for ${env.name}`, 'success')
  } catch (e) {
    showToast && showToast('Refresh failed', 'error')
  } finally {
    refreshingEnvId.value = ''
  }
}

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
  // Split filter into words (by comma or space)
  const words = filter.value.split(/[,\s]+/).map(w => w.trim().toLowerCase()).filter(Boolean)
  return environments.value.filter(e =>
    words.every(f =>
      e.name.toLowerCase().includes(f) ||
      (e.tags && e.tags.some(tag => tag.toLowerCase().includes(f)))
    )
  )
})

const deploySelections = ref<Record<string, string>>({})
const promoteSelections = ref<Record<string, string>>({})

function getDeployment(appId: string, envId: string) {
  return deployments.value.find(d => d.appId === appId && d.envId === envId)
}
function getVersionName(versionId?: string) {
  return versions.value.find(v => v.id === versionId)?.name || ''
}
function isSnapshot(versionId?: string) {
  return versions.value.find(v => v.id === versionId)?.isSnapshot
}
function statusBadge(status?: string) {
  if (status === 'deployed') return 'bg-green-200 text-green-800 px-2 py-1 rounded text-xs'
  if (status === 'failed') return 'bg-red-200 text-red-800 px-2 py-1 rounded text-xs'
  if (status === 'pending') return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs'
  return 'bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs'
}
function getAppVersions(appId: string) {
  return versions.value.filter(v => v.appId === appId)
}
function deployVersion(app: any, env: any, versionId: string) {
  if (!canDeploy(app, env, versionId)) {
    showToast && showToast('This version is already deployed in this environment.', 'error')
    return
  }
  const now = new Date().toISOString()
  const existing = getDeployment(app.id, env.id)
  if (existing) {
    deploymentsStore.updateDeployment(existing.id, { versionId, status: 'deployed', deployedAt: now })
  } else {
    deploymentsStore.addDeployment({ id: 'dep-' + Math.random().toString(36).slice(2), appId: app.id, envId: env.id, versionId, status: 'deployed', deployedAt: now })
  }
  deploySelections.value[app.id + '-' + env.id] = ''
  showToast && showToast('Version deployed successfully!', 'success')
}
function getPromotable(appId: string, targetEnvId: string) {
  // Find all deployments of this app in other envs, not yet in this env
  return deployments.value
    .filter(d => d.appId === appId && d.envId !== targetEnvId)
    .map(d => ({
      env: environments.value.find(e => e.id === d.envId),
      version: versions.value.find(v => v.id === d.versionId),
    }))
    .filter(item => item.env && item.version && !getDeployment(appId, targetEnvId))
}
function promoteVersion(app: any, env: any, versionId: string) {
  const version = getVersionById(versionId)
  if (!canPromote(app, env, version)) {
    showToast && showToast('Cannot promote this version to this environment.', 'error')
    return
  }
  const now = new Date().toISOString()
  deploymentsStore.addDeployment({ id: 'dep-' + Math.random().toString(36).slice(2), appId: app.id, envId: env.id, versionId, status: 'deployed', deployedAt: now })
  promoteSelections.value[app.id + '-' + env.id] = ''
  showToast && showToast('Version promoted successfully!', 'success')
}
function isProduction(env: any) {
  return env.name && env.name.toLowerCase().includes('prod')
}
function canDeploy(app: any, env: any, versionId: string) {
  const current = getDeployment(app.id, env.id)
  return !current || current.versionId !== versionId
}
function canPromote(app: any, env: any, version: any) {
  if (!version) return false
  if (isProduction(env) && version.isSnapshot) return false
  // Don't promote if already deployed
  const current = getDeployment(app.id, env.id)
  return !current || current.versionId !== version.id
}
function getVersionById(versionId: string) {
  return versions.value.find(v => v.id === versionId)
}
</script> 