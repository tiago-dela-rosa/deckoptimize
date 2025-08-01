// Analytics Event Enums and Types

/**
 * Calculator Page Events - for events on the main calculator page
 */
export enum CalculatorEvents {
  EXAMPLE_SELECTED = 'calculator_example_selected',
  SHARE_BUTTON_CLICKED = 'calculator_share_button_clicked',
  CALCULATION_PERFORMED = 'calculator_calculation_performed',
  GROUP_ADDED = 'calculator_group_added',
  GROUP_REMOVED = 'calculator_group_removed',
  GROUP_UPDATED = 'calculator_group_updated',
  DECK_CONFIG_CHANGED = 'calculator_deck_config_changed',
  TOOLTIP_VIEWED = 'calculator_tooltip_viewed'
}

/**
 * UI Events - for general UI interactions across pages
 */
export enum UIEvents {
  THEME_TOGGLED = 'ui_theme_toggled',
  TOOLTIP_VIEWED = 'ui_tooltip_viewed'
}

/**
 * Event property types for type safety
 */
export interface ExampleSelectedProperties {
  example_id: string
  source: 'quick_examples_dropdown'
  example_name?: string
  deck_size?: number
  hand_size?: number
  card_groups_count?: number
}

export interface ShareButtonClickedProperties {
  deck_size: number
  hand_size: number
  group_name: string
  cards_used: number
  min: number
  max: number
  card_groups_count: number
  probability_result: number
}

export interface CalculationPerformedProperties {
  deck_size: number
  hand_size: number
  card_groups_count: number
  total_assigned_cards?: number
  probability_result?: number
  consistency_rating?: string
  trigger: 'manual' | 'auto' | 'example_load'
}

export interface GroupAddedProperties {
  deck_size: number
  hand_size: number
  group_name: string
  cards_used: number
  min: number
  max: number
  source: 'add_button'
}

export interface GroupRemovedProperties {
  group_id: number
  total_groups: number
  deck_size: number
  source: 'remove_button'
}

export interface GroupUpdatedProperties {
  group_id: number
  field: 'copies' | 'minNeeded' | 'maxNeeded' | 'name'
  old_value?: string | number
  new_value: string | number
  total_groups: number
}

export interface DeckConfigChangedProperties {
  field: 'totalCards' | 'handSize'
  old_value: number
  new_value: number
  change_method: 'increment' | 'decrement' | 'direct_input'
  total_assigned_cards?: number
}

export interface ThemeToggledProperties {
  from_theme: 'light' | 'dark'
  to: 'light' | 'dark'
  user_preferences: 'light' | 'dark' | 'system'
}

export interface TooltipViewedProperties {
  tooltip_id: string
}

/**
 * Union type for all event properties
 */
export type EventProperties = 
  | ExampleSelectedProperties
  | ShareButtonClickedProperties
  | CalculationPerformedProperties
  | GroupAddedProperties
  | GroupRemovedProperties
  | GroupUpdatedProperties
  | DeckConfigChangedProperties
  | ThemeToggledProperties
  | TooltipViewedProperties