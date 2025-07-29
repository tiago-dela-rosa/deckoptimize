import type { PrebuiltExample } from '~/interfaces'

// Prebuilt example definitions
export const prebuiltExamples: PrebuiltExample[] = [
  {
    id: 'empty',
    name: "Blank",
    description: "Empty form with default values",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "", copies: 0, minNeeded: 1, maxNeeded: 0 }
      ]
    }
  },
  {
    id: 'starters',
    name: "Opening with at least two Starters",
    description: "Common scenario for combo decks",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Starters", copies: 16, minNeeded: 2, maxNeeded: 16 }
      ]
    }
  },
  {
    id: 'handtraps',
    name: "Opening with exactly one Handtrap",
    description: "Control deck anti-combo setup",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Handtraps", copies: 12, minNeeded: 1, maxNeeded: 1 }
      ]
    }
  },
  {
    id: 'engine-extenders',
    name: "Engine + Extenders combination",
    description: "Need engine piece plus at least one extender",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Engine", copies: 9, minNeeded: 1, maxNeeded: 9 },
        { name: "Extenders", copies: 6, minNeeded: 1, maxNeeded: 6 }
      ]
    }
  },
  {
    id: 'playable-hand',
    name: "Playable hand (Starter + Non-brick)",
    description: "At least one starter and avoid too many garnets",
    config: {
      totalCards: 40,
      handSize: 5,
      groups: [
        { name: "Starters", copies: 14, minNeeded: 1, maxNeeded: 14 },
        { name: "Garnets", copies: 3, minNeeded: 0, maxNeeded: 1 }
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