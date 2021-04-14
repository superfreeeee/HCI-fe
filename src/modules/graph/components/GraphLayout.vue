<template>
  <div class="layout">
    <h3>布局设置</h3>
    <div class="modes">
      <el-button
        v-for="mode in modes"
        :key="mode.label"
        :type="mode.type"
        :plain="mode.mode !== graphBoardMode"
        size="large"
        @click="switchMode($event, mode)"
        >{{ mode.label }}</el-button
      >
    </div>
    <div class="actions">
      <el-button
        v-for="action in actions"
        :key="action.label"
        size="medium"
        type="info"
        round
        @click="action.handler"
        >{{ action.label }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { buttonAutoBlur } from '@/common/utils'
import { layoutModes } from '../utils/layout'

export default {
  name: 'GraphLayout',
  data() {
    return {
      modes: layoutModes,
      actions: [
        {
          label: '保存布局',
          handler: () => this.saveLayout()
        },
        {
          label: '恢复布局',
          handler: () => this.restoreLayout()
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['graphBoardMode'])
  },
  methods: {
    ...mapActions(['switchLayoutMode', 'saveLayout', 'restoreLayout']),
    switchMode(e, { mode }) {
      buttonAutoBlur(e)
      if (mode !== this.graphBoardMode) {
        this.switchLayoutMode(mode)
      }
    }
  }
}
</script>

<style scoped>
.layout {
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 0;
  padding: 0 5px 5px;
  transform: translate(-50%, 0);
  border: 1px groove;
  border-top: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
h3 {
  position: sticky;
  top: 0;
  background-color: #fff;
  text-align: center;
  padding-top: 5px;
  margin: 0;
  border-bottom: 1px solid #bbbbbb;
}
.modes {
  display: flex;
  justify-content: center;
  /* gap: 5px; */
  cursor: pointer;
}
.actions {
  display: flex;
  justify-content: center;
}
.actions > * {
  flex: 1;
}
</style>
