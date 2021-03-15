<template>
  <div class="home">
    <div class="graph">
      <d-3-sample/>
    </div>
    <div class="panel" :style="{width : showPanel ? '300px' : '0'}">
      <div class="upper">
        <div class="quarter">
          <el-button type="primary" round size="mini" @click="setInsertDialogVisible(true)">增加实体</el-button>
          <el-button type="primary" round size="mini">增加关系</el-button>
        </div>
        <div class="quarter">
          <el-button type="danger" round size="mini" @click="setDeleteDialogVisible(true)">删除实体</el-button>
          <el-button type="danger" round size="mini">删除关系</el-button>
        </div>
        <div class="quarter">
          <el-button type="success" round size="mini" @click="setModifyDialogVisible(true)">修改实体</el-button>
          <el-button type="success" round size="mini">修改关系</el-button>
        </div>
        <div class="quarter">
          <el-button type="warning" round size="mini" @click="setSearchDialogVisible(true)">查询实体</el-button>
          <el-button type="warning" round size="mini">查询关系</el-button>
        </div>
      </div>
      <div class="lower">
        <el-input
            placeholder="请输入 projectID"
            prefix-icon="el-icon-search"
            v-model="projectID"
            change="getGraph()">
        </el-input>
      </div>
    </div>
    <el-button @click="/* showPanel = !showPanel */" icon="el-icon-arrow-left"></el-button>
    <InsertEntityDialog />
    <DeleteEntityDialog />
    <ModifyEntityDialog />
    <SearchEntityDialog />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import D3Sample from './components/D3Sample'
import InsertEntityDialog from './components/InsertEntityDialog'
import DeleteEntityDialog from './components/DeleteEntityDialog'
import ModifyEntityDialog from './components/ModifyEntityDialog'
import SearchEntityDialog from './components/SearchEntityDialog'

export default {
  components: {
    D3Sample,
    InsertEntityDialog,
    DeleteEntityDialog,
    ModifyEntityDialog,
    SearchEntityDialog
  },
  data () {
    return {
      showPanel: true,
      projectID: '',
    }
  },
  methods: {
    ...mapMutations([
      'setInsertDialogVisible',
      'setDeleteDialogVisible',
      'setModifyDialogVisible',
      'setSearchDialogVisible',
      'setProjectID',
    ]),
    getGraph() {
      setProjectID(this.projectID)
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
  position: relative;
  box-sizing: border-box;
  transition: width 1s ease-in-out;
}

.panel > .arrow{
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

.panel > .arrow::after {
  content: "<";
  font-weight: 600;
  transform: scaleY(2);
  top: 0;
}

.home > .panel > .upper {
  height: 250px;
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px groove;
}

.home > .panel > .upper >.quarter {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.home > .panel > .lower {
  height: calc(100vh - 251px);
}

.el-button {
  margin: 0;
}
</style>