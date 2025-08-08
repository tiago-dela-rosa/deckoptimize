<template>
  <div>
    <LoadingScreen :is-loading="isLoading" />
    
    <CopyNotification :show-notification="showCopyNotification" />

    <!-- Main Content -->
    <div v-show="!isLoading">
      <div class="max-w-6xl mx-auto p-4 space-y-6">
        

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          <!-- Starter Opening Chart -->
          <div class="xl:col-span-2">
            <StarterOpeningChart />
          </div>

          <!-- Future charts can be added here -->
          <!-- 
          <div>
            <ProbabilityChart
              :deck-config="deckConfig"
              :card-groups="cardGroups"
              title="Opening Hand Analysis"
              description="Probability of different opening hand scenarios"
            />
          </div>
          -->

        </div>

        <!-- Chart Controls & Filters (Future Enhancement) -->
        <!-- 
        <div class="bg-white dark:bg-sakai-surface-800 rounded-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-sakai-text-primary dark:text-white mb-4">
            {{ $t('charts.controls.title') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-sakai-text-primary dark:text-white mb-2">
                {{ $t('charts.controls.maxCards') }}
              </label>
              <select class="w-full px-3 py-2 border border-sakai-surface-300 dark:border-sakai-surface-600 rounded-lg bg-white dark:bg-sakai-surface-700 text-sakai-text-primary dark:text-white">
                <option value="15">15 cards</option>
                <option value="20" selected>20 cards</option>
                <option value="30">30 cards</option>
              </select>
            </div>
          </div>
        </div>
        -->

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import LoadingScreen from '~/components/LoadingScreen.vue'
import CopyNotification from '~/components/CopyNotification.vue'
import StarterOpeningChart from '~/components/Charts/StarterOpeningChart/StarterOpeningChart.vue'

// Meta tags
useHead({
  title: 'Charts - Deck Optimize',
  meta: [
    { name: 'description', content: 'Visualize your deck optimization with interactive charts and probability analysis.' }
  ]
})

// Get shared URL state from middleware
const hasSharedUrl = useState('hasSharedUrl', () => false)
const sharedUrlData = useState('sharedUrlData', () => null)

// Composables
const { deckConfig, cardGroups, loadSharedData } = useDeckState()
const { showCopyNotification, shareResults } = useSharedUrl()
// const { t } = useI18n() // Disabled for now

// Local state
const isLoading = ref(hasSharedUrl.value || false)

// Computed properties
const activeGroupsCount = computed(() => {
  return cardGroups.value.filter(group => group.copies > 0 && (group.minNeeded > 0 || group.maxNeeded > 0)).length
})

const hasActiveGroups = computed(() => activeGroupsCount.value > 0)

// Functions
function handleSharedUrl(encodedData: string) {
  setTimeout(() => {
    const { decodeFormData } = useSharedUrl()
    const decodedData = decodeFormData(encodedData)
    if (decodedData) {
      loadSharedData(decodedData)
    }
    isLoading.value = false
  }, 800)
}

function handleShareResults() {
  shareResults(deckConfig.value, cardGroups.value)
}

// Watchers
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

// Lifecycle
onMounted(() => {
  if (!hasSharedUrl.value) {
    isLoading.value = false
  }
})
</script>