<template>
  <div>
    <div class="header">
      <el-button size="small" icon="el-icon-arrow-left" @click="back()"
        >返回</el-button
      >
      <h3 v-if="createNew">新增实体</h3>
      <h3 v-else>实体 ID：{{ nodeId }}</h3>
    </div>
    <el-form ref="node" :model="node" label-width="80px">
      <el-form-item
        v-for="option in options"
        :key="option.attr"
        :label="option.label"
      >
        <el-input :disabled="!panelEdit" v-model="node[option.attr]"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="primaryBtn.handler">{{
          primaryBtn.label
        }}</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'PanelNode',
  data() {
    return {
      options: [
        { label: '实体名称', attr: 'name' },
        { label: '实体类别', attr: 'group' },
        { label: '实体权重', attr: 'value' }
      ],
      nodeId: -1,
      node: {
        name: '',
        group: '',
        value: ''
      }
    }
  },
  mounted() {
    if (!this.createNew) {
      console.log(`panel node mounted, id = ${this.panelItem.id}`)
      this.overWriteNode(this.panelItem)
    } else {
      console.log(`panel node mounted, edit = ${this.panelEdit}`)
    }
  },
  computed: {
    ...mapGetters(['panelEdit', 'panelItem']),
    createNew() {
      return this.panelItem == null
    },
    primaryBtn() {
      if (this.createNew) {
        return {
          label: '确定新增',
          handler: this.create
        }
      }
      if (this.panelEdit) {
        return {
          label: '确认修改',
          handler: this.modify
        }
      }
      return {
        label: '点击修改',
        handler: () => {
          this.setPanelEdit(true)
        }
      }
    }
  },
  watch: {
    panelItem(node) {
      this.overWriteNode(node)
    }
  },
  methods: {
    ...mapMutations(['setPanelContentType', 'setPanelEdit']),
    overWriteNode(node) {
      this.node = { ...node }
      this.nodeId = node.id
    },
    checkSave() {},
    back() {
      this.setPanelContentType('')
    },
    modify() {
      console.log('modify')
      this.setPanelEdit(false)
    },
    create() {
      console.log('create')
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
