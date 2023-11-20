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

const { slug } = defineProps({ slug: { type: [String, undefined], default: undefined } })

const formSchema = object({
  title: string().required(),
  description: string().required(),
  body: string().required(),
  tagsList: string().required()
})

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const { data: allTags, isLoading: tagLoading, isError: tagError } = useAllTags()
const isEditPage = computed(() => route.name === 'edit-article')
const { data, isLoading, isError, refetch } = useEditArticle(slug, {
  enabled: !!slug
})

const { mutate: updateArticle, isPending: updateArticleLoading } = useUpdateArticle(slug)
const { mutate: createArticle, isPending: createArticleLoading } = useCreateArticle()
const articleTagList = reactive([])
const showError = reactive({
  title: false,
  description: false,
  body: false,
  tags: false
})
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

const validateForm = async (schema) => {
  showError.title = false
  showError.description = false
  showError.body = false
  showError.tags = false

  try {
    const formData = {
      title: articleData.title,
      description: articleData.description,
      body: articleData.body,
      tagsList: (articleData.tagsList ? articleData.tagsList : articleTagList.value)?.join(', ')
    }

    await schema.validate(formData, { abortEarly: false })
    return true
  } catch (err) {
    err.inner.forEach((error) => {
      showError[error.path] = true
    })

    return false
  }
}

const onSubmit = async () => {
  const isValidate = await validateForm(formSchema)
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
              <label for="title" :class="['mb-2', { 'text-danger': showError.title }]">
                Title
              </label>
              <input
                v-model="articleData.title"
                type="title"
                :class="['form-control', { 'border border-danger': showError.title }]"
                id="title"
                placeholder="Title"
                required
              />
              <p v-if="showError.title" class="mt-2 text-danger">Required field</p>
            </div>
            <div class="form-group mb-4">
              <label for="description" :class="['mb-2', { 'text-danger': showError.description }]">
                Description
              </label>
              <input
                v-model="articleData.description"
                type="title"
                :class="['form-control', { 'border border-danger': showError.description }]"
                id="description"
                placeholder="Description"
                required
              />
              <p v-if="showError.description" class="mt-2 text-danger">Required field</p>
            </div>
            <div class="form-group">
              <label for="body" :class="['mb-2', { 'text-danger': showError.body }]"> Body </label>
              <textarea
                v-model="articleData.body"
                type="title"
                :class="['form-control', { 'border border-danger': showError.body }]"
                id="body"
                rows="9"
                required
              />
              <p v-if="showError.body" class="mt-2 text-danger">Required field</p>
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
            :show-error="showError.tags"
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
