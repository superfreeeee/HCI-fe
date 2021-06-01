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
      type="border-card"
      style="height: 100%"
    >
      <el-tab-pane label="图谱问答">
        <GraphDialogue />
      </el-tab-pane>
      <el-tab-pane label="实体查询">
        <EntityQuery />
      </el-tab-pane>
      <el-tab-pane label="关系查询">
        <RelationQuery />
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
    }
  },
  methods: {
    goback() {
      this.$router.back()
    },
  },
}
</script>

<style>
.smartbox {
  width: calc(100vw - 40px);
  height: calc(90vh - 40px);
  padding: 20px;
}
.el-tabs--border-card > .el-tabs__content {
  height: calc(100% - 30px);
}
.el-tabs--border-card > .el-tabs__content > .el-tab-pane {
  height: 100%;
}
</style>
