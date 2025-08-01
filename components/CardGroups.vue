<template>
  <div class="bg-sakai-surface dark:bg-sakai-surface-800 rounded-xl shadow-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-4">
    <div class="flex items-center gap-2 text-sakai-text-primary dark:text-white font-semibold text-lg mb-3">
      <Icon name="heroicons:list-bullet" class="w-6 h-6 text-sakai-primary" />
      <span>Card Groups</span>
    </div>
    
    <div class="space-y-4">
      <div 
        v-for="(group, index) in cardGroups" 
        :key="group.id" 
        class="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-sakai-surface-50 dark:bg-sakai-surface-700 rounded-lg items-start md:items-center relative"
      >
        <!-- Group Name -->
        <div class="relative md:col-span-2">
          <TooltipWrapper
            :tooltip-id="`groupName${group.id}`"
            tooltip-text="Give this group a descriptive name"
            :is-active="activeTooltip === `groupName${group.id}`"
            @toggle-tooltip="$emit('toggle-tooltip', $event)"
          >
            <template #label>
              <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Group Name</label>
            </template>
            <template #content>
              <input 
                v-model="group.name" 
                type="text"
                placeholder="Group name (e.g., Removal)"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="$emit('calculate-probability')"
              />
            </template>
          </TooltipWrapper>
        </div>
        
        <!-- Cards Used -->
        <div class="relative">
          <TooltipWrapper
            :tooltip-id="`cardsUsed${group.id}`"
            tooltip-text="How many copies of this group are in your deck"
            :is-active="activeTooltip === `cardsUsed${group.id}`"
            @toggle-tooltip="$emit('toggle-tooltip', $event)"
          >
            <template #label>
              <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Cards Used</label>
            </template>
            <template #content>
              <IncrementControl
                v-if="isMobile"
                :value="group.copies || 0"
                :min="0"
                :max="totalCards"
                :input-id="`copies-${group.id}`"
                title="Number of copies in deck"
                :decrement-disabled="(group.copies || 0) <= 0"
                :increment-disabled="(group.copies || 0) >= totalCards"
                @increment="incrementCopies(group)"
                @decrement="decrementCopies(group)"
                @update:value="updateCopies(group, $event)"
              />
              <input 
                v-else
                v-model.number="group.copies" 
                type="number"
                :min="0" 
                :max="totalCards"
                placeholder="0"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="handleCopiesChange(group)"
              />
            </template>
          </TooltipWrapper>
        </div>
        
        <!-- Minimum -->
        <div class="relative">
          <TooltipWrapper
            :tooltip-id="`minimum${group.id}`"
            tooltip-text="Minimum cards needed in opening hand"
            :is-active="activeTooltip === `minimum${group.id}`"
            @toggle-tooltip="$emit('toggle-tooltip', $event)"
          >
            <template #label>
              <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Minimum</label>
            </template>
            <template #content>
              <IncrementControl
                v-if="isMobile"
                :value="group.minNeeded || 0"
                :min="0"
                :max="group.copies || 0"
                :input-id="`minimum-${group.id}`"
                title="Minimum cards needed in opening hand"
                :decrement-disabled="(group.minNeeded || 0) <= 0"
                :increment-disabled="(group.minNeeded || 0) >= (group.copies || 0)"
                @increment="incrementMinimum(group)"
                @decrement="decrementMinimum(group)"
                @update:value="updateMinimum(group, $event)"
              />
              <input 
                v-else
                v-model.number="group.minNeeded" 
                type="number"
                :min="0" 
                :max="group.copies || 0"
                placeholder="1"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="$emit('calculate-probability')"
              />
            </template>
          </TooltipWrapper>
        </div>
        
        <!-- Maximum -->
        <div class="relative">
          <TooltipWrapper
            :tooltip-id="`maximum${group.id}`"
            tooltip-text="Maximum cards needed in opening hand"
            :is-active="activeTooltip === `maximum${group.id}`"
            @toggle-tooltip="$emit('toggle-tooltip', $event)"
          >
            <template #label>
              <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Maximum</label>
            </template>
            <template #content>
              <IncrementControl
                v-if="isMobile"
                :value="group.maxNeeded || 0"
                :min="group.minNeeded || 0"
                :max="group.copies || 0"
                :input-id="`maximum-${group.id}`"
                title="Maximum cards needed in opening hand"
                :decrement-disabled="(group.maxNeeded || 0) <= (group.minNeeded || 0)"
                :increment-disabled="(group.maxNeeded || 0) >= (group.copies || 0)"
                @increment="incrementMaximum(group)"
                @decrement="decrementMaximum(group)"
                @update:value="updateMaximum(group, $event)"
              />
              <input 
                v-else
                v-model.number="group.maxNeeded" 
                type="number"
                :min="group.minNeeded || 0" 
                :max="group.copies || 0"
                placeholder="0"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="$emit('calculate-probability')"
              />
            </template>
          </TooltipWrapper>
        </div>
        
        <!-- Delete Button -->
        <div class="relative flex mt-2 md:mt-6">
          <button 
            @click="handleRemoveGroup(index)"
            class="text-sakai-text-secondary hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 opacity-40 hover:opacity-100"
            :disabled="cardGroups.length <= 1"
            :class="{ 'opacity-20 cursor-not-allowed hover:bg-transparent hover:text-sakai-text-secondary': cardGroups.length <= 1 }"
          >
            <Icon name="heroicons:trash" class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <button 
        @click="$emit('add-group')"
        class="bg-sakai-primary hover:bg-sakai-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 w-full flex items-center justify-center space-x-2"
      >
        <Icon name="heroicons:plus" class="w-5 h-5" />
        <span>Add Group</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CardGroupWithId } from '~/interfaces'
import TooltipWrapper from '~/components/ui/TooltipWrapper/TooltipWrapper.vue'
import IncrementControl from '~/components/ui/IncrementControl.vue'

interface Props {
  cardGroups: CardGroupWithId[]
  totalCards: number
  activeTooltip: string | null
}

const props = defineProps<Props>()

// Mobile detection
const isMobile = ref(false)

function updateScreenSize() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

const emit = defineEmits<{
  'add-group': []
  'remove-group': [index: number]
  'calculate-probability': []
  'toggle-tooltip': [id: string]
}>()

function handleCopiesChange(group: CardGroupWithId) {
  emit('calculate-probability')
}

function handleRemoveGroup(index: number) {
  emit('remove-group', index)
  emit('calculate-probability')
}

// Increment/Decrement functions for mobile controls
function incrementCopies(group: CardGroupWithId) {
  if (group.copies < props.totalCards) {
    group.copies++
    handleCopiesChange(group)
  }
}

function decrementCopies(group: CardGroupWithId) {
  if (group.copies > 0) {
    group.copies--
    handleCopiesChange(group)
  }
}

function updateCopies(group: CardGroupWithId, value: number) {
  if (value >= 0 && value <= props.totalCards) {
    group.copies = value
    handleCopiesChange(group)
  }
}

function incrementMinimum(group: CardGroupWithId) {
  if (group.minNeeded < (group.copies || 0)) {
    group.minNeeded++
    emit('calculate-probability')
  }
}

function decrementMinimum(group: CardGroupWithId) {
  if (group.minNeeded > 0) {
    group.minNeeded--
    emit('calculate-probability')
  }
}

function updateMinimum(group: CardGroupWithId, value: number) {
  if (value >= 0 && value <= (group.copies || 0)) {
    group.minNeeded = value
    emit('calculate-probability')
  }
}

function incrementMaximum(group: CardGroupWithId) {
  if (group.maxNeeded < (group.copies || 0)) {
    group.maxNeeded++
    emit('calculate-probability')
  }
}

function decrementMaximum(group: CardGroupWithId) {
  if (group.maxNeeded > (group.minNeeded || 0)) {
    group.maxNeeded--
    emit('calculate-probability')
  }
}

function updateMaximum(group: CardGroupWithId, value: number) {
  if (value >= (group.minNeeded || 0) && value <= (group.copies || 0)) {
    group.maxNeeded = value
    emit('calculate-probability')
  }
}
</script>