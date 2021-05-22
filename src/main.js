// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuex from 'vuex'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

import * as d3 from 'd3'
import axios from './api/axios'
import * as echarts from 'echarts'
import Chat from 'jwchat'

Vue.use(vuex)
Vue.use(elementUI)
Vue.use(Chat)

Vue.config.productionTip = false
Vue.prototype.$d3 = d3
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
