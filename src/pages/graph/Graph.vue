<template>
  <div class="home">
    <div class="graph">
      <div class="title">
        <el-button round type="text" icon="el-icon-arrow-left" @click="back"
          >返回</el-button
        >
        <span>知识图谱：项目-{{ projectId }}</span>
      </div>
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
      <!-- <el-input
        label="查找实体"
        placeholder="输入实体 ID"
        prefix-icon="el-icon-search"
        v-model="searchNode"
      >
        @change="getGraph()"
      </el-input> -->
      <graph-panel></graph-panel>
    </div>
    <el-button
      @click="showPanel = !showPanel"
      :icon="`el-icon-arrow-${showPanel ? 'right' : 'left'}`"
    ></el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
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
      showPanel: true
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  methods: {
    ...mapMutations(['setProjectId', 'setGraphPinned']),
    ...mapActions([
      'panelCreate',
      'graphZoomReset',
      'graphToPng',
      'graphToXml'
    ]),
    back() {
      this.$router.back()
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

.graph > .title {
  position: absolute;
  left: 50px;
  top: 50px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 0px slategray;
  padding-right: 15px;
  height: 40px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
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
  box-sizing: border-box;
  padding: 16px;
  transition: width 1s ease-out;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  overflow: hidden;
}

.el-button {
  margin: 0;
}
</style>
