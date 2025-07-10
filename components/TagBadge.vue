<template>
  <span :class="badgeClass" class="inline-block text-xs rounded px-2 py-1 min-w-[2.5rem] text-center font-medium">
    {{ tag }}
  </span>
</template>
<script setup lang="ts">
const props = defineProps<{ tag: string }>()
const palette = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-purple-100 text-purple-800',
  'bg-red-100 text-red-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-200 text-gray-700',
]
function hashTag(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}
const badgeClass = computed(() => {
  const idx = hashTag(props.tag) % palette.length
  return palette[idx]
})
</script> 