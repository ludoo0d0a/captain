<template>
  <div class="max-w-xl mx-auto py-10">
    <h1 class="text-2xl font-bold mb-4">Database Management</h1>
    <p class="text-gray-600 mb-6">Perform maintenance tasks on the application database. Use with caution!</p>
    <div class="space-y-4">
      <button @click="clearDatabase" class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Clear Database</button>
      <button @click="prefillDatabase" class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Prefill with Mock Data</button>
    </div>
    <div v-if="message" class="mt-6 p-3 rounded text-white" :class="messageType === 'success' ? 'bg-green-600' : 'bg-red-600'">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const messageType = ref<'success' | 'error'>('success')

async function clearDatabase() {
  try {
    const res = await $fetch('/api/database', { method: 'POST', body: { action: 'clear' } })
    if (res && 'success' in res && res.success) {
      message.value = res.message || 'Database cleared successfully.'
      messageType.value = 'success'
    } else if (res && 'error' in res) {
      message.value = res.error || 'Failed to clear database'
      messageType.value = 'error'
    } else {
      message.value = 'Failed to clear database'
      messageType.value = 'error'
    }
  } catch (e) {
    message.value = 'Failed to clear database'
    messageType.value = 'error'
  }
}

async function prefillDatabase() {
  try {
    const res = await $fetch('/api/database', { method: 'POST', body: { action: 'prefill' } })
    if (res && 'success' in res && res.success) {
      message.value = res.message || 'Database prefilled successfully.'
      messageType.value = 'success'
    } else if (res && 'error' in res) {
      message.value = res.error || 'Failed to prefill database'
      messageType.value = 'error'
    } else {
      message.value = 'Failed to prefill database'
      messageType.value = 'error'
    }
  } catch (e) {
    message.value = 'Failed to prefill database'
    messageType.value = 'error'
  }
}
</script> 