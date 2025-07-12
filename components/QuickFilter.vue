<template>
  <div class="w-full">
    <div class="flex flex-wrap items-center gap-2">
      <!-- Dismissable selected tags -->
      <div v-for="tag in selectedTags" :key="tag" class="flex items-center">
        <TagBadge :tag="tag" class="mr-1" />
        <button @click="removeTag(tag)" class="ml-[-0.5rem] text-gray-400 hover:text-red-500 focus:outline-none" title="Remove tag">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Text input -->
      <input
        :placeholder="placeholder || 'Quick filter by name or tag'"
        class="border rounded px-2 py-1 text-sm flex-1 min-w-[180px]"
        :value="modelValue"
        @input="onInput"
        @keydown.down.prevent="openDropdown = true"
      />
      <!-- Tag selector dropdown -->
      <div class="relative">
        <button @click="toggleDropdown" class="p-1 rounded hover:bg-gray-100 border border-gray-200" title="Select tags">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <div v-if="openDropdown" class="absolute z-20 bg-white border rounded shadow mt-1 w-48 max-h-48 overflow-auto">
          <div v-if="filteredTags.length === 0" class="px-3 py-2 text-xs text-gray-400">No tags</div>
          <div v-for="tag in filteredTags" :key="tag" class="px-2 py-1 cursor-pointer hover:bg-blue-50 flex items-center gap-2" @mousedown.prevent="addTag(tag)">
            <TagBadge :tag="tag" />
            <span class="text-xs">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TagBadge from './TagBadge.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  allTags: { type: Array as () => string[], default: () => [] },
  selectedTags: { type: Array as () => string[], default: () => [] },
  placeholder: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'update:selectedTags'])

const openDropdown = ref(false)

function toggleDropdown() {
  openDropdown.value = !openDropdown.value
}
function addTag(tag: string) {
  if (!props.selectedTags.includes(tag)) {
    emit('update:selectedTags', [...props.selectedTags, tag])
  }
  openDropdown.value = false
}
function removeTag(tag: string) {
  emit('update:selectedTags', props.selectedTags.filter(t => t !== tag))
}
const filteredTags = computed(() => {
  return props.allTags.filter(tag => !props.selectedTags.includes(tag))
})
function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
// Close dropdown on outside click
function onClickOutside(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('.relative')) {
    openDropdown.value = false
  }
}
watch(openDropdown, (open) => {
  if (open) {
    window.addEventListener('mousedown', onClickOutside)
  } else {
    window.removeEventListener('mousedown', onClickOutside)
  }
})
</script> 