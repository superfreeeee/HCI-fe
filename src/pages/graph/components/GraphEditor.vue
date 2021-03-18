<template>
  <div class="editor">
    <h4 v-if="!graphEditorItem">点击实体/关系查看细节</h4>
    <div v-else>
      <!-- 编辑器头部 -->
      <div class="header">
        <div class="left">
          <el-button
            type="text"
            size="small"
            icon="el-icon-arrow-left"
            @click="setEditor()"
            >返回</el-button
          >
          <h3>{{ graphEditorTitle }}</h3>
        </div>
        <el-button
          v-if="!graphEditorCreateNew"
          size="small"
          type="danger"
          icon="el-icon-delete"
          >删除{{ typeStr }}</el-button
        >
      </div>
      <!-- 实体/关系属性编辑 -->
      <el-form ref="editorItem" :model="item" label-width="80px">
        <el-form-item
          v-for="option in graphEditorOptions"
          :key="option.attr"
          :label="option.label"
        >
          <!-- 输入框 -->
          <el-input
            v-if="option.type === 'input'"
            :disabled="!graphEditorEditable"
            :placeholder="option.holder"
            v-model="item[option.attr]"
          ></el-input>
          <!-- 下拉框(source/target in link) -->
          <el-select
            v-else
            :disabled="!graphEditorEditable"
            :placeholder="option.holder"
            v-model="item[option.attr]"
          >
            <el-option
              v-for="node in graphNodes"
              :key="node.id"
              :label="node.name"
              :value="node.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 属性可选操作 -->
        <el-form-item class="options">
          <el-button type="primary" @click="primaryButton.handler">{{
            primaryButton.name
          }}</el-button>
          <el-button @click="alterButton.handler">{{
            alterButton.name
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { itemOptions, typeMapper } from '../../../common/editor'

export default {
  name: 'GraphEditor',
  data() {
    return {
      item: null,
      itemOptions
    }
  },
  computed: {
    ...mapGetters([
      'graphNodes',
      'graphEditorItem',
      'graphEditorType',
      'graphEditorTitle',
      'graphEditorOptions',
      'graphEditorCreateNew',
      'graphEditorEditable'
    ]),
    typeStr() {
      return typeMapper[this.graphEditorType]
    },
    primaryButton() {
      if (this.graphEditorCreateNew) {
        return {
          name: `新增${this.typeStr}`,
          handler: () => this.editorCreateCommit(this.item)
        }
      }
      if (!this.graphEditorEditable) {
        return {
          name: `点击修改`,
          handler: () => this.setEditorEditable(true)
        }
      } else {
        return {
          name: `确认修改`,
          handler: () => this.editorUpdateCommit(this.item)
        }
      }
    },
    alterButton() {
      return {
        name: this.graphEditorCreateNew ? '重置选项' : '取消修改',
        handler: !this.graphEditorEditable
          ? () => {}
          : this.graphEditorCreateNew
          ? this.resetItem
          : () =>
              this.editorSelect({
                type: this.graphEditorType,
                id: this.item.id
              })
      }
    }
  },
  watch: {
    graphEditorItem(item) {
      this.item = { ...item }
    }
  },
  methods: {
    ...mapMutations(['setEditor', 'setEditorEditable']),
    ...mapActions(['editorSelect', 'editorCreateCommit', 'editorUpdateCommit']),
    resetItem() {
      for (const prop in this.item) {
        this.item[prop] = ''
      }
    }
  },
  mounted() {
    this.setEditor()
  }
}
</script>

<style scoped>
.editor {
  padding: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header > .left {
  display: flex;
  gap: 16px;
}
</style>
