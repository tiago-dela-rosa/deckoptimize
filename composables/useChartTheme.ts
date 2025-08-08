import type { ChartOptions } from 'chart.js'

export const useChartTheme = () => {
  // Check for dark mode - using same pattern as AppHeader component
  const isDark = ref(false)

  // Update dark mode state based on DOM
  const updateDarkMode = () => {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  // Sakai theme colors for charts
  const colors = computed(() => ({
    primary: '#10b981',      // sakai-primary (emerald-500)
    primaryDark: '#059669',  // emerald-600
    primaryLight: '#34d399', // emerald-400
    secondary: '#6366f1',    // indigo-500
    accent: '#8b5cf6',       // violet-500
    success: '#22c55e',      // green-500
    warning: '#f59e0b',      // amber-500
    error: '#ef4444',        // red-500
    
    // Background colors
    background: isDark.value ? '#0f172a' : '#ffffff',        // slate-900 : white
    surface: isDark.value ? '#1e293b' : '#f8fafc',           // slate-800 : slate-50
    
    // Text colors
    textPrimary: isDark.value ? '#f1f5f9' : '#0f172a',       // slate-100 : slate-900
    textSecondary: isDark.value ? '#cbd5e1' : '#475569',     // slate-300 : slate-600
    
    // Border colors
    border: isDark.value ? '#475569' : '#e2e8f0',            // slate-600 : slate-200
    borderLight: isDark.value ? '#64748b' : '#cbd5e1',       // slate-500 : slate-300
  }))

  // Chart.js theme configuration
  const chartTheme = computed<Partial<ChartOptions>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: colors.value.background,
    borderColor: colors.value.border,
    color: colors.value.textPrimary,
    
    plugins: {
      legend: {
        labels: {
          color: colors.value.textPrimary,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: colors.value.surface,
        titleColor: colors.value.textPrimary,
        bodyColor: colors.value.textSecondary,
        borderColor: colors.value.border,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 13,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 12,
          weight: '400'
        },
        caretPadding: 8,
        displayColors: true,
        boxPadding: 4
      }
    },
    
    scales: {
      x: {
        border: {
          color: colors.value.border,
          width: 1
        },
        grid: {
          color: colors.value.border,
          lineWidth: 1
        },
        ticks: {
          color: colors.value.textSecondary,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500'
          },
          padding: 8
        },
        title: {
          color: colors.value.textPrimary,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '600'
          },
          padding: {
            top: 16,
            bottom: 8
          }
        }
      },
      y: {
        border: {
          color: colors.value.border,
          width: 1
        },
        grid: {
          color: colors.value.border,
          lineWidth: 1
        },
        ticks: {
          color: colors.value.textSecondary,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500'
          },
          padding: 8,
          callback: function(value: any) {
            return value + '%'
          }
        },
        title: {
          color: colors.value.textPrimary,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '600'
          },
          padding: {
            top: 8,
            bottom: 16
          }
        }
      }
    },

    elements: {
      point: {
        backgroundColor: colors.value.primary,
        borderColor: colors.value.background,
        borderWidth: 2,
        radius: 4,
        hoverRadius: 6,
        hoverBorderWidth: 3
      },
      line: {
        borderColor: colors.value.primary,
        borderWidth: 3,
        fill: false,
        tension: 0.4
      },
      bar: {
        backgroundColor: colors.value.primary,
        borderColor: colors.value.primaryDark,
        borderWidth: 1,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0
        }
      }
    },

    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },

    interaction: {
      intersect: false,
      mode: 'index'
    }
  }))

  // Color palette for multiple datasets
  const colorPalette = computed(() => [
    colors.value.primary,      // emerald-500
    colors.value.secondary,    // indigo-500
    colors.value.accent,       // violet-500
    colors.value.success,      // green-500
    colors.value.warning,      // amber-500
    colors.value.error,        // red-500
    colors.value.primaryLight, // emerald-400
    colors.value.primaryDark   // emerald-600
  ])

  // Annotation theme for chartjs-plugin-annotation
  const annotationTheme = computed(() => ({
    line: {
      borderColor: colors.value.primary,
      borderWidth: 2,
      borderDash: [5, 5],
      label: {
        backgroundColor: colors.value.primary,
        color: '#ffffff',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 11,
          weight: '600'
        },
        padding: {
          x: 8,
          y: 4
        },
        cornerRadius: 4
      }
    },
    point: {
      backgroundColor: colors.value.primary,
      borderColor: colors.value.background,
      borderWidth: 3,
      radius: 6
    },
    box: {
      backgroundColor: `${colors.value.primary}20`, // 20% opacity
      borderColor: colors.value.primary,
      borderWidth: 1
    }
  }))

  // Initialize dark mode detection
  onMounted(() => {
    updateDarkMode()
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      updateDarkMode()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Cleanup observer
    onUnmounted(() => {
      observer.disconnect()
    })
  })

  return {
    isDark: readonly(isDark),
    colors: readonly(colors),
    chartTheme: readonly(chartTheme),
    colorPalette: readonly(colorPalette),
    annotationTheme: readonly(annotationTheme),
    updateDarkMode
  }
}