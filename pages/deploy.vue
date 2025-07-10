<template>
  <div class="max-w-lg mx-auto mt-10 bg-white rounded shadow p-6">
    <h2 class="text-2xl font-bold mb-4">Deploy Version</h2>
    <div v-if="app && env">
      <div class="mb-2"><span class="font-semibold">App:</span> {{ app.name }}</div>
      <div class="mb-2"><span class="font-semibold">Environment:</span> {{ env.name }}</div>
      <div class="mb-4 flex items-center gap-4">
        <label class="font-medium">Show Snapshots</label>
        <input type="checkbox" v-model="showSnapshots" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Select Version</label>
        <select v-model="selectedVersion" class="w-full border rounded px-3 py-2">
          <option v-for="v in filteredVersions" :key="v.id" :value="v.id">
            {{ v.name }} <span v-if="v.isSnapshot">(snapshot)</span>
          </option>
        </select>
      </div>
      <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold" :disabled="!selectedVersion" @click="deploy">
        Deploy
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
const filteredVersions = computed(() => {
  return versionsStore.versions.filter(v => v.appId === appId && (showSnapshots.value || !v.isSnapshot))
})
function deploy() {
  if (!selectedVersion.value || !app.value || !env.value) return
  const now = new Date().toISOString()
  const existing = deploymentsStore.deployments.find(d => d.appId === appId && d.envId === envId)
  if (existing) {
    deploymentsStore.updateDeployment(existing.id, { versionId: selectedVersion.value, status: 'deployed', deployedAt: now })
  } else {
    deploymentsStore.addDeployment({ id: 'dep-' + Math.random().toString(36).slice(2), appId, envId, versionId: selectedVersion.value, status: 'deployed', deployedAt: now })
  }
  showToast && showToast('Version deployed successfully!', 'success')
  router.push('/')
}
</script> 