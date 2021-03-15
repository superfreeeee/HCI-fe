<template>
  <div>
    <div class="header">
      <el-button size="small" icon="el-icon-arrow-left" @click="$emit('back')">返回</el-button>
      <h3>新增关系</h3>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="关系名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="关系实体1">
        <el-input v-model="form.source"></el-input>
      </el-form-item>
      <el-form-item label="关系实体2">
        <el-input v-model="form.target"></el-input>
      </el-form-item>
      <el-form-item label="关系权重">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">确定新增</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PanelNewNode',
  data() {
    return {
      form: {
        name: '',
        group: '',
        value: ''
      }
    }
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
