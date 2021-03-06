import Vue from 'vue'
import Router from 'vue-router'
import WebGL_demo from '@/components/WebGL_demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WebGL_demo',
      component: WebGL_demo
    }
  ]
})
