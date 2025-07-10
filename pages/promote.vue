<template>
  <div class="max-w-lg mx-auto mt-10 bg-white rounded shadow p-6">
    <h2 class="text-2xl font-bold mb-4">Promote Version</h2>
    <div v-if="app && env">
      <div class="mb-2"><span class="font-semibold">App:</span> {{ app.name }}</div>
      <div class="mb-2"><span class="font-semibold">Target Environment:</span> {{ env.name }}</div>
      <div class="mb-4 flex items-center gap-4">
        <label class="font-medium">Show Snapshots</label>
        <input type="checkbox" v-model="showSnapshots" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Select Version to Promote</label>
        <select v-model="selectedVersion" class="w-full border rounded px-3 py-2">
          <template v-for="item in filteredPromotable" :key="item.version?.id">
            <option v-if="item.env && item.version" :value="item.version.id">
              {{ item.version.name }} from {{ item.env.name }} <span v-if="item.version.isSnapshot">(snapshot)</span>
            </option>
          </template>
        </select>
      </div>
      <button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold" :disabled="!selectedVersion" @click="promote">
        Promote
      </button>
    </div>
    <div v-else class="text-red-500">Invalid app or environment.</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, inject } from 'vue'
import { useApplicationsStore } from '~/stores/applications'
import { useEnvironmentsStore } from '~/stores/environments'
import { useVersionsStore } from '~/stores/versions'
import { useDeploymentsStore } from '~/stores/deployments'

const route = useRoute()
const router = useRouter()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const appId = route.query.appId as string
const envId = route.query.envId as string
const applicationsStore = useApplicationsStore()
const environmentsStore = useEnvironmentsStore()
const versionsStore = useVersionsStore()
const deploymentsStore = useDeploymentsStore()

const app = computed(() => applicationsStore.applications.find(a => a.id === appId))
const env = computed(() => environmentsStore.environments.find(e => e.id === envId))
const showSnapshots = ref(false)
const selectedVersion = ref('')
const promotable = computed(() => {
  // Find all deployments of this app in other envs, not yet in this env
  return deploymentsStore.deployments
    .filter(d => d.appId === appId && d.envId !== envId)
    .map(d => ({
      env: environmentsStore.environments.find(e => e.id === d.envId),
      version: versionsStore.versions.find(v => v.id === d.versionId),
    }))
    .filter(item => item.env && item.version)
})
const filteredPromotable = computed(() => {
  return promotable.value.filter(item => item.version && (showSnapshots.value || !item.version.isSnapshot))
})
function promote() {
  if (!selectedVersion.value || !app.value || !env.value) return
  const now = new Date().toISOString()
  deploymentsStore.addDeployment({ id: 'dep-' + Math.random().toString(36).slice(2), appId, envId, versionId: selectedVersion.value, status: 'deployed', deployedAt: now })
  showToast && showToast('Version promoted successfully!', 'success')
  router.push('/')
}
</script> 