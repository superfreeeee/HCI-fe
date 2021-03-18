<template>
  <div class="graph">
    <div class="main">
      <div class="title">
        <el-button round type="text" icon="el-icon-arrow-left" @click="back()"
          >返回</el-button
        >
        <span>知识图谱：项目-{{ graphData.projectId }}</span>
      </div>
      <graph-board ref="board"></graph-board>
      <graph-options @graph-action="actionDispatch"></graph-options>
    </div>
    <div :class="['panel', showPanel ? 'open' : 'close']">
      <graph-editor></graph-editor>
    </div>
    <el-button
      @click="showPanel = !showPanel"
      :icon="`el-icon-arrow-${showPanel ? 'right' : 'left'}`"
    ></el-button>
  </div>
</template>

<script>
import GraphBoard from './components/GraphBoard'
import GraphOptions from './components/GraphOptions'
import GraphEditor from './components/GraphEditor'
import { mapGetters } from 'vuex'

export default {
  name: 'Graph',
  components: {
    GraphBoard,
    GraphOptions,
    GraphEditor
  },
  data() {
    return {
      showPanel: true
    }
  },
  computed: {
    ...mapGetters(['graphData'])
  },
  methods: {
    back() {
      this.$router.back()
    },
    actionDispatch(name, ...args) {
      this.$refs.board[name](...args)
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
  top: 40px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 0px slategray;
  background-color: #ffffff;
  padding-right: 15px;
  height: 40px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.graph > .panel {
  border-left: 1px solid #bbbbbb;
  box-sizing: border-box;
  transition: width 1s ease-out;
}
.graph > .panel.open {
  width: 350px;
}
.graph > .panel.close {
  width: 0;
}
</style>
