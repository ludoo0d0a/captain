<template>
  <div class="max-w-3xl mx-auto py-10">
    <h1 class="text-3xl font-bold mb-4">Settings</h1>
    <p class="text-gray-600 mb-8">Manage your application, connector, and system settings from here.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <NuxtLink to="/settings/network" class="block bg-white rounded shadow p-6 hover:shadow-md transition">
        <div class="flex items-center mb-2">
          <Icon name="heroicons:server" class="w-6 h-6 mr-2 text-blue-500" />
          <span class="font-semibold text-lg">Network</span>
        </div>
        <p class="text-sm text-gray-500">Configure global network and proxy settings for all connectors.</p>
      </NuxtLink>
      <NuxtLink to="/connectors" class="block bg-white rounded shadow p-6 hover:shadow-md transition">
        <div class="flex items-center mb-2">
          <Icon name="heroicons:link" class="w-6 h-6 mr-2 text-green-500" />
          <span class="font-semibold text-lg">Connectors</span>
        </div>
        <p class="text-sm text-gray-500">Manage, add, and configure third-party connectors and integrations.</p>
      </NuxtLink>
      <NuxtLink to="/settings/database" class="block bg-white rounded shadow p-6 hover:shadow-md transition">
        <div class="flex items-center mb-2">
          <Icon name="heroicons:database" class="w-6 h-6 mr-2 text-purple-500" />
          <span class="font-semibold text-lg">Database</span>
        </div>
        <p class="text-sm text-gray-500">Manage database settings and perform maintenance tasks.</p>
      </NuxtLink>
    </div>
    <div>
      <h2 class="text-xl font-semibold mb-4">Connector Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="connector in connectorTypes"
          :key="connector.id"
          :to="`/settings/connectors/${connector.id}`"
          class="block bg-white rounded shadow p-4 hover:shadow-md transition flex items-center"
        >
          <Icon :name="connector.icon" class="w-5 h-5 mr-2" />
          <span class="font-medium">{{ connector.label }}</span>
        </NuxtLink>
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