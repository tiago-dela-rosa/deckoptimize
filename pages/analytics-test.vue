<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Umami Analytics Test Page
        </h1>
        
        <div class="space-y-6">
          <!-- Status Check -->
          <div class="p-4 rounded-lg" :class="umamiReady ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'">
            <h2 class="text-lg font-semibold mb-2" :class="umamiReady ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
              Umami Status: {{ umamiReady ? 'Ready ✅' : 'Not Ready ❌' }}
            </h2>
            <p class="text-sm" :class="umamiReady ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
              {{ umamiReady ? 'Umami is loaded and ready to track events' : 'Umami is not loaded. Check your configuration.' }}
            </p>
          </div>

          <!-- Test Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="testCustomEvent"
              class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              umTrackEvent
            </button>

            <button
              @click="testPageView"
              class="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
              :disabled="!umamiReady"
            >
              umTrackView
            </button>

            <button
              @click="testButtonClick"
              class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
              :disabled="!umamiReady"
            >
              Button Click Event
            </button>

            <button
              @click="testCalculationEvent"
              class="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
              :disabled="!umamiReady"
            >
              Calculation Event
            </button>

            <button
              @click="testIdentify"
              class="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm"
              :disabled="!umamiReady"
            >
              umIdentify
            </button>

            <button
              @click="testRevenue"
              class="px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors text-sm"
              :disabled="!umamiReady"
            >
              umTrackRevenue
            </button>
          </div>

          <!-- Event Log -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Log</h3>
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto">
              <div v-if="eventLog.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
                No events tracked yet. Click the buttons above to test tracking.
              </div>
              <div v-for="(event, index) in eventLog" :key="index" class="mb-2 p-2 bg-white dark:bg-gray-600 rounded text-sm">
                <div class="font-medium text-gray-900 dark:text-white">{{ event.name }}</div>
                <div class="text-gray-600 dark:text-gray-300">{{ event.timestamp }}</div>
                <div v-if="event.data" class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {{ JSON.stringify(event.data) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Configuration Info -->
          <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Configuration</h3>
            <div class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <div><strong>Host:</strong> {{ config.host || 'Not configured' }}</div>
              <div><strong>Website ID:</strong> {{ config.id ? `${config.id.substring(0, 8)}...` : 'Not configured' }}</div>
              <div><strong>Auto Track:</strong> {{ config.autoTrack ? 'Enabled' : 'Disabled' }}</div>
              <div><strong>SPA Mode:</strong> {{ config.spa ? 'Enabled' : 'Disabled' }}</div>
            </div>
          </div>

          <!-- Directive Test -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">v-umami Directive Test</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Test the v-umami directive for simple event tracking.
            </p>
            <div class="flex gap-4">
              <button
                v-umami="'directive-simple'"
                class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Simple Directive
              </button>
              <button
                v-umami="{ name: 'directive-with-data', source: 'test-page', action: 'click' }"
                class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Directive with Data
              </button>
            </div>
          </div>

          <!-- Navigation Test -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigation Test</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Test client-side navigation tracking by navigating between pages (autoTrack should work).
            </p>
            <NuxtLink
              to="/"
              class="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Home Page
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page title
useHead({
  title: 'Analytics Test'
})

// Reactive state for logging
const eventLog = ref<Array<{ name: string, timestamp: string, data?: any }>>([])

// Configuration from runtime config
const config = useRuntimeConfig().public.umami || {}

// Check if umami functions are available
const umamiReady = computed(() => {
  return process.client && typeof umTrackEvent !== 'undefined'
})

// Helper to add event to log
const logEvent = (name: string, data?: any) => {
  eventLog.value.unshift({
    name,
    timestamp: new Date().toLocaleTimeString(),
    data
  })
}

// Test functions using official nuxt-umami v3 methods
const testCustomEvent = async () => {
  try {
    const result = await umTrackEvent('test_custom_event', {
      page: 'analytics-test',
      type: 'click',
      timestamp: Date.now()
    })
    logEvent('Custom Event', { page: 'analytics-test', result })
  } catch (error) {
    logEvent('Error: Custom Event', { error: error.message })
  }
}

const testPageView = async () => {
  try {
    const result = await umTrackView('/analytics-test', 'https://example.com')
    logEvent('Manual Page View', { url: '/analytics-test', result })
  } catch (error) {
    logEvent('Error: Page View', { error: error.message })
  }
}

const testButtonClick = async () => {
  try {
    const result = await umTrackEvent('button_click', {
      button: 'test_button',
      location: 'analytics_test_page',
      action: 'click'
    })
    logEvent('Button Click', { button: 'test_button', result })
  } catch (error) {
    logEvent('Error: Button Click', { error: error.message })
  }
}

const testCalculationEvent = async () => {
  try {
    const result = await umTrackEvent('calculation_performed', {
      type: 'test_calculation',
      cards: 40,
      hand_size: 5,
      source: 'test_page'
    })
    logEvent('Calculation Event', { type: 'test_calculation', result })
  } catch (error) {
    logEvent('Error: Calculation Event', { error: error.message })
  }
}

const testIdentify = async () => {
  try {
    const result = await umIdentify({
      user_type: 'tester',
      session_id: Date.now(),
      browser: 'test'
    })
    logEvent('Identify Event', { result })
  } catch (error) {
    logEvent('Error: Identify', { error: error.message })
  }
}

const testRevenue = async () => {
  try {
    const result = await umTrackRevenue('test_purchase', 29.99, 'USD')
    logEvent('Revenue Event', { amount: 29.99, currency: 'USD', result })
  } catch (error) {
    logEvent('Error: Revenue', { error: error.message })
  }
}

// Log page load
onMounted(() => {
  logEvent('Page Mounted')
})
</script>