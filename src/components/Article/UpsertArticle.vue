<script setup>
import { computed, reactive, watch, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { object, string } from 'yup'
import {
  useEditArticle,
  useAllTags,
  useUpdateArticle,
  useCreateArticle
} from '../../composables/articles'
import LoadingComponent from '../LoadingComponent.vue'
import ArticleTags from './ArticleTags.vue'
import { useToastStore } from '../../stores/toast'
import { useYup } from '../../composables/use-yup'

const { slug } = defineProps({ slug: { type: [String, undefined], default: undefined } })

const formSchema = object({
  title: string().required('Title is required'),
  description: string().required('Description is required'),
  body: string().required('Body is required'),
  tagsList: string().required('Tag is required')
})

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const { data: allTags, isLoading: tagLoading, isError: tagError } = useAllTags()
const isEditPage = computed(() => route.name === 'edit-article')
const { data, isLoading, isError, refetch } = useEditArticle(slug, {
  enabled: !!slug
})

const { validate, objectError: error } = useYup(formSchema)

const { mutate: updateArticle, isPending: updateArticleLoading } = useUpdateArticle(slug)
const { mutate: createArticle, isPending: createArticleLoading } = useCreateArticle()
const articleData = reactive({
  title: data?.value?.article?.title || '',
  description: data?.value?.article?.description || '',
  body: data?.value?.article?.body || '',
  tagsList: data?.value?.article?.tagList || []
})

watch(data, (newValue) => {
  articleData.title = newValue?.article?.title
  articleData.description = newValue?.article?.description
  articleData.body = newValue?.article?.body
  articleData.tagsList = newValue?.article?.tagList || []
})

const onSelectTag = (tagList) => {
  articleData.tagsList = [...tagList]
}

const onSubmit = async () => {
  const formData = {
    title: articleData.title,
    description: articleData.description,
    body: articleData.body,
    tagsList: articleData.tagsList?.join(', ')
  }

  const isValidate = await validate(formData)
  if (!isValidate) return

  if (isEditPage.value) {
    updateArticle(
      {
        article: {
          body: articleData.body
        }
      },
      {
        onSuccess: () => {
          toast.showToast()
          toast.setInfo({
            title: 'Well done!',
            message: 'Article updated successfully.',
            type: 'success'
          })
          router.push({ path: '/articles' })
        },
        onError: () => {
          toast.showToast()
          toast.setInfo({
            title: 'Oops!',
            message: 'Something went wrong.',
            type: 'error'
          })
        }
      }
    )
  } else {
    createArticle(
      {
        article: {
          title: articleData.title,
          description: articleData.description,
          body: articleData.body,
          tagList: [...articleData.tagsList]
        }
      },
      {
        onSuccess: () => {
          toast.showToast()
          toast.setInfo({
            title: 'Well done!',
            message: 'Article created successfully.',
            type: 'success'
          })
          router.push({ path: '/articles' })
        },
        onError: () => {
          toast.showToast()
          toast.setInfo({
            title: 'Oops!',
            message: 'Something went wrong.',
            type: 'error'
          })
        }
      }
    )
  }
}
</script>

<template>
  <div class="article h-100">
    <div
      v-if="isLoading || tagLoading"
      class="d-flex w-100 h-100 justify-content-center align-items-center"
    >
      <LoadingComponent />
    </div>
    <div
      v-else-if="isError || tagError"
      class="d-flex w-100 h-100 justify-content-center align-items-center"
    >
      <button type="button" class="btn btn-primary btn-lg" @click="refetch">Try again</button>
    </div>
    <div v-else>
      <h1 class="mb-4">
        {{ isEditPage ? 'Edit Article' : 'New Article' }}
      </h1>
      <div class="row mx-0">
        <div class="col-12 col-lg-9 p-0 pe-lg-3">
          <form class="d-flex flex-column justify-content-center">
            <div class="form-group mb-4">
              <label for="title" :class="['mb-2', { 'text-danger': error.title }]"> Title </label>
              <input
                v-model="articleData.title"
                type="title"
                :class="['form-control', { 'border border-danger': error.title }]"
                id="title"
                placeholder="Title"
                required
              />
              <p v-if="error.title" class="mt-2 text-danger">{{ error.title }}</p>
            </div>
            <div class="form-group mb-4">
              <label for="description" :class="['mb-2', { 'text-danger': error.description }]">
                Description
              </label>
              <input
                v-model="articleData.description"
                type="title"
                :class="['form-control', { 'border border-danger': error.description }]"
                id="description"
                placeholder="Description"
                required
              />
              <p v-if="error.description" class="mt-2 text-danger">{{ error.description }}</p>
            </div>
            <div class="form-group">
              <label for="body" :class="['mb-2', { 'text-danger': error.body }]"> Body </label>
              <textarea
                v-model="articleData.body"
                type="title"
                :class="['form-control', { 'border border-danger': error.body }]"
                id="body"
                rows="9"
                required
              />
              <p v-if="error.body" class="mt-2 text-danger">{{ error.body }}</p>
            </div>
            <div class="d-none d-lg-block mt-4">
              <button
                type="submit"
                :class="[
                  'btn btn-primary',
                  { disabled: createArticleLoading || updateArticleLoading }
                ]"
                @click.prevent="onSubmit"
                :disabled="createArticleLoading || updateArticleLoading"
              >
                <span
                  v-if="createArticleLoading || updateArticleLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>

                Submit
              </button>
            </div>
          </form>
        </div>
        <div class="col-12 col-md-6 col-lg-3 p-0 ps-lg-4 mt-4 m-lg-0">
          <ArticleTags
            :all-tags="allTags"
            :article-tags="articleData?.tagsList"
            @onSelectTag="onSelectTag"
            :error="error.tagsList"
            :disabled="!!slug"
          />
        </div>
        <div class="d-lg-none mt-4 p-0">
          <button
            type="submit"
            :class="['btn btn-primary', { disabled: createArticleLoading || updateArticleLoading }]"
            @click.prevent="onSubmit"
            :disabled="createArticleLoading || updateArticleLoading"
          >
            <span
              v-if="createArticleLoading || updateArticleLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article {
  margin-bottom: 4.5rem;
}
</style>
