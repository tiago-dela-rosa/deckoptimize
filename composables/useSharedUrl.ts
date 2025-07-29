import type { CardGroupWithId, DeckConfig } from '~/interfaces'

export function useSharedUrl() {
  const showCopyNotification = ref(false)

  function encodeFormData(deckConfig: DeckConfig, cardGroups: CardGroupWithId[]): string {
    const data = {
      deck: deckConfig,
      groups: cardGroups.map(group => ({
        name: group.name,
        copies: group.copies,
        minNeeded: group.minNeeded,
        maxNeeded: group.maxNeeded
      }))
    }
    
    // Simple Base64 encoding for obfuscation
    const jsonString = JSON.stringify(data)
    return btoa(encodeURIComponent(jsonString))
  }

  function decodeFormData(encodedData: string): any | null {
    try {
      const jsonString = decodeURIComponent(atob(encodedData))
      return JSON.parse(jsonString)
    } catch (error) {
      console.error('Failed to decode form data:', error)
      return null
    }
  }

  async function shareResults(deckConfig: DeckConfig, cardGroups: CardGroupWithId[]) {
    try {
      const encodedData = encodeFormData(deckConfig, cardGroups)
      const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`
      
      await navigator.clipboard.writeText(url)
      
      // Show notification
      showCopyNotification.value = true
      setTimeout(() => {
        showCopyNotification.value = false
      }, 3000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback: show URL in an alert
      const encodedData = encodeFormData(deckConfig, cardGroups)
      const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`
      alert(`Copy this URL to share: ${url}`)
    }
  }

  return {
    showCopyNotification,
    encodeFormData,
    decodeFormData,
    shareResults
  }
}