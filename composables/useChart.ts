import { Chart as ChartJS, type ChartConfiguration, type ChartData, type ChartOptions } from 'chart.js'
import type { CardGroupWithId, DeckConfig } from '~/interfaces'

export interface ChartThemeColors {
  primary: string
  primaryRgb: string
  success: string
  successRgb: string
  warning: string
  warningRgb: string
  danger: string
  dangerRgb: string
  text: string
  textSecondary: string
  surface: string
  border: string
  grid: string
}

export function useChart() {
  const { $ChartJS } = useNuxtApp()
  
  // Get current theme colors based on dark mode
  const getThemeColors = (): ChartThemeColors => {
    const isDark = document.documentElement.classList.contains('dark')
    
    if (isDark) {
      return {
        primary: '#10b981',
        primaryRgb: '16, 185, 129',
        success: '#34d399',
        successRgb: '52, 211, 153',
        warning: '#fbbf24',
        warningRgb: '251, 191, 36',
        danger: '#f87171',
        dangerRgb: '248, 113, 113',
        text: '#f8fafc',
        textSecondary: '#94a3b8',
        surface: '#1e293b',
        border: '#334155',
        grid: 'rgba(148, 163, 184, 0.1)'
      }
    }
    
    return {
      primary: '#10b981',
      primaryRgb: '16, 185, 129',
      success: '#059669',
      successRgb: '5, 150, 105',
      warning: '#d97706',
      warningRgb: '217, 119, 6',
      danger: '#dc2626',
      dangerRgb: '220, 38, 38',
      text: '#0f172a',
      textSecondary: '#64748b',
      surface: '#ffffff',
      border: '#e2e8f0',
      grid: 'rgba(100, 116, 139, 0.1)'
    }
  }

  // Create probability analysis chart data
  const createProbabilityChartData = (
    deckConfig: DeckConfig,
    cardGroups: CardGroupWithId[],
    analysisRange = 20
  ): ChartData<'line'> => {
    const { calculateProbability } = useProbabilityCalculator()
    const colors = getThemeColors()
    
    const labels: string[] = []
    const data: number[] = []
    const optimalPoints: { x: number; y: number }[] = []
    
    // Generate data points for different card quantities
    for (let cardCount = 1; cardCount <= analysisRange; cardCount++) {
      labels.push(cardCount.toString())
      
      // Create modified groups with the current card count
      const modifiedGroups = cardGroups.map(group => ({
        ...group,
        copies: group.copies > 0 ? cardCount : 0
      }))
      
      const probability = calculateProbability(deckConfig, modifiedGroups)
      const percentage = probability ? probability * 100 : 0
      data.push(percentage)
      
      // Mark optimal points (>75% probability)
      if (percentage >= 75) {
        optimalPoints.push({ x: cardCount - 1, y: percentage })
      }
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Probability (%)',
          data,
          borderColor: colors.primary,
          backgroundColor: `rgba(${colors.primaryRgb}, 0.1)`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: colors.surface,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    }
  }

  // Create base chart options with theme integration
  const createBaseChartOptions = (): ChartOptions<'line'> => {
    const colors = getThemeColors()
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: colors.text,
            font: {
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: colors.surface,
          titleColor: colors.text,
          bodyColor: colors.textSecondary,
          borderColor: colors.border,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context) => `${context[0].label} Cards`,
            label: (context) => `Probability: ${context.parsed.y.toFixed(1)}%`
          }
        },
        annotation: {
          annotations: {
            optimalLine: {
              type: 'line',
              yMin: 75,
              yMax: 75,
              borderColor: colors.success,
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                display: true,
                content: 'Optimal Threshold (75%)',
                position: 'end',
                backgroundColor: colors.success,
                color: colors.surface,
                font: {
                  size: 11,
                  weight: 'bold'
                },
                padding: 4,
                cornerRadius: 4
              }
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Number of Cards',
            color: colors.text,
            font: {
              size: 12,
              weight: '600'
            }
          },
          grid: {
            color: colors.grid,
            drawBorder: false
          },
          ticks: {
            color: colors.textSecondary,
            font: {
              size: 11
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Probability (%)',
            color: colors.text,
            font: {
              size: 12,
              weight: '600'
            }
          },
          min: 0,
          max: 100,
          grid: {
            color: colors.grid,
            drawBorder: false
          },
          ticks: {
            color: colors.textSecondary,
            font: {
              size: 11
            },
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }
  }

  // Update chart theme when dark mode changes
  const updateChartTheme = (chart: ChartJS) => {
    const colors = getThemeColors()
    const options = chart.options as ChartOptions<'line'>
    
    // Update legend colors
    if (options.plugins?.legend?.labels) {
      options.plugins.legend.labels.color = colors.text
    }
    
    // Update tooltip colors
    if (options.plugins?.tooltip) {
      options.plugins.tooltip.backgroundColor = colors.surface
      options.plugins.tooltip.titleColor = colors.text
      options.plugins.tooltip.bodyColor = colors.textSecondary
      options.plugins.tooltip.borderColor = colors.border
    }
    
    // Update scale colors
    if (options.scales?.x) {
      if (options.scales.x.title) options.scales.x.title.color = colors.text
      if (options.scales.x.grid) options.scales.x.grid.color = colors.grid
      if (options.scales.x.ticks) options.scales.x.ticks.color = colors.textSecondary
    }
    
    if (options.scales?.y) {
      if (options.scales.y.title) options.scales.y.title.color = colors.text
      if (options.scales.y.grid) options.scales.y.grid.color = colors.grid
      if (options.scales.y.ticks) options.scales.y.ticks.color = colors.textSecondary
    }
    
    // Update annotation colors
    if (options.plugins?.annotation?.annotations) {
      const annotations = options.plugins.annotation.annotations as any
      if (annotations.optimalLine) {
        annotations.optimalLine.borderColor = colors.success
        if (annotations.optimalLine.label) {
          annotations.optimalLine.label.backgroundColor = colors.success
          annotations.optimalLine.label.color = colors.surface
        }
      }
    }
    
    chart.update('none')
  }

  // Add optimal point annotations dynamically
  const addOptimalAnnotations = (chart: ChartJS, optimalPoints: { x: number; y: number }[]) => {
    const colors = getThemeColors()
    const options = chart.options as ChartOptions<'line'>
    
    if (!options.plugins?.annotation?.annotations) return
    
    // Clear existing optimal point annotations
    const annotations = options.plugins.annotation.annotations as any
    Object.keys(annotations).forEach(key => {
      if (key.startsWith('optimal_')) {
        delete annotations[key]
      }
    })
    
    // Add new optimal point annotations
    optimalPoints.forEach((point, index) => {
      annotations[`optimal_${index}`] = {
        type: 'point',
        xValue: point.x,
        yValue: point.y,
        backgroundColor: colors.success,
        borderColor: colors.surface,
        borderWidth: 2,
        radius: 6,
        label: {
          display: true,
          content: `${point.y.toFixed(1)}%`,
          position: 'top',
          backgroundColor: colors.success,
          color: colors.surface,
          font: {
            size: 10,
            weight: 'bold'
          },
          padding: 2,
          cornerRadius: 3
        }
      }
    })
    
    chart.update('none')
  }

  return {
    ChartJS: $ChartJS,
    getThemeColors,
    createProbabilityChartData,
    createBaseChartOptions,
    updateChartTheme,
    addOptimalAnnotations
  }
}