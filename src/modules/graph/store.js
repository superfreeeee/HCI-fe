import api from '@/api/dispatcher'
import { consoleGroup, $notify, $confirm } from '@/common/utils'

import { itemOptions, typeMapper } from './utils/editor'
import { svgToPng, download, xmlDownload } from './utils/saving'
import { itemVarify } from './utils/item'
import { restoreLayout, saveLayout } from './utils/layout'
// import { fakeGraphData } from '@/common/entity'

const graph = {
  state: {
    projectId: -1,
    data: {
      nodes: [],
      links: []
    },
    board: {
      svg: null,
      focus: false,
      type: 'FORCE' // 'FORCE' | ''GRID | 'FREE'
    },
    svg: null,
    editor: {
      type: '', // 'node' | 'link' | ''
      createNew: true,
      select: '',
      item: null,
      editable: false
    },
    layouts: {
      // later change to history layout
      FORCE: [],
      GRID: [],
      FREE: []
    }
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
      {
        type = '',
        item = null,
        createNew = true,
        editable = false,
        select = '',
        focus = false
      } = {}
    ) {
      state.editor.type = type
      state.editor.item = item
      state.editor.select = select
      state.editor.createNew = createNew
      state.editor.editable = editable
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
    setLayout(state, { type = 'FORCE', layout }) {
      state.layouts[type] = layout
    }
  },
  actions: {
    async graphInit({ commit, state }, projectId) {
      if (projectId === state.projectId) return true
      commit('setGraphProjectId', projectId)
      const res = await api.getGraphByProjectId(projectId)
      // const res = { status: 200, data: fakeGraphData }
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
      return res.status === 200
    },
    // 选取 实体/关系
    async editorSelect({ state, commit, dispatch }, { type, id }) {
      consoleGroup('[action] editorSelect', () => {
        console.log(`type=${type}, id=${id}`)
      })
      const { type: t, editable, select, item } = state.editor
      if (!select && editable) {
        const confirm = await $confirm({
          title: '当前物件修改未保存',
          message: '是否保存修改?',
          type: 'warning',
          confirmText: '保存',
          cancelText: '不保存'
        })
        let doNext = false
        if (confirm === 'confirm') {
          doNext = await dispatch(
            `editor${item.id ? 'Update' : 'Create'}Commit`
          )
        } else if (confirm === 'cancel') {
          doNext = true
        } else if (confirm === 'close') {
          doNext = false
        }
        if (!doNext) return false
      }
      if (type === 'cancel') {
        commit('setEditor')
        return true
      }
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
      item = itemVarify(type, item)
      consoleGroup('[action] editorCreateCommit', () => {
        console.log({ ...item })
      })
      // request
      const res = await (type === 'node'
        ? api.graphInsertNode(item, projectId)
        : api.graphInsertRel(item, projectId))
      if (res.status === 200) {
        item.id = type === 'node' ? res.data.nodeId : res.data.relationId
        // solve response item
        consoleGroup('[action] editorCreateCommit', () => {
          console.log(item)
        })
        commit('addGraphItem', item)
        commit('setEditor', {
          type,
          item,
          createNew: false,
          focus: item.id
        })
        $notify({ title: `添加${typeMapper[type]}成功`, type: 'success' })
      } else {
        consoleGroup('[action] editorCreateCommit error', () => {
          console.log(res)
        })
        $notify({ title: `添加${typeMapper[type]}失败`, type: 'error' })
      }
      return res.status === 200
    },
    // 提交 实体/关系 更新
    async editorUpdateCommit({ state, commit }) {
      let {
        projectId,
        editor: { item, type }
      } = state
      item = itemVarify(type, item)
      consoleGroup('[action] editorUpdateCommit', () => {
        console.log({ ...item })
      })
      const { x, y } = item
      // request
      const res = await (type === 'node'
        ? api.graphUpdateNode(item, projectId)
        : api.graphUpdateRel(item, projectId))
      if (res.status === 200) {
        item.x = x
        item.y = y
        commit('updateGraphItem', item)
        commit('setEditorEditable', false)
        $notify({ title: `修改${typeMapper[type]}成功`, type: 'success' })
      } else {
        consoleGroup('[action] editorUpdateCommit error', () => {
          console.log(res)
        })
        $notify({ title: `修改${typeMapper[type]}失败`, type: 'error' })
      }
      return res.status === 200
    },
    // 提交 实体/关系 删除
    async editorDeleteCommit({ state, commit }) {
      console.log('[action] editorDeleteCommit')
      if (!state.editor.createNew) {
        const confirm = await $confirm({
          title: `删除${typeMapper[state.editor.type]}`,
          message: '确定删除？',
          type: 'warning'
        })
        if (confirm !== 'confirm') {
          return false
        }
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
          res = await api.graphDeleteNodeCascade(id, projectId)
        } else {
          item = { nodeId: null, linksId: [id] }
          res = await api.graphDeleteRel(id, projectId)
        }
        if (res.status === 200) {
          commit('deleteGraphItem', item)
          commit('setEditor')
          $notify({ title: `删除${typeMapper[type]}成功`, type: 'success' })
        } else {
          console.log('[action] editorDeleteCommit error')
          $notify({ title: `删除${typeMapper[type]}失败`, type: 'error' })
        }
        return res.status === 200
      }
      return false
    },
    // 保存布局
    async saveLayout({ state, commit }) {
      const {
        projectId,
        data: { nodes },
        board: { type }
      } = state
      const layout = saveLayout(nodes)
      consoleGroup('[action] saveLayout', () => {
        console.log('nodes', nodes)
        console.log('layout', layout)
      })
      commit('setLayout', { type, layout })

      // const res = await api.updateLayout(projectId, layout)
      // if (res) commit('setRecentLayout', layout)
    },
    // 恢复布局
    restoreLayout({ state, commit }) {
      const type = state.board.type
      const {
        data: { nodes },
        layouts: { [type]: layout }
      } = state
      const newNodes = restoreLayout(nodes, layout)
      consoleGroup('[action] restoreLayout', () => {
        console.log('type', type)
        console.log('layout', layout)
        console.log('nodes', newNodes)
      })
      commit('setGraphNodes', newNodes)
    },
    // 持久化相关
    saveAsPng({ state, getters }) {
      console.log('[action] saveAsPng')
      const name = getters.projectInfo.name
      const svg = state.board.svg

      const group = svg._groups[0][0]
      const width = group.width.baseVal.value
      const height = group.height.baseVal.value

      svgToPng(svg, width, height).then(dataUrl => {
        download(`知识图谱-${name}.png`, dataUrl)
      })
    },
    async saveAsXml({ getters }, projectId) {
      const res = await api.exportProjectXml(projectId)
      const name = getters.projectInfo.name
      xmlDownload(res.data.xml, `知识图谱-${name}.xml`)
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
