<template>
  <div class="max-w-2xl mx-auto py-10">
    <ConnectorSettingsForm :connector-id="connectorId" @saved="handleSaved" @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import ConnectorSettingsForm from '~/components/ConnectorSettingsForm.vue'

const route = useRoute()
const router = useRouter()
const connectorId = route.params.connectorId as string

function handleSaved() {
  router.push('/settings')
}
function handleCancel() {
  router.push('/settings')
}
</script> 