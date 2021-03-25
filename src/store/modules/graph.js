import {
  getGraphByProjectIdAPI,
  graphDeleteNodeAPI,
  graphDeleteRelAPI,
  graphInsertNodeAPI,
  graphInsertRelAPI,
  graphUpdateNodeAPI,
  graphUpdateRelAPI
} from '../../api/graph'
import { exportProjectXmlAPI, getProjectInfoAPI } from '../../api/project'
import {
  consoleGroup,
  download,
  itemTransformer,
  responseItemTranformer,
  svgToPng,
  xmlDownload
} from '../../common/utils'
import { fakeGraphData } from '../../common/sample'
import { itemOptions, typeMapper } from '../../common/editor'

const graph = {
  state: {
    projectId: -1,
    data: {
      // projectId,
      // nodes,
      // links
    },
    svg: null,
    editor: {
      type: '', // 'node' | 'link' | ''
      createNew: true,
      item: null,
      editable: true
    },
    recentLayout: null // later change to history layout
  },
  mutations: {
    setGraphProjectId(state, id) {
      state.projectId = id
    },
    setGraphData(state, data) {
      state.data = data
    },
    setGraphNodes(state, nodes) {
      state.data.nodes = nodes
    },
    setGraphLinks(state, links) {
      state.data.nodes = links
    },
    setGraphSvg(state, svg) {
      state.svg = svg
    },
    setEditor(state, { type = '', item = null, createNew = true } = {}) {
      state.editor.type = type
      state.editor.item = item
      state.editor.createNew = createNew
    },
    setEditorEditable(state, bool) {
      state.editor.editable = bool
    },
    addGraphItem(state, item) {
      state.data[`${state.editor.type}s`].push(item)
    },
    deleteGraphItem(state, item) {
      // console.log('[mutations] deleteGraphItem')
      const { nodes, links } = state.data
      const { nodeId, linksId } = item
      if (linksId.length > 0) {
        for (let i = 0; i < links.length; i++) {
          const idx = linksId.indexOf(links[i].id)
          if (idx >= 0) {
            links.splice(i, 1)
            linksId.splice(idx, 1)
            if (linksId.length === 0) {
              break
            }
            i--
          }
        }
      }
      if (nodeId != null) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === nodeId) {
            nodes.splice(i, 1)
            break
          }
        }
      }
    },
    updateGraphItem(state, item) {
      const type = state.editor.type
      const items = state.data[`${type}s`]
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === item.id) {
          items.splice(i, 1)
          break
        }
      }
      items.push(item)
    },
    setRecentLayout(state, layout) {
      state.recentLayout = layout
    }
  },
  actions: {
    getProjectInfo: async ({ commit, state }, projectId) => {
      if (projectId === state.projectId) return true
      const res = await getProjectInfoAPI(projectId)
      if (res.status === 200) {
        commit('setProjectInfo', res.data)
        return true
      } else {
        console.log('getProjectInfo error')
        return false
      }
    },
    async graphInit({ commit, state }, projectId) {
      if (projectId === state.projectId) return true
      commit('setGraphProjectId', projectId)
      const res = await getGraphByProjectIdAPI(projectId)
      // const res = { status: 200, data: fakeGraphData }
      if (res.status === 200) {
        const { nodes, relations } = res.data
        const data = {
          nodes: nodes.map(n => responseItemTranformer('node', n)),
          links: relations.map(r => responseItemTranformer('link', r))
        }
        commit('setGraphData', data)
        commit('setEditor')
        consoleGroup('[action] graphInit', () => {
          console.log({ ...data })
        })
      } else {
        console.log('error')
      }
    },
    // 选取 实体/关系
    editorSelect({ state, commit }, { type, id }) {
      consoleGroup('[action] editorSelect', () => {
        console.log(`type=${type}, id=${id}`)
      })
      const items = state.data[`${type}s`]
      const rest = items.filter(item => item.id === id)
      // console.log(rest)
      if (rest.length > 0) {
        commit('setEditor', { type, item: { ...rest[0] }, createNew: false })
        commit('setEditorEditable', false)
      } else {
        console.log(`[action] editorSelect, id = ${id} not found`)
      }
    },
    // 创建 实体/关系
    editorCreate({ commit }, type) {
      const item = {}
      for (const { attr } of itemOptions[type]) {
        item[attr] = ''
      }
      commit('setEditor', { type, item })
      commit('setEditorEditable', true)
    },
    // 提交 实体/关系 创建
    async editorCreateCommit({ state, commit, dispatch }, item) {
      consoleGroup('[action] editorCreateCommit', () => {
        console.log({ ...item })
      })
      const type = state.editor.type
      const projectId = state.projectId
      // form param item
      item = itemTransformer(type, item, projectId)
      // request
      const res = await (type === 'node'
        ? graphInsertNodeAPI(item)
        : graphInsertRelAPI(item))
      if (res.status === 200) {
        // solve response item
        item = responseItemTranformer(type, res.data)
        consoleGroup('[action] editorCreateCommit', () => {
          console.log(item)
        })
        commit('addGraphItem', item)
        dispatch('editorSelect', { type, id: item.id })
      } else {
        console.log('[action] editorCreateCommit error')
      }
    },
    // 提交 实体/关系 更新
    async editorUpdateCommit({ state, commit }, item) {
      consoleGroup('[action] editorUpdateCommit', () => {
        console.log({ ...item })
      })
      const type = state.editor.type
      const projectId = state.projectId
      const { x, y } = item
      // form param item
      item = itemTransformer(type, item, projectId)
      // request
      const res = await (type === 'node'
        ? graphUpdateNodeAPI(item)
        : graphUpdateRelAPI(item))
      if (res.status === 200) {
        item = responseItemTranformer(type, res.data)
        item.x = x
        item.y = y
        commit('updateGraphItem', item)
        commit('setEditorEditable', false)
      } else {
        console.log('[action] editorUpdateCommit error, do fake')
        // item = responseItemTranformer(type, item)
        // item.x = x
        // item.y = y
        // commit('updateGraphItem', item)
        // commit('setEditorEditable', false)
      }
    },
    async editorDeleteCommit({ state, commit }) {
      console.log('[action] editorDeleteCommit')
      if (!state.editor.createNew) {
        const {
          type,
          item: { id }
        } = state.editor
        const projectId = state.projectId
        // get delete items
        let item
        if (type === 'node') {
          const linksId = []
          for (const link of state.data.links) {
            if (link.from === id || link.to === id) {
              linksId.push(link.id)
            }
          }
          item = { nodeId: id, linksId }
        } else {
          item = { nodeId: null, linksId: [id] }
        }
        // delete requests
        const requests = []
        if (item.nodeId != null) {
          requests.push(() =>
            graphDeleteNodeAPI({ nodeId: item.nodeId, projectId })
          )
        }
        item.linksId.forEach(relationId => {
          requests.push(() => graphDeleteRelAPI({ relationId, projectId }))
        })
        const res = await Promise.all(requests.map(request => request()))
        if (res) {
          commit('deleteGraphItem', item)
          commit('setEditor')
        } else {
          console.log('[action] editorDeleteCommit error')
        }
      }
    },
    // 布局相关
    saveLayout({ state }) {
      console.log('[action] saveLayout')
      const { nodes, links } = state.data
      console.log([...nodes])
      console.log([...links])
      const aLayout = { nodes: [] }
      commit('setRecentLayout', aLayout)
    },
    restoreLayout({ state }) {
      console.log('[action] restoreLayout')
      console.log(state.recentLayout)
    },
    // 持久化相关
    saveAsPng({ state }) {
      console.log('[action] saveAsPng')
      const projectId = state.projectId
      const svg = state.svg
      const width = svg._groups[0][0].width.baseVal.value
      const height = svg._groups[0][0].height.baseVal.value
      // const {
      //   _groups: [
      //     [
      //       {
      //         width: {
      //           baseVal: { value: width }
      //         },
      //         height: {
      //           baseVal: { value: height }
      //         }
      //       }
      //     ]
      //   ]
      // } = svg
      svgToPng(svg, width, height).then(dataUrl => {
        download(`知识图谱-${projectId}.png`, dataUrl)
      })
    },
    async saveAsXml(_, projectId) {
      const res = await exportProjectXmlAPI(projectId)
      xmlDownload(res.data.xml, `知识图谱-${projectId}.xml`)
    }
  },
  getters: {
    projectId: state => state.projectId,
    graphData: state => state.data,
    graphNodes: state => {
      const nodes = state.data.nodes
      return nodes ? nodes : []
    },
    graphLinks: state => {
      const links = state.data.links
      return links ? links : []
    },
    graphSvg: state => state.svg,
    graphEditorType: state => state.editor.type,
    graphEditorTitle: state => {
      const body = typeMapper[state.editor.type]
      if (state.editor.createNew) {
        return `新增${body}`
      }
      const id = state.editor.item.id
      return `${body} ID：${id}`
    },
    graphEditorOptions: state =>
      !state.editor.type ? [] : itemOptions[state.editor.type],
    graphEditorItem: state => state.editor.item,
    graphEditorCreateNew: state => state.editor.createNew,
    graphEditorEditable: state => state.editor.editable
  }
}

export default graph
