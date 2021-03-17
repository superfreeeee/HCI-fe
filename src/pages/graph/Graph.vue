<template>
  <div class="home">
    <div class="graph">
      <graph-show />
      <div class="options">
        <h3>图谱操作</h3>
        <el-button
          v-for="option in options"
          size="medium"
          :key="option.label"
          :type="option.type"
          @click="option.handler"
          >{{ option.label }}</el-button
        >
      </div>
    </div>
    <div class="panel" :style="{ width: showPanel ? '350px' : '0' }">
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
      options: [
        {
          label: '新增实体',
          type: 'primary',
          handler: () => this.panelCreate({ type: 'node' })
        },
        {
          label: '新增关系',
          type: 'primary',
          handler: () => this.panelCreate({ type: 'relation' })
        },
        {
          label: '回到中央',
          type: 'info',
          handler: () => this.graphZoomReset(this.$d3)
        },
        {
          label: '固定节点',
          type: 'danger',
          handler: () => this.setGraphPinned(true)
        },
        {
          label: '取消固定',
          type: 'danger',
          handler: () => this.setGraphPinned(false)
        },
        {
          label: '保存为 png',
          type: 'warning',
          handler: () => this.graphToPng()
        },
        {
          label: '保存为 xml',
          type: 'warning',
          handler: () => this.graphToXml()
        }
      ],
      showPanel: true,
      projectId: ''
    }
  },
  methods: {
    ...mapMutations(['setProjectId', 'setGraphPinned']),
    ...mapActions([
      'panelCreate',
      'graphZoomReset',
      'graphToPng',
      'graphToXml'
    ]),
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
  position: relative;
}

.home > .graph > .options {
  padding: 5px;
  border: 1px groove;
  background-color: #ffffff;
  border-right: none;
  position: absolute;
  top: 50px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.options > h3 {
  text-align: center;
  margin: 0;
}

.home > .panel {
  border-left: 2px solid #bbbbbb;
  width: 0;
  box-sizing: border-box;
  transition: width 1s ease-out;
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
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  border-bottom: 1px groove;
  margin-bottom: -10px;
  overflow: auto;
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
