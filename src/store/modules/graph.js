import { getGraphByProjectIdAPI } from '../../api/graph'
import { fakeGraphData } from '../../common/sample'
import { deepCopy, svgToPng } from '../../common/utils'

const graph = {
  state: {
    graphData: {},
    projectId: 0,
    // panel
    panelContentType: '',
    panelContentIndex: -1,
    panelEdit: false,
    // graph
    graph: {
      // simulation,
      // svg,
      // root,
      // svg_links,
      // svg_nodes,
      // links,
      // nodes,
      // svg_nodes_text,
      // drag,
      // zoom
    }
  },
  mutations: {
    setGraphData(state, data) {
      state.graphData = data
    },
    setProjectId(state, data) {
      state.projectId = data
      console.log('state.projectId ', state.projectId)
    },
    // panel
    setPanelContentType(state, type) {
      state.panelContentType = type
    },
    setPanelContentIndex(state, index) {
      state.panelContentIndex = index
    },
    setPanelEdit(state, bool) {
      state.panelEdit = bool
    },
    // graph
    setGraph(state, graph) {
      state.graph = graph
    },
    setGraphPinned(state, bool) {
      state.graph.pinned = bool
    }
  },
  actions: {
    panelSelect({ state, commit }, { type, id }) {
      let items
      if (type === 'node') {
        items = state.graphData.nodes
      } else if (type === 'relation') {
        items = state.graphData.relations
      }
      items = items
        .map((item, index) => ({ index, id: item.id }))
        .filter(item => item.id === id)
      const index = items.length > 0 ? items[0].index : -1
      commit('setPanelContentType', type)
      commit('setPanelContentIndex', index)
      commit('setPanelEdit', false)
    },
    panelCreate({ commit }, { type }) {
      commit('setPanelContentType', type)
      commit('setPanelContentIndex', -1)
      commit('setPanelEdit', true)
    },
    graphInit({ commit }, graph) {
      commit('setGraph', graph)
    },
    getGraphData: async ({ commit }) => {
      // const res = await getGraphByProjectIdAPI(1)
      const res = { status: 200, data: fakeGraphData }
      if (res.status === 200) {
        let data = res.data
        data = {
          projectID: data.projectID,
          nodes: data.nodes.map(n => ({
            id: n.nodeID,
            name: n.name,
            group: n.group,
            radius: n.val
          })),
          relations: data.relations.map(r => ({
            id: r.relationID,
            name: r.name,
            source: r.source,
            target: r.target,
            from: r.source,
            to: r.target,
            value: r.val
          }))
        }
        // console.log(deepCopy(data))
        commit('setGraphData', data)
      } else {
        console.log('error')
      }
    },
    graphZoomReset({ state }, d3) {
      const zoom = state.graph.zoom
      const root = state.graph.root
      root
        .transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity)
    },
    graphToPng({ state }) {
      //svg 保存成 png
      const { projectID } = state.graphData
      const svg = state.graph.svg
      const width = svg._groups[0][0].width.baseVal.value
      const height = svg._groups[0][0].height.baseVal.value
      svgToPng(svg, width, height, projectID)
    },
    graphToXml({ state }) {
      console.log('save as xml')
      const { nodes, links } = state.graph
      const data = {
        projectId: state.projectId,
        nodes: deepCopy(nodes),
        relations: deepCopy(links)
      }
      console.log(data)
    }
  },
  getters: {
    graphData: state => state.graphData,
    graph: state => state.graph,
    graphPinned: state => state.graph.pinned,
    panelContentType: state => state.panelContentType,
    panelEdit: state => state.panelEdit,
    panelItem: state => {
      const type = state.panelContentType
      const index = state.panelContentIndex
      if (index < 0) return null
      let items
      if (type === 'node') {
        items = state.graphData.nodes
      } else if (type === 'relation') {
        items = state.graphData.relations
      } else {
        return null
      }
      return items[index]
    },
    panelCreateNew: (_, getters) => getters.panelItem == null
  }
}

export default graph
