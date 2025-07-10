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
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Applications</h3>
        <ul class="divide-y mb-2">
          <li v-for="app in applications" :key="app.id" class="py-2 flex items-center gap-2">
            <input v-if="editingAppId === app.id" v-model="editAppName" class="border rounded px-2 py-1 text-sm flex-1" @keyup.enter="saveAppEdit(app)" />
            <span v-else class="flex-1">{{ app.name }}</span>
            <button v-if="editingAppId !== app.id" class="text-xs text-blue-600" @click="startAppEdit(app)">Rename</button>
            <button v-if="editingAppId === app.id" class="text-xs text-green-600" @click="saveAppEdit(app)">Save</button>
            <button v-if="editingAppId === app.id" class="text-xs text-gray-500" @click="cancelAppEdit">Cancel</button>
            <button class="text-xs text-red-600" @click="deleteApp(app.id)">Delete</button>
          </li>
        </ul>
        <div class="flex gap-2 mb-4">
          <input v-model="newAppName" class="border rounded px-2 py-1 text-sm flex-1" placeholder="New application name" @keyup.enter="addApp" />
          <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" @click="addApp">Add</button>
        </div>
        <h3 class="text-lg font-semibold mb-2">Environments</h3>
        <ul class="divide-y mb-2">
          <li v-for="env in environments" :key="env.id" class="py-2 flex items-center gap-2">
            <input v-if="editingEnvId === env.id" v-model="editEnvName" class="border rounded px-2 py-1 text-sm flex-1" @keyup.enter="saveEnvEdit(env)" />
            <span v-else class="flex-1">{{ env.name }}</span>
            <button v-if="editingEnvId !== env.id" class="text-xs text-blue-600" @click="startEnvEdit(env)">Rename</button>
            <button v-if="editingEnvId === env.id" class="text-xs text-green-600" @click="saveEnvEdit(env)">Save</button>
            <button v-if="editingEnvId === env.id" class="text-xs text-gray-500" @click="cancelEnvEdit">Cancel</button>
            <button class="text-xs text-red-600" @click="deleteEnv(env.id)">Delete</button>
          </li>
        </ul>
        <div class="flex gap-2 mb-4">
          <input v-model="newEnvName" class="border rounded px-2 py-1 text-sm flex-1" placeholder="New environment name" @keyup.enter="addEnv" />
          <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" @click="addEnv">Add</button>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Connectors</h3>
        <ul class="divide-y">
          <li v-for="connector in connectors" :key="connector.id" class="py-3 flex items-center justify-between">
            <div>
              <div class="font-medium">{{ connector.name }}</div>
              <div class="text-xs text-gray-400">{{ connector.type }}</div>
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
const applicationsStore = useApplicationsStore()
const environmentsStore = useEnvironmentsStore()
const applications = applicationsStore.applications
const environments = environmentsStore.environments

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

const connectors = reactive([
  { id: 'github', name: 'GitHub Actions', type: 'CI/CD', status: 'disconnected' },
  { id: 'jenkins', name: 'Jenkins', type: 'CI/CD', status: 'disconnected' },
  { id: 'ssh', name: 'Custom SSH', type: 'Server', status: 'disconnected' },
])
function toggleConnector(connector: any) {
  connector.status = connector.status === 'connected' ? 'disconnected' : 'connected'
}
</script> 