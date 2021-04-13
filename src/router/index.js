import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

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
      ],
      beforeEnter: (to, from, next) => {
        if(to.name === 'Graph') {
          if(!localStorage.token) {
            next(false)
          } else {
            next(true)
          }
        } else {
          next(true)
        }
      }
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

export default router
