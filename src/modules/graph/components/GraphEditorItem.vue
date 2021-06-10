<template>
  <div>
    <h4 v-if="!selectedItem.type">点击实体/关系查看细节</h4>
    <div v-else>
      <!-- 编辑器头部 -->
      <div class="header">
        <div class="left">
          <el-button
            type="text"
            size="small"
            icon="el-icon-arrow-left"
            @click="selectNone"
            >返回</el-button
          >
          <h3>{{ editorTitle }}</h3>
        </div>
        <el-button
          v-if="!createNew"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="deleteItem"
          >删除{{ typeStr }}</el-button
        >
      </div>
      <!-- 实体编辑 -->
      <el-form
        v-if="selectedItem.type === 'node'"
        ref="editorItem"
        :model="selectedItem.item"
        label-width="80px"
      >
        <el-form-item label="实体名称">
          <el-input
            clearable
            :disabled="!editable"
            placeholder="实体名称"
            v-model="selectedItem.item.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="实体类别">
          <el-autocomplete
            clearable
            :disabled="!editable"
            :fetch-suggestions="queryGroup"
            placeholder="输入/选择实体类别"
            v-model="selectedItem.item.group"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="实体权重">
          <el-input
            clearable
            :disabled="!editable"
            placeholder="1~20"
            v-model="selectedItem.item.radius"
          ></el-input>
        </el-form-item>
        <el-form-item label="实体颜色">
          <div>
            <el-radio-group :disabled="!editable" v-model="useGroupColor">
              <el-radio :label="true" style="margin-bottom: 10px"
                >按默认分组颜色</el-radio
              >
              <el-radio :label="false">自定义颜色</el-radio>
            </el-radio-group>
            <el-input
              style="padding-top: 10px"
              v-if="!useGroupColor"
              type="color"
              :disabled="!editable"
              v-model="selectedItem.item.color"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="实体形状">
          <el-input
            clearable
            :disabled="!editable"
            placeholder="实体形状"
            v-model="selectedItem.item.figure"
          ></el-input>
        </el-form-item>
        <el-form-item label="字体大小">
          <el-input
            clearable
            :disabled="!editable"
            placeholder="单位 px"
            v-model="selectedItem.item.textSize"
          ></el-input>
        </el-form-item>
        <el-form-item class="options">
          <el-button type="primary" @click="primaryButton.handler">{{
            primaryButton.label
          }}</el-button>
          <el-button v-if="editable" @click="alterButton.handler">{{
            alterButton.label
          }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 关系编辑 -->
      <el-form
        v-if="selectedItem.type === 'link'"
        ref="editorItem"
        :model="selectedItem.item"
        label-width="80px"
      >
        <el-form-item label="关系名称">
          <el-input
            clearable
            :disabled="!editable"
            placeholder="关系名称"
            v-model="selectedItem.item.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="关系实体1">
          <div>
            <el-select
              clearable
              :disabled="!editable"
              placeholder="实体名称"
              v-model="selectedItem.item.from"
              style="width: 170px"
            >
              <el-option
                v-for="node in options.nodeOptions"
                :key="node.id"
                :label="node.name"
                :value="node.id"
              ></el-option>
            </el-select>
            <!-- <el-button
              title="点击选择目标节点"
              :disabled="!editable"
              :icon="
                graphEditorSelect === option.attr
                  ? 'el-icon-close'
                  : 'el-icon-thumb'
              "
              @click="setEditorSelect(option.attr)"
              @blur="setEditorSelect('')"
            ></el-button> -->
          </div>
        </el-form-item>
        <el-form-item label="关系实体2">
          <div>
            <el-select
              clearable
              :disabled="!editable"
              placeholder="实体名称"
              v-model="selectedItem.item.to"
              style="width: 170px"
            >
              <el-option
                v-for="node in options.nodeOptions"
                :key="node.id"
                :label="node.name"
                :value="node.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="关系权重">
          <el-input
            clearable
            :disabled="!editable"
            placeholder="1~20"
            v-model="selectedItem.item.value"
          ></el-input>
        </el-form-item>
        <el-form-item class="options">
          <el-button type="primary" @click="primaryButton.handler">{{
            primaryButton.label
          }}</el-button>
          <el-button v-if="editable" @click="alterButton.handler">{{
            alterButton.label
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'GraphEditorItem',
  props: {
    projectId: {
      type: Number
    },
    nodeOptions: {
      type: Array
    },
    nodeGroups: {
      type: Array
    }
  },
  data() {
    return {
      useGroupColor: false,
      editable: false,
      selectedItem: {
        type: null,
        item: {}
      },
      originItem: null,
      options: {
        nodeOptions: [],
        nodeGroups: []
      }
    }
  },
  computed: {
    typeStr() {
      return this.selectedItem.type === 'node' ? '实体' : '关系'
    },
    editorTitle() {
      return this.createNew
        ? `新增${this.typeStr}`
        : `${this.typeStr} ID: ${this.selectedItem.item.id}`
    },
    createNew() {
      return !this.selectedItem.item.id
    },
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
    primaryButton() {
      return !this.createNew
        ? this.editable
          ? { label: `确认修改`, handler: this.updateItem }
          : {
              label: '点击修改',
              handler: () => {
                this.editable = true
              }
            }
        : { label: `新增${this.typeStr}`, handler: this.createItem }
    },
    alterButton() {
      return this.createNew
        ? { label: '重置选项', handler: this.reset }
        : { label: '取消修改', handler: this.cancel }
    }
  },
  watch: {
    projectId(id) {
      this.projectId = id
    },
    useGroupColor(bool) {
      if (bool) {
        this.selectedItem.item.color = ''
      }
    },
    nodeOptions(options) {
      this.options.nodeOptions = options
    },
    nodeGroups(groups) {
      this.options.nodeGroups = groups
    }
  },
  methods: {
    ...mapActions({
      createItemAct: 'createItem',
      updateItemAct: 'updateItem',
      deleteItemAct: 'deleteItem'
    }),
    /********** 外部操作事件 **********/
    createNode() {
      const newNode = this.getEditNode()
      // console.log('createNode')

      this.selectedItem.type = 'node'
      this.selectedItem.item = newNode
      this.originItem = null
      this.editable = true
      this.useGroupColor = true
      this.$emit('graph-action', 'clearFocus')
    },
    createLink() {
      const newLink = this.getEditLink()
      // console.log('createLink')

      this.selectedItem.type = 'link'
      this.selectedItem.item = newLink
      this.originItem = null
      this.editable = true
      this.useGroupColor = true
      this.$emit('graph-action', 'clearFocus')
    },
    selectNode(node) {
      const newNode = this.getEditNode(node)
      // console.log('selectNode', newNode)

      this.selectedItem.type = 'node'
      this.selectedItem.item = { ...newNode }
      this.originItem = newNode
      this.editable = false
      this.useGroupColor = !node.color
    },
    selectLink(link) {
      const newLink = this.getEditLink(link)
      // console.log('selectLink', link)

      this.selectedItem.type = 'link'
      this.selectedItem.item = { ...newLink }
      this.originItem = newLink
      this.editable = false
      this.useGroupColor = true
    },
    selectNone() {
      // console.log('selectNone')
      this.selectedItem.type = ''
      this.selectedItem.item = {}
      this.$emit('graph-action', 'clearFocus')
    },
    /********** 内部方法 **********/
    getEditNode(origin) {
      if (origin) {
        const {
          id,
          name,
          group,
          radius,
          color,
          figure,
          textSize,
          properties
        } = origin
        const node = {
          id,
          name,
          group,
          radius,
          color,
          figure,
          textSize,
          properties
        }
        return node
      } else {
        return {
          name: '',
          group: '',
          radius: '',
          color: '',
          figure: '',
          textSize: '',
          properties: {}
        }
      }
    },
    getEditLink(origin) {
      if (origin) {
        const { id, name, from, to, value } = origin
        const newLink = { id, name, from, to, value }
        return newLink
      } else {
        return {
          name: '',
          from: '',
          to: '',
          value: ''
        }
      }
    },
    reset() {
      const item = this.selectedItem.item
      for (const prop in item) {
        item[prop] = ''
      }
    },
    cancel() {
      this.editable = false
      // reset attribute
      this.selectedItem.item = { ...this.originItem }
    },
    createItem() {
      const {
        projectId,
        selectedItem: { type, item }
      } = this
      this.createItemAct({ projectId, type, item }).then(item => {
        if (item) {
          if (type === 'node') {
            this.$emit('graph-action', 'createNode', item)
            this.selectNode(item)
          } else if (type === 'link') {
            this.$emit('graph-action', 'createLink', item)
            this.selectLink(item)
          }
        }
      })
    },
    updateItem() {
      const {
        projectId,
        selectedItem: { type, item }
      } = this
      this.updateItemAct({ projectId, type, item }).then(item => {
        if (item) {
          if (type === 'node') {
            this.$emit('graph-action', 'updateNode', item)
            this.selectNode(item)
          } else if (type === 'link') {
            this.$emit('graph-action', 'updateLink', item)
            this.selectLink(item)
          }
        }
      })
    },
    deleteItem() {
      const {
        projectId,
        selectedItem: { type, item }
      } = this
      this.deleteItemAct({ projectId, type, id: item.id }).then(res => {
        if (res) {
          const action =
            type === 'node' ? 'deleteNode' : type === 'link' ? 'deleteLink' : ''
          if (action) {
            this.$emit('graph-action', action, item.id)
            this.selectNone()
          }
        }
      })
    },
    queryGroup(inputGroup, cb) {
      const groups = this.options.nodeGroups
      const suggestGroups = inputGroup
        ? groups.filter(
            group => group.toLowerCase().indexOf(inputGroup.toLowerCase()) === 0
          )
        : groups
      return cb(suggestGroups.map(group => ({ value: group })))
    }
  }
}
</script>

<style scoped>
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
