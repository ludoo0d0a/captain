<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Features</h1>
            <p class="mt-2 text-sm text-gray-600">
              Manage features and their associated applications.
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="loading">Refreshing...</span>
              <span v-else>Refresh</span>
            </button>
            <NuxtLink
              to="/features/add"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Feature
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick Filter -->
      <div class="px-4 sm:px-0 mb-6">
        <QuickFilter 
          v-model:search="searchTerm"
          v-model:selectedTags="selectedTags"
          :availableTags="availableTags"
          placeholder="Search features..."
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-gray-600">Loading features...</p>
        </div>
      </div>

      <!-- Features Grid -->
      <div v-else-if="filteredFeatures.length > 0" class="px-4 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="feature in filteredFeatures" 
            :key="feature.id"
            class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <!-- Feature Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ feature.name }}</h3>
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <span v-if="feature.ticketNumber" class="bg-gray-100 px-2 py-1 rounded">
                    {{ feature.ticketNumber }}
                  </span>
                  <span v-if="feature.link">
                    <a 
                      :href="feature.link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <NuxtLink
                  :to="`/features/${feature.id}`"
                  class="text-gray-400 hover:text-gray-600"
                  title="Edit feature"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>
                <button
                  @click="deleteFeature(feature.id)"
                  class="text-gray-400 hover:text-red-600"
                  title="Delete feature"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Associated Applications -->
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Associated Applications</h4>
              <div v-if="feature.applications && feature.applications.length > 0" class="space-y-2">
                <div 
                  v-for="app in feature.applications" 
                  :key="app.id"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{ app.name }}</span>
                    <div class="flex space-x-1">
                      <TagBadge v-for="tag in app.tags" :key="tag" :tag="tag" class="text-xs" />
                    </div>
                  </div>
                  <NuxtLink 
                    :to="`/applications/${app.id}`"
                    class="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View
                  </NuxtLink>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 italic">
                No applications associated
              </div>
            </div>

            <!-- Timestamps -->
            <div class="text-xs text-gray-400 border-t pt-3">
              <div>Created: {{ formatDate(feature.createdAt) }}</div>
              <div v-if="feature.updatedAt !== feature.createdAt">
                Updated: {{ formatDate(feature.updatedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="px-4 sm:px-0">
        <div class="bg-white shadow rounded-lg p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No features found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ searchTerm || selectedTags.length > 0 ? 'Try adjusting your search criteria.' : 'Get started by creating a new feature.' }}
          </p>
          <div class="mt-6">
            <NuxtLink
              to="/features/add"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Feature
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QuickFilter from '~/components/QuickFilter.vue'
import TagBadge from '~/components/TagBadge.vue'

const showToast = inject('showToast') as (msg: string, type?: 'success' | 'error') => void

const loading = ref(false)
const features = ref<any[]>([])
const applications = ref<any[]>([])

// Filter state
const searchTerm = ref('')
const selectedTags = ref<string[]>([])

// Computed properties
const availableTags = computed(() => {
  const tags = new Set<string>()
  features.value.forEach(feature => {
    feature.applications?.forEach((app: any) => {
      app.tags?.forEach((tag: string) => tags.add(tag))
    })
  })
  return Array.from(tags)
})

const filteredFeatures = computed(() => {
  let filtered = features.value

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(feature => 
      feature.name.toLowerCase().includes(term) ||
      feature.ticketNumber?.toLowerCase().includes(term) ||
      feature.applications?.some((app: any) => app.name.toLowerCase().includes(term))
    )
  }

  // Filter by tags
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(feature =>
      feature.applications?.some((app: any) =>
        app.tags?.some((tag: string) => selectedTags.value.includes(tag))
      )
    )
  }

  return filtered
})

// Methods
async function loadData() {
  loading.value = true
  try {
    const [featuresData, appsData] = await Promise.all([
      $fetch('/api/features'),
      $fetch('/api/applications')
    ])
    features.value = featuresData
    applications.value = appsData.map((app: any) => ({
      ...app,
      tags: app.tags ? JSON.parse(app.tags) : []
    }))
  } catch (error) {
    console.error('Failed to load data:', error)
    showToast('Failed to load features', 'error')
  } finally {
    loading.value = false
  }
}

async function refreshData() {
  await loadData()
  showToast('Data refreshed successfully', 'success')
}

async function deleteFeature(featureId: string) {
  if (!confirm('Are you sure you want to delete this feature?')) {
    return
  }

  try {
    await $fetch(`/api/features?id=${featureId}`, {
      method: 'DELETE'
    })
    showToast('Feature deleted successfully', 'success')
    await loadData()
  } catch (error) {
    console.error('Failed to delete feature:', error)
    showToast('Failed to delete feature', 'error')
  }
}

function formatDate(dateString: string) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  loadData()
})
</script> 