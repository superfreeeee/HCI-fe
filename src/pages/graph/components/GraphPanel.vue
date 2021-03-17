<template>
  <div>
    <h4 v-if="panelContentType === ''">点击实体/关系查看细节</h4>
    <div v-else>
      <div class="header">
        <el-button size="small" icon="el-icon-arrow-left" @click="back()"
          >返回</el-button
        >
        <h3>{{ title }}</h3>
      </div>
      <el-form ref="item" :model="item" label-width="80px">
        <el-form-item
          v-for="option in options"
          :key="option.attr"
          :label="option.label"
        >
          <el-input
            :disabled="!panelEdit"
            :placeholder="option.holder"
            v-model="item[option.attr]"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="primaryBtn.handler">{{
            primaryBtn.label
          }}</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'GraphPanel',
  data() {
    return {
      nodeOptions: [
        { label: '实体名称', attr: 'name', holder: '实体名称' },
        { label: '实体类别', attr: 'group', holder: '实体类别' },
        { label: '实体权重', attr: 'radius', holder: '1~100' }
      ],
      relationOptions: [
        { label: '关系名称', attr: 'name', holder: '关系名称' },
        { label: '关系实体1', attr: 'from', holder: 'ID' },
        { label: '关系实体2', attr: 'to', holder: 'ID' },
        { label: '关系权重', attr: 'value', holder: '1~100' }
      ],
      item: {
        name: '',
        group: '',
        value: ''
      }
    }
  },
  mounted() {
    if (!this.panelCreateNew) {
      this.overWriteItem(this.panelItem)
    }
  },
  computed: {
    ...mapGetters([
      'panelContentType',
      'panelEdit',
      'panelItem',
      'panelCreateNew'
    ]),
    title() {
      const type = this.panelContentType === 'node' ? '实体' : '关系'
      if (this.panelCreateNew) {
        return `新增${type}`
      } else {
        return `${type} ID：${this.item.id}`
      }
    },
    options() {
      return this[`${this.panelContentType}Options`]
    },
    primaryBtn() {
      if (this.panelCreateNew) {
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
    panelItem(item) {
      this.overWriteItem(item)
    }
  },
  methods: {
    ...mapMutations(['setPanelContentType', 'setPanelEdit']),
    overWriteItem(item) {
      this.item = { ...item }
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
