<template>
  <div class="container">
    <el-button
      v-for="option in options"
      size="medium"
      :key="option.label"
      :type="option.type"
      @click="buttonHandlerWrapper($event, option.handler)"
      >{{ option.label }}</el-button
    >
  </div>
</template>

<script>
import { buttonAutoBlur } from '@/common/utils'
import { mapActions } from 'vuex'

export default {
  name: 'GraphActions',
  data() {
    return {
      options: [
        {
          label: '新增实体',
          type: 'primary',
          handler: () => this.$emit('editor-action', 'createNode')
        },
        {
          label: '新增关系',
          type: 'primary',
          handler: () => this.$emit('editor-action', 'createLink')
        },
        {
          label: '重置缩放',
          type: 'danger',
          handler: () => this.$emit('graph-action', 'resetZoom')
        },
        {
          label: '全局刷新',
          type: 'danger',
          handler: () => this.$emit('graph-action', 'randomDisorder')
        },
        {
          label: '保存为 png',
          type: 'warning',
          handler: () => this.saveAsPng()
        },
        {
          label: '保存为 xml',
          type: 'warning',
          handler: () => this.exportXml()
        }
      ]
    }
  },
  methods: {
    ...mapActions(['saveAsPng', 'exportXml']),
    buttonHandlerWrapper(e, handler) {
      buttonAutoBlur(e)
      handler()
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.el-button {
  margin: unset;
  margin-bottom: 10px;
  width: 100%;
}
</style>
