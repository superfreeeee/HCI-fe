<template>
  <div>
    <div class="header">
      <el-button size="small" icon="el-icon-arrow-left" @click="$emit('back')"
        >返回</el-button
      >
      <h3>新增关系</h3>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item
        v-for="option in options"
        :key="option.attr"
        :label="option.label"
      >
        <el-input :disabled="!panelEdit" v-model="node[option.attr]"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">确定新增</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PanelRelation',
  data() {
    return {
      options: [
        { label: '关系名称', attr: 'name' },
        { label: '关系实体1', attr: 'source' },
        { label: '关系实体2', attr: 'target' },
        { label: '关系权重', attr: 'value' }
      ],
      relation: {
        name: '',
        source: '',
        target: '',
        value: ''
      }
    }
  },
  computed: {
    ...mapGetters(['panelEdit'])
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
