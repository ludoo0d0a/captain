<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <button
              @click="$router.push('/features')"
              class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon class="h-4 w-4 mr-2" />
              Back to Features
            </button>
            <h1 class="text-3xl font-bold text-gray-900">Add New Feature</h1>
            <p class="mt-2 text-sm text-gray-600">
              Create a new feature and associate it with applications.
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="loadApplications"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="loading">Loading...</span>
              <span v-else>Refresh Apps</span>
            </button>
            <button
              @click="saveFeature"
              :disabled="saving"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="saving">Creating...</span>
              <span v-else>Create Feature</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-gray-600">Loading applications...</p>
        </div>
      </div>

      <div v-else class="px-4 sm:px-0">
        <!-- Feature Form -->
        <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="saveFeature" class="space-y-6">
            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Feature Name *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter feature name"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ticket Number</label>
                  <input
                    v-model="form.ticketNumber"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., FEATURE-123"
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Link</label>
                <input
                  v-model="form.link"
                  type="url"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://jira.company.com/browse/FEATURE-123"
                />
                <p class="mt-1 text-xs text-gray-500">Optional link to ticket, documentation, or related resource</p>
              </div>
            </div>

            <!-- Associated Versions -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Associated Versions</h3>
              <div v-if="versions.length === 0" class="text-center text-gray-500 py-4">
                No versions available. Please create versions first.
              </div>
              <div v-else class="space-y-3">
                <div class="text-sm text-gray-600 mb-3">
                  Select the versions that this feature is implemented in:
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    v-for="ver in versions" 
                    :key="ver.id"
                    class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                    :class="[
                      form.versionIds.includes(ver.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                    @click="toggleVersion(ver.id)"
                  >
                    <input
                      type="checkbox"
                      :checked="form.versionIds.includes(ver.id)"
                      @change="toggleVersion(ver.id)"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{{ ver.name }}</div>
                      <div class="text-xs text-gray-500 mt-1">App: {{ getAppName(ver.appId) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                @click="$router.push('/features')"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving || !form.name.trim()"
                class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {{ saving ? 'Creating...' : 'Create Feature' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import TagBadge from '~/components/TagBadge.vue'

const router = useRouter()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const loading = ref(false)
const saving = ref(false)
const versions = ref<any[]>([])
const applications = ref<any[]>([])

const form = ref({
  name: '',
  ticketNumber: '',
  link: '',
  versionIds: [] as string[]
})

onMounted(() => {
  loadVersions()
  loadApplications()
})

async function loadVersions() {
  try {
    const vers = await $fetch('/api/versions')
    versions.value = vers
  } catch (error) {
    console.error('Failed to load versions:', error)
    showToast('Failed to load versions', 'error')
  }
}

function toggleVersion(verId: string) {
  const index = form.value.versionIds.indexOf(verId)
  if (index > -1) {
    form.value.versionIds.splice(index, 1)
  } else {
    form.value.versionIds.push(verId)
  }
}

function getAppName(appId: string) {
  const app = applications.value.find((a: any) => a.id === appId)
  return app ? app.name : appId
}

async function loadApplications() {
  loading.value = true
  try {
    const apps = await $fetch('/api/applications')
    applications.value = Array.isArray(apps)
      ? apps.map((app: any) => ({ ...app, tags: app.tags ? JSON.parse(app.tags) : [] }))
      : []
  } catch (error) {
    console.error('Failed to load applications:', error)
    showToast('Failed to load applications', 'error')
    applications.value = []
  } finally {
    loading.value = false
  }
}

async function saveFeature() {
  if (!form.value.name.trim()) {
    showToast('Feature name is required', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      ...form.value,
      id: `feature-${Date.now()}`
    }

    await $fetch('/api/features', {
      method: 'POST',
      body: payload
    })
    
    showToast('Feature created successfully', 'success')
    router.push('/features')
  } catch (error) {
    console.error('Failed to create feature:', error)
    showToast('Failed to create feature', 'error')
  } finally {
    saving.value = false
  }
}
</script> 