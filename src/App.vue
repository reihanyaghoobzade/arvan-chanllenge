<script setup>
import { RouterView } from 'vue-router'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import ToastComponent from './components/ToastComponent.vue'
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
  <ToastComponent />
</template>
