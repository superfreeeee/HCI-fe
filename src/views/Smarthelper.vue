<template>
  <div class="smartbox">
    <el-button
      circle
      icon="el-icon-arrow-left"
      style="margin-bottom: 15px"
      @click="goback()"
    ></el-button>
    <el-tabs
      :tab-position="tabPosition"
      :before-leave="tabClick"
      :value="graphDialogueName"
      type="border-card"
      style="height: 100%"
    >
      <el-tab-pane label="图谱问答" :name="graphDialogueName">
        <GraphDialogue v-if="show.graphDialogue" />
      </el-tab-pane>
      <el-tab-pane label="实体查询" :name="entityQueryName">
        <EntityQuery v-if="show.entityQuery" />
      </el-tab-pane>
      <el-tab-pane label="关系查询" :name="relationQueryName">
        <RelationQuery v-if="show.relationQuery" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GraphDialogue from '../modules/smart/components/GraphDialogue.vue'
import EntityQuery from '../modules/smart/components/EntityQuery.vue'
import RelationQuery from '../modules/smart/components/RelationQuery'

export default {
  components: {
    GraphDialogue,
    EntityQuery,
    RelationQuery,
  },
  name: 'Smarthelper',
  data() {
    return {
      tabPosition: 'left',
      graphDialogueName: 'graphDialogue',
      entityQueryName: 'entityQuery',
      relationQueryName: 'relationQuery',
      show: {
        graphDialogue: true,
        entityQuery: false,
        relationQuery: false,
      },
    }
  },
  methods: {
    goback() {
      this.$router.back()
    },
    tabClick(activeName, oldActiveName) {
      console.log(activeName, oldActiveName)
      this.show[activeName] = true
      this.show[oldActiveName] = false
    },
  },
}
</script>

<style>
.smartbox {
  width: calc(100vw - 40px);
  height: calc(90vh - 40px);
  padding: 20px;
  background-color: #fdfcf8;
}
.el-tabs--border-card > .el-tabs__content {
  height: calc(100% - 30px);
}
.el-tabs--border-card > .el-tabs__content > .el-tab-pane {
  height: 100%;
}
</style>
