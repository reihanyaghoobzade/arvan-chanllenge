<script setup>
import { useRoute } from 'vue-router'
import UpsertArticle from '../components/Article/UpsertArticle.vue'

const route = useRoute()
</script>

<template>
  <UpsertArticle :slug="route.params.slug" :key="route.params.slug" />
</template>

<style scoped></style>
