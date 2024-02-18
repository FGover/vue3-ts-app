import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register/index.vue')
    }
  ]
})

export default router
