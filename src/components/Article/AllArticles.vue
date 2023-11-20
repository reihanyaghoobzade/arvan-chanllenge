<script setup>
import { computed } from 'vue'
import { useArticles, useDeleteArticle } from '../../composables/articles'
import LoadingComponent from '../LoadingComponent.vue'
import { useToastStore } from '../../stores/toast'
import PaginationComponent from '../PaginationComponent.vue'
import ArticlesTable from './ArticlesTable.vue'
import ArticlesCollapse from './ArticlesCollapse.vue'

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
    }
  })
}
</script>

<template>
  <div class="article mb-5 h-100">
    <div v-if="isLoading" class="d-flex w-100 h-100 justify-content-center align-items-center">
      <LoadingComponent />
    </div>
    <div v-else-if="isError" class="d-flex w-100 h-100 justify-content-center align-items-center">
      <button type="button" class="btn btn-primary btn-lg" @click="refetch">Try again</button>
    </div>
    <div v-else>
      <h1 class="mb-4">All Posts</h1>
      <div class="d-lg-none mb-5 mb-lg-0">
        <ArticlesCollapse
          :articles="articles"
          :article-page="articlePage"
          @onDeletePost="onDeletePost"
        />
      </div>
      <div class="d-none d-lg-block">
        <ArticlesTable
          :articles="articles"
          :article-page="articlePage"
          @onDeletePost="onDeletePost"
        />
      </div>
      <div class="pb-3 pb-md-0">
        <PaginationComponent
          :current-page="articlePage"
          :all-page="articlesCount"
          :per-page="3"
          base-route="/articles/page/"
        />
      </div>
    </div>
  </div>
</template>
