<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const { currentPage, allPage, perPage, baseRoute } = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  allPage: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    required: true
  },
  baseRoute: {
    type: String,
    required: true
  },
  showFirstLastPage: {
    type: Boolean,
    default: false
  }
})

const visiblePages = computed(() => {
  return Array.from(Array(allPage).keys()).slice(
    currentPage < perPage ? 0 : currentPage - perPage + 1,
    currentPage < perPage ? perPage : currentPage + 1
  )
})
</script>
<template>
  <nav aria-label="col-12 page navigation d-flex flex flex-wrap" limit="10">
    <ul class="pagination flex-wrap justify-content-center">
      <li v-if="showFirstLastPage" class="page-item">
        <RouterLink class="page-link" :to="baseRoute + 1" aria-label="First Page">
          <span aria-hidden="true">First Page</span>
        </RouterLink>
      </li>
      <li :class="['page-item', { disabled: currentPage === 0 }]">
        <RouterLink class="page-link" :to="baseRoute + currentPage" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </RouterLink>
      </li>
      <li v-if="currentPage > perPage - 1" class="page-item"><span class="page-link">...</span></li>
      <li v-for="i in visiblePages" :key="i" :class="['page-item', { active: currentPage === i }]">
        <RouterLink class="page-link" :to="baseRoute + (i + 1)">{{ i + 1 }}</RouterLink>
      </li>
      <li v-if="currentPage + 1 < allPage" class="page-item">
        <span class="page-link">...</span>
      </li>
      <li :class="['page-item', { disabled: allPage === currentPage + 1 }]">
        <RouterLink class="page-link" :to="`/articles/page/${+currentPage + 2}`" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </RouterLink>
      </li>
      <li v-if="showFirstLastPage" class="page-item">
        <RouterLink class="page-link" :to="baseRoute + allPage" aria-label="Last Page">
          <span aria-hidden="true">Last Page</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
