<template>
  <div class="w-full min-h-screen bg-gray-50 p-8">
    <div class="flex items-center mb-8">
      <NuxtLink to="/" class="mr-4">
        <button class="p-2 rounded hover:bg-gray-100" title="Back to Environments">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </NuxtLink>
      <h1 class="text-3xl font-bold">Manage Environments</h1>
    </div>
    <div class="bg-white rounded shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Environments</h3>
      <ul class="divide-y mb-4">
        <li v-for="env in environments" :key="env.id" class="py-3 flex items-center gap-2">
          <input v-if="editingEnvId === env.id" v-model="editEnvName" class="border rounded px-2 py-1 text-sm flex-1" @keyup.enter="saveEnvEdit(env)" />
          <span v-else class="flex-1">{{ env.name }}</span>
          <button v-if="editingEnvId !== env.id" class="text-xs text-blue-600" @click="startEnvEdit(env)">Rename</button>
          <button v-if="editingEnvId === env.id" class="text-xs text-green-600" @click="saveEnvEdit(env)">Save</button>
          <button v-if="editingEnvId === env.id" class="text-xs text-gray-500" @click="cancelEnvEdit">Cancel</button>
          <button class="text-xs text-red-600" @click="deleteEnv(env.id)">Delete</button>
        </li>
      </ul>
      <div class="flex gap-2 mb-2">
        <input v-model="newEnvName" class="border rounded px-2 py-1 text-sm flex-1" placeholder="New environment name" @keyup.enter="addEnv" />
        <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" @click="addEnv">Add</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useEnvironmentsStore } from '~/stores/environments'
const environmentsStore = useEnvironmentsStore()
const environments = environmentsStore.environments
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
</script> 