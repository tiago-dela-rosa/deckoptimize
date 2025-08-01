<template>
  <div>
    <LoadingScreen :is-loading="isLoading" />
    
    <CopyNotification :show-notification="showCopyNotification" />

    <!-- Main Content -->
    <div v-show="!isLoading">
      <div class="max-w-4xl mx-auto p-4 space-y-4">

        <DeckConfiguration
          :deck-config="deckConfig"
          :assigned-cards="assignedCards"
          :active-tooltip="activeTooltip"
          @increment-total="incrementTotal"
          @decrement-total="decrementTotal"
          @increment-hand="incrementHand"
          @decrement-hand="decrementHand"
          @update-total="updateTotal"
          @update-hand="updateHand"
          @toggle-tooltip="toggleTooltip"
        />

        <QuickExamples
          ref="quickExamplesRef"
          @load-example="loadExample"
        />

        <CardGroups
          :card-groups="cardGroups"
          :total-cards="deckConfig.totalCards"
          :active-tooltip="activeTooltip"
          @add-group="addGroup"
          @remove-group="removeGroup"
          @calculate-probability="calculateProbabilityAndUpdate"
          @toggle-tooltip="toggleTooltip"
        />

        <ProbabilityResults
          :probability="probability"
          :consistency-rating="getConsistencyRating(probability)"
          :consistency-classes="getConsistencyClasses(probability)"
          :probability-color-class="getProbabilityColorClass(probability)"
          :progress-bar-class="getProgressBarClass(probability)"
          @share-results="handleShareResults"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { PrebuiltExample } from '~/interfaces'
import LoadingScreen from '~/components/LoadingScreen.vue'
import CopyNotification from '~/components/CopyNotification.vue'
import DeckConfiguration from '~/components/DeckConfiguration.vue'
import QuickExamples from '~/components/QuickExamples/QuickExamples.vue'
import CardGroups from '~/components/CardGroups.vue'
import ProbabilityResults from '~/components/ProbabilityResults/ProbabilityResults.vue'
import { trackShareButtonClicked } from '~/components/ProbabilityResults/probabilityResults.events'

// Get shared URL state from middleware
const hasSharedUrl = useState('hasSharedUrl', () => false)
const sharedUrlData = useState('sharedUrlData', () => null)

// Composables
const { deckConfig, cardGroups, assignedCards, addGroup, removeGroup, decrementTotal, incrementTotal, decrementHand, incrementHand, updateTotal, updateHand, loadSharedData } = useDeckState()
const { calculateProbability, getConsistencyRating, getConsistencyClasses, getProbabilityColorClass, getProgressBarClass } = useProbabilityCalculator()
const { showCopyNotification, shareResults } = useSharedUrl()
const { activeTooltip, toggleTooltip, setupClickOutside } = useTooltips()

// Local state
const probability = ref<number | null>(null)
const isLoading = ref(hasSharedUrl.value || false)
const quickExamplesRef = ref()

// Watchers
watch(probability, (newResult) => {
  if (newResult) {
    isLoading.value = false
  }
})

watch(hasSharedUrl, (newValue) => {
  if (newValue) {
    isLoading.value = true
  }
}, { immediate: true })

watch(sharedUrlData, (newData) => {
  if (newData && hasSharedUrl.value) {
    handleSharedUrl(newData as string)
  }
}, { immediate: true })

// Functions
function loadExample(example: PrebuiltExample) {
  deckConfig.value = { ...example.config }
  cardGroups.value = example.config.groups.map((group, index) => ({
    id: index + 1,
    name: group.name,
    copies: group.copies,
    minNeeded: group.minNeeded,
    maxNeeded: group.maxNeeded
  }))
  
  if (quickExamplesRef.value) {
    quickExamplesRef.value.setSelection(example.id)
  }
  
  calculateProbabilityAndUpdate()
}

function handleSharedUrl(encodedData: string) {
  setTimeout(() => {
    const { decodeFormData } = useSharedUrl()
    const decodedData = decodeFormData(encodedData)
    if (decodedData) {
      loadSharedData(decodedData)
      calculateProbabilityAndUpdate()
    }
    isLoading.value = false
  }, 800)
}

function calculateProbabilityAndUpdate() {
  probability.value = calculateProbability(deckConfig.value, cardGroups.value)
}

// Handle deck config updates manually since we removed the @update:deck-config
watch([() => deckConfig.value.totalCards, () => deckConfig.value.handSize], () => {
  calculateProbabilityAndUpdate()
})

function handleShareResults() {
  trackShareButtonClicked(deckConfig.value, cardGroups.value, probability.value || 0)
  shareResults(deckConfig.value, cardGroups.value)
}

onMounted(() => {
  setupClickOutside()
  
  if (!hasSharedUrl.value) {
    calculateProbabilityAndUpdate()
  }
})
</script>