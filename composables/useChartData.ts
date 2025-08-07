import type { ChartData, ChartOptions } from 'chart.js'
import type { CardGroupWithId, DeckConfig } from '~/interfaces'

export interface ChartDataPoint {
  x: number
  y: number
  label?: string
}

export interface AnnotationConfig {
  x?: number
  y?: number
  value?: number
  label: string
  color?: string
  type: 'line' | 'point' | 'box'
}

export const useChartData = () => {
  const { calculateProbability } = useProbabilityCalculator()
  const { chartTheme, colorPalette, annotationTheme } = useChartTheme()
  // const { t } = useI18n() // Disabled for now

  // Generate starter consistency chart data
  const generateStarterConsistencyData = (
    deckConfig: DeckConfig,
    cardGroups: CardGroupWithId[],
    maxCards: number = 20
  ): ChartDataPoint[] => {
    const dataPoints: ChartDataPoint[] = []
    
    if (!cardGroups.length || cardGroups.every(group => group.copies === 0)) {
      return dataPoints
    }

    // Generate data points for 1 to maxCards
    for (let cardCount = 1; cardCount <= maxCards; cardCount++) {
      // Create a modified deck config with different card counts
      const modifiedDeckConfig = { ...deckConfig }
      
      // Update the first active group's copies to cardCount
      const activeGroup = cardGroups.find(group => group.copies > 0)
      if (!activeGroup) continue

      const modifiedGroups = cardGroups.map(group => 
        group.id === activeGroup.id 
          ? { ...group, copies: cardCount }
          : group
      )

      // Calculate total assigned cards to ensure deck stays valid
      const assignedCards = modifiedGroups.reduce((total, group) => total + (group.copies || 0), 0)
      
      // Adjust total deck size if needed to accommodate the cards
      if (assignedCards > modifiedDeckConfig.totalCards) {
        modifiedDeckConfig.totalCards = Math.max(assignedCards, modifiedDeckConfig.handSize)
      }

      const probability = calculateProbability(modifiedDeckConfig, modifiedGroups)
      
      if (probability !== null) {
        dataPoints.push({
          x: cardCount,
          y: Math.round(probability * 100 * 100) / 100, // Round to 2 decimal places
          label: `${cardCount} ${cardCount === 1 ? 'card' : 'cards'}: ${(probability * 100).toFixed(1)}%`
        })
      }
    }

    return dataPoints
  }

  // Generate Chart.js data object
  const createChartData = (
    dataPoints: ChartDataPoint[],
    label: string = 'Starter Consistency',
    color?: string
  ): ChartData<'line'> => {
    const primaryColor = color || colorPalette.value[0]
    
    return {
      labels: dataPoints.map(point => point.x.toString()),
      datasets: [{
        label,
        data: dataPoints.map(point => point.y),
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}20`, // 20% opacity for fill
        borderWidth: 3,
        pointBackgroundColor: primaryColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: false
      }]
    }
  }

  // Generate annotations for optimal thresholds
  const generateAnnotations = (
    dataPoints: ChartDataPoint[],
    thresholds: { value: number; label: string; color?: string }[] = []
  ): any => {
    if (!dataPoints.length) return {}

    const annotations: any = {}
    const theme = annotationTheme.value

    // Default thresholds if none provided
    const defaultThresholds = [
      { value: 75, label: 'Optimal Threshold (75%)', color: theme.line.borderColor },
      { value: 90, label: 'Excellent Threshold (90%)', color: '#22c55e' }
    ]

    const finalThresholds = thresholds.length > 0 ? thresholds : defaultThresholds

    // Add horizontal threshold lines
    finalThresholds.forEach((threshold, index) => {
      annotations[`threshold${index}`] = {
        type: 'line',
        yMin: threshold.value,
        yMax: threshold.value,
        borderColor: threshold.color || theme.line.borderColor,
        borderWidth: 2,
        borderDash: [8, 4],
        label: {
          display: true,
          content: threshold.label,
          position: 'end',
          backgroundColor: threshold.color || theme.line.borderColor,
          color: '#ffffff',
          font: theme.line.label.font,
          padding: theme.line.label.padding,
          cornerRadius: theme.line.label.cornerRadius
        }
      }
    })

    // Find optimal point (first point that reaches 75% or highest point)
    const optimalPoint = dataPoints.find(point => point.y >= 75) || 
                        dataPoints.reduce((max, point) => point.y > max.y ? point : max, dataPoints[0])

    if (optimalPoint) {
      annotations.optimalPoint = {
        type: 'point',
        xValue: optimalPoint.x,
        yValue: optimalPoint.y,
        backgroundColor: theme.point.backgroundColor,
        borderColor: theme.point.borderColor,
        borderWidth: theme.point.borderWidth,
        radius: 8,
        label: {
          display: true,
          content: `Optimal Point: ${optimalPoint.x} cards`,
          backgroundColor: theme.point.backgroundColor,
          color: '#ffffff',
          font: theme.line.label.font,
          padding: { x: 12, y: 6 },
          cornerRadius: 6,
          yAdjust: -30
        }
      }
    }

    return annotations
  }

  // Create complete chart configuration
  const createChartConfig = (
    dataPoints: ChartDataPoint[],
    title: string,
    options: Partial<ChartOptions<'line'>> = {}
  ): ChartOptions<'line'> => {
    const annotations = generateAnnotations(dataPoints)
    
    return {
      ...chartTheme.value,
      plugins: {
        ...chartTheme.value.plugins,
        title: {
          display: true,
          text: title,
          color: chartTheme.value.color,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 16,
            weight: '600'
          },
          padding: {
            top: 16,
            bottom: 24
          }
        },
        annotation: {
          annotations
        }
      },
      scales: {
        ...chartTheme.value.scales,
        x: {
          ...chartTheme.value.scales?.x,
          title: {
            ...chartTheme.value.scales?.x?.title,
            display: true,
            text: 'Number of Cards'
          },
          min: 1,
          max: Math.max(20, Math.max(...dataPoints.map(p => p.x)) + 2)
        },
        y: {
          ...chartTheme.value.scales?.y,
          title: {
            ...chartTheme.value.scales?.y?.title,
            display: true,
            text: 'Consistency (%)'
          },
          min: 0,
          max: 100,
          ticks: {
            ...chartTheme.value.scales?.y?.ticks,
            stepSize: 10,
            callback: function(value: any) {
              return value + '%'
            }
          }
        }
      },
      ...options
    } as ChartOptions<'line'>
  }

  // Helper to get chart data for current deck configuration
  const getCurrentChartData = (
    deckConfig: DeckConfig,
    cardGroups: CardGroupWithId[]
  ) => {
    const dataPoints = generateStarterConsistencyData(deckConfig, cardGroups)
    const chartData = createChartData(dataPoints, 'Starter Consistency')
    const chartOptions = createChartConfig(
      dataPoints, 
      'Starter Consistency Analysis'
    )

    return {
      dataPoints,
      chartData,
      chartOptions,
      hasData: dataPoints.length > 0
    }
  }

  return {
    generateStarterConsistencyData,
    createChartData,
    generateAnnotations,
    createChartConfig,
    getCurrentChartData
  }
}