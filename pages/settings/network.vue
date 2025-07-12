<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Network Settings</h1>
        <p class="text-sm text-gray-600 mb-6">
          Configure the global corporate proxy for all backend HTTP requests.
        </p>
        <form @submit.prevent="saveProxy" class="space-y-6 bg-white shadow rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Proxy Host *</label>
              <input v-model="form.host" type="text" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="proxy.company.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Proxy Port *</label>
              <input v-model="form.port" type="number" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="8080" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Protocol *</label>
              <select v-model="form.protocol" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="http">HTTP</option>
                <option value="https">HTTPS</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input v-model="form.username" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="(optional)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input v-model="form.password" type="password" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="(optional)" />
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="resetForm" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Reset</button>
            <button type="submit" :disabled="saving" class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              <span v-if="saving">Saving...</span>
              <span v-else>Save Proxy Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const form = ref({
  host: '',
  port: '',
  protocol: 'http',
  username: '',
  password: ''
})
const saving = ref(false)

async function loadProxy() {
  try {
    const res = await $fetch('/api/settings?scope=global&key=proxy')
    if (res.success && res.value) {
      Object.assign(form.value, JSON.parse(res.value))
    }
  } catch (e) {
    // ignore
  }
}

async function saveProxy() {
  saving.value = true
  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: {
        scope: 'global',
        key: 'proxy',
        value: JSON.stringify(form.value)
      }
    })
    showToast && showToast('Proxy settings saved!', 'success')
  } catch (e) {
    showToast && showToast('Failed to save proxy settings', 'error')
  } finally {
    saving.value = false
  }
}

function resetForm() {
  form.value = { host: '', port: '', protocol: 'http', username: '', password: '' }
}

onMounted(loadProxy)
</script> 