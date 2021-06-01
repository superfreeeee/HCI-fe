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
      <el-tab-pane label="图谱问答">图谱问答</el-tab-pane>
      <el-tab-pane label="实体查询">实体查询</el-tab-pane>
      <el-tab-pane label="关系查询">关系查询</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
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
</style>
