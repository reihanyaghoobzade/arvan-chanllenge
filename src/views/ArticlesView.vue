<script setup>
import { useRoute } from 'vue-router'
import AllArticles from '../components/Article/AllArticles.vue'

const route = useRoute()
</script>

<template>
  <AllArticles :key="route.params.page" :article-page="route.params.page - 1 || 0" />
</template>
