<template>
  <div class="home">
    <div class="graph">
      <d-3-sample />
    </div>
    <div class="panel" :style="{ width: showPanel ? '300px' : '0' }">
      <div class="upper">
        <el-button
          type="primary"
          round
          size="medium"
          @click="panel = 'panel-new-node'"
          >新增实体</el-button
        >
        <el-button
          type="primary"
          round
          size="medium"
          @click="panel = 'panel-new-relation'"
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
        <h4 v-if="panel === ''">点击实体/关系查看细节</h4>
        <component :is="panel" @back="panel = ''"></component>
        <div>
          <el-button @click="setInsertDialogVisible(true)">A</el-button>
          <el-button @click="setDeleteDialogVisible(true)">B</el-button>
          <el-button @click="setModifyDialogVisible(true)">C</el-button>
          <el-button @click="setSearchDialogVisible(true)">D</el-button>
        </div>
      </div>
    </div>
    <insert-entity-dialog></insert-entity-dialog>
    <delete-entity-dialog></delete-entity-dialog>
    <modify-entity-dialog></modify-entity-dialog>
    <search-entity-dialog></search-entity-dialog>
    <!-- <el-button @click="showPanel = !showPanel" icon="el-icon-arrow-left"></el-button> -->
    <el-button
      @click="showPanel = !showPanel"
      :icon="`el-icon-arrow-${showPanel ? 'right' : 'left'}`"
    ></el-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import D3Sample from './components/D3Sample'
import InsertEntityDialog from './components/InsertEntityDialog'
import DeleteEntityDialog from './components/DeleteEntityDialog'
import ModifyEntityDialog from './components/ModifyEntityDialog'
import SearchEntityDialog from './components/SearchEntityDialog'
import PanelNewNode from './components/PanelNewNode'
import PanelNewRelation from './components/PanelNewRelation'

export default {
  components: {
    D3Sample,
    InsertEntityDialog,
    DeleteEntityDialog,
    ModifyEntityDialog,
    SearchEntityDialog,
    PanelNewNode,
    PanelNewRelation
  },
  data() {
    return {
      showPanel: true,
      projectId: '',
      panel: 'panel-new-node'
    }
  },
  methods: {
    ...mapMutations([
      'setInsertDialogVisible',
      'setDeleteDialogVisible',
      'setModifyDialogVisible',
      'setSearchDialogVisible',
      'setProjectId'
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
