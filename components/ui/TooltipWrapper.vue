<template>
  <div class="relative">
    <div class="flex items-center gap-2">
      <slot name="label" />
      <button 
        @click="$emit('toggle-tooltip', tooltipId)" 
        data-tooltip-trigger 
        class="text-sakai-text-secondary hover:text-sakai-primary transition-colors"
      >
        <Icon name="heroicons:information-circle" class="w-4 h-4" />
      </button>
    </div>
    <slot name="content" />
    <div 
      v-if="isActive" 
      data-tooltip 
      class="absolute z-10 bg-sakai-text-primary text-white text-xs rounded py-2 px-3 top-full left-0 mt-1 whitespace-nowrap shadow-lg"
    >
      {{ tooltipText }}
      <div class="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-sakai-text-primary"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tooltipId: string
  tooltipText: string
  isActive: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-tooltip': [id: string]
}>()
</script>