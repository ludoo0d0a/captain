<template>
  <div>
    <DashboardEnvironments v-if="viewMode === 'environment'" />
    <DashboardApplications v-else-if="viewMode === 'app'" />
  </div>
</template>

<script setup lang="ts">
// Inject the viewMode from the parent app
const viewMode = inject('viewMode') as Ref<'environment' | 'app'>
</script> 