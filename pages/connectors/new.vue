<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <button
              @click="$router.push('/connectors')"
              class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon class="h-4 w-4 mr-2" />
              Back to Connectors
            </button>
            <h1 class="text-3xl font-bold text-gray-900">Add New Connector</h1>
            <p class="mt-2 text-sm text-gray-600">
              Configure a new third-party integration for your applications and deployments.
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="px-4 sm:px-0">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Basic Information -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Connector Name
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="My GitHub Connector"
                />
              </div>

              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">
                  Connector Type
                </label>
                <select
                  id="type"
                  v-model="form.type"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a connector type</option>
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                  <option value="docker">Docker</option>
                  <option value="kubernetes">Kubernetes</option>
                  <option value="githubactions">GitHub Actions</option>
                  <option value="http">HTTP API</option>
                  <option value="jenkins">Jenkins</option>
                  <option value="ssh">SSH</option>
                  <option value="xldeploy">XL Deploy</option>
                  <option value="googleplaystore">Google Play Store</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Type-specific Settings -->
          <div v-if="form.type" class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">
              {{ getConnectorTypeLabel(form.type) }} Settings
            </h3>
            
            <!-- GitHub Settings -->
            <div v-if="form.type === 'github'" class="space-y-6">
              <div>
                <label for="github-org" class="block text-sm font-medium text-gray-700">
                  Organization
                </label>
                <input
                  id="github-org"
                  v-model="form.settings.organization"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="my-organization"
                />
              </div>
              <div>
                <label for="github-repo" class="block text-sm font-medium text-gray-700">
                  Repository
                </label>
                <input
                  id="github-repo"
                  v-model="form.settings.repository"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="my-organization/my-repo"
                />
              </div>
              <div>
                <label for="github-token" class="block text-sm font-medium text-gray-700">
                  Personal Access Token
                </label>
                <input
                  id="github-token"
                  v-model="form.credentials.token"
                  type="password"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ghp_..."
                />
              </div>
            </div>

            <!-- GitLab Settings -->
            <div v-if="form.type === 'gitlab'" class="space-y-6">
              <div>
                <label for="gitlab-url" class="block text-sm font-medium text-gray-700">
                  GitLab URL
                </label>
                <input
                  id="gitlab-url"
                  v-model="form.settings.baseUrl"
                  type="url"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://gitlab.com"
                />
              </div>
              <div>
                <label for="gitlab-token" class="block text-sm font-medium text-gray-700">
                  Personal Access Token
                </label>
                <input
                  id="gitlab-token"
                  v-model="form.credentials.token"
                  type="password"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="glpat-..."
                />
              </div>
            </div>

            <!-- Docker Settings -->
            <div v-if="form.type === 'docker'" class="space-y-6">
              <div>
                <label for="docker-url" class="block text-sm font-medium text-gray-700">
                  Docker Registry URL
                </label>
                <input
                  id="docker-url"
                  v-model="form.settings.registryUrl"
                  type="url"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://registry.hub.docker.com"
                />
              </div>
              <div>
                <label for="docker-username" class="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="docker-username"
                  v-model="form.credentials.username"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="username"
                />
              </div>
              <div>
                <label for="docker-password" class="block text-sm font-medium text-gray-700">
                  Password/Token
                </label>
                <input
                  id="docker-password"
                  v-model="form.credentials.password"
                  type="password"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="password or access token"
                />
              </div>
            </div>

            <!-- Kubernetes Settings -->
            <div v-if="form.type === 'kubernetes'" class="space-y-6">
              <div>
                <label for="k8s-cluster" class="block text-sm font-medium text-gray-700">
                  Cluster URL
                </label>
                <input
                  id="k8s-cluster"
                  v-model="form.settings.clusterUrl"
                  type="url"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://kubernetes.example.com"
                />
              </div>
              <div>
                <label for="k8s-namespace" class="block text-sm font-medium text-gray-700">
                  Default Namespace
                </label>
                <input
                  id="k8s-namespace"
                  v-model="form.settings.namespace"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="default"
                />
              </div>
              <div>
                <label for="k8s-token" class="block text-sm font-medium text-gray-700">
                  Service Account Token
                </label>
                <textarea
                  id="k8s-token"
                  v-model="form.credentials.token"
                  rows="4"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Paste your service account token here..."
                />
              </div>
            </div>

            <!-- HTTP Settings -->
            <div v-if="form.type === 'http'" class="space-y-6">
              <div>
                <label for="http-url" class="block text-sm font-medium text-gray-700">
                  Base URL
                </label>
                <input
                  id="http-url"
                  v-model="form.settings.baseUrl"
                  type="url"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://api.example.com"
                />
              </div>
              <div>
                <label for="http-auth-type" class="block text-sm font-medium text-gray-700">
                  Authentication Type
                </label>
                <select
                  id="http-auth-type"
                  v-model="form.credentials.type"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">None</option>
                  <option value="basic">Basic Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="api-key">API Key</option>
                </select>
              </div>
              
              <!-- Basic Auth -->
              <div v-if="form.credentials.type === 'basic'" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="http-username" class="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="http-username"
                    v-model="form.credentials.credentials.username"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="http-password" class="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="http-password"
                    v-model="form.credentials.credentials.password"
                    type="password"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <!-- Bearer Token -->
              <div v-if="form.credentials.type === 'bearer'">
                <label for="http-bearer-token" class="block text-sm font-medium text-gray-700">
                  Bearer Token
                </label>
                <input
                  id="http-bearer-token"
                  v-model="form.credentials.credentials.token"
                  type="password"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- API Key -->
              <div v-if="form.credentials.type === 'api-key'" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="http-api-key-header" class="block text-sm font-medium text-gray-700">
                    Header Name
                  </label>
                  <input
                    id="http-api-key-header"
                    v-model="form.credentials.credentials.header"
                    type="text"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="X-API-Key"
                  />
                </div>
                <div>
                  <label for="http-api-key-value" class="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    id="http-api-key-value"
                    v-model="form.credentials.credentials.key"
                    type="password"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Jenkins Settings -->
            <div v-if="form.type === 'jenkins'" class="space-y-6">
              <div>
                <label for="jenkins-url" class="block text-sm font-medium text-gray-700">
                  Jenkins URL
                </label>
                <input
                  id="jenkins-url"
                  v-model="form.settings.baseUrl"
                  type="url"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://jenkins.example.com"
                />
              </div>
              <div>
                <label for="jenkins-username" class="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="jenkins-username"
                  v-model="form.credentials.username"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="jenkins-token" class="block text-sm font-medium text-gray-700">
                  API Token
                </label>
                <input
                  id="jenkins-token"
                  v-model="form.credentials.apiToken"
                  type="password"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- SSH Settings -->
            <div v-if="form.type === 'ssh'" class="space-y-6">
              <div>
                <label for="ssh-host" class="block text-sm font-medium text-gray-700">
                  Host
                </label>
                <input
                  id="ssh-host"
                  v-model="form.settings.host"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="192.168.1.100"
                />
              </div>
              <div>
                <label for="ssh-port" class="block text-sm font-medium text-gray-700">
                  Port
                </label>
                <input
                  id="ssh-port"
                  v-model="form.settings.port"
                  type="number"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="22"
                />
              </div>
              <div>
                <label for="ssh-username" class="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="ssh-username"
                  v-model="form.credentials.username"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="ssh-key" class="block text-sm font-medium text-gray-700">
                  Private Key (optional)
                </label>
                <textarea
                  id="ssh-key"
                  v-model="form.credentials.privateKey"
                  rows="4"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="-----BEGIN PRIVATE KEY-----..."
                />
              </div>
              <div>
                <label for="ssh-password" class="block text-sm font-medium text-gray-700">
                  Password (if not using key)
                </label>
                <input
                  id="ssh-password"
                  v-model="form.credentials.password"
                  type="password"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- XL Deploy Settings -->
            <div v-if="form.type === 'xldeploy'" class="space-y-6">
              <div>
                <label for="xldeploy-url" class="block text-sm font-medium text-gray-700">
                  XL Deploy URL
                </label>
                <input
                  id="xldeploy-url"
                  v-model="form.settings.baseUrl"
                  type="url"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://xldeploy.example.com"
                />
              </div>
              <div>
                <label for="xldeploy-username" class="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="xldeploy-username"
                  v-model="form.credentials.username"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="xldeploy-password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="xldeploy-password"
                  v-model="form.credentials.password"
                  type="password"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Google Play Store Settings -->
            <div v-if="form.type === 'googleplaystore'" class="space-y-6">
              <div>
                <label for="play-package" class="block text-sm font-medium text-gray-700">
                  Package Name
                </label>
                <input
                  id="play-package"
                  v-model="form.settings.packageName"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="com.example.myapp"
                />
              </div>
              <div>
                <label for="play-service-account" class="block text-sm font-medium text-gray-700">
                  Service Account Key (JSON)
                </label>
                <textarea
                  id="play-service-account"
                  v-model="form.credentials.serviceAccountKey"
                  rows="6"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder='{"type": "service_account", "project_id": "..."}'
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$router.push('/connectors')"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="loading">Creating...</span>
              <span v-else>Create Connector</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const loading = ref(false)

const form = ref({
  name: '',
  type: '',
  settings: {},
  credentials: {}
})

const connectorTypes = {
  github: 'GitHub',
  gitlab: 'GitLab',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  githubactions: 'GitHub Actions',
  http: 'HTTP API',
  jenkins: 'Jenkins',
  ssh: 'SSH',
  xldeploy: 'XL Deploy',
  googleplaystore: 'Google Play Store'
}

watch(() => form.value.type, (newType) => {
  // Reset form when type changes
  form.value.settings = {}
  form.value.credentials = {}
})

function getConnectorTypeLabel(type: string) {
  return connectorTypes[type as keyof typeof connectorTypes] || type
}

async function handleSubmit() {
  loading.value = true
  
  try {
    await $fetch('/api/connectors', {
      method: 'POST',
      body: {
        name: form.value.name,
        type: form.value.type,
        settings: form.value.settings,
        credentials: form.value.credentials
      }
    })
    
    router.push('/connectors')
  } catch (error) {
    console.error('Failed to create connector:', error)
  } finally {
    loading.value = false
  }
}
</script> 