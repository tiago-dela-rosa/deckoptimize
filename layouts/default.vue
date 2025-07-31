<template>
  <div class="min-h-screen bg-sakai-gradient dark:bg-sakai-dark-gradient transition-colors duration-300">
    <AppHeader />
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
</script>