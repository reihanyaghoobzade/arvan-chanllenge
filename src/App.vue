<script setup>
import { RouterView } from 'vue-router'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useLogin } from './composables/login-and-register'
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
</template>
