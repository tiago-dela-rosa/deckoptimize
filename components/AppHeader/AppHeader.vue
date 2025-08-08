<template>
  <header class="relative flex items-center px-3 xs:px-6 py-3 bg-white/80 dark:bg-sakai-surface-800/80 backdrop-blur-sm border-b border-sakai-surface-200 dark:border-sakai-surface-600">
    <!-- Logo -->
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-sakai-primary rounded-lg flex items-center justify-center">
        <Icon name="bxs:chart" class="w-5 h-5 text-white" />
      </div>
      <span class="text-lg xs:text-xl font-semibold text-sakai-text-primary dark:text-white">{{ $t('header.title') }}</span>
    </div>
    
    <!-- Navigation Tabs - Responsive positioning -->
    <nav class="absolute right-16 xs:left-1/2 xs:right-auto xs:transform xs:-translate-x-1/2 flex items-center space-x-1">
      <NuxtLink
        to="/"
        @click="trackNavigation('calculator')"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
        :class="$route.path === '/' 
          ? 'bg-sakai-primary text-white shadow-sm' 
          : 'text-sakai-text-600 dark:text-sakai-surface-200 hover:bg-sakai-surface-100 dark:hover:bg-sakai-surface-700 hover:text-sakai-text-primary dark:hover:text-white'"
      >
        <Icon name="heroicons:calculator" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ $t('header.nav.calculator') }}</span>
      </NuxtLink>
      
      <NuxtLink
        to="/charts"
        @click="trackNavigation('charts')"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
        :class="$route.path === '/charts' 
          ? 'bg-sakai-primary text-white shadow-sm' 
          : 'text-sakai-text-600 dark:text-sakai-surface-200 hover:bg-sakai-surface-100 dark:hover:bg-sakai-surface-700 hover:text-sakai-text-primary dark:hover:text-white'"
      >
        <Icon name="heroicons:chart-bar" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ $t('header.nav.charts') }}</span>
      </NuxtLink>
    </nav>
    
    <!-- Theme Toggle -->
    <div class="ml-auto">
      <button 
        @click="toggleDarkMode"
        class="p-2 rounded-lg hover:bg-sakai-surface-100 dark:hover:bg-sakai-surface-700 transition-colors"
        :title="isDark ? $t('header.darkMode.switchToLight') : $t('header.darkMode.switchToDark')"
      >
        <Icon v-if="isDark" name="heroicons:sun" class="w-5 h-5 text-sakai-text-primary dark:text-white" />
        <Icon v-else name="heroicons:moon" class="w-5 h-5 text-sakai-text-primary dark:text-white" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { trackThemeToggled } from './appHeader.events'

const isDark = ref(false)

function toggleDarkMode() {
  const fromTheme = isDark.value ? 'dark' : 'light'
  const toTheme = isDark.value ? 'light' : 'dark'
  
  trackThemeToggled(fromTheme, toTheme)
  
  isDark.value = !isDark.value
  isDark.value ? 
    (document.documentElement.classList.add('dark'), localStorage.setItem('darkMode', 'true')) :
    (document.documentElement.classList.remove('dark'), localStorage.setItem('darkMode', 'false'))
}

function trackNavigation(menuId: string) {
  // Track navigation event using umTrackEvent
  if (typeof umTrackEvent === 'function') {
    umTrackEvent('navigation_click', menuId)
  }
}

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedDarkMode === 'true' ? true : 
                 savedDarkMode === 'false' ? false : prefersDark
  
  isDark.value ? document.documentElement.classList.add('dark') : 
                 document.documentElement.classList.remove('dark')
})
</script>