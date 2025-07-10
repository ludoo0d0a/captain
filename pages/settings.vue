<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-white border-r flex flex-col">
      <div class="h-16 flex items-center justify-center font-bold text-xl border-b">Settings</div>
      <nav class="flex-1 p-4 space-y-2">
        <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 font-semibold mb-2" @click="goHome">
          <span class="i-heroicons-arrow-left mr-2" /> Back to Dashboard
        </button>
        <button
          v-for="c in connectors"
          :key="c.id"
          class="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200 font-semibold': selectedId === c.id }"
          @click="selectedId = c.id"
        >
          <span class="i-heroicons-cog-6-tooth mr-2" /> {{ getConnectorName(c) }}
        </button>
        <button
          class="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
          :class="{ 'bg-gray-200 font-semibold': selectedId === 'database' }"
          @click="selectedId = 'database'"
        >
          <span class="i-heroicons-database mr-2" /> Database Management
        </button>
      </nav>
    </aside>
    <main class="flex-1 flex flex-col items-center justify-center p-8">
      <div v-if="selectedConnector" class="bg-white rounded shadow p-8 w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-4">{{ getConnectorName(selectedConnector) }} Settings</h2>
        <form @submit.prevent="saveConfig(selectedConnector)">
          <div v-if="'baseUrl' in selectedConnector" class="mb-4">
            <label class="block text-xs font-semibold mb-1">Base URL</label>
            <input v-model="form.baseUrl" class="border rounded px-2 py-1 text-sm w-full" :placeholder="String(selectedConnector.baseUrl || 'https://...')" />
          </div>
          <div v-if="'username' in selectedConnector" class="mb-4">
            <label class="block text-xs font-semibold mb-1">Username</label>
            <input v-model="form.username" class="border rounded px-2 py-1 text-sm w-full" :placeholder="String(selectedConnector.username || 'Username')" />
          </div>
          <div v-if="'password' in selectedConnector" class="mb-4">
            <label class="block text-xs font-semibold mb-1">Password</label>
            <input v-model="form.password" type="password" class="border rounded px-2 py-1 text-sm w-full" :placeholder="String(selectedConnector.password || 'Password')" />
          </div>
          <button type="submit" class="mt-2 px-4 py-2 rounded text-sm font-semibold bg-blue-500 text-white">Save</button>
        </form>
      </div>
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
      <div v-else class="text-gray-400 text-lg">Select a connector to configure.</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useConnectorsStore } from '~/stores/connectors'
const connectorsStore = useConnectorsStore()
const connectors = connectorsStore.connectorConfigs
const selectedId = ref<string>(connectors[0]?.id || '')
const selectedConnector = computed<any>(() => connectors.find(c => c.id === selectedId.value))
const form = reactive<{ baseUrl: string; username: string; password: string }>({ baseUrl: '', username: '', password: '' })
const router = useRouter()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

// Database management state and methods
const dbLoading = ref(false)
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
watch(selectedConnector, (c) => {
  if (c) {
    form.baseUrl = typeof c.baseUrl === 'string' ? c.baseUrl : ''
    form.username = typeof c.username === 'string' ? c.username : ''
    form.password = typeof c.password === 'string' ? c.password : ''
  }
}, { immediate: true })
function saveConfig(connector: any) {
  connectorsStore.updateConfig(connector.id, {
    baseUrl: form.baseUrl,
    username: form.username,
    password: form.password,
  })
}
function getConnectorName(connector: any) {
  switch (connector.type) {
    case 'GitHubActionsConnector': return 'GitHub Actions'
    case 'JenkinsConnector': return 'Jenkins'
    case 'SSHConnector': return 'SSH'
    case 'HTTPConnector': return 'HTTP'
    case 'XLDeployConnector': return 'XL Deploy'
    default: return connector.id
  }
}
</script> 