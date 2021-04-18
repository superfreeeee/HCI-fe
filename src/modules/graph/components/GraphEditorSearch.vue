<template>
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { $notify } from '@/common/utils'

export default {
  name: 'GraphEditorSearch',
  data() {
    return {
      searchNodeName: ''
    }
  },
  computed: {
    ...mapGetters(['graphNodes']),
    graphNodesOption() {
      const options = this.graphNodes.map(({ id, name }) => ({
        id,
        value: `${id}：${name}`
      }))
      options.sort(({ id: x }, { id: y }) => x - y)
      return options
    }
  },
  methods: {
    ...mapActions(['editorSelect']),
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
          title: '请输入 id 或从搜索推荐内选择',
          type: 'warning'
        })
      }
      this.$refs.searchInput.activated = false
    }
  }
}
</script>
