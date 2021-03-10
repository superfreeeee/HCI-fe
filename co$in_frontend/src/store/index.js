import Vue from 'vue';
import Vuex from 'vuex';
import operation from './modules/operation';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        operation,
    },
    state: {
    },
    mutations: {
    },
    actions: {
    },
    getters
})
