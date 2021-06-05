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
        <graph-layout @graph-action="passingGraphAction" />
      </el-menu-item-group>
    </el-submenu>
    <!-- 图谱操作 -->
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-edit"></i>
        <span>图谱操作</span>
      </template>
      <el-menu-item-group style="text-align: center">
        <graph-actions
          @graph-action="passingGraphAction"
          @editor-action="passingEditorAction"
        />
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
import { buttonAutoBlur } from '@/common/utils'
import { mapGetters, mapActions } from 'vuex'
import GraphLayout from './GraphLayout'
import GraphActions from './GraphActions'

export default {
  name: 'GraphSideBar',
  components: {
    GraphLayout,
    GraphActions
  },
  data() {
    return {
      flag: true, // mock verifyInitiate
      smartOptions: [
        {
          label: '初始化图谱',
          handler: () => this.initGraph()
        },
        {
          label: '智能小助手 PC 端',
          handler: () => this.gotoSmarthelper('/chat')
        },
        {
          label: '智能小助手 Web 端',
          handler: () => this.gotoSmarthelper('/smarthelper')
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['graphBoardMode', 'projectId'])
  },
  methods: {
    ...mapActions(['switchLayoutMode', 'initiateGraph', 'verifyInitiate']),
    passingGraphAction(...args) {
      this.passingEmit('graph-action', ...args)
    },
    passingEditorAction(...args) {
      this.passingEmit('editor-action', ...args)
    },
    passingEmit(eventName, ...args) {
      this.$emit(eventName, ...args)
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    gotoSmarthelper(path) {
      const projectId = Number(this.$route.params.projectId)
      this.verifyInitiate(projectId).then(res => {
        if (res) {
          this.$router.push(`${path}/${projectId}`)
        } else {
          this.$router.push(`/graph/${projectId}`)
          this.$message.error('请先初始化图谱!')
        }
      })
    },
    initGraph() {
      const projectId = Number(this.$route.params.projectId)
      this.initiateGraph(projectId)
    },
    handlerDispatcher(e, handler) {
      buttonAutoBlur(e)
      handler()
    }
  }
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
