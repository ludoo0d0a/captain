<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="$emit('close')">
        <span class="i-heroicons-x-mark w-6 h-6" />
      </button>
      <h2 class="text-xl font-bold mb-4">Promote Version</h2>
      <div class="mb-4">
        <div class="font-semibold">App: <span class="text-gray-700">{{ app?.name }}</span></div>
        <div class="font-semibold">Version: <span class="text-gray-700">{{ version?.name }}</span></div>
        <div class="font-semibold">From: <span class="text-gray-700">{{ fromEnv?.name }}</span></div>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Promote to Environment</label>
        <select v-model="selectedEnv" class="w-full border rounded px-3 py-2">
          <option v-for="env in toEnvs" :key="env.id" :value="env.id">
            {{ env.name }}
          </option>
        </select>
      </div>
      <button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold" :disabled="!selectedEnv" @click="promote">
        Promote
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
  fromEnv: Environment | null
  toEnvs: Environment[]
  version: Version | null
}>()
const emit = defineEmits(['close', 'promoted'])
const selectedEnv = ref('')
function promote() {
  if (selectedEnv.value) emit('promoted', selectedEnv.value)
}
</script> 