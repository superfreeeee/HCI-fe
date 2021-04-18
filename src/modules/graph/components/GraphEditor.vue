<template>
  <div class="editor">
    <el-autocomplete
      placeholder="搜索实体（输入 id / 实体名称）"
      :fetch-suggestions="queryNodes"
      v-model="searchNodeName"
      @select="searchNode"
      style="width: 100%"
      ref="searchInput"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchNode"
      ></el-button>
    </el-autocomplete>
    <h4 v-if="!graphEditorItem">点击实体/关系查看细节</h4>
    <div v-else>
      <!-- 编辑器头部 -->
      <div class="header">
        <div class="left">
          <el-button
            type="text"
            size="small"
            icon="el-icon-arrow-left"
            @click="editorSelect({ type: 'cancel' })"
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
          <!-- 下拉框(source/target in link) -->
          <div v-if="option.type === 'select'">
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
          <div v-else-if="option.type === 'color'">
            <el-radio-group
              :disabled="!graphEditorEditable"
              v-model="useGroupColor"
            >
              <el-radio :label="true" style="margin-bottom: 10px"
                >按默认分组颜色</el-radio
              >
              <el-radio :label="false">自定义颜色</el-radio>
            </el-radio-group>
            <el-input
              style="padding-top: 10px"
              v-if="!useGroupColor"
              type="color"
              :disabled="!graphEditorEditable"
              v-model="graphEditorItem[option.attr]"
            ></el-input>
          </div>
          <!-- 选择组别 -->
          <el-autocomplete
            v-else-if="option.attr === 'group'"
            clearable
            :disabled="!graphEditorEditable"
            :fetch-suggestions="queryGroup"
            :placeholder="option.holder"
            v-model="graphEditorItem[option.attr]"
          ></el-autocomplete>
          <!-- 其他输入框 -->
          <el-input
            v-else
            clearable
            :type="option.type"
            :disabled="!graphEditorEditable"
            :placeholder="option.holder"
            v-model="graphEditorItem[option.attr]"
          ></el-input>
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
import { typeMapper } from '../utils/item'
import { $notify } from '@/common/utils'

export default {
  name: 'GraphEditor',
  data() {
    return {
      searchNodeName: '',
      useGroupColor: false
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
      'graphEditorEditable',
      'graphEditorNodeGroups',
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
    },
    graphNodesOption() {
      const options = this.graphNodes.map(({ id, name }) => ({
        id,
        value: `${id}：${name}`
      }))
      options.sort(({ id: x }, { id: y }) => x - y)
      return options
    }
  },
  watch: {
    graphEditorItem(item) {
      const color = item == null ? '' : item.color
      this.useGroupColor = !color
    },
    useGroupColor(bool) {
      if (bool && this.graphEditorItem) {
        this.graphEditorItem.color = ''
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
    queryNodes(inputName, cb) {
      const { graphNodesOption } = this
      let inputId = inputName
      if (inputName.indexOf('：') >= 0) {
        inputName = inputName.substring(inputName.indexOf('：') + 1)
        inputId = inputName.substring(0, inputName.indexOf('：'))
      }
      const suggestNodes = inputName
        ? graphNodesOption.filter(({ value }) => {
            const [id, name] = value.toLowerCase().split('：')
            return id.indexOf(inputId) === 0 || name.indexOf(inputName) === 0
          })
        : graphNodesOption
      return cb(suggestNodes)
    },
    searchNode() {
      const { searchNodeName, editorSelect } = this
      if (searchNodeName.indexOf('：') >= 0 || !isNaN(Number(searchNodeName))) {
        const [id] = searchNodeName.split('：')
        editorSelect({ type: 'node', id: Number(id) })
      } else {
        $notify({
          title: '请从搜索推荐内选择实体',
          type: 'warning'
        })
      }
      this.$refs.searchInput.activated = false
    },
    queryGroup(inputGroup, cb) {
      const { graphEditorNodeGroups } = this
      const suggestGroups = inputGroup
        ? graphEditorNodeGroups.filter(
            group => group.toLowerCase().indexOf(inputGroup.toLowerCase()) === 0
          )
        : graphEditorNodeGroups
      return cb(suggestGroups.map(group => ({ value: group })))
    },
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
