<template>
  <footer class="bg-white/80 dark:bg-sakai-surface-800/80 backdrop-blur-sm border-t border-sakai-surface-200 dark:border-sakai-surface-600 py-6">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Left Section: Brand & Description -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-6 h-6 bg-sakai-primary rounded-lg flex items-center justify-center">
              <Icon name="bxs:chart" class="w-4 h-4 text-white" />
            </div>
            <span class="text-lg font-semibold text-sakai-text-primary dark:text-white">{{ $t('header.title') }}</span>
          </div>
          <p class="text-sm text-sakai-text-600 dark:text-sakai-surface-200 max-w-sm">
            {{ $t('footer.description') }}
          </p>
        </div>
        
        <!-- Center Section: Credits & Community -->
        <div class="flex flex-col items-center space-y-2 text-center">
          <div class="flex flex-col items-center space-y-1">
            <p class="text-xs text-sakai-text-500 dark:text-sakai-surface-300">
              {{ $t('footer.inspiredBy') }}
            </p>
            <a 
              href="https://www.youtube.com/@JessePerezStrategyGaming" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-xs text-sakai-text-600 dark:text-sakai-surface-200 hover:text-sakai-primary dark:hover:text-sakai-primary transition-colors"
            >
              {{ $t('footer.chartsInspiredBy') }}
            </a>
          </div>
          <p class="text-xs text-sakai-text-500 dark:text-sakai-surface-300">
            {{ $t('footer.madeWith') }} 
            <span class="text-red-500 mx-1">♥</span>
            {{ $t('footer.forCommunity') }}
          </p>
        </div>
        
        <!-- Right Section: Copyright -->
        <div class="text-center md:text-right">
          <p class="text-xs text-sakai-text-500 dark:text-sakai-surface-300">
            © {{ currentYear }} {{ $t('header.title') }}
          </p>
          <p class="text-xs text-sakai-text-500 dark:text-sakai-surface-300">
            {{ $t('footer.allRightsReserved') }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>