import type { CardGroupWithId, DeckConfig } from '~/interfaces'

export function useProbabilityCalculator() {
  function combination(n: number, k: number): number {
    if (k > n || k < 0) return 0
    if (k === 0 || k === n) return 1
    
    let result = 1
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1)
    }
    return Math.round(result)
  }

  function hypergeometric(N: number, K: number, n: number, k: number): number {
    return combination(K, k) * combination(N - K, n - k) / combination(N, n)
  }

  function calculateProbability(deckConfig: DeckConfig, cardGroups: CardGroupWithId[]): number | null {
    const assignedCards = cardGroups.reduce((total, group) => total + (group.copies || 0), 0)
    
    const canCalculate = deckConfig.totalCards > 0 && 
                        deckConfig.handSize > 0 && 
                        assignedCards <= deckConfig.totalCards &&
                        cardGroups.some(group => group.copies > 0 && (group.minNeeded > 0 || group.maxNeeded > 0))

    if (!canCalculate) {
      return null
    }

    const N = deckConfig.totalCards
    const n = deckConfig.handSize
    
    let totalProbability = 0
    const activeGroups = cardGroups.filter(group => 
      group.copies > 0 && (group.minNeeded > 0 || group.maxNeeded > 0)
    )
    
    if (activeGroups.length === 0) {
      return null
    }

    if (activeGroups.length === 1) {
      const group = activeGroups[0]
      const K = group.copies
      const minK = group.minNeeded || 0
      const maxK = group.maxNeeded || minK || K
      
      // Calculate probability for range [minK, maxK] inclusive
      for (let k = minK; k <= Math.min(maxK, K, n); k++) {
        if (k >= 0) {
          totalProbability += hypergeometric(N, K, n, k)
        }
      }
    } else {
      // For multiple groups, calculate individual probabilities and combine
      const groupProbs = activeGroups.map(group => {
        const K = group.copies
        const minK = group.minNeeded || 0
        const maxK = group.maxNeeded || minK || K
        let groupProb = 0
        
        // Calculate probability for range [minK, maxK] inclusive
        for (let k = minK; k <= Math.min(maxK, K, n); k++) {
          if (k >= 0) {
            groupProb += hypergeometric(N, K, n, k)
          }
        }
        return groupProb
      })
      
      // Multiply probabilities (assuming independence for small overlaps)
      totalProbability = groupProbs.reduce((acc, prob) => acc * prob, 1)
    }
    
    return Math.max(0, Math.min(1, totalProbability))
  }

  function getConsistencyRating(probability: number | null): string {
    if (probability === null) return ''
    const percent = probability * 100
    if (percent >= 90) return '⭐ Excellent probability'
    if (percent >= 75) return '✨ Very good probability'
    if (percent >= 60) return '👍 Good probability'
    if (percent >= 40) return '⚠️ Fair probability'
    return '❌ Low probability'
  }

  function getConsistencyClasses(probability: number | null): string {
    if (probability === null) return 'bg-gray-100 text-gray-600'
    const percent = probability * 100
    if (percent >= 75) return 'bg-green-100 text-green-800'
    if (percent >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  function getProbabilityColorClass(probability: number | null): string {
    if (probability === null) return 'text-sakai-text-secondary'
    const percent = probability * 100
    if (percent >= 75) return 'text-green-600 dark:text-green-400'
    if (percent >= 50) return 'text-yellow-600 dark:text-yellow-400'
    if (percent >= 25) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  function getProgressBarClass(probability: number | null): string {
    if (probability === null) return 'bg-sakai-surface-300'
    const percent = probability * 100
    if (percent >= 75) return 'bg-gradient-to-r from-green-500 to-green-600'
    if (percent >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    if (percent >= 25) return 'bg-gradient-to-r from-orange-500 to-orange-600'
    return 'bg-gradient-to-r from-red-500 to-red-600'
  }

  return {
    calculateProbability,
    getConsistencyRating,
    getConsistencyClasses,
    getProbabilityColorClass,
    getProgressBarClass
  }
}