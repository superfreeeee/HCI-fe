import { getGraphByProjectIdAPI } from '../../api/graph'
import { consoleGroup, download, svgToPng } from '../../common/utils'
import { fakeGraphData } from '../../common/sample'
import { itemOptions, typeMapper } from '../../common/editor'

const graph = {
  state: {
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
    }
  },
  actions: {
    // graphCreate: async({ commit }, data) => {

    // },
    graphInit({ commit }, projectId = 1) {
      // const res = await getGraphByProjectIdAPI(projectId)
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
          links: data.relations.map(r => ({
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
    editorCreateCommit(_, item) {
      consoleGroup('[action] editorItemCreate', () => {
        console.log({ ...item })
      })
    },
    // 提交 实体/关系 更新
    editorUpdateCommit(_, item) {
      consoleGroup('[action] editorItemUpdate', () => {
        console.log({ ...item })
      })
    },
    // 持久化相关
    saveAsPng({ state }) {
      console.log('[action] saveAsPng')
      const projectId = state.data.projectId
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
    saveAsXml() {
      console.log('[action] saveAsXml')
    }
  },
  getters: {
    graphData: state => state.data,
    graphNodes: state => state.data.nodes,
    graphLinks: state => state.data.links,
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
