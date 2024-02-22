import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/index.vue'
import { useUserStore } from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 不展示圆圈加载
NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      meta: { title: '注册' },
      component: () => import('@/views/Register/index.vue')
    },
    {
      path: '/user/patient',
      name: 'patient',
      meta: { title: '家庭档案' },
      component: () => import('@/views/User/PatientPage.vue')
    },
    {
      path: '/consult/fast',
      name: 'fast',
      meta: { title: '极速问诊' },
      component: () => import('@/views/Consult/ConsultFast.vue')
    },
    {
      path: '/consult/dep',
      name: 'dep',
      meta: { title: '选择科室' },
      component: () => import('@/views/Consult/ConsultDep.vue')
    },
    {
      path: '/consult/illness',
      name: 'illness',
      meta: { title: '病情描述' },
      component: () => import('@/views/Consult/ConsultIllness.vue')
    },
    {
      path: '/consult/pay',
      name: 'pay',
      meta: { title: '问诊支付' },
      component: () => import('@/views/Consult/ConsultPay.vue')
    },
    {
      path: '/consult/doctor',
      name: 'doctor',
      meta: { title: '选择科室' },
      component: () => import('@/views/Consult/ConsultDoctor.vue')
    },
    {
      path: '/room',
      name: 'room',
      meta: { title: '问诊室' },
      component: () => import('@/views/Room/index.vue'),
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    {
      path: '/user/consult',
      name: 'consult',
      meta: { title: '问诊页面' },
      component: () => import('@/views/User/UserConsult.vue')
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home',
          meta: { title: '首页' },
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/article',
          meta: { title: '健康百科' },
          component: () => import('@/views/Article/index.vue')
        },
        {
          path: '/notify',
          meta: { title: '消息通知' },
          component: () => import('@/views/Notify/index.vue')
        },
        {
          path: '/user',
          meta: { title: '个人中心' },
          component: () => import('@/views/User/index.vue')
        }
      ]
    }
  ]
})

// 路由前置守卫
router.beforeEach((to) => {
  NProgress.start()
  const userStore = useUserStore()
  const whiteList = ['/login', '/register'] // 不需要登录的页面
  if (!whiteList.includes(to.path)) {
    if (userStore.user?.token) {
      // 放行
      return true
    } else {
      return '/login'
    }
  }
})

// 全局后置导航 标题
router.afterEach((to) => {
  document.title = `${to.meta.title || ''} - 问诊`
  NProgress.done()
})

export default router
