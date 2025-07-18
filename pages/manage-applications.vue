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
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
    <div v-else class="bg-white rounded shadow p-6">
      <div class="flex items-center mb-4">
        <h3 class="text-xl font-semibold flex-1">Applications</h3>
        <QuickFilter
          v-model="filter"
          :all-tags="allTags"
          :selected-tags="selectedTags"
          @update:selectedTags="val => selectedTags = val"
          class="ml-4 w-full max-w-xl"
        />
        <button 
          @click="refreshApplications" 
          :disabled="loading"
          class="ml-2 p-2 rounded hover:bg-gray-100 disabled:opacity-50" 
          title="Refresh applications"
        >
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </button>
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
            <TagBadge v-for="tag in app.tags || []" :key="tag" :tag="tag" class="mr-1" />
            <span v-if="!app.tags || !app.tags.length" class="inline-block text-gray-400 text-xs">—</span>
          </template>
          <button v-if="editingAppId !== app.id" class="p-1 rounded hover:bg-gray-100" @click="startAppEdit(app)" title="Edit application">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button v-if="editingAppId === app.id" class="text-xs text-green-600" @click="saveAppEdit(app)">Save</button>
          <button v-if="editingAppId === app.id" class="text-xs text-gray-500" @click="cancelAppEdit">Cancel</button>
          <button class="p-1 rounded hover:bg-gray-100" @click="deleteApp(app.id)" title="Delete application">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
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
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '~/stores/applications'
import type { Application } from '~/stores/applications'
import TagBadge from '~/components/TagBadge.vue'
import QuickFilter from '~/components/QuickFilter.vue'

const applicationsStore = useApplicationsStore()
const { applications, loading } = storeToRefs(applicationsStore)

const newAppName = ref('')
const newAppTagsInput = ref('')
const editingAppId = ref('')
const editAppName = ref('')
const editAppTagsInput = ref('')
const filter = ref('')
const selectedTags = ref<string[]>([])

onMounted(async () => {
  await applicationsStore.fetchApplications()
})

if (applications.value.length === 0) {
  applicationsStore.fetchApplications()
}

const allTags = computed(() => {
  const tags = new Set<string>()
  applications.value.forEach((a: Application) => (a.tags || []).forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
})
const filteredApps = computed(() => {
  const f = filter.value.trim().toLowerCase()
  return applications.value.filter((a: Application) => {
    const tags = a.tags || []
    const matchesText = !f || a.name.toLowerCase().includes(f) || tags.some((tag: string) => tag.toLowerCase().includes(f))
    const matchesTags = selectedTags.value.length === 0 || selectedTags.value.every(tag => tags.includes(tag))
    return matchesText && matchesTags
  })
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
  // applications.value = applicationsStore.applications // This line is removed as per the new_code
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
  // applications.value = applicationsStore.applications // This line is removed as per the new_code
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
  // applications.value = applicationsStore.applications // This line is removed as per the new_code
}
async function refreshApplications() {
  await applicationsStore.fetchApplications()
}
</script> 