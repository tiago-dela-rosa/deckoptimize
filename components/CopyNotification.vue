<template>
  <div 
    v-if="showNotification" 
    class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300"
  >
    <Icon name="heroicons:check-circle" class="w-5 h-5" />
    {{ $t('notification.linkCopied') }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  showNotification: boolean
}

defineProps<Props>()
</script>