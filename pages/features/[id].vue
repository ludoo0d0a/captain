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
            <h1 class="text-3xl font-bold text-gray-900">Edit Feature</h1>
            <p class="mt-2 text-sm text-gray-600">
              Update feature details and associated applications.
            </p>
            <p class="mt-1 text-xs text-gray-400">Feature ID: {{ featureId }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="loadData"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="loading">Refreshing...</span>
              <span v-else>Refresh</span>
            </button>
            <button
              @click="saveFeature"
              :disabled="saving"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>Save Changes</span>
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
          <p class="text-gray-600">Loading feature data...</p>
        </div>
      </div>

      <div v-else-if="feature" class="px-4 sm:px-0">
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

            <!-- Associated Applications -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Associated Applications</h3>
              <div v-if="applications.length === 0" class="text-center text-gray-500 py-4">
                No applications available. Please create applications first.
              </div>
              <div v-else class="space-y-3">
                <div class="text-sm text-gray-600 mb-3">
                  Select the applications that this feature affects or is implemented in:
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    v-for="app in applications" 
                    :key="app.id"
                    class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                    :class="[
                      form.applicationIds.includes(app.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                    @click="toggleApplication(app.id)"
                  >
                    <input
                      type="checkbox"
                      :checked="form.applicationIds.includes(app.id)"
                      @change="toggleApplication(app.id)"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{{ app.name }}</div>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <TagBadge v-for="tag in app.tags" :key="tag" :tag="tag" class="text-xs" />
                        <span v-if="!app.tags || app.tags.length === 0" class="text-xs text-gray-400">No tags</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Associations -->
            <div v-if="feature.applications && feature.applications.length > 0">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Current Associations</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    v-for="app in feature.applications" 
                    :key="app.id"
                    class="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div class="flex items-center space-x-3">
                      <div>
                        <div class="font-medium text-gray-900">{{ app.name }}</div>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <TagBadge v-for="tag in app.tags" :key="tag" :tag="tag" class="text-xs" />
                        </div>
                      </div>
                    </div>
                    <NuxtLink 
                      :to="`/applications/${app.id}`"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View App
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timestamps -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Timestamps</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span class="font-medium">Created:</span> {{ formatDate(feature.createdAt) }}
                </div>
                <div v-if="feature.updatedAt !== feature.createdAt">
                  <span class="font-medium">Last Updated:</span> {{ formatDate(feature.updatedAt) }}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div v-else class="px-4 sm:px-0">
        <div class="bg-white shadow rounded-lg p-6 text-center">
          <p class="text-gray-500 mb-4">Feature not found</p>
          <button 
            @click="loadData"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Loading
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import TagBadge from '~/components/TagBadge.vue'

const route = useRoute()
const router = useRouter()
const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const featureId = route.params.id as string
const loading = ref(false)
const saving = ref(false)

const feature = ref<any>(null)
const applications = ref<any[]>([])

const form = ref({
  name: '',
  ticketNumber: '',
  link: '',
  applicationIds: [] as string[]
})

onMounted(() => {
  console.log('🚀 Edit feature page mounted for feature:', featureId)
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    // Load feature
    const features = await $fetch('/api/features')
    feature.value = features.find((f: any) => f.id === featureId)
    
    if (!feature.value) {
      console.log('Feature not found')
      showToast && showToast('Feature not found', 'error')
      return
    }

    // Load applications
    const apps = await $fetch('/api/applications')
    applications.value = apps.map((app: any) => ({
      ...app,
      tags: app.tags ? JSON.parse(app.tags) : []
    }))

    // Populate form
    form.value = {
      name: feature.value.name,
      ticketNumber: feature.value.ticketNumber || '',
      link: feature.value.link || '',
      applicationIds: feature.value.applications?.map((app: any) => app.id) || []
    }
  } catch (error) {
    console.error('Failed to load data:', error)
    showToast && showToast('Failed to load feature data', 'error')
  } finally {
    loading.value = false
  }
}

function toggleApplication(appId: string) {
  const index = form.value.applicationIds.indexOf(appId)
  if (index > -1) {
    form.value.applicationIds.splice(index, 1)
  } else {
    form.value.applicationIds.push(appId)
  }
}

async function saveFeature() {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      id: featureId
    }

    await $fetch('/api/features', {
      method: 'PUT',
      body: payload
    })
    
    showToast('Feature updated successfully', 'success')
    await loadData() // Reload to get updated data
  } catch (error) {
    console.error('Failed to save feature:', error)
    showToast('Failed to save feature', 'error')
  } finally {
    saving.value = false
  }
}

function formatDate(dateString: string) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}
</script> 