// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuex from 'vuex'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store';
import * as d3 from 'd3'
import axios from 'axios'

Vue.use(vuex)
Vue.use(elementUI)

Vue.config.productionTip = false
Vue.prototype.$d3 = d3
Vue.prototype.$axios = axios;

// const consoleGroup = function (name, cb) {
//   console.group(name)
//   cb()
//   console.groupEnd(name)
// }

// axios.interceptors.request.use(config => {
//   consoleGroup(`[axios.request] ${config.url}`, () => {
//     console.log(config)
//   })
//   return config
// }, err => {
//   return err
// })


// axios.interceptors.response.use(response => {
//   const config = response.config
//   consoleGroup(`[axios.response] ${config.url}`, () => {
//     console.log(response)
//   })
//   return response
// }, err => {
//   return err
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
