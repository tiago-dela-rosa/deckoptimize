import { CalculatorEvents, type ExampleSelectedProperties } from '~/types/analytics'
import type { PrebuiltExample } from '~/interfaces'

export const trackExampleSelected = (example: PrebuiltExample) => {
  const eventProperties: ExampleSelectedProperties = {
    example_id: example.id,
    example_name: example.name,
    source: 'quick_examples_dropdown',
  }
  
  umTrackEvent(CalculatorEvents.EXAMPLE_SELECTED, eventProperties)
}