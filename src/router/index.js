import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import { $message, consoleGroup } from '../common/utils'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/user',
      component: () => import('@/views/User.vue'),
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('@/modules/user/components/Login.vue')
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/modules/user/components/Register.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/graph/:projectId',
      name: 'Graph',
      component: () => import('@/views/Graph.vue')
    }
  ]
})

const whiteList = ['/user', '/user/register']

let recentRoute = null

export const setRecentRoute = () => {
  recentRoute = router.currentRoute
}

router.beforeEach((to, from, next) => {
  consoleGroup('[router.beforeEach] start', () => {
    console.log('from', from)
    console.log('to', to)
  })
  if (!whiteList.includes(to.path)) {
    // not on whiteList
    console.log('guard', to)
    const token = localStorage.getItem('coin-token')
    if (token) {
      // has token(login before)
      // token 过期由 axios 拦截器进行拦截并跳转
      if (recentRoute) {
        next(recentRoute)
        recentRoute = null
      } else {
        next()
      }
    } else {
      // no token
      $message('请先完成登陆', 'error')
      next('/user')
    }
  } else {
    // on whiteList, directly pass
    next()
  }
})

export default router
