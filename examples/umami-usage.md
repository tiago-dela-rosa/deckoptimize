# Umami Analytics Usage Examples for Deck Optimize

## Direct Method Usage (Recommended)

### Track Events
```vue
<script setup>
// Track a calculation event
const onCalculate = async () => {
  try {
    await umTrackEvent('calculation_performed', {
      deck_size: deckConfiguration.value.totalCards,
      hand_size: deckConfiguration.value.handSize,
      card_groups: cardGroups.value.length,
      game_type: 'yugioh' // or 'mtg', 'pokemon', etc.
    })
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

// Track user interactions
const onQuickExampleUsed = async (exampleName) => {
  await umTrackEvent('quick_example_used', {
    example: exampleName,
    source: 'quick_examples_section'
  })
}

// Track sharing events
const onUrlCopied = async () => {
  await umTrackEvent('url_shared', {
    type: 'copy_link',
    page: 'calculator'
  })
}
</script>
```

### Track Page Views (Manual)
```vue
<script setup>
// Manual page view tracking (usually not needed with autoTrack: true)
const trackCustomView = async () => {
  await umTrackView('/custom-path', 'https://referrer.com')
}
</script>
```

### Track User Identification
```vue
<script setup>
// Identify user sessions with custom data
const identifyUser = async () => {
  await umIdentify({
    user_type: 'power_user',
    visit_count: 5,
    preferred_game: 'yugioh'
  })
}
</script>
```

### Track Revenue (if applicable)
```vue
<script setup>
// Track premium features or donations
const onDonation = async (amount) => {
  await umTrackRevenue('donation', amount, 'USD')
}
</script>
```

## Directive Usage (Simple Events)

```vue
<template>
  <!-- Simple event name -->
  <button v-umami="'button_clicked'">
    Simple Track
  </button>

  <!-- Event with data -->
  <button v-umami="{ name: 'feature_used', feature: 'card_optimizer', location: 'sidebar' }">
    Track with Data
  </button>
</template>
```

## Recommended Events for Deck Optimize

```javascript
// Core functionality
umTrackEvent('calculation_performed', { deck_size: 40, hand_size: 5 })
umTrackEvent('card_group_added', { group_count: 3 })
umTrackEvent('quick_example_used', { example: 'yugioh_combo' })

// User engagement
umTrackEvent('url_shared', { method: 'copy' })
umTrackEvent('settings_changed', { setting: 'hand_size' })
umTrackEvent('help_accessed', { section: 'probability_explanation' })

// Page interactions
umTrackEvent('dark_mode_toggled', { state: 'dark' })
umTrackEvent('mobile_menu_opened', {})

// Errors (optional)
umTrackEvent('calculation_error', { error_type: 'invalid_input' })
```

## Notes

- All methods return `Promise<{ ok: boolean }>`
- Always wrap in try-catch for error handling
- Use meaningful event names and consistent data structures
- Automatic page view tracking is enabled with `autoTrack: true`
- Event data should only contain strings, numbers, or booleans