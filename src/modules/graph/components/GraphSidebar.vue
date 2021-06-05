<template>
  <el-menu
    @open="handleOpen"
    @close="handleClose"
    :unique-opened="true"
    class="sidemenu"
  >
    <!-- 布局操作 -->
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
    <!-- 图谱操作 -->
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
    <!-- 智能服务 -->
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-magic-stick"></i>
        <span>智能服务</span>
      </template>
      <el-menu-item-group style="text-align: center">
        <el-button
          v-for="smartOption in smartOptions"
          :key="smartOption.label"
          type="success"
          style="margin-bottom: 10px; width: 100%"
          @click="smartOption.handler"
        >
          {{ smartOption.label }}
        </el-button>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { layoutModes } from '@/modules/graph/utils/layout'
import { buttonAutoBlur } from '@/common/utils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'GraphSideBar',
  data() {
    return {
      flag: true, // mock verifyInitiate
      modes: layoutModes,
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
          handler: () => this.$emit('graph-action', 'resetZoom'),
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
      smartOptions: [
        {
          label: '初始化图谱',
          handler: () => this.initGraph(),
        },
        {
          label: '智能小助手 PC 端',
          handler: () => this.gotoChat(),
        },
        {
          label: '智能小助手 Web 端',
          handler: () => this.gotoSmarthelper(),
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['graphBoardMode', 'projectId']),
  },
  methods: {
    ...mapActions([
      'switchLayoutMode',
      'saveAsPng',
      'saveAsXml',
      'saveLayout',
      'restoreLayout',
      'editorCreate',
      'initiateGraph',
    ]),
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    gotoChat() {
      const projectId = Number(this.$route.params.projectId)
      if (this.flag) {
        this.$router.push(`/smarthelper/${projectId}`)
      } else {
        this.$router.push(`/graph/${projectId}`)
        this.$message.error('请先初始化图谱!')
      }
    },
    gotoSmarthelper() {
      const projectId = Number(this.$route.params.projectId)
      if (this.flag) {
        this.$router.push(`/smarthelper/${projectId}`)
      } else {
        this.$router.push(`/graph/${projectId}`)
        this.$message.error('请先初始化图谱!')
      }
    },
    initGraph() {
      const projectId = Number(this.$route.params.projectId)
      this.initiateGraph(projectId)
    },
    switchMode(e, { mode }) {
      buttonAutoBlur(e)
      if (mode !== this.graphBoardMode) {
        this.switchLayoutMode(mode)
      }
    },
    handlerDispatcher(e, handler) {
      buttonAutoBlur(e)
      handler()
    },
    exportXml() {
      this.saveAsXml(this.projectId)
    },
  },
}
</script>

<style>
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
