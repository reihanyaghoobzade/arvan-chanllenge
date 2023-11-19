<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import dayjs from 'dayjs'
import { useArticles, useDeleteArticle } from '../../composables/articles'
import LoadingComponent from '../LoadingComponent.vue'
import { useToastStore } from '../../stores/toast'
import PaginationComponent from '../PaginationComponent.vue'

const { articlePage } = defineProps({
  articlePage: {
    type: Number,
    required: true
  }
})

const { data, refetch, isLoading, isError } = useArticles(articlePage)
const { mutate: deleteArticle } = useDeleteArticle()
const toast = useToastStore()

const articles = computed(() => data?.value?.articles)

const articlesCount = computed(() => data?.value?.articlesCount)

const onDeletePost = (slug) => {
  deleteArticle(slug, {
    onSuccess: () => {
      toast.showToast()
      toast.setInfo({
        title: 'Well done!',
        message: 'Article deleted successfully.',
        type: 'success'
      })
      refetch?.()
    },
    onError: () => {
      toast.showToast()
      toast.setInfo({
        title: 'Oops!',
        message: 'Something went wrong.',
        type: 'error'
      })
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
      <PaginationComponent
        :current-page="articlePage"
        :all-page="articlesCount"
        :per-page="5"
        show-first-last-page
        base-route="/articles/page/"
      />
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