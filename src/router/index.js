import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import { $message } from '../common/utils'
import { makeAllRoute } from '../common/utils'

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
      component: Home,
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/graph/:projectId',
      name: 'Graph',
      component: () => import('@/views/Graph.vue'),
      meta: {
        requireLogin: true
      }
    }
  ]
})

let recentRoute = null
let routes = router.options.routes
let allRoute = makeAllRoute(routes)

export const setRecentRoute = to => {
  recentRoute = to || router.currentRoute
  console.log('set recentRoute', recentRoute)
}

export const checkRouteExist = to => {
  console.log(allRoute)
  let flag = false
  for(let i=0; i<allRoute.length; i++) {
    if(to.name === 'Graph') {
      return true
    }
    if(to.path === allRoute[i]) {
      flag = true
      break
    }
  }
  return flag
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('coin-token')
  if(!checkRouteExist(to)) {
    $message('路由错误', 'error')
    next(from)
  }
  if (to.meta.requireLogin) {
    // need login
    if (token) {
      // has token(login before)
      // token 过期由 axios 拦截器进行拦截并跳转
      if (recentRoute) {
        const target = recentRoute
        recentRoute = null
        next(target)
      } else {
        next()
      }
    } else {
      // no token
      setRecentRoute(to)
      $message('请先完成登陆', 'error')
      next('/user')
    }
  } else {
    // no need login
    if(token) {
      next(false)
    } else {
      next()
    }
  }
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
