import { CalculatorEvents, type ShareButtonClickedProperties } from '~/types/analytics'
import type { DeckConfig, CardGroup } from '~/interfaces'

export const trackShareButtonClicked = (
  deckConfig: DeckConfig,
  cardGroups: CardGroup[],
  probability: number
) => {
  const firstGroup = cardGroups[0] || {}
  
  const eventProperties: ShareButtonClickedProperties = {
    deck_size: deckConfig.totalCards,
    hand_size: deckConfig.handSize,
    group_name: firstGroup.name || 'Unknown',
    cards_used: firstGroup.copies || 0,
    min: firstGroup.minNeeded || 0,
    max: firstGroup.maxNeeded || 0,
    card_groups_count: cardGroups.length,
    probability_result: probability
  }
  
  umTrackEvent(CalculatorEvents.SHARE_BUTTON_CLICKED, eventProperties)
}