<template>
  <div class="min-h-screen bg-sakai-gradient dark:bg-sakai-dark-gradient transition-colors duration-300">
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="relative">
          <div class="w-12 h-12 bg-sakai-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="bxs:chart" class="w-6 h-6 text-white" />
          </div>
          <div class="absolute inset-0 w-12 h-12 border-4 border-sakai-primary-dark border-t-transparent rounded-lg animate-spin mx-auto"></div>
        </div>
        <div class="text-sakai-text-primary dark:text-white font-semibold text-lg mb-2">Loading shared configuration...</div>
        <div class="text-sakai-text-secondary dark:text-sakai-surface-300 text-sm">Decoding deck parameters</div>
      </div>
    </div>

    <!-- Copy Notification -->
    <div 
      v-if="showCopyNotification" 
      class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300"
    >
      <Icon name="heroicons:check-circle" class="w-5 h-5" />
      Link copied to clipboard!
    </div>

    <!-- Main Content -->
    <div v-show="!isLoading" class="min-h-screen bg-sakai-gradient dark:bg-sakai-dark-gradient transition-colors duration-300">
    <!-- Header -->
    <header class="flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-sakai-surface-800/80 backdrop-blur-sm border-b border-sakai-surface-200 dark:border-sakai-surface-600">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-sakai-primary rounded-lg flex items-center justify-center">
          <Icon name="bxs:chart" class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-semibold text-sakai-text-primary dark:text-white">Deck Optimize</span>
      </div>
      
      <button 
        @click="toggleDarkMode"
        class="p-2 rounded-lg hover:bg-sakai-surface-100 dark:hover:bg-sakai-surface-700 transition-colors"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <Icon v-if="isDark" name="heroicons:sun" class="w-5 h-5 text-sakai-text-primary dark:text-white" />
        <Icon v-else name="heroicons:moon" class="w-5 h-5 text-sakai-text-primary dark:text-white" />
      </button>
    </header>

    <div class="max-w-4xl mx-auto p-4 space-y-4">
      <!-- Deck Configuration -->
      <div class="bg-sakai-surface dark:bg-sakai-surface-800 rounded-xl shadow-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-4">
        <div class="flex items-center gap-2 text-sakai-text-primary dark:text-white font-semibold text-lg mb-3">
          <Icon name="heroicons:cog-6-tooth" class="w-6 h-6 text-sakai-primary" />
          <span>Deck Configuration</span>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4 mb-3">
          <div class="space-y-2 relative">
            <div class="flex items-center gap-2">
              <label for="totalCards" class="block text-sm font-medium text-sakai-text-secondary dark:text-sakai-surface-300">
                Total Cards in Deck
              </label>
              <button @click="toggleTooltip('totalCards')" data-tooltip-trigger class="text-sakai-text-secondary hover:text-sakai-primary transition-colors">
                <Icon name="heroicons:information-circle" class="w-4 h-4" />
              </button>
            </div>
            <div class="flex items-center">
              <button 
                @click="decrementTotal"
                class="px-3 py-2 bg-sakai-surface-100 dark:bg-sakai-surface-700 hover:bg-sakai-surface-200 dark:hover:bg-sakai-surface-600 rounded-l-lg transition-colors border border-sakai-surface-300 dark:border-sakai-surface-600 text-sakai-text-primary dark:text-white"
                :disabled="deckConfig.totalCards <= 1"
              >
                -
              </button>
              <input 
                id="totalCards"
                v-model.number="deckConfig.totalCards" 
                type="number"
                :min="1" 
                :max="60"
                class="block w-full rounded-none border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-700 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white"
                @input="calculateProbability"
                :title="'Total number of cards in your deck'"
              />
              <button 
                @click="incrementTotal"
                class="px-3 py-2 bg-sakai-surface-100 dark:bg-sakai-surface-700 hover:bg-sakai-surface-200 dark:hover:bg-sakai-surface-600 rounded-r-lg transition-colors border border-sakai-surface-300 dark:border-sakai-surface-600 text-sakai-text-primary dark:text-white"
                :disabled="deckConfig.totalCards >= 60"
              >
                +
              </button>
            </div>
            <div v-if="activeTooltip === 'totalCards'" data-tooltip class="absolute z-10 bg-sakai-text-primary text-white text-xs rounded py-2 px-3 top-full left-0 mt-1 whitespace-nowrap shadow-lg">
              Total number of cards in your deck
              <div class="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-sakai-text-primary"></div>
            </div>
          </div>
          
          <div class="space-y-2 relative">
            <div class="flex items-center gap-2">
              <label for="handSize" class="block text-sm font-medium text-sakai-text-secondary dark:text-sakai-surface-300">
                Opening Hand Size
              </label>
              <button @click="toggleTooltip('handSize')" data-tooltip-trigger class="text-sakai-text-secondary hover:text-sakai-primary transition-colors">
                <Icon name="heroicons:information-circle" class="w-4 h-4" />
              </button>
            </div>
            <div class="flex items-center">
              <button 
                @click="decrementHand"
                class="px-3 py-2 bg-sakai-surface-100 dark:bg-sakai-surface-700 hover:bg-sakai-surface-200 dark:hover:bg-sakai-surface-600 rounded-l-lg transition-colors border border-sakai-surface-300 dark:border-sakai-surface-600 text-sakai-text-primary dark:text-white"
                :disabled="deckConfig.handSize <= 1"
              >
                -
              </button>
              <input 
                id="handSize"
                v-model.number="deckConfig.handSize" 
                type="number"
                :min="1" 
                :max="10"
                class="block w-full rounded-none border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-700 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white"
                @input="calculateProbability"
                :title="'Number of cards you draw at the start'"
              />
              <button 
                @click="incrementHand"
                class="px-3 py-2 bg-sakai-surface-100 dark:bg-sakai-surface-700 hover:bg-sakai-surface-200 dark:hover:bg-sakai-surface-600 rounded-r-lg transition-colors border border-sakai-surface-300 dark:border-sakai-surface-600 text-sakai-text-primary dark:text-white"
                :disabled="deckConfig.handSize >= 10"
              >
                +
              </button>
            </div>
            <div v-if="activeTooltip === 'handSize'" data-tooltip class="absolute z-10 bg-sakai-text-primary text-white text-xs rounded py-2 px-3 top-full left-0 mt-1 whitespace-nowrap shadow-lg">
              Number of cards you draw at the start
              <div class="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-sakai-text-primary"></div>
            </div>
          </div>
        </div>
        
        <div class="text-right text-sm font-medium text-sakai-text-secondary dark:text-sakai-surface-300">
          Cards Assigned: {{ assignedCards }} / {{ deckConfig.totalCards }}
        </div>
      </div>

      <!-- Prebuilt Examples -->
      <div class="bg-sakai-surface dark:bg-sakai-surface-800 rounded-xl shadow-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-4">
        <div class="flex items-center gap-2 text-sakai-text-primary dark:text-white font-semibold text-lg mb-3">
          <Icon name="heroicons:squares-2x2" class="w-6 h-6 text-sakai-primary" />
          <span>Quick Examples</span>
        </div>
        
        <div class="space-y-2">
          <select 
            v-model="selectedExample"
            @change="handleExampleChange(selectedExample)"
            class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-700 focus:border-sakai-primary focus:ring-sakai-primary dark:text-white text-sakai-text-primary"
          >
            <option disabled selected value="">Choose a Prebuilt Example</option>
            <option 
              v-for="example in prebuiltExamples" 
              :key="example.id" 
              :value="example.id"
            >
              {{ example.name }}
            </option>
          </select>
          <p class="text-xs text-sakai-text-secondary dark:text-sakai-surface-300">
            Select an example to automatically fill the form with common deck scenarios
          </p>
        </div>
      </div>

      <!-- Card Groups -->
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
              <div class="flex items-center gap-2 mb-1">
                <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Group Name</label>
                <button @click="toggleTooltip(`groupName${group.id}`)" data-tooltip-trigger class="text-sakai-text-secondary hover:text-sakai-primary transition-colors">
                  <Icon name="heroicons:information-circle" class="w-4 h-4 md:w-4 md:h-4" />
                </button>
              </div>
              <input 
                v-model="group.name" 
                type="text"
                placeholder="Group name (e.g., Removal)"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="calculateProbability"
              />
              <div v-if="activeTooltip === `groupName${group.id}`" data-tooltip class="absolute z-10 bg-sakai-text-primary text-white text-xs rounded py-2 px-3 top-full left-0 mt-1 whitespace-nowrap shadow-lg">
                Give this group a descriptive name
                <div class="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-sakai-text-primary"></div>
              </div>
            </div>
            
            <!-- Cards Used -->
            <div class="relative">
              <div class="flex items-center gap-2 mb-1">
                <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Cards Used</label>
                <button @click="toggleTooltip(`cardsUsed${group.id}`)" data-tooltip-trigger class="text-sakai-text-secondary hover:text-sakai-primary transition-colors">
                  <Icon name="heroicons:information-circle" class="w-4 h-4 md:w-4 md:h-4" />
                </button>
              </div>
              <input 
                v-model.number="group.copies" 
                type="number"
                :min="0" 
                :max="deckConfig.totalCards"
                placeholder="0"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="updateMaximumOnCopiesChange(group)"
              />
              <div v-if="activeTooltip === `cardsUsed${group.id}`" data-tooltip class="absolute z-10 bg-sakai-text-primary text-white text-xs rounded py-2 px-3 top-full left-0 mt-1 whitespace-nowrap shadow-lg">
                How many copies of this group are in your deck
                <div class="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-sakai-text-primary"></div>
              </div>
            </div>
            
            <!-- Minimum -->
            <div class="relative">
              <div class="flex items-center gap-2 mb-1">
                <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Minimum</label>
                <button @click="toggleTooltip(`minimum${group.id}`)" data-tooltip-trigger class="text-sakai-text-secondary hover:text-sakai-primary transition-colors">
                  <Icon name="heroicons:information-circle" class="w-4 h-4 md:w-4 md:h-4" />
                </button>
              </div>
              <input 
                v-model.number="group.minNeeded" 
                type="number"
                :min="0" 
                :max="group.copies || 0"
                placeholder="1"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="calculateProbability"
              />
              <div v-if="activeTooltip === `minimum${group.id}`" data-tooltip class="absolute z-10 bg-sakai-text-primary text-white text-xs rounded py-2 px-3 top-full left-0 mt-1 whitespace-nowrap shadow-lg">
                Minimum cards needed in opening hand
                <div class="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-sakai-text-primary"></div>
              </div>
            </div>
            
            <!-- Maximum -->
            <div class="relative">
              <div class="flex items-center gap-2 mb-1">
                <label class="text-sm md:text-sm text-sakai-text-secondary dark:text-sakai-surface-300 font-medium">Maximum</label>
                <button @click="toggleTooltip(`maximum${group.id}`)" data-tooltip-trigger class="text-sakai-text-secondary hover:text-sakai-primary transition-colors">
                  <Icon name="heroicons:information-circle" class="w-4 h-4 md:w-4 md:h-4" />
                </button>
              </div>
              <input 
                v-model.number="group.maxNeeded" 
                type="number"
                :min="group.minNeeded || 0" 
                :max="group.copies || 0"
                placeholder="0"
                class="block w-full rounded-lg border-sakai-surface-300 dark:border-sakai-surface-600 bg-sakai-surface dark:bg-sakai-surface-800 text-center focus:border-sakai-primary focus:ring-sakai-primary dark:text-white placeholder-sakai-text-secondary dark:placeholder-sakai-surface-400"
                @input="calculateProbability"
              />
              <div v-if="activeTooltip === `maximum${group.id}`" data-tooltip class="absolute z-10 bg-sakai-text-primary text-white text-xs rounded py-2 px-3 top-full left-0 mt-1 whitespace-nowrap shadow-lg">
                Maximum cards needed in opening hand
                <div class="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-sakai-text-primary"></div>
              </div>
            </div>
            
            <!-- Delete Button -->
            <div class="relative flex mt-2 md:mt-6">
              <button 
                @click="removeGroup(index)"
                class="text-sakai-text-secondary hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 opacity-40 hover:opacity-100"
                :disabled="cardGroups.length <= 1"
                :class="{ 'opacity-20 cursor-not-allowed hover:bg-transparent hover:text-sakai-text-secondary': cardGroups.length <= 1 }"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button 
            @click="addGroup"
            class="bg-sakai-primary hover:bg-sakai-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 w-full flex items-center justify-center space-x-2"
          >
            <Icon name="heroicons:plus" class="w-5 h-5" />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="probability !== null" class="bg-sakai-surface dark:bg-sakai-surface-800 rounded-xl shadow-lg border border-sakai-surface-200 dark:border-sakai-surface-600 p-6 text-center">
        <div class="text-6xl font-bold mb-2 transition-colors duration-300"
             :class="getProbabilityColorClass()">
          {{ (probability * 100).toFixed(2) }}%
        </div>
        <div class="text-lg text-sakai-text-secondary dark:text-sakai-surface-300 mb-6">
          Chance of drawing your desired combination
        </div>
        
        <div class="w-full bg-sakai-surface-200 dark:bg-sakai-surface-600 rounded-full h-3 overflow-hidden mb-6">
          <div 
            class="h-full transition-all duration-500 ease-out"
            :class="getProgressBarClass()"
            :style="{ width: `${probability * 100}%` }"
          ></div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
               :class="getConsistencyClasses()">
            {{ getConsistencyRating() }}
          </div>
          
          <button 
            @click="shareResults"
            class="inline-flex items-center gap-2 px-4 py-2 bg-sakai-primary hover:bg-sakai-primary-dark text-white font-medium text-sm rounded-lg transition-colors duration-200"
          >
            <Icon name="heroicons:share" class="w-4 h-4" />
            Share Results
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { prebuiltExamples as examples, getExampleById } from '~/helpers/examples'

// Get shared URL state from middleware
const hasSharedUrl = useState('hasSharedUrl', () => false)
const sharedUrlData = useState('sharedUrlData', () => null)

const deckConfig = ref({
  totalCards: 40,
  handSize: 5
})

const cardGroups = ref([
  {
    id: 1,
    name: '',
    copies: 0,
    minNeeded: 1,
    maxNeeded: 0
  }
])

const probability = ref(null)
let nextGroupId = 2

const isDark = ref(false)
const isMobile = ref(false)
const activeTooltip = ref(null)
const selectedExample = ref('')
const showCopyNotification = ref(false)
const isLoading = ref(hasSharedUrl.value || false)

const prebuiltExamples = ref(examples)

watch(probability, (newResult) => {
  if(newResult){
    console.log('novo resultado!', newResult)
    isLoading.value = false
  }
})

// Watch for shared URL state changes from middleware
watch(hasSharedUrl, (newValue) => {
  if (newValue) {
    isLoading.value = true
    console.log('Shared URL detected, showing loading state')
  }
}, { immediate: true })

// Watch for shared data changes and trigger loading
watch(sharedUrlData, (newData) => {
  if (newData && hasSharedUrl.value) {
    console.log('Shared data available, starting to load')
    loadSharedData(newData)
  }
}, { immediate: true })

function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

function updateScreenSize() {
  isMobile.value = window.innerWidth < 768
}

function toggleTooltip(tooltipId) {
  activeTooltip.value = activeTooltip.value === tooltipId ? null : tooltipId
}

function updateMaximumOnCopiesChange(group) {
  if (group.copies !== null && group.copies !== undefined && group.copies > 0) {
    group.maxNeeded = group.copies
  }
  calculateProbability()
}

function loadExample(example) {
  deckConfig.value = { ...example.config }
  cardGroups.value = example.config.groups.map((group, index) => ({
    id: index + 1,
    name: group.name,
    copies: group.copies,
    minNeeded: group.minNeeded,
    maxNeeded: group.maxNeeded
  }))
  nextGroupId = cardGroups.value.length + 1
  selectedExample.value = example.id
  calculateProbability()
}

function handleExampleChange(exampleId) {
  const example = getExampleById(exampleId)
  if (example) {
    loadExample(example)
  }
}

// URL encoding/decoding functions
function encodeFormData() {
  const data = {
    deck: deckConfig.value,
    groups: cardGroups.value.map(group => ({
      name: group.name,
      copies: group.copies,
      minNeeded: group.minNeeded,
      maxNeeded: group.maxNeeded
    }))
  }
  
  // Simple Base64 encoding for obfuscation
  const jsonString = JSON.stringify(data)
  return btoa(encodeURIComponent(jsonString))
}

function decodeFormData(encodedData) {
  try {
    const jsonString = decodeURIComponent(atob(encodedData))
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Failed to decode form data:', error)
    return null
  }
}

async function shareResults() {
  try {
    const encodedData = encodeFormData()
    const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`
    
    await navigator.clipboard.writeText(url)
    
    // Show notification
    showCopyNotification.value = true
    setTimeout(() => {
      showCopyNotification.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    // Fallback: show URL in an alert
    const encodedData = encodeFormData()
    const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`
    alert(`Copy this URL to share: ${url}`)
  }
}

function loadSharedData(encodedData) {
  try {
    // Add a small delay to show the loading animation
    setTimeout(() => {
      const decodedData = decodeFormData(encodedData)
      if (decodedData) {
        deckConfig.value = { ...decodedData.deck }
        cardGroups.value = decodedData.groups.map((group, index) => ({
          id: index + 1,
          name: group.name || '',
          copies: group.copies || 0,
          minNeeded: group.minNeeded || 1,
          maxNeeded: group.maxNeeded || 0
        }))
        nextGroupId = cardGroups.value.length + 1
        calculateProbability()
      }
      
      // Set loading to false after data is loaded
      isLoading.value = false
    }, 800) // 800ms delay for better UX
  } catch (error) {
    console.error('Failed to load shared data:', error)
    isLoading.value = false
  }
}

const assignedCards = computed(() => {
  return cardGroups.value.reduce((total, group) => total + (group.copies || 0), 0)
})

const canCalculate = computed(() => {
  return deckConfig.value.totalCards > 0 && 
         deckConfig.value.handSize > 0 && 
         assignedCards.value <= deckConfig.value.totalCards &&
         cardGroups.value.some(group => group.copies > 0 && (group.minNeeded > 0 || group.maxNeeded > 0))
})

function addGroup() {
  cardGroups.value.push({
    id: nextGroupId++,
    name: '',
    copies: 0,
    minNeeded: 1,
    maxNeeded: 0
  })
}

function removeGroup(index) {
  if (cardGroups.value.length > 1) {
    cardGroups.value.splice(index, 1)
    calculateProbability()
  }
}

function combination(n, k) {
  if (k > n || k < 0) return 0
  if (k === 0 || k === n) return 1
  
  let result = 1
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1)
  }
  return Math.round(result)
}

function hypergeometric(N, K, n, k) {
  return combination(K, k) * combination(N - K, n - k) / combination(N, n)
}

function calculateProbability() {
  if (!canCalculate.value) {
    probability.value = null
    return
  }

  const N = deckConfig.value.totalCards
  const n = deckConfig.value.handSize
  
  let totalProbability = 0
  const activeGroups = cardGroups.value.filter(group => 
    group.copies > 0 && (group.minNeeded > 0 || group.maxNeeded > 0)
  )
  
  if (activeGroups.length === 0) {
    probability.value = null
    return
  }

  if (activeGroups.length === 1) {
    const group = activeGroups[0]
    const K = group.copies
    const minK = group.minNeeded || 0
    const maxK = group.maxNeeded || minK || K
    
    // Calculate probability for range [minK, maxK] inclusive
    for (let k = minK; k <= Math.min(maxK, K, n); k++) {
      if (k >= 0) {
        totalProbability += hypergeometric(N, K, n, k)
      }
    }
  } else {
    // For multiple groups, calculate individual probabilities and combine
    const groupProbs = activeGroups.map(group => {
      const K = group.copies
      const minK = group.minNeeded || 0
      const maxK = group.maxNeeded || minK || K
      let groupProb = 0
      
      // Calculate probability for range [minK, maxK] inclusive
      for (let k = minK; k <= Math.min(maxK, K, n); k++) {
        if (k >= 0) {
          groupProb += hypergeometric(N, K, n, k)
        }
      }
      return groupProb
    })
    
    // Multiply probabilities (assuming independence for small overlaps)
    totalProbability = groupProbs.reduce((acc, prob) => acc * prob, 1)
  }
  
  probability.value = Math.max(0, Math.min(1, totalProbability))
}

function decrementTotal() {
  if (deckConfig.value.totalCards > 1) {
    deckConfig.value.totalCards--
    calculateProbability()
  }
}

function incrementTotal() {
  if (deckConfig.value.totalCards < 60) {
    deckConfig.value.totalCards++
    calculateProbability()
  }
}

function decrementHand() {
  if (deckConfig.value.handSize > 1) {
    deckConfig.value.handSize--
    calculateProbability()
  }
}

function incrementHand() {
  if (deckConfig.value.handSize < 10) {
    deckConfig.value.handSize++
    calculateProbability()
  }
}

function getConsistencyRating() {
  if (probability.value === null) return ''
  const percent = probability.value * 100
  if (percent >= 90) return '⭐ Excellent probability'
  if (percent >= 75) return '✨ Very good probability'
  if (percent >= 60) return '👍 Good probability'
  if (percent >= 40) return '⚠️ Fair probability'
  return '❌ Low probability'
}

function getConsistencyClasses() {
  if (probability.value === null) return 'bg-gray-100 text-gray-600'
  const percent = probability.value * 100
  if (percent >= 75) return 'bg-green-100 text-green-800'
  if (percent >= 50) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getProbabilityColorClass() {
  if (probability.value === null) return 'text-sakai-text-secondary'
  const percent = probability.value * 100
  if (percent >= 75) return 'text-green-600 dark:text-green-400'
  if (percent >= 50) return 'text-yellow-600 dark:text-yellow-400'
  if (percent >= 25) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

function getProgressBarClass() {
  if (probability.value === null) return 'bg-sakai-surface-300'
  const percent = probability.value * 100
  if (percent >= 75) return 'bg-gradient-to-r from-green-500 to-green-600'
  if (percent >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  if (percent >= 25) return 'bg-gradient-to-r from-orange-500 to-orange-600'
  return 'bg-gradient-to-r from-red-500 to-red-600'
}

onMounted(() => {
  // Initialize dark mode from localStorage
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (savedDarkMode === 'false') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    // Default to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  }
  
  // Initialize screen size
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
  
  // Close tooltip when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-tooltip-trigger]') && !e.target.closest('[data-tooltip]')) {
      activeTooltip.value = null
    }
  })
  
  // Only calculate probability if no shared URL is being loaded
  if (!hasSharedUrl.value) {
    // Calculate probability for the default empty form
    calculateProbability()
  }
})
</script>