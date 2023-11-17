import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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
      component: () => import('../layouts/ArticlesLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'all-articles',
          meta: { title: 'All Posts' },
          component: () => import('../views/ArticlesView.vue')
        },
        {
          path: 'page/:page',
          name: 'articles-pages',
          meta: { title: 'All Posts' },
          component: () => import('../views/ArticlesView.vue')
        },
        {
          path: 'create',
          name: 'new-article',
          component: () => import('../views/NewArticleView.vue'),
          meta: { title: 'New Post' }
        },
        {
          path: 'edit/:slug',
          name: 'edit-article',
          component: () => import('../views/NewArticleView.vue'),
          meta: { title: 'Edit Post' }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Register' }
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/PageNotFound.vue'),
      meta: { title: '404 | Not Found' }
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.checkIsLoggedIn()

  if (to.meta.requiresAuth && !auth?.isLoggedIn) {
    return { path: '/login' }
  }

  if ((to.name === 'login' || to.name === 'register') && auth?.isLoggedIn) {
    return { path: '/' }
  }

  document.title = to.meta.title

  return true
})

export default router
