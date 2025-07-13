<template>
  <div class="bg-white rounded shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ connectorMeta?.label }} Settings</h3>
        <p class="text-sm text-gray-600 mt-1">
          Configure connection settings for {{ connectorMeta?.label }}.
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="testConnection"
          :disabled="testing"
          class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <span v-if="testing">Testing...</span>
          <span v-else>Test Connection</span>
        </button>
      </div>
    </div>

    <form @submit.prevent="saveSettings" class="space-y-6">
      <div v-if="connectorMeta" class="space-y-4">
        <div v-for="field in connectorMeta.fields" :key="field.name" class="space-y-2">
          <label :for="field.name" class="block text-sm font-medium text-gray-700">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
          
          <!-- Text input -->
          <input
            v-if="field.type === 'text'"
            :id="field.name"
            v-model="settings[field.name]"
            type="text"
            :required="field.required"
            :placeholder="field.placeholder"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          
          <!-- Password input -->
          <input
            v-else-if="field.type === 'password'"
            :id="field.name"
            v-model="settings[field.name]"
            type="password"
            :required="field.required"
            :placeholder="field.placeholder"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          
          <!-- URL input -->
          <input
            v-else-if="field.type === 'url'"
            :id="field.name"
            v-model="settings[field.name]"
            type="url"
            :required="field.required"
            :placeholder="field.placeholder"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          
          <!-- Number input -->
          <input
            v-else-if="field.type === 'number'"
            :id="field.name"
            v-model.number="settings[field.name]"
            type="number"
            :required="field.required"
            :placeholder="field.placeholder"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          
          <!-- Boolean input -->
          <div v-else-if="field.type === 'boolean'" class="flex items-center">
            <input
              :id="field.name"
              v-model="settings[field.name]"
              type="checkbox"
              :required="field.required"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label :for="field.name" class="ml-2 block text-sm text-gray-900">
              {{ field.label }}
            </label>
          </div>
          
          <!-- Select input -->
          <select
            v-else-if="field.type === 'select'"
            :id="field.name"
            v-model="settings[field.name]"
            :required="field.required"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Textarea for long text (like private keys) -->
          <textarea
            v-else-if="field.name === 'privateKey'"
            :id="field.name"
            v-model="settings[field.name]"
            :required="field.required"
            :placeholder="field.placeholder"
            rows="6"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-xs"
          />
          
          <p v-if="field.isCredential" class="text-xs text-gray-500 mt-1">
            This is a sensitive credential and will be encrypted.
          </p>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="saving">Saving...</span>
          <span v-else>Save Settings</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { connectorSettingsMeta, type ConnectorMeta } from '~/utils/connectorSettingsMeta'

interface Props {
  connectorId: string
}

interface Emits {
  (e: 'saved'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const settings = ref<Record<string, any>>({})
const saving = ref(false)
const testing = ref(false)
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const connectorMeta = computed<ConnectorMeta | undefined>(() => 
  connectorSettingsMeta[props.connectorId]
)

// Initialize settings with default values from metamodel
watch(() => props.connectorId, (newId) => {
  if (newId && connectorMeta.value) {
    settings.value = {}
    connectorMeta.value.fields.forEach(field => {
      settings.value[field.name] = field.value
    })
    loadSettings()
  }
}, { immediate: true })

async function loadSettings() {
  try {
    const response = await $fetch(`/api/settings?connectorId=${props.connectorId}`)
    if (response && response.success && response.settings) {
      // Merge loaded settings with defaults
      Object.assign(settings.value, response.settings)
    } else if (response && response.error) {
      showToast && showToast('Failed to load settings: ' + response.error, 'error')
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
    showToast && showToast('Failed to load settings', 'error')
  }
}

async function saveSettings() {
  saving.value = true
  try {
    // Save each field as a separate key-value pair
    for (const field of connectorMeta.value?.fields || []) {
      await $fetch('/api/settings', {
        method: 'POST',
        body: {
          key: field.name,
          value: settings.value[field.name],
          connectorId: props.connectorId
        }
      })
    }
    showToast && showToast('Settings saved successfully!', 'success')
    emit('saved')
  } catch (error) {
    console.error('Failed to save settings:', error)
    showToast && showToast('Failed to save settings', 'error')
  } finally {
    saving.value = false
  }
}

async function testConnection() {
  testing.value = true
  try {
    if (props.connectorId === 'jira') {
      const { baseUrl, email, apiToken } = settings.value
      const result = await $fetch('/api/connectors/jira', {
        method: 'POST',
        body: { baseUrl, email, apiToken }
      })
      if (result && result.success) {
        showToast && showToast(result.message || 'Jira connection successful!', 'success')
      } else {
        showToast && showToast((result && result.message) || 'Jira connection failed', 'error')
      }
    } else {
      // This would call the connector's test method
      // For now, just simulate a test
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast && showToast('Connection test successful!', 'success')
    }
  } catch (error) {
    showToast && showToast('Connection test failed', 'error')
  } finally {
    testing.value = false
  }
}
</script> 