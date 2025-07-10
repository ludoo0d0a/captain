<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="$emit('close')">
        <span class="i-heroicons-x-mark w-6 h-6" />
      </button>
      <h2 class="text-xl font-bold mb-4">Deploy Version</h2>
      <div class="mb-4">
        <div class="font-semibold">App: <span class="text-gray-700">{{ app?.name }}</span></div>
        <div class="font-semibold">Environment: <span class="text-gray-700">{{ env?.name }}</span></div>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Select Version</label>
        <select v-model="selectedVersion" class="w-full border rounded px-3 py-2">
          <option v-for="v in versions" :key="v.id" :value="v.id">
            {{ v.name }} <span v-if="v.isSnapshot">(snapshot)</span>
          </option>
        </select>
      </div>
      <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold" :disabled="!selectedVersion" @click="deploy">
        Deploy
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Application } from '~/stores/applications'
import type { Environment } from '~/stores/environments'
import type { Version } from '~/stores/versions'

const props = defineProps<{
  app: Application | null
  env: Environment | null
  versions: Version[]
}>()
const emit = defineEmits(['close', 'deployed'])
const selectedVersion = ref('')
function deploy() {
  if (selectedVersion.value) emit('deployed', selectedVersion.value)
}
</script> 