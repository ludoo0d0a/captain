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
    <div v-if="applicationsStore.loading" class="flex justify-center items-center min-h-[200px]">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
    <div v-else class="bg-white rounded shadow p-6">
      <div class="flex items-center mb-4">
        <h3 class="text-xl font-semibold flex-1">Applications</h3>
        <input v-model="filter" class="border rounded px-2 py-1 text-sm ml-4 w-64" placeholder="Quick filter by name or tag" />
      </div>
      <ul class="divide-y mb-4">
        <li v-for="app in filteredApps" :key="app.id" class="py-3 flex items-center gap-2">
          <input v-if="editingAppId === app.id" v-model="editAppName" class="border rounded px-2 py-1 text-sm flex-1" @keyup.enter="saveAppEdit(app)" />
          <span v-else class="flex-1">{{ app.name }}</span>
          <template v-if="editingAppId === app.id">
            <div class="relative w-48">
              <input v-model="editAppTagsInput" class="border rounded px-2 py-1 text-xs w-full" placeholder="Tags (comma separated)" @input="onEditTagInput" @keyup.enter="saveAppEdit(app)" />
              <ul v-if="editTagSuggestions.length" class="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-32 overflow-auto">
                <li v-for="tag in editTagSuggestions" :key="tag" class="px-2 py-1 text-xs cursor-pointer hover:bg-blue-100" @mousedown.prevent="addEditTagSuggestion(tag)">{{ tag }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <span v-for="tag in app.tags || []" :key="tag" class="inline-block bg-gray-100 text-gray-700 text-xs rounded px-2 py-1 mr-1 min-w-[2.5rem] text-center">{{ tag }}</span>
            <span v-if="!app.tags || !app.tags.length" class="inline-block text-gray-400 text-xs">—</span>
          </template>
          <button v-if="editingAppId !== app.id" class="text-xs text-blue-600" @click="startAppEdit(app)">Rename/Tags</button>
          <button v-if="editingAppId === app.id" class="text-xs text-green-600" @click="saveAppEdit(app)">Save</button>
          <button v-if="editingAppId === app.id" class="text-xs text-gray-500" @click="cancelAppEdit">Cancel</button>
          <button class="text-xs text-red-600" @click="deleteApp(app.id)">Delete</button>
        </li>
      </ul>
      <div class="flex gap-2 mb-2 items-start">
        <input v-model="newAppName" class="border rounded px-2 py-1 text-sm flex-1" placeholder="New application name" @keyup.enter="addApp" />
        <div class="relative w-48">
          <input v-model="newAppTagsInput" class="border rounded px-2 py-1 text-xs w-full" placeholder="Tags (comma separated)" @input="onNewTagInput" @keyup.enter="addApp" />
          <ul v-if="newTagSuggestions.length" class="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-32 overflow-auto">
            <li v-for="tag in newTagSuggestions" :key="tag" class="px-2 py-1 text-xs cursor-pointer hover:bg-blue-100" @mousedown.prevent="addNewTagSuggestion(tag)">{{ tag }}</li>
          </ul>
        </div>
        <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" @click="addApp">Add</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '~/stores/applications'
import type { Application } from '~/stores/applications'
const applicationsStore = useApplicationsStore()
const applications = ref<Application[]>([])
// Removed: const loading = ref(false)

const newAppName = ref('')
const newAppTagsInput = ref('')
const editingAppId = ref('')
const editAppName = ref('')
const editAppTagsInput = ref('')
const filter = ref('')

onMounted(async () => {
  await applicationsStore.fetchApplications()
  applications.value = applicationsStore.applications
})

const allTags = computed(() => {
  const tags = new Set<string>()
  applications.value.forEach((a: Application) => (a.tags || []).forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
})
const filteredApps = computed(() => {
  if (!filter.value.trim()) return applications.value
  const f = filter.value.trim().toLowerCase()
  return applications.value.filter((a: Application) =>
    a.name.toLowerCase().includes(f) ||
    (a.tags && a.tags.some((tag: string) => tag.toLowerCase().includes(f)))
  )
})
// Autocomplete for new tags
const newTagSuggestions = ref<string[]>([])
function onNewTagInput() {
  const input = newAppTagsInput.value.split(',').pop()?.trim().toLowerCase() || ''
  newTagSuggestions.value = input
    ? allTags.value.filter(tag => tag.toLowerCase().startsWith(input) && !newAppTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
    : allTags.value.filter(tag => !newAppTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
}
function addNewTagSuggestion(tag: string) {
  let tags = newAppTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  if (!tags.includes(tag)) tags.push(tag)
  newAppTagsInput.value = tags.join(', ') + ', '
  newTagSuggestions.value = []
}
// Autocomplete for edit tags
const editTagSuggestions = ref<string[]>([])
function onEditTagInput() {
  const input = editAppTagsInput.value.split(',').pop()?.trim().toLowerCase() || ''
  editTagSuggestions.value = input
    ? allTags.value.filter(tag => tag.toLowerCase().startsWith(input) && !editAppTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
    : allTags.value.filter(tag => !editAppTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
}
function addEditTagSuggestion(tag: string) {
  let tags = editAppTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  if (!tags.includes(tag)) tags.push(tag)
  editAppTagsInput.value = tags.join(', ') + ', '
  editTagSuggestions.value = []
}
async function addApp() {
  if (!newAppName.value.trim()) return
  const tags = newAppTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  await applicationsStore.addApplication({ id: 'app-' + Math.random().toString(36).slice(2), name: newAppName.value.trim(), versions: [], tags })
  await applicationsStore.fetchApplications()
  applications.value = applicationsStore.applications
  newAppName.value = ''
  newAppTagsInput.value = ''
}
function startAppEdit(app: Application) {
  editingAppId.value = app.id
  editAppName.value = app.name
  editAppTagsInput.value = (app.tags || []).join(', ')
}
async function saveAppEdit(app: Application) {
  if (!editAppName.value.trim()) return
  const tags = editAppTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  await applicationsStore.updateApplication(app.id, { name: editAppName.value.trim(), tags })
  await applicationsStore.fetchApplications()
  applications.value = applicationsStore.applications
  editingAppId.value = ''
  editAppName.value = ''
  editAppTagsInput.value = ''
}
function cancelAppEdit() {
  editingAppId.value = ''
  editAppName.value = ''
  editAppTagsInput.value = ''
}
async function deleteApp(id: string) {
  await applicationsStore.removeApplication(id)
  await applicationsStore.fetchApplications()
  applications.value = applicationsStore.applications
}
</script> 