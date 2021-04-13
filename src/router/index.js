import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import { $message } from '../common/utils' 

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/user',
      name: 'User',
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
      component: () => import('@/views/Graph.vue'),
      beforeEnter: (to, from, next) => {
        if(from.path === '/user') {
          if(!localStorage.token) {
            next(false)
            $message('请先登录！', 'error')
          } else {
            next(true)
          }
        } else {
          next(true)
        }
      }
    }
  ]
})

export default router
