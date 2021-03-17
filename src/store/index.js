import Vue from 'vue'
import Vuex from 'vuex'
import graph from './modules/graph'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    graph
  }
})
