<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Applications</h1>
      <NuxtLink to="/manage-applications" class="ml-auto">
        <button class="p-2 rounded hover:bg-gray-100" title="Manage Applications">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </NuxtLink>
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
      <h2 class="text-2xl font-bold">Applications Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="app in filteredApps" :key="app.id" class="bg-white rounded shadow p-6 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <div class="text-lg font-semibold">{{ app.name }}</div>
            <div class="text-xs text-gray-400">{{ app.description }}</div>
          </div>
          <div class="mb-2">
            <TagBadge v-for="tag in app.tags || []" :key="tag" :tag="tag" class="mr-1" />
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
              <tr v-for="env in environments" :key="env.id" class="border-t">
                <td class="px-2 py-1">{{ env.name }}</td>
                <td class="px-2 py-1">
                  <template v-if="getDeployment(app.id, env.id)">
                    <span :class="[isSnapshot(getDeployment(app.id, env.id)?.versionId) ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800', 'px-2 py-1 rounded text-xs font-mono']">
                      {{ getVersionName(getDeployment(app.id, env.id)?.versionId) }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="text-gray-300">—</span>
                  </template>
                </td>
                <td class="px-2 py-1">
                  <template v-if="getDeployment(app.id, env.id)">
                    <span :class="statusBadge(getDeployment(app.id, env.id)?.status)">
                      {{ getDeployment(app.id, env.id)?.status }}
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
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
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '~/stores/applications'
import { useEnvironmentsStore } from '~/stores/environments'
import { useDeploymentsStore } from '~/stores/deployments'
import { useVersionsStore } from '~/stores/versions'
import TagBadge from './TagBadge.vue'

const { applications } = storeToRefs(useApplicationsStore())
const { environments } = storeToRefs(useEnvironmentsStore())
const { deployments } = storeToRefs(useDeploymentsStore())
const { versions } = storeToRefs(useVersionsStore())
const deploymentsStore = useDeploymentsStore()

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
  applications.value.forEach(a => (a.tags || []).forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})
const filteredApps = computed(() => {
  if (!filter.value.trim()) return applications.value
  // Split filter into words (by comma or space)
  const words = filter.value.split(/[,\s]+/).map(w => w.trim().toLowerCase()).filter(Boolean)
  return applications.value.filter(a =>
    words.every(f =>
      a.name.toLowerCase().includes(f) ||
      (a.tags && a.tags.some(tag => tag.toLowerCase().includes(f)))
    )
  )
})

const deploySelections = ref<Record<string, string>>({})
const promoteSelections = ref<Record<string, string>>({})
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

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