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
      <div class="flex items-center mb-4">
        <h3 class="text-xl font-semibold flex-1">Environments</h3>
        <input v-model="filter" class="border rounded px-2 py-1 text-sm ml-4 w-64" placeholder="Quick filter by name or tag" />
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
            <span v-for="tag in env.tags || []" :key="tag" class="inline-block bg-gray-100 text-gray-700 text-xs rounded px-2 py-1 mr-1 min-w-[2.5rem] text-center">{{ tag }}</span>
            <span v-if="!env.tags || !env.tags.length" class="inline-block text-gray-400 text-xs">—</span>
          </template>
          <button v-if="editingEnvId !== env.id" class="text-xs text-blue-600" @click="startEnvEdit(env)">Rename/Tags</button>
          <button v-if="editingEnvId === env.id" class="text-xs text-green-600" @click="saveEnvEdit(env)">Save</button>
          <button v-if="editingEnvId === env.id" class="text-xs text-gray-500" @click="cancelEnvEdit">Cancel</button>
          <button class="text-xs text-red-600" @click="deleteEnv(env.id)">Delete</button>
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
import { ref, computed } from 'vue'
import { useEnvironmentsStore } from '~/stores/environments'
const environmentsStore = useEnvironmentsStore()
const environments = environmentsStore.environments
const newEnvName = ref('')
const newEnvTagsInput = ref('')
const editingEnvId = ref('')
const editEnvName = ref('')
const editEnvTagsInput = ref('')
const filter = ref('')
const allTags = computed(() => {
  const tags = new Set<string>()
  environments.forEach(e => (e.tags || []).forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})
const filteredEnvs = computed(() => {
  if (!filter.value.trim()) return environments
  const f = filter.value.trim().toLowerCase()
  return environments.filter(e =>
    e.name.toLowerCase().includes(f) ||
    (e.tags && e.tags.some(tag => tag.toLowerCase().includes(f)))
  )
})
// Autocomplete for new tags
const newTagSuggestions = ref<string[]>([])
function onNewTagInput() {
  // Always show suggestions for the current word being typed
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
  // Always show suggestions for the current word being typed
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
function addEnv() {
  if (!newEnvName.value.trim()) return
  const tags = newEnvTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  environmentsStore.addEnvironment({ id: 'env-' + Math.random().toString(36).slice(2), name: newEnvName.value.trim(), tags })
  newEnvName.value = ''
  newEnvTagsInput.value = ''
}
function startEnvEdit(env: any) {
  editingEnvId.value = env.id
  editEnvName.value = env.name
  editEnvTagsInput.value = (env.tags || []).join(', ')
}
function saveEnvEdit(env: any) {
  if (!editEnvName.value.trim()) return
  const tags = editEnvTagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  environmentsStore.updateEnvironment(env.id, { name: editEnvName.value.trim(), tags })
  editingEnvId.value = ''
  editEnvName.value = ''
  editEnvTagsInput.value = ''
}
function cancelEnvEdit() {
  editingEnvId.value = ''
  editEnvName.value = ''
  editEnvTagsInput.value = ''
}
function deleteEnv(id: string) {
  environmentsStore.removeEnvironment(id)
}
</script> 