<template>
  <div class="editor">
    <!-- 图谱搜索框 -->
    <!-- <graph-editor-search></graph-editor-search> -->

    <!-- 选取查看组别 -->
    <!-- <graph-editor-group></graph-editor-group> -->
    <el-divider></el-divider>

    <h4 v-if="true">点击实体/关系查看细节</h4>
    <!-- <h4 v-if="!graphEditorItem">点击实体/关系查看细节</h4> -->
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
          <!-- 选颜色 -->
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
    <el-divider></el-divider>
    <!-- 图谱统计数据 -->
    <graph-editor-statistics :statisticsData="statisticsData" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { typeMapper } from '../utils/item'
import GraphEditorSearch from './GraphEditorSearch'
import GraphEditorGroup from './GraphEditorGroup'
import GraphEditorStatistics from './GraphEditorStatistics'

export default {
  name: 'GraphEditor',
  components: {
    GraphEditorSearch,
    GraphEditorGroup,
    GraphEditorStatistics
  },
  props: {
    graphData: {
      type: Object,
      default: () => ({})
    },
    nodesScale: {
      type: Function
    }
  },
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
      'graphNodeGroups',
      'graphEditorSelect'
    ]),
    statisticsData() {
      const nodes = this.graphData && this.graphData.nodes
      const nodesScale = this.nodesScale
      if (!nodes || !nodesScale) return []

      const dataMapper = {}
      nodes.forEach(({ group }) => {
        if (!Reflect.has(dataMapper, group)) {
          dataMapper[group] = 0
        }
        dataMapper[group]++
      })
      const data = Reflect.ownKeys(dataMapper).map(group => ({
        name: group,
        value: dataMapper[group],
        itemStyle: {
          color: nodesScale(group)
        }
      }))
      data.sort(({ name: x }, { name: y }) => (x < y ? -1 : x === y ? 0 : 1))
      return data
    },
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
    queryGroup(inputGroup, cb) {
      const { graphNodeGroups } = this
      const suggestGroups = inputGroup
        ? graphNodeGroups.filter(
            group => group.toLowerCase().indexOf(inputGroup.toLowerCase()) === 0
          )
        : graphNodeGroups
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
