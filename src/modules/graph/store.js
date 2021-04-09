import api from '@/api/dispatcher'
import { consoleGroup } from '@/common/utils'
import { $notify, $confirm } from '@/common/message'

import { itemOptions, typeMapper } from './utils/editor'
import { svgToPng, download, xmlDownload } from './utils/saving'
import { itemTransformer, responseItemTranformer } from './utils/item'
import { restoreLayout, saveLayout } from './utils/layout'
import { fakeGraphData } from '../../common/sample'

const graph = {
  state: {
    projectId: -1,
    data: {
      nodes: [],
      links: []
    },
    board: {
      svg: null,
      focus: false
    },
    svg: null,
    editor: {
      type: '', // 'node' | 'link' | ''
      createNew: true,
      select: '',
      item: null,
      editable: true
    },
    recentLayout: [] // later change to history layout
  },
  mutations: {
    setGraphProjectId(state, id) {
      state.projectId = id
    },
    setGraphData(state, data = { nodes: [], links: [] }) {
      state.data = data
    },
    setGraphNodes(state, nodes = []) {
      state.data.nodes = nodes
    },
    setGraphLinks(state, links = []) {
      state.data.links = links
    },
    setGraphBoardSvg(state, svg) {
      state.board.svg = svg
    },
    setGraphBoardFocus(state, focus) {
      state.board.focus = focus
    },
    setEditor(
      state,
      { type = '', item = null, createNew = true, select = '', focus = false } = {}
    ) {
      state.editor.type = type
      state.editor.item = item
      state.editor.select = select
      state.editor.createNew = createNew
      state.board.focus = focus
    },
    setEditorSelect(state, select = '') {
      if (state.editor.select === select) {
        select = ''
      }
      console.log(`select = '${select}'`)
      state.editor.select = select
      if (select !== '') {
        $notify({ title: '点击目标实体', message: '再次点击取消选择' })
      }
    },
    setEditorEditable(state, bool) {
      state.editor.editable = bool
    },
    setEditorItem(state, item) {
      state.editor.item = item
    },
    addGraphItem(state, item) {
      state.data[`${state.editor.type}s`].push(item)
    },
    deleteGraphItem(state, item) {
      const { nodes, links } = state.data
      const { nodeId, linksId } = item
      // 删除关系
      if (linksId.length > 0) {
        state.data.links = links.filter(link => !linksId.includes(link.id))
      }
      // 删除实体
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
    async graphInit({ commit, state }, projectId) {
      if (projectId === state.projectId) return true
      commit('setGraphProjectId', projectId)
      // const res = await api.getGraphByProjectId(projectId)
      const res = { status: 200, data: fakeGraphData }
      if (res.status === 200) {
        const data = res.data
        commit('setGraphData', data)
        commit('setEditor')
        consoleGroup('[action] graphInit', () => {
          console.log('data', { ...data })
        })
      } else {
        console.log('error')
        $notify({
          title: '图谱初始化异常',
          type: 'error'
        })
      }
    },
    // 选取 实体/关系
    editorSelect({ state, commit }, { type, id }) {
      consoleGroup('[action] editorSelect', () => {
        console.log(`type=${type}, id=${id}`)
      })
      if (type === 'cancel') {
        if (state.editor.type) {
          commit('setEditor')
        }
        return
      }
      const { select, item } = state.editor
      if (select) {
        if (type === 'node') {
          commit('setEditorItem', { ...item, [select]: id })
          commit('setEditorSelect', '')
        }
      } else {
        const items = state.data[`${type}s`]
        const target = items.filter(item => item.id === id)[0]
        if (target) {
          commit('setEditor', { type, item: { ...target }, createNew: false })
          commit('setEditorEditable', false)
          if (type === 'node') {
            commit('setGraphBoardFocus', id)
          }
        } else {
          console.log(`[action] editorSelect, id = ${id} not found`)
          $notify({
            title: '实体选择异常',
            message: `实体 Id: ${id} Not found`,
            type: 'error'
          })
        }
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
    async editorCreateCommit({ state, commit, dispatch }) {
      let {
        projectId,
        editor: { item, type }
      } = state
      consoleGroup('[action] editorCreateCommit', () => {
        console.log({ ...item })
      })
      // form param item
      item = itemTransformer(type, item, projectId)
      // request
      const res = await (type === 'node'
        ? api.graphInsertNode(item)
        : api.graphInsertRel(item))
      if (res.status === 200) {
        // solve response item
        item = responseItemTranformer(type, res.data)
        consoleGroup('[action] editorCreateCommit', () => {
          console.log(item)
        })
        commit('addGraphItem', item)
        dispatch('editorSelect', { type, id: item.id })
        $notify({ title: `添加${typeMapper[type]}成功`, type: 'success' })
      } else {
        consoleGroup('[action] editorCreateCommit error', () => {
          console.log(res)
        })
        $notify({ title: `添加${typeMapper[type]}失败`, type: 'error' })
      }
    },
    // 提交 实体/关系 更新
    async editorUpdateCommit({ state, commit }) {
      let {
        projectId,
        editor: { item, type }
      } = state
      consoleGroup('[action] editorUpdateCommit', () => {
        console.log({ ...item })
      })
      const { x, y } = item
      // form param item
      item = itemTransformer(type, item, projectId)
      // request
      const res = await (type === 'node'
        ? api.graphUpdateNode(item)
        : api.graphUpdateRel(item))
      if (res.status === 200) {
        item = responseItemTranformer(type, res.data)
        item.x = x
        item.y = y
        commit('updateGraphItem', item)
        commit('setEditorEditable', false)
        $notify({ title: `修改${typeMapper[type]}成功`, type: 'success' })
      } else {
        console.log('[action] editorUpdateCommit error, do fake')
        $notify({ title: `修改${typeMapper[type]}失败`, type: 'error' })
      }
    },
    // 提交 实体/关系 删除
    async editorDeleteCommit({ state, commit }) {
      console.log('[action] editorDeleteCommit')
      const type = state.editor.type
      if (
        !state.editor.createNew &&
        (await $confirm(`删除${typeMapper[type]}`, '确定删除？'))
      ) {
        const {
          type,
          item: { id }
        } = state.editor
        const projectId = state.projectId
        // get delete items
        let item, res
        if (type === 'node') {
          const linksId = []
          for (const link of state.data.links) {
            if (link.from === id || link.to === id) {
              linksId.push(link.id)
            }
          }
          item = { nodeId: id, linksId }
          res = await api.graphDeleteNodeCascade({ nodeId: id, projectId })
        } else {
          item = { nodeId: null, linksId: [id] }
          res = await api.graphDeleteRel({ relationId: id, projectId })
        }
        if (res) {
          commit('deleteGraphItem', item)
          commit('setEditor')
          $notify({ title: `删除${typeMapper[type]}成功`, type: 'success' })
        } else {
          console.log('[action] editorDeleteCommit error')
          $notify({ title: `删除${typeMapper[type]}失败`, type: 'error' })
        }
      }
    },
    // 保存布局
    async saveLayout({ state, commit }) {
      const projectId = state.projectId
      const nodes = state.data.nodes
      const layout = saveLayout(nodes)
      consoleGroup('[action] saveLayout', () => {
        console.log('nodes', nodes)
        console.log('layout', layout)
      })
      commit('setRecentLayout', layout)

      // const res = await api.updateLayout(projectId, layout)
      // if (res) commit('setRecentLayout', layout)
    },
    // 恢复布局
    restoreLayout({ state, commit }) {
      const {
        data: { nodes },
        recentLayout: layout
      } = state
      const newNodes = restoreLayout(nodes, layout)
      consoleGroup('[action] restoreLayout', () => {
        console.log('layout', layout)
        console.log('nodes', newNodes)
      })
      commit('setGraphNodes', newNodes)
    },
    // 持久化相关
    saveAsPng({ state }) {
      console.log('[action] saveAsPng')
      const projectId = state.projectId
      const svg = state.boardsvg

      const group = svg._groups[0][0]
      const width = group.width.baseVal.value
      const height = group.height.baseVal.value

      svgToPng(svg, width, height).then(dataUrl => {
        download(`知识图谱-${projectId}.png`, dataUrl)
      })
    },
    async saveAsXml(_, projectId) {
      const res = await api.exportProjectXml(projectId)
      xmlDownload(res.data.xml, `知识图谱-${projectId}.xml`)
    }
  },
  getters: {
    projectId: state => state.projectId,
    graphData: state => state.data,
    graphNodes: state => state.data.nodes,
    graphLinks: state => state.data.links,
    graphBoardSvg: state => state.board.svg,
    graphBoardFocus: state => state.board.focus,
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
    graphEditorSelect: state => state.editor.select,
    graphEditorEditable: state => state.editor.editable
  }
}

export default graph
