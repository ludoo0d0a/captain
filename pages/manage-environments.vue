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
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
    <div v-else class="bg-white rounded shadow p-6">
      <div class="flex items-center mb-4">
        <h3 class="text-xl font-semibold flex-1">Environments</h3>
        <input v-model="filter" class="border rounded px-2 py-1 text-sm ml-4 w-64" placeholder="Quick filter by name or tag" />
        <button 
          @click="refreshEnvironments" 
          :disabled="loading"
          class="ml-2 p-2 rounded hover:bg-gray-100 disabled:opacity-50" 
          title="Refresh environments"
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
        <li v-for="env in filteredEnvs" :key="env.id" class="py-3 flex items-center gap-2">
          <input v-if="editingEnvId === env.id" v-model="editEnvName" class="border rounded px-2 py-1 text-sm flex-1" @keyup.enter="saveEnvEdit(env)" />
          <span v-else class="flex-1">{{ env.name }}</span>
          <template v-if="editingEnvId === env.id">
            <div class="relative w-48">
              <input v-model="editEnvTagsInput" class="border rounded px-2 py-1 text-xs w-full" placeholder="Tags (comma separated)" @input="onEditTagInput" @keyup.enter="saveEnvEdit(env)" />
              <ul v-if="editTagSuggestions.length" class="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-32 overflow-auto">
                <li v-for="tag in editTagSuggestions" :key="tag" class="px-2 py-1 text-xs cursor-pointer hover:bg-blue-100" @mousedown.prevent="addEditTagSuggestion(tag)">{{ tag }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <TagBadge v-for="tag in env.tags || []" :key="tag" :tag="tag" class="mr-1" />
            <span v-if="!env.tags || !env.tags.length" class="inline-block text-gray-400 text-xs">—</span>
          </template>
          <button v-if="editingEnvId !== env.id" class="p-1 rounded hover:bg-gray-100" @click="startEnvEdit(env)" title="Edit environment">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button v-if="editingEnvId === env.id" class="text-xs text-green-600" @click="saveEnvEdit(env)">Save</button>
          <button v-if="editingEnvId === env.id" class="text-xs text-gray-500" @click="cancelEnvEdit">Cancel</button>
          <button class="p-1 rounded hover:bg-gray-100" @click="deleteEnv(env.id)" title="Delete environment">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </li>
      </ul>
      <div class="flex gap-2 mb-2 items-start">
        <input v-model="newEnvName" class="border rounded px-2 py-1 text-sm flex-1" placeholder="New environment name" @keyup.enter="addEnv" />
        <div class="relative w-48">
          <input v-model="newEnvTagsInput" class="border rounded px-2 py-1 text-xs w-full" placeholder="Tags (comma separated)" @input="onNewTagInput" @keyup.enter="addEnv" />
          <ul v-if="newTagSuggestions.length" class="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-32 overflow-auto">
            <li v-for="tag in newTagSuggestions" :key="tag" class="px-2 py-1 text-xs cursor-pointer hover:bg-blue-100" @mousedown.prevent="addNewTagSuggestion(tag)">{{ tag }}</li>
          </ul>
        </div>
        <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm" @click="addEnv">Add</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEnvironmentsStore } from '~/stores/environments'
import type { Environment } from '~/stores/environments'
import TagBadge from '~/components/TagBadge.vue'

const environmentsStore = useEnvironmentsStore()
const { environments, loading } = storeToRefs(environmentsStore)

const newEnvName = ref('')
const newEnvTagsInput = ref('')
const editingEnvId = ref('')
const editEnvName = ref('')
const editEnvTagsInput = ref('')
const filter = ref('')

onMounted(async () => {
  console.log('Environments page onMounted called')
  await environmentsStore.fetchEnvironments()
  console.log('Environments loaded:', environments.value.length)
})

// Also ensure data is loaded if onMounted doesn't work
if (environments.value.length === 0) {
  console.log('No environments found, fetching...')
  environmentsStore.fetchEnvironments()
}

const allTags = computed(() => {
  const tags = new Set<string>()
  environments.value.forEach((e: Environment) => (e.tags || []).forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
})
const filteredEnvs = computed(() => {
  if (!filter.value.trim()) return environments.value
  const f = filter.value.trim().toLowerCase()
  return environments.value.filter((e: Environment) =>
    e.name.toLowerCase().includes(f) ||
    (e.tags && e.tags.some((tag: string) => tag.toLowerCase().includes(f)))
  )
})
// Autocomplete for new tags
const newTagSuggestions = ref<string[]>([])
function onNewTagInput() {
  const input = newEnvTagsInput.value.split(',').pop()?.trim().toLowerCase() || ''
  newTagSuggestions.value = input
    ? allTags.value.filter(tag => tag.toLowerCase().startsWith(input) && !newEnvTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
    : allTags.value.filter(tag => !newEnvTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
}
function addNewTagSuggestion(tag: string) {
  let tags = newEnvTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  if (!tags.includes(tag)) tags.push(tag)
  newEnvTagsInput.value = tags.join(', ') + ', '
  newTagSuggestions.value = []
}
// Autocomplete for edit tags
const editTagSuggestions = ref<string[]>([])
function onEditTagInput() {
  const input = editEnvTagsInput.value.split(',').pop()?.trim().toLowerCase() || ''
  editTagSuggestions.value = input
    ? allTags.value.filter(tag => tag.toLowerCase().startsWith(input) && !editEnvTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
    : allTags.value.filter(tag => !editEnvTagsInput.value.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
}
function addEditTagSuggestion(tag: string) {
  let tags = editEnvTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  if (!tags.includes(tag)) tags.push(tag)
  editEnvTagsInput.value = tags.join(', ') + ', '
  editTagSuggestions.value = []
}
async function addEnv() {
  if (!newEnvName.value.trim()) return
  const tags = newEnvTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  await environmentsStore.addEnvironment({ id: 'env-' + Math.random().toString(36).slice(2), name: newEnvName.value.trim(), tags })
  await environmentsStore.fetchEnvironments()
  // environments.value = environmentsStore.environments // This line is no longer needed as environments is reactive
  newEnvName.value = ''
  newEnvTagsInput.value = ''
}
function startEnvEdit(env: Environment) {
  editingEnvId.value = env.id
  editEnvName.value = env.name
  editEnvTagsInput.value = (env.tags || []).join(', ')
}
async function saveEnvEdit(env: Environment) {
  if (!editEnvName.value.trim()) return
  const tags = editEnvTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  await environmentsStore.updateEnvironment(env.id, { name: editEnvName.value.trim(), tags })
  await environmentsStore.fetchEnvironments()
  // environments.value = environmentsStore.environments // This line is no longer needed as environments is reactive
  editingEnvId.value = ''
  editEnvName.value = ''
  editEnvTagsInput.value = ''
}
function cancelEnvEdit() {
  editingEnvId.value = ''
  editEnvName.value = ''
  editEnvTagsInput.value = ''
}
async function deleteEnv(id: string) {
  await environmentsStore.removeEnvironment(id)
  await environmentsStore.fetchEnvironments()
  // environments.value = environmentsStore.environments // This line is no longer needed as environments is reactive
}
async function refreshEnvironments() {
  await environmentsStore.fetchEnvironments()
}
</script> 