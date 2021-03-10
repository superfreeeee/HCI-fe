import Vue from 'vue'
import Router from 'vue-router'
import Graph from '../pages/graph/Graph.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Graph',
      component: Graph
    }
  ]
})
