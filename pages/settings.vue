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
      <div v-else class="text-gray-400 text-lg">Select a connector to configure.</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConnectorsStore } from '~/stores/connectors'
const connectorsStore = useConnectorsStore()
const connectors = connectorsStore.connectorConfigs
const selectedId = ref<string>(connectors[0]?.id || '')
const selectedConnector = computed<any>(() => connectors.find(c => c.id === selectedId.value))
const form = reactive<{ baseUrl: string; username: string; password: string }>({ baseUrl: '', username: '', password: '' })
const router = useRouter()
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