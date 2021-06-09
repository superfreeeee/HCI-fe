<template>
  <div class="graph">
    <div class="main">
      <div class="title">
        <el-button round type="text" icon="el-icon-arrow-left" @click="back()"
          >返回</el-button
        >
        <span>项目：{{ projectInfo.name }}</span>
        <el-button
          round
          type="text"
          icon="el-icon-info"
          @click="showDescription()"
          >关于</el-button
        >
      </div>
      <!-- 侧边操作导航栏 -->
      <graph-sidebar
        :layoutMode="graphProperty.layoutMode"
        @layout-action="dispatchGraphAction"
        @graph-action="dispatchGraphAction"
        @editor-action="dispatchEditorAction"
      ></graph-sidebar>
      <!-- 图谱中心 -->
      <graph-board
        ref="board"
        @init-property="initPropertyHandler"
        @editor-action="dispatchEditorAction"
      ></graph-board>
    </div>
    <div :class="['editor', showEditor ? 'open' : 'close']">
      <!-- 图谱修改面板 -->
      <graph-editor
        ref="editor"
        :graphData="graphData"
        :nodesScale="graphProperty.nodeScale"
        :nodeOptions="nodeOptions"
        :nodeGroups="nodeGroups"
        @graph-action="dispatchGraphAction"
      ></graph-editor>
    </div>
    <el-button
      @click="showEditor = !showEditor"
      :icon="`el-icon-arrow-${showEditor ? 'right' : 'left'}`"
    ></el-button>
    <graph-modify-name-modal />
    <graph-modify-desc-modal />
    <graph-modify-status-modal />
  </div>
</template>

<script>
import GraphBoard from '../modules/graph/components/GraphBoard'
import GraphEditor from '../modules/graph/components/GraphEditor'
import GraphSidebar from '../modules/graph/components/GraphSidebar'
import GraphModifyNameModal from '../modules/graph/components/GraphModifyNameModal'
import GraphModifyDescModal from '../modules/graph/components/GraphModifyDescModal'
import GraphModifyStatusModal from '../modules/graph/components/GraphModifyStatusModal'
import { mapGetters, mapActions } from 'vuex'

import { _projectInfo, _graphData } from '../modules/graph/utils/data'
import { deepCopy } from '../common/utils/object'

export default {
  name: 'Graph',
  components: {
    GraphBoard,
    GraphEditor,
    GraphSidebar,
    GraphModifyNameModal,
    GraphModifyDescModal,
    GraphModifyStatusModal
  },
  data() {
    return {
      projectInfo: {},
      graphData: null,
      graphProperty: {
        layoutMode: 'FORCE',
        nodeScale: null
      },
      showEditor: false
    }
  },
  computed: {
    ...mapGetters([
      // 'graphData',
      // 'projectInfo',
    ]),
    nodeOptions() {
      const data = this.graphData
      return data ? data.nodes.map(({ id, name }) => ({ id, name })) : []
    },
    nodeGroups() {
      if (!this.graphData) return []
      return [...new Set(this.graphData.nodes.map(node => node.group))]
    }
  },
  methods: {
    ...mapActions({
      getProjectInfoAct: 'getProjectInfo',
      getProjectGraphDataAct: 'getProjectGraphData'
    }),
    back() {
      this.$router.push('/')
    },
    dispatchGraphAction(name, ...args) {
      console.log(`[GraphAction] ${name}`, args)
      if (name === 'switchLayout') {
        this.graphProperty.layoutMode = args[0]
      }
      if (
        [
          'createNode',
          'createLink',
          'updateNode',
          'updateLink',
          'deleteNode',
          'deleteLink'
        ].includes(name)
      ) {
        const item = args[0]
        const { nodes, links } = this.graphData
        ;({
          createNode: () => {
            nodes.push(item)
          },
          createLink: () => {
            links.push(item)
          },
          updateNode: () => {
            const node = nodes.filter(node => node.id === item.id)[0]
            if (node) {
              for (const prop in node) {
                node[prop] = item[prop]
              }
            }
          },
          updateLink: () => {
            const link = links.filter(link => link.id === item.id)[0]
            if (link) {
              for (const prop in link) {
                link[prop] = item[prop]
              }
            }
          },
          deleteNode: () => {
            const node = nodes.filter(node => node.id === item.id)[0]
            if (node) {
              console.log('delete target ', node)
              nodes.splice(nodes.indexOf(node), 1)
              this.graphData.links = links.filter(
                ({ from, to }) => from !== node.id && to !== node.id
              )
            }
          },
          deleteLink: () => {
            const target = links.filter(link => link.id === item.id)[0]
            if (target) {
              console.log('delete target ', target)
              links.splice(links.indexOf(target), 1)
            }
          }
        }[name]())
      }
      this.$refs.board[name](...args)
    },
    dispatchEditorAction(name, ...args) {
      console.log(`[EditorAction] ${name}`, args)
      this.showEditor = true
      this.$refs.editor.dispatchEditorAction(name, ...args)
    },
    initPropertyHandler(name, value) {
      console.log(`[InitProperty] ${name}`)
      this.graphProperty[name] = value
    },
    showDescription() {
      this.$notify({
        title: `关于 ${this.projectInfo.name}`,
        message: this.projectInfo.description,
        duration: 5000,
        type: 'info',
        position: 'bottom-left'
      })
    }
  },
  async mounted() {
    const projectId = Number(this.$route.params.projectId)
    console.log(`[Graph] mounted, projectId = ${projectId}`)

    const projectInfo = await this.getProjectInfoAct(projectId)

    // const projectInfo = deepCopy(_projectInfo)
    console.log('projectInfo', projectInfo)
    if (!projectInfo) {
      // warning
      return
    }
    this.projectInfo = projectInfo

    const graphData = await this.getProjectGraphDataAct(projectId)
    // const graphData = deepCopy(_graphData)
    console.log('graphData', graphData)
    if (!graphData) {
      // warning
      return
    }
    this.graphData = graphData

    const graphBoard = this.$refs.board
    graphBoard.mountGraphData(graphData, this.projectInfo)

    // setTimeout(() => {
    //   graphBoard.reset()
    //   setTimeout(() => {
    //     graphBoard.mountGraphData(graphData)
    //   }, 5000)
    // }, 5000)
  }
}
</script>

<style scoped>
.graph {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: stretch;
}
.graph > .main {
  flex: 1;
  position: relative;
}
.graph > .main > .title {
  position: absolute;
  left: 40px;
  top: 20px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 0px slategray;
  background-color: #ffffff;
  height: 40px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.graph > .editor {
  border-left: 1px solid #bbbbbb;
  box-sizing: border-box;
  transition: width 1s ease-out;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: auto;
}
.graph > .editor.open {
  width: 350px;
}
.graph > .editor.close {
  width: 0;
}
</style>
