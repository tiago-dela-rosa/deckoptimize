import { CalculatorEvents, type TooltipViewedProperties } from '~/types/analytics'

export const trackTooltipViewed = (tooltipId: string) => {
  const eventProperties: TooltipViewedProperties = {
    tooltip_id: tooltipId
  }
  
  umTrackEvent(CalculatorEvents.TOOLTIP_VIEWED, eventProperties)
}