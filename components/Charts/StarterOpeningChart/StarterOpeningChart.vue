<template>
  <div class="starter-opening-chart">
    <!-- Chart Header -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-sakai-text-primary dark:text-white mb-2">
        Chances de abrir com starter
      </h2>
      <p class="text-sm text-sakai-text-secondary dark:text-slate-300">
        Probabilidade de abrir com starter e ganhos marginais mostrando retornos decrescentes para identificar o número ótimo
      </p>
    </div>

    <!-- Chart Container -->
    <div class="bg-white dark:bg-sakai-surface-800 rounded-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-6 shadow-sm relative">
      <!-- Loading State -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-sakai-surface-800 rounded-lg z-10">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sakai-primary"></div>
          <span class="text-sakai-text-secondary">Loading chart...</span>
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

      <!-- Chart Stats -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-sakai-surface-200 dark:border-sakai-surface-600">
        <div class="text-center">
          <div class="text-2xl font-bold text-sakai-primary">
            {{ optimalStarters }}
          </div>
          <div class="text-sm text-sakai-text-secondary">
            Starters ótimos
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-sakai-primary">
            {{ optimalProbability }}%
          </div>
          <div class="text-sm text-sakai-text-secondary">
            Probabilidade no ótimo
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            +{{ optimalMarginalGain }}%
          </div>
          <div class="text-sm text-sakai-text-secondary">
            Ganho marginal
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

// Composables
const { getProbabilityColorClass, getConsistencyRating } = useProbabilityCalculator()

// Simple dark mode detection without reactivity issues
const isDarkMode = () => {
  if (typeof window !== 'undefined' && document.documentElement) {
    return document.documentElement.classList.contains('dark')
  }
  return false
}

// Computed properties
const optimalStarters = computed(() => {
  // Find the point where marginal gains drop below 3% (diminishing returns threshold)
  const marginalGains = getMarginalGains()
  for (let i = 0; i < marginalGains.length; i++) {
    if (marginalGains[i] < 3.0) {
      return i + 2 // +2 because marginal gains start from the second starter
    }
  }
  return 12 // Fallback
})

const optimalProbability = computed(() => {
  const optimal = starterOpeningData.find(point => point.starters === optimalStarters.value)
  return optimal ? optimal.probability : 0
})

const optimalMarginalGain = computed(() => {
  const marginalGains = getMarginalGains()
  const index = optimalStarters.value - 2 // -2 because marginal gains start from the second starter
  return index >= 0 && index < marginalGains.length ? marginalGains[index] : 0
})

const rating = computed(() => {
  return getConsistencyRating(optimalProbability.value / 100)
})

const ratingClass = computed(() => {
  return getProbabilityColorClass(optimalProbability.value / 100)
})

const getChartData = () => {
  const labels = starterOpeningData.map(point => point.starters.toString())
  const probabilityData = starterOpeningData.map(point => point.probability)
  const marginalGains = getMarginalGains()
  // Marginal gains labels start from 2 starters since we need differences
  const marginalLabels = labels.slice(1)
  const isDark = isDarkMode()
  
  return {
    labels,
    datasets: [
      {
        label: 'Probabilidade de Abrir (%)',
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
      },
      {
        label: 'Ganho Marginal (%)',
        data: [null, ...marginalGains], // Add null for first point to align with labels
        borderColor: isDark ? '#94a3b8' : '#64748b',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.3,
        pointBackgroundColor: isDark ? '#94a3b8' : '#64748b',
        pointBorderColor: isDark ? '#94a3b8' : '#64748b',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5],
        yAxisID: 'y1'
      }
    ]
  }
}

const getChartOptions = () => {
  const isDark = isDarkMode()
  
  return {
    responsive: true,
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
          title: (context: any) => `${context[0].label} starters`,
          label: (context: any) => {
            const datasetLabel = context.dataset.label
            const value = context.parsed.y
            if (datasetLabel === 'Ganho Marginal (%)') {
              return value !== null ? `${datasetLabel}: +${value}%` : `${datasetLabel}: N/A`
            }
            return `${datasetLabel}: ${value}%`
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Número de Starters no Deck',
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
          text: 'Probabilidade de Abrir (%)',
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
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Ganho Marginal (%)',
          color: isDark ? '#94a3b8' : '#64748b',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        min: 0,
        max: 15, // Adjust based on actual marginal gain values
        grid: {
          drawOnChartArea: false, // Don't draw grid lines for right axis
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          callback: (value: any) => `+${value}%`
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
  if (!chartCanvas.value) {
    console.error('Chart canvas not available')
    return
  }

  if (isInitialized.value) {
    console.log('Chart already initialized, skipping')
    return
  }

  console.log('Creating chart with data:', starterOpeningData.length, 'points')
  //console.log('Chart data:', getChartData())

  // Destroy existing chart and clear canvas
  if (chartInstance.value) {
    console.log('Destroying existing chart')
    chartInstance.value.destroy()
    chartInstance.value = undefined
  }

  // Clear any existing chart from this canvas
  const existingChart = Chart.getChart(chartCanvas.value)
  if (existingChart) {
    console.log('Found existing chart on canvas, destroying it')
    existingChart.destroy()
  }

  try {
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: getChartData(),
      options: getChartOptions()
    }

    chartInstance.value = new Chart(chartCanvas.value, config)
    isInitialized.value = true
    isLoading.value = false
    console.log('Chart created successfully')
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

const updateChart = () => {
  if (!chartInstance.value || !isInitialized.value || !chartCanvas.value) {
    return // Don't create chart here to avoid infinite loops
  }

  console.log('Updating chart with new theme')
  isLoading.value = true
  
  try {
    // Safely destroy the chart
    chartInstance.value.destroy()
    chartInstance.value = undefined
    
    // Wait a moment before recreating to ensure cleanup is complete
    setTimeout(() => {
      if (chartCanvas.value && isInitialized.value) {
        const config: ChartConfiguration<'line'> = {
          type: 'line',
          data: getChartData(),
          options: getChartOptions()
        }
        
        chartInstance.value = new Chart(chartCanvas.value, config)
        isLoading.value = false
      }
    }, 50)
  } catch (error) {
    console.error('Error updating chart:', error)
    isLoading.value = false
  }
}

// Simple theme handling without reactivity
let themeObserver: MutationObserver | null = null
let themeChangeTimeout: NodeJS.Timeout | null = null
let isUpdating = ref(false)

// Lifecycle
onMounted(() => {
  console.log('StarterOpeningChart mounted')
  console.log('Starter data loaded:', starterOpeningData.length, 'points')
  console.log('First data point:', starterOpeningData[0])
  
  // Setup debounced theme observer that recreates chart
  if (typeof window !== 'undefined' && document.documentElement) {
    themeObserver = new MutationObserver(() => {
      // Clear any pending theme change
      if (themeChangeTimeout) {
        clearTimeout(themeChangeTimeout)
      }
      
      // Debounce theme changes to prevent rapid updates
      themeChangeTimeout = setTimeout(() => {
        if (isInitialized.value && chartInstance.value && !isUpdating.value) {
          console.log('Theme changed, recreating chart')
          isUpdating.value = true
          
          try {
            updateChart()
          } catch (error) {
            console.error('Error updating chart theme:', error)
          } finally {
            // Reset updating flag after a delay
            setTimeout(() => {
              isUpdating.value = false
            }, 200)
          }
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
      console.log('Canvas element:', chartCanvas.value)
      createChart()
    }, 100)
  })
})

onUnmounted(() => {
  console.log('StarterOpeningChart unmounting')
  
  // Clear any pending theme changes
  if (themeChangeTimeout) {
    clearTimeout(themeChangeTimeout)
    themeChangeTimeout = null
  }
  
  // Disconnect theme observer
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  
  // Destroy chart
  if (chartInstance.value) {
    try {
      chartInstance.value.destroy()
    } catch (error) {
      console.error('Error destroying chart:', error)
    }
    chartInstance.value = undefined
  }
  
  isInitialized.value = false
  isUpdating.value = false
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