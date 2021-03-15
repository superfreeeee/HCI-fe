import { getGraphByProjectIdAPI } from '../../api/graph'

const graph = {
  state: {
    graphData: [],
    insertDialogVisible: false,
    deleteDialogVisible: false,
    modifyDialogVisible: false,
    searchDialogVisible: false,
    projectId: 0
  },
  mutations: {
    setGraphData: function(state, data) {
      state.graphData = data
    },
    setInsertDialogVisible: function(state, data) {
      state.insertDialogVisible = data
    },
    setDeleteDialogVisible: function(state, data) {
      state.deleteDialogVisible = data
    },
    setModifyDialogVisible: function(state, data) {
      state.modifyDialogVisible = data
    },
    setSearchDialogVisible: function(state, data) {
      state.searchDialogVisible = data
    },
    setProjectId: function(state, data) {
      state.projectId = data
      console.log('state.projectId ', state.projectId)
    }
  },
  actions: {
    getGraphData: async ({ commit }) => {
      const res = await getGraphByProjectIdAPI(1)
      // console.log(res)
      if (res.status === 200) {
        const data = res.data
        // console.log("data ", data)
        const nodes = data.nodes
        // console.log("nodes ", nodes)
        const relations = data.relations
        // console.log("relations ", relations)
        let newNodes = nodes.map(v => {
          return {
            id: v.nodeID.toString(),
            name: v.name,
            group: v.group,
            radius: v.val
          }
        })
        // console.log("newNodes ", newNodes)
        let newRelations = relations.map(v => {
          return {
            relationID: v.relationID,
            name: v.name,
            source: v.source.toString(),
            target: v.target.toString(),
            value: v.val
          }
        })
        // console.log("newRelations ", newRelations)
        data.nodes = newNodes
        data.relations = newRelations
        commit('setGraphData', data)
      } else {
        console.log('error')
      }
    }
  }
}

export default graph
