import api from '@/api/dispatcher'
import { consoleGroup, $notify, $confirm } from '@/common/utils'

import { svgToPng, download, xmlDownload } from './utils/saving'
import {
  itemVarify,
  itemOptions,
  typeMapper,
  itemTransformer
} from './utils/item'
import {
  getGridLayout,
  getScale,
  restoreLayout,
  saveLayout,
  getNodesSize
} from './utils/layout'

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
      mode: 'FORCE', // 'FORCE' | 'GRID' | 'FREE'
      scale: 1,
      groups: [],
      colorMapper: {}
    },
    layoutConfirm: {
      // 布局保存提示
      ignore: false, // 不再提醒
      dirty: true, // 需要提醒
      timer: null
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
      FORCE: { nodes: [] },
      GRID: { nodes: [] },
      FIXED: { nodes: [] }
    },
    showModifyNameModal: false,
    showModifyDescModal: false,
    showModifyStatusModal: false
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
    setGraphBoardMode(state, mode) {
      state.board.mode = mode
    },
    setGraphBoardScale(state, scale = 1) {
      state.board.scale = scale
    },
    setGraphBoardGroups(state, groups = []) {
      state.board.groups = groups
    },
    setGraphBoardColorMapper(state, mapper = {}) {
      state.board.colorMapper = mapper
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
    setLayouts(state, layouts) {
      layouts.forEach(layout => {
        state.layouts[layout.type] = layout
      })
    },
    setLayout(state, { mode = 'FORCE', layout }) {
      state.layouts[mode] = layout
    },
    setLayoutConfirm(state) {
      const { ignore, timer } = state.layoutConfirm
      clearTimeout(timer)
      state.layoutConfirm.timer = null
      if (!ignore) {
        state.layoutConfirm.dirty = false
        state.layoutConfirm.timer = setTimeout(() => {
          state.layoutConfirm.dirty = true
          state.layoutConfirm.timer = null
        }, 5000)
      }
    },
    setShowModifyNameModal(state, data) {
      state.showModifyNameModal = data
    },
    setShowModifyDescModal(state, data) {
      state.showModifyDescModal = data
    },
    setShowModifyStatusModal(state, data) {
      state.showModifyStatusModal = data
    }
  },
  actions: {
    // async getProjectInfo(_, projectId) {
    //   const res = await api.getProjectInfo(projectId)
    //   return res.status === 200 ? res.data : null
    // },
    async getProjectGraphData(_, projectId) {
      const res = await api.getGraphByProjectId(projectId)
      return res.status === 200 ? res.data : null
    },
    /********** old **********/
    async graphInit({ commit, state, getters }, projectId) {
      if (projectId === state.projectId) return true
      const res = await api.getGraphByProjectId(projectId)
      // const res = { status: 200, data: fakeGraphData }
      if (res.status === 200) {
        const mode = getters.projectInfo.layoutStatus || 'FORCE'
        const { projectId, nodes, links, layouts } = res.data
        const pureLayouts = layouts.map(({ projectId, ...rest }) => ({
          ...rest
        }))
        const scale = getScale(
          pureLayouts.filter(layout => layout.type === mode)[0]
        )
        commit('setGraphProjectId', projectId)
        commit('setGraphBoardMode', mode)
        commit('setGraphData', { nodes, links })
        commit('setLayouts', pureLayouts)
        commit('setGraphBoardScale', scale)
        commit('setEditor')
        consoleGroup('[action] graphInit', () => {
          console.log('projectId', projectId)
          console.log('mode', mode)
          console.log('nodes', nodes)
          console.log('links', links)
          console.log('layouts', layouts)
        })
        commit('setGraphBoardGroups', getters.graphNodeGroups)
        return true
      } else {
        console.log('[action] graphInit.error')
        $notify({
          title: '图谱初始化异常',
          type: 'error'
        })
        return false
      }
    },
    // 选取 实体/关系
    async editorSelect({ state, commit, dispatch }, { type, id }) {
      consoleGroup('[action] editorSelect', () => {
        console.log(`type=${type}, id=${id}`)
      })
      const { editable, select, item } = state.editor
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
          // console.log(`[action] editorSelect, id = ${id} not found`)
          $notify({
            title: `实体 id='${id}' 不存在`,
            // message: `实体 Id: ${id} Not found`,
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
        dispatch('restoreLayout')
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
    // 布局模式转换
    async switchLayoutMode({ state, commit, dispatch }, mode) {
      const {
        data: { nodes },
        board: { mode: currentMode },
        layoutConfirm: { ignore, dirty }
      } = state
      consoleGroup('[action] switchLayoutMode', () => {
        console.log('mode', mode)
        console.log('ignore', ignore)
        console.log('dirty', dirty)
      })
      let doNext = true
      // 非排版模式提示保存布局
      if (currentMode !== 'GRID' && !ignore && dirty) {
        const option = await $confirm({
          title: '保存布局',
          message: '是否保存当前布局？',
          confirmText: '保存',
          cancelText: '不保存'
        })
        ;({
          confirm() {
            dispatch('saveLayout')
          },
          cancel() {},
          close() {
            doNext = false
          }
        }[option]())
      }
      if (!doNext) return
      if (mode === 'GRID') {
        const layout = getGridLayout(nodes)
        commit('setLayout', { mode: 'GRID', layout })
      }
      commit('setGraphBoardMode', mode)
    },
    // 保存布局
    async saveLayout({ state, commit }) {
      const {
        projectId,
        data: { nodes },
        board: { mode }
      } = state
      const layout = saveLayout(nodes)
      consoleGroup('[action] saveLayout', () => {
        console.log('nodes', nodes)
        console.log('layout', layout)
      })

      const res = await api.updateLayout(mode, layout, projectId)
      if (res.status === 200) {
        commit('setLayout', { mode, layout })
        commit('setLayoutConfirm')
        $notify({ title: '保存布局成功', type: 'success' })
        return true
      }
      return false
    },
    // 恢复布局
    restoreLayout({ state, commit }) {
      const {
        data: { nodes },
        board: { mode }
      } = state
      let layout = state.layouts[mode]
      if (!layout) return 1
      if (layout.nodes.length !== nodes.length && mode === 'GRID') {
        layout = getGridLayout(nodes)
        commit('setLayout', { mode: 'GRID', layout })
      }
      const newNodes = restoreLayout(mode, nodes, layout)
      const scale = getScale(getNodesSize(newNodes))
      consoleGroup('[action] restoreLayout', () => {
        console.log('mode', mode)
        console.log('layout', layout)
        console.log('nodes', newNodes)
      })
      commit('setGraphBoardScale', scale)
      commit('setGraphNodes', newNodes)
      commit('setLayoutConfirm')
      return scale
    },
    /********** new **********/
    async createItem(_, { projectId, type, item }) {
      const data = itemTransformer(type, item, projectId)
      console.log(`[action] createItem: type=${type}, item=`, data)
      if (type === 'node' || type === 'link') {
        const res =
          type === 'node'
            ? await api.graphInsertNode(data)
            : await api.graphInsertRel(data)
        console.log('res', res)
        if (res.status === 200) {
          return type === 'node'
            ? {
                ...item,
                radius: Number(item.radius),
                id: res.data.nodeId
              }
            : {
                ...item,
                id: res.data.relationId,
                source: item.from,
                target: item.to
              }
        }
        // request fail warning
        return false
      }
      // unknown type warning
      return false
    },
    async updateItem(_, { projectId, type, item }) {
      const data = itemTransformer(type, item, projectId)
      console.log(`[action] updateItem: type=${type}, item=`, data)
      if (type === 'node' || type === 'link') {
        const res =
          type === 'node'
            ? await api.graphUpdateNode(data)
            : await api.graphUpdateRel(data)
        console.log('res', res)
        if (res.status === 200) {
          return type === 'node'
            ? {
                ...item,
                radius: Number(item.radius)
              }
            : {
                ...item,
                source: item.from,
                target: item.to
              }
        }
        // request fail warning
        return false
      }
      // unknown type warning
      return false
    },
    async deleteItem(_, { projectId, type, id }) {
      console.log(`[action] deleteItem: type=${type}, id=${id}`)
      if (type === 'node' || type === 'link') {
        const res =
          type === 'node'
            ? await api.graphDeleteNodeCascade(id, projectId)
            : await api.graphDeleteRel(id, projectId)
        console.log('res', res)
        return res.status === 200
      }
      return false
    },
    /********** other **********/
    // 持久化相关
    saveAsPng(_, { projectName, svg }) {
      console.log('[action] saveAsPng')

      const group = svg._groups[0][0]
      const width = group.width.baseVal.value
      const height = group.height.baseVal.value

      svgToPng(svg, width, height).then(dataUrl => {
        download(`知识图谱-${projectName}.png`, dataUrl)
      })
    },
    async saveAsXml(_, { projectId, name }) {
      const res = await api.exportProjectXml(projectId)
      xmlDownload(res.data.xml, `知识图谱-${name}.xml`)
    },
    updateProjectName: async ({ commit }, data) => {
      const res = await api.updateName(data)
      return Promise.resolve(res.data)
    },
    updateProjectDesc: async ({ commit }, data) => {
      const res = await api.updateDescription(data)
      return Promise.resolve(res.data)
    },
    updateProjectStatus: async ({ commit }, data) => {
      const res = await api.updateStatus(data)
      return Promise.resolve(res.data)
    }
  },
  getters: {
    projectId: state => state.projectId,
    graphData: state => state.data,
    graphNodes: state => state.data.nodes,
    graphNodeGroups: state => {
      const groups = new Set()
      state.data.nodes.forEach(({ group }) => groups.add(group))
      return [...groups]
    },
    graphLinks: state => state.data.links,
    graphBoardSvg: state => state.board.svg,
    graphBoardFocus: state => state.board.focus,
    graphBoardMode: state => state.board.mode,
    graphBoardScale: state => state.board.scale,
    graphBoardGroups: state => state.board.groups,
    graphBoardColorMapper: state => state.board.colorMapper,
    graphEditorType: state => state.editor.type,
    graphEditorTitle: state => {
      const {
        editor: {
          type,
          createNew,
          item: { id }
        }
      } = state
      const body = typeMapper[type]
      return createNew ? `新增${body}` : `${body} ID：${id}`
    },
    graphEditorOptions: state =>
      !state.editor.type ? [] : itemOptions[state.editor.type],
    graphEditorItem: state => state.editor.item,
    graphEditorCreateNew: state => state.editor.createNew,
    graphEditorSelect: state => state.editor.select,
    graphEditorEditable: state => state.editor.editable,
    showModifyNameModal: state => state.showModifyNameModal,
    showModifyDescModal: state => state.showModifyDescModal,
    showModifyStatusModal: state => state.showModifyStatusModal
  }
}

export default graph
