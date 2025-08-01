<template>
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

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedDarkMode === 'true' ? true : 
                 savedDarkMode === 'false' ? false : prefersDark
  
  isDark.value ? document.documentElement.classList.add('dark') : 
                 document.documentElement.classList.remove('dark')
})
</script>