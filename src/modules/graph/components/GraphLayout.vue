<template>
  <div class="container">
    <el-button
      v-for="action in actions"
      :key="action.label"
      :type="action.type"
      size="medium"
      round
      @click="buttonHandlerWrapper($event, action.handler)"
      >{{ action.label }}</el-button
    >
  </div>
</template>

<script>
import { buttonAutoBlur } from '@/common/utils'

export default {
  name: 'GraphLayout',
  data() {
    return {
      actions: [
        {
          label: '力导图模式',
          type: 'primary',
          handler: () => this.$emit('graph-action', 'switchLayout', 'FORCE')
        },
        {
          label: '排版模式',
          type: 'danger',
          handler: () => this.$emit('graph-action', 'switchLayout', 'GRID')
        },
        {
          label: '定点模式',
          type: 'warning',
          handler: () => this.$emit('graph-action', 'switchLayout', 'FIXED')
        },
        {
          label: '保存布局',
          type: 'info',
          handler: () => this.$emit('graph-action', 'saveLayout')
        },
        {
          label: '恢复布局',
          type: 'info',
          handler: () => this.$emit('graph-action', 'restoreLayout')
        }
      ]
    }
  },
  methods: {
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
