import { getGraphByProjectIdAPI } from '../../api/graph'
import { fakeGraphData } from '../../common/sample'
import { capitalize, deepCopy, svgToPng } from '../../common/utils'

const graph = {
  state: {
    graphData: {},
    // panel
    panelContentType: '',
    panelContentIndex: -1,
    panelEdit: false,
    // graph
    graph: {
      // svg,
      // root,
      // svg_links,
      // svg_nodes,
      // svg_links_text,
      // svg_nodes_text,
      // links,
      // nodes,
      // drag,
      // zoom,
      // pinned: false
    },
    nextNodeId: -1,
    nextRelationId: -1
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
      state.graph = {
        ...state.graph,
        ...graph
      }
    },
    updateGraphNode(state, { svg_nodes, svg_nodes_text }) {
      state.graph.svg_nodes = svg_nodes
      state.graph.svg_nodes_text = svg_nodes_text
    },
    updateGraphLink(state, { svg_links, svg_links_text }) {
      state.graph.svg_links = svg_links
      state.graph.svg_links_text = svg_links_text
    },
    setGraphPinned(state, bool) {
      state.graph.pinned = bool
    },
    addNode(state, node) {
      state.graph.nodes.push(node)
    },
    addRelation(state, relation) {
      state.graph.links.push(relation)
    },
    setNextNodeId(state, id) {
      state.nextNodeId = id
    },
    setNextRelationId(state, id) {
      state.nextRelationId = id
    },
    increaseNextNodeId(state) {
      state.nextNodeId++
    },
    increaseNextRelationId(state) {
      state.nextRelationId++
    }
  },
  actions: {
    panelSelect({ state, commit, getters }, { type, id }) {
      let index
      if (id == null) {
        let items
        if (type === 'node') {
          items = getters.graphNodes
        } else if (type === 'relation') {
          items = getters.graphLinks
        }
        index = items[items.length - 1]
      } else {
        let items
        if (type === 'node') {
          items = state.graphData.nodes
        } else if (type === 'relation') {
          items = state.graphData.relations
        }
        items = items
          .map((item, index) => ({ index, id: item.id }))
          .filter(item => item.id === id)
        index = items.length > 0 ? items[0].index : -1
      }
      commit('setPanelContentType', type)
      commit('setPanelContentIndex', index)
      commit('setPanelEdit', false)
    },
    panelCreate({ commit }, { type }) {
      commit('setPanelContentType', type)
      commit('setPanelContentIndex', -1)
      commit('setPanelEdit', true)
    },
    createItem({ state, commit }, { type, data }) {
      const capType = capitalize(type)
      console.log(`create new item, type = ${type}`)
      const id = state[`next${capType}Id`]
      commit(`add${capType}`, {
        id,
        ...data
      })
      commit(`increaseNext${capType}Id`)
    },
    updateItem({ commit }) {
      commit('setPanelEdit', false)
    },
    graphInit({ commit }, graph) {
      commit('setGraph', graph)
      commit('setPanelContentType', '')
      commit('setPanelContentIndex', -1)
    },
    getGraphData: async ({ commit }) => {
      // const res = await getGraphByProjectIdAPI(1)
      const res = { status: 200, data: fakeGraphData }
      if (res.status === 200) {
        let data = res.data
        data = {
          projectId: data.projectID,
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
        commit('setGraphData', data)

        let nextNodeId = 0
        data.nodes.forEach(node => {
          if (node.id >= nextNodeId) {
            nextNodeId = node.id + 1
          }
        })
        let nextRelationId = 0
        data.relations.forEach(relation => {
          if (relation.id >= nextRelationId) {
            nextRelationId = relation.id + 1
          }
        })
        commit('setNextNodeId', nextNodeId)
        commit('setNextRelationId', nextRelationId)
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
      const { projectId } = state.graphData
      const svg = state.graph.svg
      const width = svg._groups[0][0].width.baseVal.value
      const height = svg._groups[0][0].height.baseVal.value
      svgToPng(svg, width, height, projectId)
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
    projectId: (_, getters) => getters.graphData.projectId,
    graph: state => state.graph,
    graphPinned: state => state.graph.pinned,
    graphNodes: state => state.graph.nodes,
    graphLinks: state => state.graph.links,
    panelContentType: state => state.panelContentType,
    panelEdit: state => state.panelEdit,
    panelItem: (state, getters) => {
      const type = state.panelContentType
      const index = state.panelContentIndex
      if (index < 0) {
        if (type === 'node') {
          return { name: '', group: '', radius: '' }
        } else if (type === 'relation') {
          return {
            name: '',
            source: '',
            target: '',
            value: ''
          }
        }
      }
      let items
      if (type === 'node') {
        items = getters.graphNodes
      } else if (type === 'relation') {
        items = getters.graphLinks
      } else {
        return {}
      }
      const item = items[index]
      console.log('panel item')
      console.log(items)
      console.log(item)
      return item ? item : {}
    },
    panelCreateNew: (_, getters) => getters.panelItem.id == null
  }
}

export default graph
