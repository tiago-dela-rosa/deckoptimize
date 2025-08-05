<template>
  <div class="bg-sakai-surface dark:bg-sakai-surface-800 rounded-xl shadow-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-4">
    <div class="flex items-center gap-2 text-sakai-text-primary dark:text-white font-semibold text-lg mb-3">
      <Icon name="heroicons:cog-6-tooth" class="w-6 h-6 text-sakai-primary" />
      <span>{{ $t('deckConfig.title') }}</span>
    </div>
    
    <div class="grid md:grid-cols-2 gap-4 mb-3">
      <TooltipWrapper
        tooltip-id="totalCards"
        :tooltip-text="$t('deckConfig.totalCards.tooltip')"
        :is-active="activeTooltip === 'totalCards'"
        @toggle-tooltip="$emit('toggle-tooltip', $event)"
      >
        <template #label>
          <label for="totalCards" class="block text-sm font-medium text-sakai-text-secondary dark:text-sakai-surface-300">
            {{ $t('deckConfig.totalCards.label') }}
          </label>
        </template>
        <template #content>
          <IncrementControl
            :value="deckConfig.totalCards"
            :min="1"
            :max="60"
            input-id="totalCards"
            :title="$t('deckConfig.totalCards.title')"
            :decrement-disabled="deckConfig.totalCards <= 1"
            :increment-disabled="deckConfig.totalCards >= 60"
            @increment="$emit('increment-total')"
            @decrement="$emit('decrement-total')"
            @update:value="$emit('update-total', $event)"
          />
        </template>
      </TooltipWrapper>
      
      <TooltipWrapper
        tooltip-id="handSize"
        :tooltip-text="$t('deckConfig.handSize.tooltip')"
        :is-active="activeTooltip === 'handSize'"
        @toggle-tooltip="$emit('toggle-tooltip', $event)"
      >
        <template #label>
          <label for="handSize" class="block text-sm font-medium text-sakai-text-secondary dark:text-sakai-surface-300">
            {{ $t('deckConfig.handSize.label') }}
          </label>
        </template>
        <template #content>
          <IncrementControl
            :value="deckConfig.handSize"
            :min="1"
            :max="10"
            input-id="handSize"
            :title="$t('deckConfig.handSize.title')"
            :decrement-disabled="deckConfig.handSize <= 1"
            :increment-disabled="deckConfig.handSize >= 10"
            @increment="$emit('increment-hand')"
            @decrement="$emit('decrement-hand')"
            @update:value="$emit('update-hand', $event)"
          />
        </template>
      </TooltipWrapper>
    </div>
    
    <div class="text-right text-sm font-medium text-sakai-text-secondary dark:text-sakai-surface-300">
      {{ $t('deckConfig.cardsAssigned', { assigned: assignedCards, total: deckConfig.totalCards }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeckConfig } from '~/interfaces'
import IncrementControl from '~/components/ui/IncrementControl.vue'
import TooltipWrapper from '~/components/ui/TooltipWrapper/TooltipWrapper.vue'

interface Props {
  deckConfig: DeckConfig
  assignedCards: number
  activeTooltip: string | null
}

defineProps<Props>()

defineEmits<{
  'increment-total': []
  'decrement-total': []
  'increment-hand': []
  'decrement-hand': []
  'update-total': [value: number]
  'update-hand': [value: number]
  'toggle-tooltip': [id: string]
}>()
</script>