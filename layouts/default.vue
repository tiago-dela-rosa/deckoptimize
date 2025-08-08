<template>
  <div class="min-h-screen bg-sakai-gradient dark:bg-sakai-dark-gradient transition-colors duration-300 flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader/AppHeader.vue'
import AppFooter from '~/components/AppFooter/AppFooter.vue'
</script>