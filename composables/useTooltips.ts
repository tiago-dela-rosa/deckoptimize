export function useTooltips() {
  const activeTooltip = ref<string | null>(null)

  function toggleTooltip(tooltipId: string) {
    activeTooltip.value = activeTooltip.value === tooltipId ? null : tooltipId
  }

  function closeTooltip() {
    activeTooltip.value = null
  }

  function setupClickOutside() {
    document.addEventListener('click', (e) => {
      const target = e.target as Element
      if (!target.closest('[data-tooltip-trigger]') && !target.closest('[data-tooltip]')) {
        activeTooltip.value = null
      }
    })
  }

  return {
    activeTooltip,
    toggleTooltip,
    closeTooltip,
    setupClickOutside
  }
}