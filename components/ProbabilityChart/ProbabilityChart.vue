<template>
  <div class="probability-chart-container">
    <!-- Chart Header -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-sakai-text-primary dark:text-white mb-2">
        {{ $t('chart.probabilityAnalysis') }}
      </h3>
      <p class="text-sm text-sakai-text-secondary dark:text-gray-300">
        {{ $t('chart.analysisDescription') }}
      </p>
    </div>

    <!-- Chart Controls -->
    <div class="mb-4 flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <label 
          for="analysis-range" 
          class="text-sm font-medium text-sakai-text-primary dark:text-white"
        >
          {{ $t('chart.analysisRange') }}:
        </label>
        <select 
          id="analysis-range"
          v-model="analysisRange"
          class="rounded border-sakai-surface-300 dark:border-sakai-surface-600 
                 bg-white dark:bg-sakai-surface-800 text-sm px-2 py-1
                 focus:border-sakai-primary focus:ring-sakai-primary"
        >
          <option value="10">1-10 Cards</option>
          <option value="15">1-15 Cards</option>
          <option value="20">1-20 Cards</option>
          <option value="30">1-30 Cards</option>
        </select>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="refreshChart"
          class="text-sm px-3 py-1 rounded bg-sakai-primary text-white
                 hover:bg-sakai-primary-dark transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-sakai-primary focus:ring-offset-2"
        >
          {{ $t('chart.refresh') }}
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="chart-wrapper relative bg-white dark:bg-sakai-surface-800 rounded-lg shadow-sm border border-sakai-surface-200 dark:border-sakai-surface-700 p-4">
      <div 
        v-if="isLoading" 
        class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-sakai-surface-800/80 rounded-lg z-10"
      >
        <div class="flex items-center gap-2 text-sakai-text-secondary">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-sakai-primary"></div>
          <span class="text-sm">{{ $t('chart.generating') }}</span>
        </div>
      </div>
      
      <canvas
        ref="chartCanvas"
        class="w-full h-80"
        :class="{ 'opacity-50': isLoading }"
      ></canvas>
    </div>

    <!-- Chart Legend -->
    <div class="mt-4 text-xs text-sakai-text-secondary dark:text-gray-400">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-sakai-primary rounded-full"></div>
          <span>{{ $t('chart.probabilityCurve') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-1 bg-green-500" style="border: 1px dashed;"></div>
          <span>{{ $t('chart.optimalThreshold') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>{{ $t('chart.optimalPoints') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS } from 'chart.js'
import type { CardGroupWithId, DeckConfig } from '~/interfaces'

interface Props {
  deckConfig: DeckConfig
  cardGroups: CardGroupWithId[]
}

const props = defineProps<Props>()

// Composables
const { 
  ChartJS: ChartJSConstructor,
  createProbabilityChartData,
  createBaseChartOptions,
  updateChartTheme,
  addOptimalAnnotations 
} = useChart()

// Template refs
const chartCanvas = ref<HTMLCanvasElement | null>(null)

// Reactive state
const chart = ref<ChartJS | null>(null)
const analysisRange = ref(20)
const isLoading = ref(false)

// Initialize chart on mount
onMounted(() => {
  nextTick(() => {
    initializeChart()
  })
})

// Clean up chart on unmount
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy()
  }
})

// Watch for changes and update chart
watch([
  () => props.deckConfig,
  () => props.cardGroups,
  analysisRange
], () => {
  updateChart()
}, { deep: true })

// Watch for dark mode changes
const isDarkMode = ref(false)
onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
  
  // Watch for dark mode changes
  const observer = new MutationObserver(() => {
    const newIsDarkMode = document.documentElement.classList.contains('dark')
    if (newIsDarkMode !== isDarkMode.value) {
      isDarkMode.value = newIsDarkMode
      if (chart.value) {
        updateChartTheme(chart.value)
      }
    }
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  
  onUnmounted(() => {
    observer.disconnect()
  })
})

// Initialize the chart
const initializeChart = () => {
  if (!chartCanvas.value || !ChartJSConstructor) return

  const chartData = createProbabilityChartData(
    props.deckConfig,
    props.cardGroups,
    analysisRange.value
  )
  
  const chartOptions = createBaseChartOptions()

  chart.value = new ChartJSConstructor(chartCanvas.value, {
    type: 'line',
    data: chartData,
    options: chartOptions
  })
}

// Update chart data
const updateChart = async () => {
  if (!chart.value) return

  isLoading.value = true
  
  try {
    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newData = createProbabilityChartData(
      props.deckConfig,
      props.cardGroups,
      analysisRange.value
    )
    
    chart.value.data = newData
    
    // Find optimal points for annotations
    const optimalPoints: { x: number; y: number }[] = []
    newData.datasets[0].data.forEach((value, index) => {
      if (typeof value === 'number' && value >= 75) {
        optimalPoints.push({ x: index, y: value })
      }
    })
    
    // Add optimal point annotations
    addOptimalAnnotations(chart.value, optimalPoints)
    
    chart.value.update()
  } finally {
    isLoading.value = false
  }
}

// Refresh chart manually
const refreshChart = () => {
  updateChart()
}

// Expose methods for parent component
defineExpose({
  refreshChart,
  updateChart
})
</script>

<style scoped>
.probability-chart-container {
  @apply w-full;
}

.chart-wrapper {
  min-height: 320px;
}

/* Chart responsive adjustments */
@media (max-width: 640px) {
  .chart-wrapper {
    min-height: 280px;
  }
  
  .chart-wrapper canvas {
    height: 280px !important;
  }
}
</style>