<template>
  <div class="bg-sakai-surface dark:bg-sakai-surface-800 rounded-xl shadow-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-4">
    <div class="flex items-center gap-2 text-sakai-text-primary dark:text-white font-semibold text-lg mb-3">
      <Icon name="heroicons:squares-2x2" class="w-6 h-6 text-sakai-primary" />
      <span>Quick Examples</span>
    </div>
    
    <div class="space-y-2">
      <select 
        v-model="selectedExample"
        @change="handleExampleChange(selectedExample)"
        class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-700 focus:border-sakai-primary focus:ring-sakai-primary dark:text-white text-sakai-text-primary"
      >
        <option disabled selected value="">Choose a Prebuilt Example</option>
        <option 
          v-for="example in prebuiltExamples" 
          :key="example.id" 
          :value="example.id"
        >
          {{ example.name }}
        </option>
      </select>
      <p class="text-xs text-sakai-text-secondary dark:text-sakai-surface-300">
        Select an example to automatically fill the form with common deck scenarios
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { prebuiltExamples as examples, getExampleById } from '~/helpers/examples'
import type { PrebuiltExample } from '~/interfaces'

const selectedExample = ref('')
const prebuiltExamples = ref(examples)

const emit = defineEmits<{
  'load-example': [example: PrebuiltExample]
}>()

function handleExampleChange(exampleId: string) {
  const example = getExampleById(exampleId)
  if (example) {
    emit('load-example', example)
  }
}

// Watch for external changes to reset selection
defineExpose({
  resetSelection: () => {
    selectedExample.value = ''
  },
  setSelection: (id: string) => {
    selectedExample.value = id
  }
})
</script>