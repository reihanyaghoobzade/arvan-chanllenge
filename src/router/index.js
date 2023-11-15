import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/articles'
    },
    {
      path: '/articles',
      component: import('../layouts/ArticlesLayout.vue'),
      children: [
        {
          path: '',
          name: 'all-articles',
          meta: { title: 'All Posts' },
          component: import('../views/ArticlesView.vue')
        },
        {
          path: 'create',
          name: 'new-article',
          component: import('../views/NewArticleView.vue'),
          meta: { title: 'New Post' }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Register' }
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/PageNotFound.vue'),
      meta: { title: '404 | Not Found' }
    }
  ]
})

router.beforeEach((to) => {
  document.title = to.meta.title
})

export default router
