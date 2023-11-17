<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useArticles, useDeleteArticle } from '../composables/articles'
import LoadingComponent from '../components/LoadingComponent.vue'

const route = useRoute()
const articlePage = computed(() => route?.params?.page ?? 1)
const { data, refetch, isLoading, isError } = useArticles(['articles', articlePage])
const { mutate: deleteArticle } = useDeleteArticle()

const articles = computed(() => {
  return data?.value?.articles
})

const onDeletePost = (slug) => {
  deleteArticle(slug, {
    onSuccess: () => {
      // TODO: show alert
      console.log('success')
      refetch?.()
    },
    onError: () => {
      // TODO: show alert
      console.log('error')
    },
    onSettled: () => {
      document.getElementById('deleteModalClose').click()
    }
  })
}
</script>

<template>
  <div class="article h-100">
    <div v-if="isLoading" class="d-flex w-100 h-100 justify-content-center align-items-center">
      <LoadingComponent />
    </div>
    <div v-else-if="isError" class="d-flex w-100 h-100 justify-content-center align-items-center">
      <button type="button" class="btn btn-primary btn-lg" @click="refetch">Try again</button>
    </div>
    <div v-else>
      <h1 class="mb-4">All Posts</h1>
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
                {{ (articlePage - 1) * 10 + (index + 1) }}
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
                        <RouterLink
                          :to="`/articles/edit/${article.slug}`"
                          class="dropdown-item"
                          type="button"
                          >Edit</RouterLink
                        >
                      </li>
                      <li><hr class="dropdown-divider" /></li>
                      <li>
                        <button
                          type="button"
                          class="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
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
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          data-bs-dismiss="modal"
                        >
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
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li :class="['page-item', { disabled: articlePage === '1' }]">
            <RouterLink
              class="page-link"
              :to="`/articles/page/${articlePage - 1}`"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </RouterLink>
          </li>
          <li :class="['page-item', { active: articlePage === '1' }]">
            <RouterLink class="page-link" to="/articles/page/1">1</RouterLink>
          </li>
          <li :class="['page-item', { active: articlePage === '2' }]">
            <RouterLink class="page-link" to="/articles/page/2">2</RouterLink>
          </li>
          <li :class="['page-item', { active: articlePage === '3' }]">
            <RouterLink class="page-link" to="/articles/page/3">3</RouterLink>
          </li>
          <li :class="['page-item', { active: articlePage === '4' }]">
            <RouterLink class="page-link" to="/articles/page/4">4</RouterLink>
          </li>
          <li :class="['page-item', { disabled: articlePage === '4' }]">
            <RouterLink
              class="page-link"
              :to="`/articles/page/${+articlePage + 1}`"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
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
