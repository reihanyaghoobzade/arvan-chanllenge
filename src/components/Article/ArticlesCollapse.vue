<script setup>
import dayjs from 'dayjs'
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'

const { articles, articlePage } = defineProps({
  articles: {
    type: Array,
    required: true
  },
  articlePage: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['onDeletePost'])
const onDeletePost = (slug) => {
  document.getElementById('deleteModalClose').click()
  emit('onDeletePost', slug)
}
</script>

<template>
  <div v-for="(article, i) in articles" :key="article.title" class="mb-2">
    <div
      class="d-flex gap-2 w-100 overflow-hidden bg-light p-2"
      type="button"
      data-bs-toggle="collapse"
      :data-bs-target="`#article${i}`"
      aria-expanded="false"
      aria-controls="collapseExample"
    >
      <span>#{{ articlePage * 10 + (i + 1) }} </span>
      <span class="text-truncate">{{ article.title }}</span>
    </div>
    <div class="collapse" :id="`article${i}`">
      <div class="card card-body rounded-0 border-top-0">
        <p>Author: @{{ article.author.username }}</p>
        <p class="text-truncate">Tags: {{ article.tagList.join(', ') }}</p>
        <p class="text-truncate">Excerpt: {{ article.body }}</p>
        <p>Create At: {{ dayjs(article.createdAt).format('MMMM DD, YYYY') }}</p>
        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
          >
            Delete
          </button>
          <button class="btn btn-info" type="button">
            <RouterLink
              class="text-white text-decoration-none"
              :to="`/articles/edit/${article.slug}`"
              >Edit</RouterLink
            >
          </button>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModal">Delete Article</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="deleteModalClose"
            ></button>
          </div>
          <div class="modal-body pb-5 text-muted">Are you sure to delete Article?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              No
            </button>
            <button type="button" class="btn btn-danger" @click="() => onDeletePost(article.slug)">
              yes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
