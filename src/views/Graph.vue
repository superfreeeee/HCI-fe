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
      <el-menu
        @open="handleOpen"
        @close="handleClose"
        unique-opened="true"
        class="sidemenu"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span>布局设置</span>
          </template>
          <el-menu-item-group style="text-align: center">
            <el-button
              v-for="mode in modes"
              :key="mode.label"
              :type="mode.type"
              :plain="mode.mode !== graphBoardMode"
              @click="switchMode($event, mode)"
              style="margin-bottom: 10px; width: 100%"
              >{{ mode.label }}</el-button
            >
            <el-button
              v-for="action in actions"
              :key="action.label"
              size="medium"
              type="info"
              @click="action.handler"
              style="margin-bottom: 10px; width: 100%"
              >{{ action.label }}</el-button
            >
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-edit"></i>
            <span>图谱操作</span>
          </template>
          <el-menu-item-group style="text-align: center">
            <el-button
              v-for="option in options"
              size="medium"
              :key="option.label"
              :type="option.type"
              @click="handlerDispatcher($event, option.handler)"
              style="margin-bottom: 10px; width: 100%"
              >{{ option.label }}</el-button
            >
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-magic-stick"></i>
            <span>智能服务</span>
          </template>
          <el-menu-item-group style="text-align: center">
            <el-button
              type="success"
              style="margin-bottom: 10px; width: 100%"
              @click="gotoChat()"
            >
              智能小助手
            </el-button>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <graph-board ref="board" @editor-open="showEditor = true"></graph-board>
      <!-- <graph-options
        @graph-action="actionDispatch"
        @editor-open="showEditor = true"
      ></graph-options>-->
      <!-- <graph-layout @graph-action="actionDispatch"></graph-layout> -->
    </div>
    <div :class="['editor', showEditor ? 'open' : 'close']">
      <graph-editor></graph-editor>
    </div>
    <el-button
      @click="showEditor = !showEditor"
      :icon="`el-icon-arrow-${showEditor ? 'right' : 'left'}`"
    ></el-button>
  </div>
</template>

<script>
import GraphBoard from '../modules/graph/components/GraphBoard'
import GraphOptions from '../modules/graph/components/GraphOptions'
import GraphLayout from '../modules/graph/components/GraphLayout'
import GraphEditor from '../modules/graph/components/GraphEditor'
import { layoutModes } from '@/modules/graph/utils/layout'
import { buttonAutoBlur } from '@/common/utils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Graph',
  components: {
    GraphBoard,
    GraphOptions,
    GraphLayout,
    GraphEditor,
  },
  data() {
    return {
      modes: layoutModes,
      showEditor: true,
      actions: [
        {
          label: '保存布局',
          handler: () => this.saveLayout(),
        },
        {
          label: '恢复布局',
          handler: () => this.restoreLayout(),
        },
      ],
      options: [
        {
          label: '新增实体',
          type: 'primary',
          handler: () => {
            this.editorCreate('node')
            this.$emit('editor-open')
          },
        },
        {
          label: '新增关系',
          type: 'primary',
          handler: () => {
            this.editorCreate('link')
            this.$emit('editor-open')
          },
        },
        {
          label: '重置缩放',
          type: 'danger',
          handler: () => this.$emit('graph-action', 'zoomReset'),
        },
        {
          label: '全局刷新',
          type: 'danger',
          handler: () => this.$emit('graph-action', 'backCenter'),
        },
        {
          label: '保存为 png',
          type: 'warning',
          handler: () => this.saveAsPng(),
        },
        {
          label: '保存为 xml',
          type: 'warning',
          handler: () => this.exportXml(),
        },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'graphData',
      'projectInfo',
      'graphBoardMode',
      'graphBoardMode',
      'projectId',
    ]),
  },
  methods: {
    ...mapActions([
      'getProjectInfo',
      'switchLayoutMode',
      'saveLayout',
      'restoreLayout',
      'editorCreate',
      'saveAsPng',
      'saveAsXml',
    ]),
    back() {
      this.$router.push('/')
    },
    gotoChat() {
      this.$router.push('/chat')
    },
    actionDispatch(name, ...args) {
      // console.log(`[GraphAction] ${name}`)
      this.$refs.board[name](...args)
    },
    showDescription() {
      this.$notify({
        title: `关于 ${this.projectInfo.name}`,
        message: this.projectInfo.description,
        duration: 5000,
        type: 'info',
        position: 'bottom-left',
      })
    },
    switchMode(e, { mode }) {
      buttonAutoBlur(e)
      if (mode !== this.graphBoardMode) {
        this.switchLayoutMode(mode)
      }
    },
    exportXml() {
      this.saveAsXml(this.projectId)
    },
    handlerDispatcher(e, handler) {
      buttonAutoBlur(e)
      handler()
    },
  },
  async mounted() {
    const projectId = Number(this.$route.params.projectId)
    console.log(`[Graph] mounted, projectId = ${projectId}`)

    console.log(`[Graph] getProjectInfo`)
    if (!(await this.getProjectInfo(projectId))) return

    console.log(`[Graph] graphInit`)
    const board = this.$refs.board
    if (!(await board.graphInit(projectId))) return
    board.init()
  },
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
.graph > .main > .sidemenu {
  width: 150px;
  position: fixed;
  left: 0;
  top: 100px;
}

.el-button + .el-button {
  margin: 0;
}
</style>
