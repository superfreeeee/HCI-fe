import Vue from 'vue'
import Router from 'vue-router'
import Graph from '../pages/graph/Graph.vue'
import Home from '../pages/graph/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/graph',
      name: 'Graph',
      component: Graph
    },
  ]
})
