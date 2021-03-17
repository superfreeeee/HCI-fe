<template>
  <div class="home">
    <div class="graph">
      <graph-show />
    </div>
    <div class="panel" :style="{ width: showPanel ? '300px' : '0' }">
      <div class="upper">
        <el-button
          type="primary"
          size="medium"
          @click="panelCreate({ type: 'node' })"
          >新增实体</el-button
        >
        <el-button
          type="info"
          size="medium"
          @click="panelCreate({ type: 'relation' })"
          >新增关系</el-button
        >
      </div>
      <div class="lower">
        <el-input
          placeholder="请输入 projectId"
          prefix-icon="el-icon-search"
          v-model="projectId"
          change="getGraph()"
        >
        </el-input>
        <graph-panel></graph-panel>
      </div>
    </div>
    <!-- <el-button @click="showPanel = !showPanel" icon="el-icon-arrow-left"></el-button> -->
    <el-button
      @click="showPanel = !showPanel"
      :icon="`el-icon-arrow-${showPanel ? 'right' : 'left'}`"
    ></el-button>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import GraphPanel from './components/GraphPanel'
import GraphShow from './components/GraphShow.vue'

export default {
  components: {
    GraphShow,
    GraphPanel
  },
  data() {
    return {
      showPanel: true,
      projectId: ''
    }
  },
  computed: {
  },
  methods: {
    ...mapMutations(['setProjectId']),
    ...mapActions(['panelCreate']),
    getGraph() {
      setProjectId(this.projectId)
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

.home > .graph {
  flex: 1;
}

.home > .panel {
  border-left: 2px solid #bbbbbb;
  width: 0;
  box-sizing: border-box;
  transition: width 1s ease-in-out;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  overflow: hidden;
}

.panel > .arrow {
  height: 30px;
  width: 10px;
  display: grid;
  place-content: center;
  cursor: pointer;
  border: 1px solid black;
  box-sizing: border-box;
  position: absolute;
  left: -10px;
  top: calc(50vh - 15px);
}

.home > .panel > .upper {
  padding: 16px;
  display: flex;
  justify-content: space-evenly;
  border-bottom: 1px groove;
}

/* .home > .panel > .upper >.quarter {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
} */

.home > .panel > .lower {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
}

.el-button {
  margin: 0;
}
</style>
