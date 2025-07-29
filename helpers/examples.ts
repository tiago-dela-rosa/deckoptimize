import type { PrebuiltExample } from '~/interfaces'

// Prebuilt example definitions
export const prebuiltExamples: PrebuiltExample[] = [
  {
    id: 'empty',
    name: "Blank",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "", copies: 0, minNeeded: 1, maxNeeded: 0 }
      ]
    }
  },  
  {
    id: 'two-card-combo',
    name: "Allure of Darkness plus an dark monster",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Allure of Darkness", copies: 3, minNeeded: 1, maxNeeded: 3 },
        { name: "Dark Monsters", copies: 16, minNeeded: 1, maxNeeded: 16 }
      ]
    }
  },
  {
    id: 'minimum-desired',
    name: "At least one handtrap in opening hand",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Hand Traps", copies: 18, minNeeded: 1, maxNeeded: 3 },
      ]
    }
  },  
  {
    id: 'exactly-desired',
    name: "Exactly three handtraps in opening hand",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Hand Traps", copies: 18, minNeeded: 3, maxNeeded: 3 },
      ]
    }
  },
  {
    id: 'grass-in-60',
    name: "Grass Looks Greener in a sixty card deck",
    config: {
      totalCards: 60,
      handSize: 5,
      groups: [
        { name: "That Grass Looks Greener", copies: 1, minNeeded: 1, maxNeeded: 1 },
      ]
    }
  },
  {
    id: 'hollie-sue-enable',
    name: "Hollie Sue turn zero combo",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Vanquish Soul Hollie Sue", copies: 3, minNeeded: 1, maxNeeded: 3 },
        { name: "Other Vanquish Soul", copies: 15, minNeeded: 1, maxNeeded: 15 },
        { name: "Fire/Dark Monster", copies: 19, minNeeded: 1, maxNeeded: 4 }
      ]
    }
  },
  {
    id: 'one-copy-playset',
    name: "Open with one copy from a three-card playset",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Mulcharmy Fuwalos", copies: 3, minNeeded: 1, maxNeeded: 3 }
      ]
    }
  },
  {
    id: 'two-limited',
    name: "Two limited cards",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Called by the Grave", copies: 1, minNeeded: 1, maxNeeded: 1 },
        { name: "Triple Tactics Talent", copies: 1, minNeeded: 1, maxNeeded: 1 },
      ]
    }
  }
]

// Helper function to get example by ID
export function getExampleById(id: string): PrebuiltExample | undefined {
  return prebuiltExamples.find(example => example.id === id)
}

// Helper function to get default empty example
export function getEmptyExample(): PrebuiltExample {
  const emptyExample = getExampleById('empty')
  if (!emptyExample) {
    throw new Error('Empty example not found')
  }
  return emptyExample
}