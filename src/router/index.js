import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
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
