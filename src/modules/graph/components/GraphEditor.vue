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
          @click="editorDeleteCommit()"
          >删除{{ typeStr }}</el-button
        >
      </div>
      <!-- 实体/关系属性编辑 -->
      <el-form ref="editorItem" :model="graphEditorItem" label-width="80px">
        <el-form-item
          v-for="option in graphEditorOptions"
          :key="option.attr"
          :label="option.label"
        >
          <!-- 输入框 -->
          <el-input
            v-if="option.type === 'input'"
            clearable
            :disabled="!graphEditorEditable"
            :placeholder="option.holder"
            v-model="graphEditorItem[option.attr]"
          ></el-input>
          <!-- 下拉框(source/target in link) -->
          <div v-else>
            <el-select
              clearable
              :disabled="!graphEditorEditable"
              :placeholder="option.holder"
              v-model="graphEditorItem[option.attr]"
              style="width: 170px"
            >
              <el-option
                v-for="node in graphNodes"
                :key="node.id"
                :label="node.name"
                :value="node.id"
              ></el-option>
            </el-select>
            <el-button
              title="点击选择目标节点"
              :disabled="!graphEditorEditable"
              :icon="
                graphEditorSelect === option.attr
                  ? 'el-icon-close'
                  : 'el-icon-thumb'
              "
              @click="setEditorSelect(option.attr)"
              @blur="setEditorSelect('')"
            ></el-button>
          </div>
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
import { typeMapper } from '../utils/editor'

export default {
  name: 'GraphEditor',
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'graphNodes',
      'graphEditorItem',
      'graphEditorType',
      'graphEditorTitle',
      'graphEditorOptions',
      'graphEditorCreateNew',
      'graphEditorEditable',
      'graphEditorSelect'
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
                id: this.graphEditorItem.id
              })
      }
    }
  },
  methods: {
    ...mapMutations([
      'setEditor',
      'setEditorEditable',
      'setEditorSelect',
      'setEditorItem'
    ]),
    ...mapActions([
      'editorSelect',
      'editorCreateCommit',
      'editorUpdateCommit',
      'editorDeleteCommit'
    ]),
    resetItem() {
      const item = {}
      this.graphEditorOptions.forEach(({ attr }) => {
        item[attr] = ''
      })
      this.setEditorItem(item)
    },
    deleteCommit() {
      this.setEditor()
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
