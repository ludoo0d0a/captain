<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Environments Overview</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded shadow text-sm">
        <thead>
          <tr>
            <th class="px-4 py-2 text-left font-semibold">Application</th>
            <th v-for="env in environments" :key="env.id" class="px-4 py-2 text-left font-semibold">
              {{ env.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" class="border-t">
            <td class="px-4 py-2 font-medium">{{ app.name }}</td>
            <td v-for="env in environments" :key="env.id" class="px-4 py-2">
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
              </template>
              <template v-else>
                <span class="text-gray-300">—</span>
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
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '~/stores/applications'
import { useEnvironmentsStore } from '~/stores/environments'
import { useDeploymentsStore } from '~/stores/deployments'
import { useVersionsStore } from '~/stores/versions'

const { applications } = storeToRefs(useApplicationsStore())
const { environments } = storeToRefs(useEnvironmentsStore())
const { deployments } = storeToRefs(useDeploymentsStore())
const { versions } = storeToRefs(useVersionsStore())
const deploymentsStore = useDeploymentsStore()

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