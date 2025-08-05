<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="relative">
        <div class="w-12 h-12 bg-sakai-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Icon name="bxs:chart" class="w-6 h-6 text-white" />
        </div>
        <div class="absolute inset-0 w-12 h-12 border-4 border-sakai-primary-dark border-t-transparent rounded-lg animate-spin mx-auto"></div>
      </div>
      <div class="text-sakai-text-primary dark:text-white font-semibold text-lg mb-2">{{ $t('loading.title') }}</div>
      <div class="text-sakai-text-secondary dark:text-sakai-surface-300 text-sm">{{ $t('loading.subtitle') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading: boolean
}

defineProps<Props>()
</script>