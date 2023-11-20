<script setup>
import { useRoute } from 'vue-router'
import LoginRegisterViews from '../components/Login/LoginRegisterViews.vue'

const route = useRoute()
</script>

<template>
  <LoginRegisterViews :key="route.name" :is-login-page="route.name === 'login'" />
</template>
