import {
  getGraphByProjectIdAPI,
  graphDeleteNodeAPI,
  graphDeleteRelAPI,
  graphInsertNodeAPI,
  graphInsertRelAPI,
  graphUpdateNodeAPI,
  graphUpdateRelAPI
} from '../../api/graph'
import { exportProjectXmlAPI } from '../../api/project'
import {
  consoleGroup,
  download,
  itemTransformer,
  responseItemTranformer,
  svgToPng
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
    }
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
    deleteGraphItem(state, id) {
      const type = state.editor.type
      const items = state.data[`${type}s`]
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items.splice(i, 1)
          break
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
    }
  },
  actions: {
    async graphInit({ commit, rootState }) {
      const projectId = rootState.project.projectId
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
      // form param item
      item = itemTransformer(type, item)
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
      const { x, y } = item
      // form param item
      item = itemTransformer(type, item)
      // request
      const res = await (type === 'node'
        ? graphUpdateNodeAPI(item)
        : graphUpdateRelAPI(item))
      console.log(res)
      if (res.status === 200) {
        item = responseItemTranformer(type, res.data)
        item.x = x
        item.y = y
        commit('updateGraphItem', item)
        commit('setEditorEditable', false)
      } else {
        console.log('[action] editorUpdateCommit error, do fake')
        item = responseItemTranformer(type, item)
        item.x = x
        item.y = y
        commit('updateGraphItem', item)
        commit('setEditorEditable', false)
      }
    },
    async editorDeleteCommit({ state, commit }) {
      console.log('[action] editorDeleteCommit')
      if (!state.editor.createNew) {
        function clearNodes(linkId) {}
        function checkNode(nodeId) {}
        function clearLinks(nodeId) {
          const links = state.data.links
          for (let i = 0; i < links.length; i++) {
            const { from, to } = links[i]
            if (from === nodeId || to === nodeId) {
              links.splice(i, 1)
              i--
              clearNodes(from === nodeId ? to : from)
            }
          }
        }
        const {
          type,
          item: { id }
        } = state.editor
        let res = await (type === 'node'
          ? graphDeleteNodeAPI(id)
          : graphDeleteRelAPI(id))
        if (res.status === 200) {
          commit('deleteGraphItem', id)
          commit('setEditor')
        } else {
          console.log('[action] editorDeleteCommit error')
        }
      }
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

      function stringToXml(xmlString) {
        var xmlDoc
        if (typeof xmlString == 'string') {
          if (document.implementation.createDocument) {
            var parser = new DOMParser()
            xmlDoc = parser.parseFromString(xmlString, 'text/xml')
          } else if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
            xmlDoc.async = false
            xmlDoc.loadXML(xmlString)
          }
        } else {
          xmlDoc = xmlString
        }
        return xmlDoc
      }
      const xmlObj = stringToXml(res.data.xml)
      console.log('xmlObj', xmlObj)
    }
  },
  getters: {
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
