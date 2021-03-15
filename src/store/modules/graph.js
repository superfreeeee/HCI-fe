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
            // console.log(res)
            if(res.status === 200) {
                const data = res.data
                // console.log("data ", data)
                const nodes = data.nodes
                // console.log("nodes ", nodes)
                const relations = data.relations
                // console.log("relations ", relations)
                let newNodes = nodes.map(v => {
                    return {
                        id: v.nodeID.toString(),
                        group: v.group,
                        name: v.name,
                        radius: v.val
                    }
                })
                // console.log("newNodes ", newNodes)
                let newRelations = relations.map(v => {
                    return {
                        name: v.name,
                        relationID: v.relationID,
                        source: v.source.toString(),
                        target: v.target.toString(),
                        value: v.val
                    }
                })
                // console.log("newRelations ", newRelations)
                data.nodes = newNodes
                data.relations = newRelations
                commit('setGraphData', data);
            }else {
                console.log("error");
            }
        },
    }
}

export default graph
