<script setup>
import { RouterView, useRouter } from 'vue-router'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { watch } from 'vue'
import ToastComponent from './components/ToastComponent.vue'
import { useCurrentUser } from './composables/login-register'
import { useAuthStore } from './stores/auth'
import TokenService from './data/services/token'

const { data, isError } = useCurrentUser()
const auth = useAuthStore()
const router = useRouter()

watch(data, (newValue) => {
  auth.setCurrentUser(newValue?.user)
})

watch(isError, (newValue) => {
  if (newValue) {
    TokenService.removeToken()
    router.push('/login')
  }
})
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
  <ToastComponent />
</template>
