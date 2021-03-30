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
      <graph-board ref="board" @editor-open="showEditor = true"></graph-board>
      <graph-options
        @graph-action="actionDispatch"
        @editor-open="showEditor = true"
      ></graph-options>
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
import GraphEditor from '../modules/graph/components/GraphEditor'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Graph',
  components: {
    GraphBoard,
    GraphOptions,
    GraphEditor
  },
  data() {
    return {
      showEditor: false
    }
  },
  mounted() {
    const projectId = this.$route.params.projectId
    this.getProjectInfo(projectId)
  },
  computed: {
    ...mapGetters(['graphData', 'projectInfo'])
  },
  methods: {
    ...mapActions(['getProjectInfo']),
    back() {
      this.$router.back()
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
        position: 'bottom-left'
      })
    }
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
