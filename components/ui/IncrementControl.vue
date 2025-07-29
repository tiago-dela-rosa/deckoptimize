<template>
  <div class="flex items-center">
    <button 
      @click="$emit('decrement')"
      class="px-3 py-2 bg-sakai-surface-100 dark:bg-sakai-surface-700 hover:bg-sakai-surface-200 dark:hover:bg-sakai-surface-600 rounded-l-lg transition-colors border border-sakai-surface-300 dark:border-sakai-surface-600 text-sakai-text-primary dark:text-white"
      :disabled="decrementDisabled"
    >
      -
    </button>
    
    <input 
      :id="inputId"
      :value="value" 
      @input="$emit('update:value', ($event.target as HTMLInputElement).valueAsNumber)"
      type="number"
      :min="min" 
      :max="max"
      class="block w-full rounded-none border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-700 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white"
      :title="title"
    />
    
    <button 
      @click="$emit('increment')"
      class="px-3 py-2 bg-sakai-surface-100 dark:bg-sakai-surface-700 hover:bg-sakai-surface-200 dark:hover:bg-sakai-surface-600 rounded-r-lg transition-colors border border-sakai-surface-300 dark:border-sakai-surface-600 text-sakai-text-primary dark:text-white"
      :disabled="incrementDisabled"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number
  min: number
  max: number
  inputId?: string
  title?: string
  decrementDisabled?: boolean
  incrementDisabled?: boolean
}

defineProps<Props>()

defineEmits<{
  'update:value': [value: number],
  increment: [],
  decrement: []
}>()
</script>