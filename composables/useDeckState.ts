import type { CardGroupWithId, DeckConfig } from '~/interfaces'
import { trackGroupAdded } from './useDeckState.events'

export function useDeckState() {
  const deckConfig = ref<DeckConfig>({
    totalCards: 40,
    handSize: 5
  })

  const cardGroups = ref<CardGroupWithId[]>([
    {
      id: 1,
      name: '',
      copies: 0,
      minNeeded: 1,
      maxNeeded: 0
    }
  ])

  let nextGroupId = 2

  const assignedCards = computed(() => {
    return cardGroups.value.reduce((total, group) => total + (group.copies || 0), 0)
  })

  const canCalculate = computed(() => {
    return deckConfig.value.totalCards > 0 && 
           deckConfig.value.handSize > 0 && 
           assignedCards.value <= deckConfig.value.totalCards &&
           cardGroups.value.some(group => group.copies > 0 && (group.minNeeded > 0 || group.maxNeeded > 0))
  })

  function addGroup(source: 'button' | 'example' = 'button') {
    const newGroup = {
      id: nextGroupId++,
      name: '',
      copies: 0,
      minNeeded: 1,
      maxNeeded: 0
    }
    
    cardGroups.value.push(newGroup)
    
    if (source === 'button') {
      trackGroupAdded(deckConfig.value, newGroup)
    }
  }

  function removeGroup(index: number) {
    if (cardGroups.value.length > 1) {
      cardGroups.value.splice(index, 1)
    }
  }


  function decrementTotal() {
    if (deckConfig.value.totalCards > 1) {
      deckConfig.value.totalCards--
    }
  }

  function incrementTotal() {
    if (deckConfig.value.totalCards < 60) {
      deckConfig.value.totalCards++
    }
  }

  function decrementHand() {
    if (deckConfig.value.handSize > 1) {
      deckConfig.value.handSize--
    }
  }

  function incrementHand() {
    if (deckConfig.value.handSize < 10) {
      deckConfig.value.handSize++
    }
  }

  function updateTotal(value: number) {
    if (value >= 1 && value <= 60) {
      deckConfig.value.totalCards = value
    }
  }

  function updateHand(value: number) {
    if (value >= 1 && value <= 10) {
      deckConfig.value.handSize = value
    }
  }

  function loadSharedData(decodedData: any) {
    if (decodedData) {
      deckConfig.value = { ...decodedData.deck }
      cardGroups.value = decodedData.groups.map((group: any, index: number) => ({
        id: index + 1,
        name: group.name || '',
        copies: group.copies || 0,
        minNeeded: group.minNeeded || 1,
        maxNeeded: group.maxNeeded || 0
      }))
      nextGroupId = cardGroups.value.length + 1
    }
  }

  return {
    deckConfig,
    cardGroups,
    assignedCards,
    canCalculate,
    addGroup,
    removeGroup,
    decrementTotal,
    incrementTotal,
    decrementHand,
    incrementHand,
    updateTotal,
    updateHand,
    loadSharedData
  }
}