import { CalculatorEvents, type GroupAddedProperties } from '~/types/analytics'
import type { DeckConfig, CardGroupWithId } from '~/interfaces'

export const trackGroupAdded = (
  deckConfig: DeckConfig,
  newGroup: CardGroupWithId
) => {
  const eventProperties: GroupAddedProperties = {
    deck_size: deckConfig.totalCards,
    hand_size: deckConfig.handSize,
    group_name: newGroup.name || 'Unknown',
    cards_used: newGroup.copies || 0,
    min: newGroup.minNeeded || 0,
    max: newGroup.maxNeeded || 0,
    source: 'add_button'
  }
  
  umTrackEvent(CalculatorEvents.GROUP_ADDED, eventProperties)
}