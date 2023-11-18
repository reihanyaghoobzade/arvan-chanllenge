<!-- Toast.vue -->
<template>
  <div :class="['toast w-auto position-fixed rounded', { show: show }]">
    <div
      :class="[
        'p-3 opacity-0 bg-opacity-75 border rounded',
        { 'toast--success opacity-100': toastData?.type === 'success' },
        { 'toast--error opacity-100': toastData?.type === 'error' }
      ]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <strong>{{ toastData?.title }}</strong> &nbsp;
      <span>
        {{ toastData?.message }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '../stores/toast'

const toast = useToastStore()

const show = computed(() => {
  return toast.getShowToast
})

const toastData = computed(() => {
  return toast.getToastData
})
</script>

<style scoped>
.toast {
  top: 1rem;
  right: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease-in-out;
  background-color: white;
}

.toast--error {
  background-color: var(--light-pale-red);
  color: var(--brick);
}

.toast--success {
  background-color: var(--light-grey-green);
  color: var(--military-green);
}

.show {
  opacity: 1 !important;
}
</style>
