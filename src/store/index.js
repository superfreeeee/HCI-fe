import Vue from 'vue'
import Vuex from 'vuex'
import graph from './modules/graph'
import project from './modules/project'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    graph,
    project
  }
})
