import { getGraphByProjectIdAPI } from '../../api/graph';

const graph = {
    state: {
        graphData: [],
    },
    mutations: {
        setGraphData: function(state, data) {
            state.graphData = data;
        },
    },
    actions: {
        getGraphData: async({ commit }) => {
            const res = await getGraphByProjectIdAPI(1);
            if(res) {
                console.log(res);
                commit('setGraphData', res);
            }
        },
    }
}

export default graph
