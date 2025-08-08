<template>
  <div class="starter-opening-chart">
    <!-- Chart Header -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-sakai-text-primary dark:text-white mb-2">
        {{ t('probabilityChart.title') }}
      </h2>
      <p class="text-sm text-sakai-text-secondary dark:text-slate-300">
        {{ t('probabilityChart.description') }}
      </p>
    </div>

    <!-- Chart Container -->
    <div class="bg-white dark:bg-sakai-surface-800 rounded-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-6 shadow-sm relative">
      <!-- Loading State -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-sakai-surface-800 rounded-lg z-10">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sakai-primary"></div>
          <span class="text-sakai-text-secondary">{{ t('loading.title') }}</span>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-wrapper">
        <canvas 
          ref="chartCanvas" 
          class="max-h-96 w-full"
          aria-label="Chart showing probability of opening with starter cards"
          role="img"
        ></canvas>
      </div>

      <!-- Chart Configuration Panel -->
      <div class="mt-6 bg-sakai-surface-50 dark:bg-sakai-surface-700 rounded-lg p-4 border-t border-sakai-surface-200 dark:border-sakai-surface-600">
        <h3 class="text-sm font-semibold text-sakai-text-primary dark:text-white mb-4">
          {{ t('probabilityChart.settings.title') }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <!-- Chart Title -->
          <div class="sm:col-span-2 lg:col-span-1">
            <label for="chartTitle" class="block text-sm font-medium text-sakai-text-primary dark:text-white mb-2">
              {{ t('probabilityChart.settings.cardTypeName.label') }}
            </label>
            <input
              id="chartTitle"
              v-model="chartTitle"
              type="text"
              :placeholder="t('probabilityChart.settings.cardTypeName.placeholder')"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-sakai-surface-300 dark:border-sakai-surface-600 rounded-lg bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-sakai-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <!-- Deck Size -->
          <div>
            <label for="deckSize" class="block text-sm font-medium text-sakai-text-primary dark:text-white mb-2">
              {{ t('probabilityChart.settings.cardsInDeck') }}
            </label>
            <input
              id="deckSize"
              v-model.number="localDeckSize"
              type="number"
              :min="30"
              :max="60"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-sakai-surface-300 dark:border-sakai-surface-600 rounded-lg bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-sakai-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <!-- Hand Size -->
          <div>
            <label for="handSize" class="block text-sm font-medium text-sakai-text-primary dark:text-white mb-2">
              {{ t('probabilityChart.settings.handSize') }}
            </label>
            <input
              id="handSize"
              v-model.number="localHandSize"
              type="number"
              :min="4"
              :max="6"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-sakai-surface-300 dark:border-sakai-surface-600 rounded-lg bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-sakai-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Probability Scenarios -->
        <div class="border-t border-sakai-surface-200 dark:border-sakai-surface-600 pt-4">
          <h4 class="text-sm font-semibold text-sakai-text-primary dark:text-white mb-3">
            {{ t('probabilityChart.scenarios.title') }}
          </h4>
          
          <!-- Mode Selection -->
          <div class="mb-4">
            <div class="flex flex-wrap gap-2">
              <button
                @click="scenarioMode = 'atLeast'"
                :class="[
                  'px-3 py-2 text-sm rounded-lg border transition-colors',
                  scenarioMode === 'atLeast'
                    ? 'bg-sakai-primary text-white border-sakai-primary'
                    : 'bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white border-sakai-surface-300 dark:border-sakai-surface-600 hover:border-sakai-primary'
                ]"
                :disabled="isLoading"
              >
                {{ t('probabilityChart.scenarios.modes.atLeast') }}
              </button>
              <button
                @click="scenarioMode = 'exactly'"
                :class="[
                  'px-3 py-2 text-sm rounded-lg border transition-colors',
                  scenarioMode === 'exactly'
                    ? 'bg-sakai-primary text-white border-sakai-primary'
                    : 'bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white border-sakai-surface-300 dark:border-sakai-surface-600 hover:border-sakai-primary'
                ]"
                :disabled="isLoading"
              >
                {{ t('probabilityChart.scenarios.modes.exactly') }}
              </button>
              <button
                @click="scenarioMode = 'between'"
                :class="[
                  'px-3 py-2 text-sm rounded-lg border transition-colors',
                  scenarioMode === 'between'
                    ? 'bg-sakai-primary text-white border-sakai-primary'
                    : 'bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white border-sakai-surface-300 dark:border-sakai-surface-600 hover:border-sakai-primary'
                ]"
                :disabled="isLoading"
              >
                {{ t('probabilityChart.scenarios.modes.between') }}
              </button>
            </div>
          </div>

          <!-- Quick Select -->
          <div class="mb-4">
            <label class="block text-xs font-medium text-sakai-text-secondary dark:text-slate-300 mb-2">
              {{ t('probabilityChart.scenarios.quickSelect') }}
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="num in [1, 2, 3, 4, 5]"
                :key="num"
                @click="addScenario(num)"
                :disabled="isLoading"
                class="w-10 h-10 text-sm font-medium rounded-lg border-2 bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white border-sakai-surface-300 dark:border-sakai-surface-600 hover:border-sakai-primary hover:bg-sakai-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ num }}
              </button>
            </div>
          </div>

          <!-- Between Mode Inputs -->
          <div v-if="scenarioMode === 'between'" class="mb-4 flex gap-3 items-end">
            <div class="flex-1">
              <label class="block text-xs font-medium text-sakai-text-secondary dark:text-slate-300 mb-1">
                {{ t('probabilityChart.scenarios.betweenInputs.min') }}
              </label>
              <input
                v-model.number="betweenMin"
                type="number"
                :min="1"
                :max="localHandSize"
                :disabled="isLoading"
                class="w-full px-2 py-1 text-sm border border-sakai-surface-300 dark:border-sakai-surface-600 rounded bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-sakai-primary disabled:opacity-50"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-medium text-sakai-text-secondary dark:text-slate-300 mb-1">
                {{ t('probabilityChart.scenarios.betweenInputs.max') }}
              </label>
              <input
                v-model.number="betweenMax"
                type="number"
                :min="betweenMin || 1"
                :max="localHandSize"
                :disabled="isLoading"
                class="w-full px-2 py-1 text-sm border border-sakai-surface-300 dark:border-sakai-surface-600 rounded bg-white dark:bg-sakai-surface-800 text-sakai-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-sakai-primary disabled:opacity-50"
              />
            </div>
            <button
              @click="addBetweenScenario"
              :disabled="isLoading || !canAddBetween"
              class="px-3 py-1 text-sm bg-sakai-primary text-white rounded hover:bg-sakai-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('probabilityChart.scenarios.betweenInputs.addLine') }}
            </button>
          </div>

          <!-- Active Scenarios -->
          <div v-if="activeScenarios.length > 0" class="border-t border-sakai-surface-200 dark:border-sakai-surface-600 pt-3">
            <label class="block text-xs font-medium text-sakai-text-secondary dark:text-slate-300 mb-2">
              {{ t('probabilityChart.scenarios.activeLines') }}
            </label>
            <div class="space-y-2">
              <div
                v-for="scenario in activeScenarios"
                :key="scenario.id"
                class="flex items-center justify-between bg-white dark:bg-sakai-surface-800 rounded px-3 py-2 border border-sakai-surface-200 dark:border-sakai-surface-600"
              >
                <div class="flex items-center gap-2">
                  <div
                    :style="{ backgroundColor: scenario.color }"
                    class="w-3 h-3 rounded-full"
                  ></div>
                  <span class="text-sm text-sakai-text-primary dark:text-white">
                    {{ getScenarioLabel(scenario) }}
                  </span>
                </div>
                <button
                  @click="removeScenario(scenario.id)"
                  :disabled="isLoading"
                  class="w-6 h-6 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, type ChartConfiguration } from 'chart.js'
import { starterOpeningData, chartConfig, getMarginalGains } from './starterData'

// Chart instance and canvas ref
const chartCanvas = ref<HTMLCanvasElement>()
const chartInstance = ref<Chart>()
const isLoading = ref(true) // Start with true to show loading
const isInitialized = ref(false)

// Configuration state
const localDeckSize = ref(40)
const localHandSize = ref(5)
const chartTitle = ref('Starters')

// Scenario types and interfaces
type ScenarioMode = 'atLeast' | 'exactly' | 'between'
interface Scenario {
  id: string
  type: ScenarioMode
  value: number
  minValue?: number
  maxValue?: number
  color: string
  label: string
}

// Scenario state
const scenarioMode = ref<ScenarioMode>('atLeast')
const betweenMin = ref(1)
const betweenMax = ref(2)
const activeScenarios = ref<Scenario[]>([])
let scenarioCounter = 0

// Color palette for different scenario lines
const scenarioColors = [
  '#10b981', // green-600
  '#3b82f6', // blue-600
  '#f59e0b', // yellow-600
  '#ef4444', // red-600
  '#8b5cf6', // violet-600
  '#f97316', // orange-600
  '#06b6d4', // cyan-600
  '#84cc16', // lime-600
]

// Composables
const { getProbabilityColorClass, getConsistencyRating } = useProbabilityCalculator()
const { t } = useI18n()

// Simple dark mode detection without reactivity issues
const isDarkMode = () => {
  if (typeof window !== 'undefined' && document.documentElement) {
    return document.documentElement.classList.contains('dark')
  }
  return false
}

// Dynamic probability calculation functions
const hypergeometric = (N: number, K: number, n: number, k: number): number => {
  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return 0
    if (r === 0 || r === n) return 1
    
    let result = 1
    for (let i = 0; i < Math.min(r, n - r); i++) {
      result = result * (n - i) / (i + 1)
    }
    return Math.floor(result)
  }

  const numerator = combination(K, k) * combination(N - K, n - k)
  const denominator = combination(N, n)
  
  return denominator === 0 ? 0 : numerator / denominator
}

const calculateStarterProbability = (deckSize: number, handSize: number, starters: number): number => {
  const probZeroStarters = hypergeometric(deckSize, starters, handSize, 0)
  const probAtLeastOne = 1 - probZeroStarters
  return Math.round(probAtLeastOne * 10000) / 100
}

// Calculate probability for different scenarios
const calculateScenarioProbability = (
  deckSize: number,
  handSize: number,
  starters: number,
  scenario: Scenario
): number => {
  switch (scenario.type) {
    case 'atLeast': {
      // P(X >= k) = 1 - P(X < k) = 1 - Σ(i=0 to k-1) P(X = i)
      let probLessThanK = 0
      for (let i = 0; i < scenario.value; i++) {
        probLessThanK += hypergeometric(deckSize, starters, handSize, i)
      }
      return Math.round((1 - probLessThanK) * 10000) / 100
    }
    
    case 'exactly': {
      // P(X = k)
      const prob = hypergeometric(deckSize, starters, handSize, scenario.value)
      return Math.round(prob * 10000) / 100
    }
    
    case 'between': {
      // P(min <= X <= max) = Σ(i=min to max) P(X = i)
      let probSum = 0
      const minVal = scenario.minValue || 0
      const maxVal = scenario.maxValue || handSize
      
      for (let i = minVal; i <= maxVal; i++) {
        probSum += hypergeometric(deckSize, starters, handSize, i)
      }
      return Math.round(probSum * 10000) / 100
    }
    
    default:
      return 0
  }
}

const generateScenarioData = (deckSize: number, handSize: number, scenario: Scenario) => {
  const maxStarters = Math.min(30, Math.floor(deckSize * 0.75))
  const data: { starters: number; probability: number }[] = []
  
  for (let starters = 1; starters <= maxStarters; starters++) {
    const probability = calculateScenarioProbability(deckSize, handSize, starters, scenario)
    data.push({ starters, probability })
  }
  
  return data
}

const generateDynamicData = (deckSize: number, handSize: number) => {
  const maxStarters = Math.min(30, Math.floor(deckSize * 0.75))
  const data: { starters: number; probability: number }[] = []
  
  for (let starters = 1; starters <= maxStarters; starters++) {
    const probability = calculateStarterProbability(deckSize, handSize, starters)
    data.push({ starters, probability })
  }
  
  return data
}


// Computed properties
const currentData = computed(() => {
  return generateDynamicData(localDeckSize.value, localHandSize.value)
})

const canAddBetween = computed(() => {
  return betweenMin.value && betweenMax.value && betweenMin.value <= betweenMax.value
})

// Scenario management functions
const getNextColor = (): string => {
  return scenarioColors[activeScenarios.value.length % scenarioColors.length]
}

const generateScenarioId = (): string => {
  return `scenario-${++scenarioCounter}`
}

const createScenarioLabel = (scenario: Scenario): string => {
  const cardType = chartTitle.value?.toLowerCase() || t('probabilityChart.scenarios.labels.defaultCards')
  switch (scenario.type) {
    case 'atLeast':
      return t('probabilityChart.scenarios.labels.atLeast', { count: scenario.value, cardType })
    case 'exactly':
      return t('probabilityChart.scenarios.labels.exactly', { count: scenario.value, cardType })
    case 'between':
      return t('probabilityChart.scenarios.labels.between', { min: scenario.minValue, max: scenario.maxValue, cardType })
    default:
      return 'Unknown'
  }
}


const addScenario = (value: number) => {
  const existingScenario = activeScenarios.value.find(
    s => s.type === scenarioMode.value && s.value === value
  )
  
  if (existingScenario) {
    return // Scenario already exists
  }

  const newScenario: Scenario = {
    id: generateScenarioId(),
    type: scenarioMode.value,
    value,
    color: getNextColor(),
    label: ''
  }
  
  newScenario.label = createScenarioLabel(newScenario)
  activeScenarios.value.push(newScenario)
}

const addBetweenScenario = () => {
  if (!canAddBetween.value) return
  
  const existingScenario = activeScenarios.value.find(
    s => s.type === 'between' && s.minValue === betweenMin.value && s.maxValue === betweenMax.value
  )
  
  if (existingScenario) {
    return // Scenario already exists
  }

  const newScenario: Scenario = {
    id: generateScenarioId(),
    type: 'between',
    value: 0, // Not used for between
    minValue: betweenMin.value,
    maxValue: betweenMax.value,
    color: getNextColor(),
    label: ''
  }
  
  newScenario.label = createScenarioLabel(newScenario)
  activeScenarios.value.push(newScenario)
}

const removeScenario = (scenarioId: string) => {
  const index = activeScenarios.value.findIndex(s => s.id === scenarioId)
  if (index !== -1) {
    activeScenarios.value.splice(index, 1)
  }
}

const getScenarioLabel = (scenario: Scenario): string => {
  return scenario.label
}

const getChartData = () => {
  const isDark = isDarkMode()
  
  // If no active scenarios, show default "at least 1" line
  if (activeScenarios.value.length === 0) {
    const data = currentData.value
    const labels = data.map(point => point.starters.toString())
    const probabilityData = data.map(point => point.probability)
    
    return {
      labels,
      datasets: [
        {
          label: t('probabilityChart.scenarios.labels.atLeast', { 
            count: 1, 
            cardType: chartTitle.value?.toLowerCase() || t('probabilityChart.scenarios.labels.defaultCard') 
          }),
          data: probabilityData,
          borderColor: isDark ? '#34d399' : '#10b981',
          backgroundColor: isDark ? '#34d39920' : '#10b98120',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: isDark ? '#34d399' : '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y'
        }
      ]
    }
  }

  // Generate data for all active scenarios
  const allLabels: string[] = []
  const datasets: any[] = []

  // Get common labels (x-axis values)
  if (activeScenarios.value.length > 0) {
    const firstScenarioData = generateScenarioData(localDeckSize.value, localHandSize.value, activeScenarios.value[0])
    allLabels.push(...firstScenarioData.map(point => point.starters.toString()))
  }

  // Create dataset for each active scenario
  activeScenarios.value.forEach((scenario) => {
    const scenarioData = generateScenarioData(localDeckSize.value, localHandSize.value, scenario)
    const probabilityData = scenarioData.map(point => point.probability)
    
    datasets.push({
      label: scenario.label,
      data: probabilityData,
      borderColor: scenario.color,
      backgroundColor: `${scenario.color}20`, // Add transparency
      fill: false, // Don't fill multiple lines to avoid visual clutter
      tension: 0.4,
      pointBackgroundColor: scenario.color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      yAxisID: 'y'
    })
  })
  
  return {
    labels: allLabels,
    datasets
  }
}

const getChartOptions = () => {
  const isDark = isDarkMode()
  
  return {
    responsive: true,
    animation: {
        duration: 0
    },
    hover: {
        animationDuration: 0
    },
    responsiveAnimationDuration: 0,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: isDark ? '#d1d5db' : '#6b7280',
          font: {
            size: 12,
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'line',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#374151' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#374151',
        bodyColor: isDark ? '#ffffff' : '#374151',
        borderColor: isDark ? '#6b7280' : '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => t('probabilityChart.tooltip.cardCount', { 
            count: context[0].label, 
            cardType: chartTitle.value?.toLowerCase() || t('probabilityChart.scenarios.labels.defaultCards') 
          }),
          label: (context: any) => {
            const datasetLabel = context.dataset.label
            const value = context.parsed.y
            return `${datasetLabel}: ${value}%`
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t('probabilityChart.axes.xAxis', { 
            cardType: chartTitle.value || t('probabilityChart.axes.defaultCardType') 
          }),
          color: isDark ? '#d1d5db' : '#6b7280',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: isDark ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#6b7280'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: t('probabilityChart.axes.yAxis'),
          color: isDark ? '#34d399' : '#10b981',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        min: 0,
        max: 100,
        grid: {
          color: isDark ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: isDark ? '#34d399' : '#10b981',
          callback: (value: any) => `${value}%`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  }
}

// Chart management
const createChart = () => {
  if (!chartCanvas.value || !chartCanvas.value.isConnected) {
    return
  }

  // Destroy existing chart if it exists
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = undefined
  }

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: getChartData(),
    options: getChartOptions()
  }

  chartInstance.value = new Chart(chartCanvas.value, config)
  isInitialized.value = true
  isLoading.value = false
}

const updateChart = () => {
  if (!isInitialized.value || !chartCanvas.value) {
    return
  }
  
  isLoading.value = true
  
  // Destroy and recreate chart with new data
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = undefined
  }

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: getChartData(),
    options: getChartOptions()
  }
  
  chartInstance.value = new Chart(chartCanvas.value, config)
  isLoading.value = false
}


// Simple theme handling without reactivity
let themeObserver: MutationObserver | null = null
let themeChangeTimeout: NodeJS.Timeout | null = null

// Watchers for configuration changes
let recalculationTimeout: NodeJS.Timeout | null = null
let scenarioTimeout: NodeJS.Timeout | null = null
let titleTimeout: NodeJS.Timeout | null = null

// Debounced recalculation for input changes
watch([localDeckSize, localHandSize], () => {
  if (!isInitialized.value) return
  
  if (recalculationTimeout) {
    clearTimeout(recalculationTimeout)
  }
  
  recalculationTimeout = setTimeout(() => {
    if (isInitialized.value) {
      updateChart()
    }
  }, 500)
}, { deep: true })

// Watch for scenario changes
watch(activeScenarios, (newScenarios, oldScenarios) => {
  if (!isInitialized.value || !oldScenarios || oldScenarios.length === 0) {
    return
  }
  
  if (scenarioTimeout) {
    clearTimeout(scenarioTimeout)
  }
  
  scenarioTimeout = setTimeout(() => {
    if (isInitialized.value) {
      updateChart()
    }
  }, 200)
}, { deep: true })

// Watch for chart title changes
watch(chartTitle, () => {
  if (!isInitialized.value) return
  
  if (titleTimeout) {
    clearTimeout(titleTimeout)
  }
  
  // Update scenario labels immediately for better UX
  activeScenarios.value.forEach(scenario => {
    scenario.label = createScenarioLabel(scenario)
  })
  
  titleTimeout = setTimeout(() => {
    if (isInitialized.value) {
      updateChart()
    }
  }, 1000)
})

// Initialize default scenario without triggering watchers
const initializeDefaultScenario = () => {
  // Add default "at least 1" scenario
  const defaultScenario: Scenario = {
    id: generateScenarioId(),
    type: 'atLeast',
    value: 1,
    color: getNextColor(),
    label: t('probabilityChart.scenarios.labels.atLeast', { 
      count: 1, 
      cardType: chartTitle.value?.toLowerCase() || t('probabilityChart.scenarios.labels.defaultCard') 
    })
  }
  
  // Use silent assignment to avoid triggering watchers during initialization
  activeScenarios.value = [defaultScenario]
}

// Lifecycle
onMounted(() => {
  
  // Setup debounced theme observer that recreates chart
  if (typeof window !== 'undefined' && document.documentElement) {
    themeObserver = new MutationObserver(() => {
      // Clear any pending theme change
      if (themeChangeTimeout) {
        clearTimeout(themeChangeTimeout)
      }
      
      // Debounce theme changes to prevent rapid updates
      themeChangeTimeout = setTimeout(() => {
        if (isInitialized.value && chartInstance.value) {
          updateChart()
        }
      }, 150)
    })
    
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
  
  nextTick(() => {
    setTimeout(() => {
      // First initialize default scenario (silently)
      initializeDefaultScenario()
      
      // Then create the chart (this will read the scenarios)
      createChart()
    }, 100)
  })
})

onUnmounted(() => {
  // Set flags to prevent any ongoing operations
  isInitialized.value = false
  
  // Clear all pending timeouts
  if (themeChangeTimeout) clearTimeout(themeChangeTimeout)
  if (recalculationTimeout) clearTimeout(recalculationTimeout)
  if (scenarioTimeout) clearTimeout(scenarioTimeout)
  if (titleTimeout) clearTimeout(titleTimeout)
  
  // Disconnect theme observer
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  
  // Destroy chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = undefined
  }
})
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.chart-wrapper canvas {
  max-height: 100%;
  width: 100% !important;
  height: auto !important;
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>