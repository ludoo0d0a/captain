<template>
  <div class="max-w-4xl mx-auto py-10">
    <h1 class="text-3xl font-bold mb-6">Settings Overview</h1>
    <p class="text-gray-600 mb-8">Configure your application settings, connectors, and system preferences.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Connectors Section -->
      <div class="border rounded-lg p-6 bg-white shadow">
        <h2 class="text-lg font-semibold mb-3 flex items-center">
          <Icon name="heroicons:link" class="w-5 h-5 mr-2 text-gray-500" /> Connectors
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          Configure third-party integrations for your applications and deployments.
        </p>
        <div class="space-y-2">
          <NuxtLink
            v-for="connector in connectorTypes"
            :key="connector.id"
            :to="`/settings/connectors/${connector.id}`"
            class="flex items-center text-sm hover:underline"
          >
            <Icon :name="connector.icon" class="h-4 w-4 mr-2 text-gray-500" />
            {{ connector.label }}
          </NuxtLink>
        </div>
      </div>
      <!-- System Section -->
      <div class="border rounded-lg p-6 bg-white shadow">
        <h2 class="text-lg font-semibold mb-3 flex items-center">
          <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 mr-2 text-gray-500" /> System
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          Manage connectors and system preferences.
        </p>
        <div class="space-y-2">
          <NuxtLink to="/settings/database" class="flex items-center text-sm hover:underline">
            <Icon name="heroicons:server" class="h-4 w-4 mr-2 text-gray-500" /> Database
          </NuxtLink>
          <NuxtLink to="/settings/network" class="flex items-center text-sm hover:underline">
            <Icon name="heroicons:server" class="h-4 w-4 mr-2 text-gray-500" /> Network
          </NuxtLink>
          <NuxtLink to="/settings/connectors" class="flex items-center text-sm hover:underline">
            <Icon name="heroicons:link" class="h-4 w-4 mr-2 text-gray-500" /> Connector Management
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const connectorTypes = [
  { id: 'github', label: 'GitHub', icon: 'heroicons:code-bracket' },
  { id: 'gitlab', label: 'GitLab', icon: 'heroicons:command-line' },
  { id: 'docker', label: 'Docker', icon: 'heroicons:cube' },
  { id: 'kubernetes', label: 'Kubernetes', icon: 'heroicons:cog-6-tooth' },
  { id: 'githubactions', label: 'GitHub Actions', icon: 'heroicons:play' },
  { id: 'http', label: 'HTTP API', icon: 'heroicons:globe-alt' },
  { id: 'jenkins', label: 'Jenkins', icon: 'heroicons:wrench-screwdriver' },
  { id: 'ssh', label: 'SSH', icon: 'heroicons:computer-desktop' },
  { id: 'xldeploy', label: 'XL Deploy', icon: 'heroicons:server' },
  { id: 'googleplaystore', label: 'Google Play Store', icon: 'heroicons:device-phone-mobile' },
  { id: 'jira', label: 'Jira', icon: 'heroicons:clipboard-document-list' }
]
</script> 