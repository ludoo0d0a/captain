<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none" @click="$emit('close')" aria-label="Close settings">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
          <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="#f3f4f6" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 9l-6 6m0-6l6 6" />
        </svg>
      </button>
      <h2 class="text-xl font-bold mb-4">Settings</h2>
      <div>
        <h3 class="text-lg font-semibold mb-2">Connectors</h3>
        <ul class="divide-y">
          <li v-for="connector in connectors" :key="connector.id" class="py-3 flex items-center justify-between">
            <div>
              <div class="font-medium">{{ connector.name }}</div>
              <div class="text-xs text-gray-400">{{ connector.type }}</div>
              <div v-if="connector.id === 'http'" class="mt-2 space-y-2">
                <label class="block text-xs font-semibold">Base URL
                  <input v-model="httpUrl" class="border rounded px-2 py-1 text-xs w-64 mt-1" placeholder="https://api.example.com" />
                </label>
                <label class="block text-xs font-semibold">Username
                  <input v-model="httpUser" class="border rounded px-2 py-1 text-xs w-64 mt-1" placeholder="Username" />
                </label>
                <label class="block text-xs font-semibold">Password
                  <input v-model="httpPass" type="password" class="border rounded px-2 py-1 text-xs w-64 mt-1" placeholder="Password" />
                </label>
                <button class="mt-1 px-3 py-1 rounded text-xs font-semibold bg-blue-500 text-white" @click="saveHttpConfig">Save</button>
              </div>
              <div v-if="connector.id === 'xldeploy'" class="mt-2 space-y-2">
                <label class="block text-xs font-semibold">Base URL
                  <input v-model="xlUrl" class="border rounded px-2 py-1 text-xs w-64 mt-1" placeholder="https://xldeploy.example.com" />
                </label>
                <label class="block text-xs font-semibold">Username
                  <input v-model="xlUser" class="border rounded px-2 py-1 text-xs w-64 mt-1" placeholder="Username" />
                </label>
                <label class="block text-xs font-semibold">Password
                  <input v-model="xlPass" type="password" class="border rounded px-2 py-1 text-xs w-64 mt-1" placeholder="Password" />
                </label>
                <button class="mt-1 px-3 py-1 rounded text-xs font-semibold bg-blue-500 text-white" @click="saveXLConfig">Save</button>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="connector.status === 'connected'" class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-700">
                <span class="i-heroicons-check-circle w-4 h-4 text-green-500" /> Connected
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-600">
                <span class="i-heroicons-x-circle w-4 h-4 text-red-500" /> Disconnected
              </span>
              <button class="ml-2 px-2 py-1 rounded text-xs font-semibold border" @click="toggleConnector(connector)">
                {{ connector.status === 'connected' ? 'Disconnect' : 'Connect' }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useApplicationsStore } from '~/stores/applications'
import { useEnvironmentsStore } from '~/stores/environments'
import { useConnectorsStore } from '~/stores/connectors'
const applicationsStore = useApplicationsStore()
const environmentsStore = useEnvironmentsStore()
const connectorsStore = useConnectorsStore()
const applications = applicationsStore.applications
const environments = environmentsStore.environments
const connectors = connectorsStore.connectors

const newAppName = ref('')
const editingAppId = ref('')
const editAppName = ref('')
function addApp() {
  if (!newAppName.value.trim()) return
  applicationsStore.addApplication({ id: 'app-' + Math.random().toString(36).slice(2), name: newAppName.value.trim(), versions: [] })
  newAppName.value = ''
}
function startAppEdit(app: any) {
  editingAppId.value = app.id
  editAppName.value = app.name
}
function saveAppEdit(app: any) {
  if (!editAppName.value.trim()) return
  applicationsStore.updateApplication(app.id, { name: editAppName.value.trim() })
  editingAppId.value = ''
  editAppName.value = ''
}
function cancelAppEdit() {
  editingAppId.value = ''
  editAppName.value = ''
}
function deleteApp(id: string) {
  applicationsStore.removeApplication(id)
}

const newEnvName = ref('')
const editingEnvId = ref('')
const editEnvName = ref('')
function addEnv() {
  if (!newEnvName.value.trim()) return
  environmentsStore.addEnvironment({ id: 'env-' + Math.random().toString(36).slice(2), name: newEnvName.value.trim() })
  newEnvName.value = ''
}
function startEnvEdit(env: any) {
  editingEnvId.value = env.id
  editEnvName.value = env.name
}
function saveEnvEdit(env: any) {
  if (!editEnvName.value.trim()) return
  environmentsStore.updateEnvironment(env.id, { name: editEnvName.value.trim() })
  editingEnvId.value = ''
  editEnvName.value = ''
}
function cancelEnvEdit() {
  editingEnvId.value = ''
  editEnvName.value = ''
}
function deleteEnv(id: string) {
  environmentsStore.removeEnvironment(id)
}

// HTTP Connector config state
const httpConnector = connectors.find(c => c.id === 'http')
const httpUrl = ref(httpConnector && 'baseUrl' in httpConnector ? httpConnector.baseUrl : '')
const httpUser = ref(httpConnector && 'username' in httpConnector ? httpConnector.username : '')
const httpPass = ref(httpConnector && 'password' in httpConnector ? httpConnector.password : '')
function saveHttpConfig() {
  const c = connectors.find(c => c.id === 'http')
  if (c && 'baseUrl' in c && 'username' in c && 'password' in c) {
    c.baseUrl = httpUrl.value
    c.username = httpUser.value
    c.password = httpPass.value
  }
}

const xlConnector = connectors.find(c => c.id === 'xldeploy')
const xlUrl = ref(xlConnector && 'baseUrl' in xlConnector ? xlConnector.baseUrl : '')
const xlUser = ref(xlConnector && 'username' in xlConnector ? xlConnector.username : '')
const xlPass = ref(xlConnector && 'password' in xlConnector ? xlConnector.password : '')
function saveXLConfig() {
  const c = connectors.find(c => c.id === 'xldeploy')
  if (c && 'baseUrl' in c && 'username' in c && 'password' in c) {
    c.baseUrl = xlUrl.value
    c.username = xlUser.value
    c.password = xlPass.value
  }
}

function toggleConnector(connector: any) {
  connector.status = connector.status === 'connected' ? 'disconnected' : 'connected'
}
</script> 