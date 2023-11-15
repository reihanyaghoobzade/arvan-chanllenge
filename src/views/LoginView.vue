<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <main>{{ route?.name === 'login' ? 'login page' : 'register page' }}</main>
</template>
