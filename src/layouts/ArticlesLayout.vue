<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TokenService from '../data/services/token'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()

const user = computed(() => auth.getUser)

const onLogout = () => {
  TokenService.removeToken()
  window.location.reload()
}
</script>

<template>
  <div class="article">
    <header class="article__header d-flex align-items-center text-white px-4">
      <div class="w-100 d-flex justify-content-between align-items-center gap-4">
        <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-sm-4">
          <p class="fs-4 m-0">Arvan Challenge</p>
          <p class="fs-6 m-0">Welcome {{ user?.username }}</p>
        </div>
        <button type="button" class="btn btn-outline-info btn-sm" @click="onLogout">Logout</button>
      </div>
    </header>
    <div class="row mx-0">
      <div class="d-none d-md-block col-md-3 col-lg-2 p-0 article__sidebar">
        <div>
          <p class="my-3 mx-4 fs-4 text-white">Post</p>
          <div>
            <RouterLink
              :to="{ path: '/articles' }"
              :class="[
                'article__sidebar-link text-white text-decoration-none d-block px-5 py-2',
                {
                  'article__sidebar-link--active':
                    route.name === 'all-articles' || route.name === 'articles-pages'
                }
              ]"
            >
              All Articles
            </RouterLink>
            <RouterLink
              :to="{ path: '/articles/create' }"
              :class="[
                'article__sidebar-link text-white text-decoration-none d-block px-5 py-2',
                {
                  'article__sidebar-link--active':
                    route.name === 'new-article' || route.name === 'edit-article'
                }
              ]"
            >
              New Article
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="d-md-none col-12 p-0 article__sidebar position-fixed bottom-0">
        <div class="row mx-0">
          <div class="col p-0">
            <RouterLink
              :to="{ path: '/articles' }"
              :class="[
                'article__sidebar-link text-center text-white text-decoration-none d-block py-2',
                {
                  'article__sidebar-link--active':
                    route.name === 'all-articles' || route.name === 'articles-pages'
                }
              ]"
            >
              All Articles
            </RouterLink>
          </div>
          <div class="col p-0">
            <RouterLink
              :to="{ path: '/articles/create' }"
              :class="[
                'article__sidebar-link text-center text-white text-decoration-none d-block py-2',
                {
                  'article__sidebar-link--active':
                    route.name === 'new-article' || route.name === 'edit-article'
                }
              ]"
            >
              New Article
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-9 col-lg-10 px-4 pt-4 article-sidebar__main">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article__header {
  background-color: var(--charcoal-grey);
  height: 4.5rem;

  @include media-breakpoint-up('md') {
    height: 3.25rem;
  }
}

.article__sidebar {
  background-color: var(--water-blue);
  z-index: 100;

  @include media-breakpoint-up('md') {
    min-height: calc(100vh - 3.25rem);
  }
}

.article-sidebar__main {
  min-height: calc(100vh - 7rem);

  @include media-breakpoint-up('md') {
    min-height: calc(100vh - 3.25rem);
  }
}
.article__sidebar-link {
  font-size: 1.125rem;

  &--active {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
