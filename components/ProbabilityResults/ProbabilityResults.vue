<template>
  <div v-if="probability !== null" class="bg-sakai-surface dark:bg-sakai-surface-800 rounded-xl shadow-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-6 text-center">
    <div class="text-6xl font-bold mb-2 transition-colors duration-300"
         :class="probabilityColorClass">
      {{ (probability * 100).toFixed(2) }}%
    </div>
    <div class="text-lg text-sakai-text-secondary dark:text-sakai-surface-300 mb-6">
      {{ $t('results.chanceDescription') }}
    </div>
    
    <div class="w-full bg-sakai-surface-200 dark:bg-sakai-surface-600 rounded-full h-3 overflow-hidden mb-6">
      <div 
        class="h-full transition-all duration-500 ease-out"
        :class="progressBarClass"
        :style="{ width: `${probability * 100}%` }"
      ></div>
    </div>
    
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
           :class="consistencyClasses">
        {{ consistencyRating }}
      </div>
      
      <button 
        @click="$emit('share-results')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-sakai-primary hover:bg-sakai-primary-dark text-white font-medium text-sm rounded-lg transition-colors duration-200"
      >
        <Icon name="heroicons:share" class="w-4 h-4" />
        {{ $t('results.shareButton') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  probability: number | null
  consistencyRating: string
  consistencyClasses: string
  probabilityColorClass: string
  progressBarClass: string
}

defineProps<Props>()

defineEmits<{
  'share-results': []
}>()
</script>