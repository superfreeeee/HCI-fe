import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/User',
      name: 'User',
      component: User
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
