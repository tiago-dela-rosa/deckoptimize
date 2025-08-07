// Types for deck optimization application

export interface CardGroup {
  name: string
  copies: number
  minNeeded: number
  maxNeeded: number
}

export interface DeckConfig {
  totalCards: number
  handSize: number
}

export interface ExampleConfig {
  totalCards: number
  handSize: number
  groups: CardGroup[]
}

export interface PrebuiltExample {
  id: string
  name: string
  config: ExampleConfig
}

// Runtime card group interface with ID
export interface CardGroupWithId extends CardGroup {
  id: number
}

// Chart-specific interfaces
export interface ChartDataPoint {
  x: number
  y: number
  label?: string
}

export interface OptimalPoint extends ChartDataPoint {
  isOptimal: boolean
  threshold: number
}