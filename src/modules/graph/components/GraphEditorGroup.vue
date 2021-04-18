<template>
  <div>
    <h4>实体类型</h4>
    <el-checkbox
      :indeterminate="isIndeterminate"
      :value="checkAll"
      @change="changeAll"
      >全选</el-checkbox
    >
    <el-checkbox-group :value="graphBoardGroups">
      <el-checkbox
        v-for="group in graphNodeGroups"
        :key="group"
        :label="group"
        @change="changeSingle(group)"
        >{{ group }}</el-checkbox
      >
    </el-checkbox-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'GraphEditorGroup',
  computed: {
    ...mapGetters(['graphBoardGroups', 'graphNodeGroups']),
    checkAll() {
      const { graphBoardGroups, graphNodeGroups } = this
      return graphBoardGroups.length === graphNodeGroups.length
    },
    isIndeterminate() {
      const { graphBoardGroups, checkAll } = this
      return graphBoardGroups.length > 0 && !checkAll
    }
  },
  methods: {
    ...mapMutations(['setGraphBoardGroups']),
    changeAll(bool) {
      const { setGraphBoardGroups, graphNodeGroups } = this
      const groups = bool ? graphNodeGroups : []
      setGraphBoardGroups(groups)
    },
    changeSingle(group) {
      const groups = [...this.graphBoardGroups]
      if (groups.indexOf(group) >= 0) {
        groups.splice(groups.indexOf(group), 1)
      } else {
        groups.push(group)
      }
      this.setGraphBoardGroups(groups)
    }
  }
}
</script>

<style scoped>
h4 {
  display: inline-block;
  margin-right: 10px;
}
</style>
