// Pre-calculated hypergeometric probabilities for starter opening chances
// Formula: 1 - hypergeometric(N=40, K=starters, n=5, k=0)
// Where k=0 represents probability of getting 0 starters (which we subtract from 1)

export interface StarterDataPoint {
  starters: number;
  probability: number;
}

// Pre-calculated data for 40-card deck, 5-card opening hand
// Probability of opening with AT LEAST 1 starter card
export const starterOpeningData: StarterDataPoint[] = [
  { starters: 1, probability: 12.50 },
  { starters: 2, probability: 23.72 },
  { starters: 3, probability: 33.76 },
  { starters: 4, probability: 42.71 },
  { starters: 5, probability: 50.66 },
  { starters: 6, probability: 57.71 },
  { starters: 7, probability: 63.93 },
  { starters: 8, probability: 69.40 },
  { starters: 9, probability: 74.18 },
  { starters: 10, probability: 78.34 },
  { starters: 11, probability: 81.95 },
  { starters: 12, probability: 85.06 },
  { starters: 13, probability: 87.73 },
  { starters: 14, probability: 90.00 },
  { starters: 15, probability: 91.93 },
  { starters: 16, probability: 93.54 },
  { starters: 17, probability: 94.89 },
  { starters: 18, probability: 96.00 },
  { starters: 19, probability: 96.91 },
  { starters: 20, probability: 97.64 },
  { starters: 21, probability: 98.23 },
  { starters: 22, probability: 98.70 },
  { starters: 23, probability: 99.06 },
  { starters: 24, probability: 99.34 },
  { starters: 25, probability: 99.54 },
  { starters: 26, probability: 99.70 },
  { starters: 27, probability: 99.80 },
  { starters: 28, probability: 99.88 },
  { starters: 29, probability: 99.93 },
  { starters: 30, probability: 99.96 }
];

// Calculate marginal gains (difference between consecutive probability points)
export const getMarginalGains = (): number[] => {
  const gains: number[] = []
  
  for (let i = 1; i < starterOpeningData.length; i++) {
    const currentProb = starterOpeningData[i].probability
    const previousProb = starterOpeningData[i - 1].probability
    const marginalGain = currentProb - previousProb
    gains.push(Math.round(marginalGain * 100) / 100) // Round to 2 decimal places
  }
  
  return gains
}

// Configuration used for calculations
export const chartConfig = {
  deckSize: 40,
  handSize: 5,
  description: 'Probability of opening with at least one starter card and marginal gains showing diminishing returns'
};