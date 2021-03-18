<template>
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
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'GraphOptions',
  data() {
    return {
      options: [
        {
          label: '新增实体',
          type: 'primary',
          handler: () => this.editorCreate('node')
        },
        {
          label: '新增关系',
          type: 'primary',
          handler: () => this.editorCreate('link')
        },
        {
          label: '批量新增',
          type: 'primary',
          handler: () => {}
        },
        {
          label: '重置缩放',
          type: 'info',
          handler: () => this.$emit('graph-action', 'zoomReset')
        },
        {
          label: '全局刷新',
          type: 'info',
          handler: () => this.$emit('graph-action', 'backCenter')
        },
        {
          label: '固定实体',
          type: 'danger',
          handler: () => this.$emit('graph-action', 'pinNodes')
        },
        {
          label: '取消固定',
          type: 'danger',
          handler: () => this.$emit('graph-action', 'unPinNodes')
        },
        {
          label: '保存为 png',
          type: 'warning',
          handler: () => this.saveAsPng()
        },
        {
          label: '保存为 xml',
          type: 'warning',
          handler: () => this.saveAsXml()
        }
      ]
    }
  },
  methods: {
    ...mapActions(['editorCreate', 'saveAsPng', 'saveAsXml'])
  }
}
</script>

<style scoped>
.options {
  background-color: #ffffff;
  padding: 5px;
  border: 1px groove;
  border-right: none;
  position: absolute;
  top: 50px;
  right: 0;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 5px;
}
h3 {
  text-align: center;
  margin: 0;
}
.el-button {
  margin: 0;
}
</style>
