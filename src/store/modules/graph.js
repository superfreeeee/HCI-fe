import {
  getGraphByProjectIdAPI,
  graphDeleteNodeAPI,
  graphDeleteRelAPI,
  graphInsertNodeAPI,
  graphInsertRelAPI,
  getGraphByProjectIdAPI
} from '../../api/graph'
import { exportProjectXmlAPI } from '../../api/project'
import { consoleGroup, download, svgToPng } from '../../common/utils'
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
      const items = state.data[`${state.editor.type}s`]
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items.splice(i, 1)
          break
        }
      }
    }
  },
  actions: {
    // graphCreate: async({ commit }, data) => {

    // },
    async graphInit({ commit, rootState }) {
      const projectId = rootState.project.projectId
      commit('setGraphProjectId', projectId)
      const res = await getGraphByProjectIdAPI(projectId)
      // const res = { status: 200, data: fakeGraphData }
      if (res.status === 200) {
        let data = res.data
        data = {
          nodes: data.nodes.map(n => ({
            id: n.nodeId,
            name: n.name,
            group: n.group,
            radius: n.val
          })),
          links: data.relations.map(r => ({
            id: r.relationId,
            name: r.name,
            source: r.source,
            target: r.target,
            from: r.source,
            to: r.target,
            value: r.val
          }))
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
      consoleGroup('[action] editorItemCreate', () => {
        console.log({ ...item })
      })
      const type = state.editor.type
      if (type === 'node') {
        item = {
          name: item.name,
          group: item.group,
          val: item.radius
        }
        const { data } = await graphInsertNodeAPI(item)
        item = {
          id: data.nodeId,
          name: data.name,
          group: data.group,
          radius: data.val
        }
      } else {
        item = {
          name: item.name,
          source: item.from,
          target: item.to,
          val: item.value
        }
        const { data } = await graphInsertRelAPI(item)
        item = {
          name: data.name,
          id: data.relationId,
          source: data.source,
          target: data.target,
          from: data.source,
          to: data.target,
          value: data.val
        }
      }
      consoleGroup('[action] editorCreateCommit', () => {
        console.log(item)
      })
      commit('addGraphItem', item)
      dispatch('editorSelect', { type, id: item.id })
    },
    // 提交 实体/关系 更新
    editorUpdateCommit(_, item) {
      consoleGroup('[action] editorItemUpdate', () => {
        console.log({ ...item })
      })
    },
    async editorDeleteCommit({ state, commit }) {
      if (!state.editor.createNew) {
        const {
          type,
          item: { id }
        } = state.editor
        let res
        if (type === 'node') {
          res = await graphDeleteNodeAPI(id)
        } else {
          res = await graphDeleteRelAPI(id)
        }
        commit('deleteGraphItem', id)
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
    saveAsXml: async ({ state }, projectId) => {
      const res = await exportProjectXmlAPI(projectId)
      console.log('saveAsXml', res)

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
