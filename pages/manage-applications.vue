<template>
  <div class="w-full min-h-screen bg-gray-50 p-8">
    <div class="flex items-center mb-8">
      <NuxtLink to="/" class="mr-4">
        <button class="p-2 rounded hover:bg-gray-100" title="Back to Applications">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </NuxtLink>
      <h1 class="text-3xl font-bold">Manage Applications</h1>
    </div>
    <div class="bg-white rounded shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Applications</h3>
      <ul class="divide-y mb-4">
        <li v-for="app in applications" :key="app.id" class="py-3 flex items-center gap-2">
          <input v-if="editingAppId === app.id" v-model="editAppName" class="border rounded px-2 py-1 text-sm flex-1" @keyup.enter="saveAppEdit(app)" />
          <span v-else class="flex-1">{{ app.name }}</span>
          <button v-if="editingAppId !== app.id" class="text-xs text-blue-600" @click="startAppEdit(app)">Rename</button>
          <button v-if="editingAppId === app.id" class="text-xs text-green-600" @click="saveAppEdit(app)">Save</button>
          <button v-if="editingAppId === app.id" class="text-xs text-gray-500" @click="cancelAppEdit">Cancel</button>
          <button class="text-xs text-red-600" @click="deleteApp(app.id)">Delete</button>
        </li>
      </ul>
      <div class="flex gap-2 mb-2">
        <input v-model="newAppName" class="border rounded px-2 py-1 text-sm flex-1" placeholder="New application name" @keyup.enter="addApp" />
        <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" @click="addApp">Add</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useApplicationsStore } from '~/stores/applications'
const applicationsStore = useApplicationsStore()
const applications = applicationsStore.applications
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
</script> 