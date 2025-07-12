<template>
  <span :class="chipClass" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 hover:shadow-sm">
    {{ tag }}
  </span>
</template>
<script setup lang="ts">
const props = defineProps<{ tag: string }>()
const palette = [
  'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100',
  'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100',
  'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100',
  'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100',
  'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100',
  'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100',
  'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100',
  'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100',
  'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100',
]
function hashTag(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}
const chipClass = computed(() => {
  const idx = hashTag(props.tag) % palette.length
  return palette[idx]
})
</script> 