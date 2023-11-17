<template>
  <div class="loading">
    <div class="sk-chase">
      <div v-for="i in Array(6).fill(1)" :key="i" class="sk-chase-dot" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
