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
  document.getElementById('desktopDeleteModalClose').click()
  emit('onDeletePost', slug)
}
</script>

<template>
  <div class="table-responsive article__table">
    <table class="table">
      <thead class="table-secondary">
        <tr>
          <th scope="col" class="p-3 article__table-head">#</th>
          <th scope="col" class="p-3 article__table-head">Title</th>
          <th scope="col" class="p-3 text-center article__table-head">Author</th>
          <th scope="col" class="p-3 article__table-head">Tags</th>
          <th scope="col" class="p-3 article__table-head">Excerpt</th>
          <th scope="col" class="p-3 text-end article__table-head">Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in articles" :key="article.slug">
          <td class="p-3">
            {{ articlePage * 10 + (index + 1) }}
          </td>
          <td class="p-3 article-table__element">{{ article.title }}</td>
          <td class="p-3 article-table__element">@{{ article.author.username }}</td>
          <td class="p-3 article-table__element">{{ article.tagList.join(', ') }}</td>
          <td class="p-3 article-table__element">{{ article.body.slice(0, 20) }}</td>
          <td class="p-3">
            <div class="d-flex justify-content-end gap-3">
              <p class="m-0">{{ dayjs(article.createdAt).format('MMMM DD, YYYY') }}</p>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-info text-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-display="static"
                  aria-expanded="false"
                >
                  ...
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <RouterLink :to="`/articles/edit/${article.slug}`" class="dropdown-item">
                      Edit
                    </RouterLink>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <button
                      type="button"
                      class="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#desktopDeleteModal"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="modal fade"
              id="desktopDeleteModal"
              tabindex="-1"
              aria-labelledby="desktopDeleteModal"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Delete Article</h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      id="desktopDeleteModalClose"
                    ></button>
                  </div>
                  <div class="modal-body pb-5 text-muted">Are you sure to delete Article?</div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                      No
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="() => onDeletePost(article.slug)"
                    >
                      yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.article {
  margin-bottom: 4.5rem;
}
.article__table {
  margin-bottom: 2.5rem;
}

.article__table-head {
  color: var(--gunmetal);
}

.article-table__element {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @include media-breakpoint-up('sm') {
    max-width: 250px;
  }
  @include media-breakpoint-up(md) {
    width: auto;
  }
}
</style>
