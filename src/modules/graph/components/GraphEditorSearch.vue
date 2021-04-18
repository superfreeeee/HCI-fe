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
import { getSearchHistory, setSearchHistory } from '../utils/search'

export default {
  name: 'GraphEditorSearch',
  data() {
    return {
      searchNodeName: '',
      searchHistory: []
    }
  },
  computed: {
    ...mapGetters(['graphNodes', 'userId', 'projectId']),
    graphNodesOption() {
      const { graphNodes, searchHistory, suggestHistory } = this
      const appearedIds = new Set(
        searchHistory.map(name => Number(name.split('：')[0]))
      )
      console.log('appearedIds', appearedIds)
      const options = graphNodes
        .filter(({ id }) => !appearedIds.has(id))
        .map(({ id, name }) => ({
          id,
          value: `${id}：${name}`
        }))
      options.sort(({ id: x }, { id: y }) => x - y)
      return suggestHistory.concat(options)
    },
    suggestHistory() {
      return this.searchHistory.map(name => {
        const [id] = name.split('：')
        return { id: Number(id), value: name }
      })
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
      const { searchNodeName, editorSelect, updateSearchHistory } = this
      if (searchNodeName.indexOf('：') >= 0 || !isNaN(Number(searchNodeName))) {
        const [id] = searchNodeName.split('：')
        editorSelect({ type: 'node', id: Number(id) })
        updateSearchHistory()
      } else {
        $notify({
          title: '请输入 id 或从搜索推荐内选择',
          type: 'warning'
        })
      }
      this.$refs.searchInput.activated = false
    },
    updateSearchHistory() {
      const {
        graphNodes,
        searchNodeName,
        searchHistory,
        userId,
        projectId
      } = this
      if (searchHistory.includes(searchNodeName)) {
        searchHistory.splice(searchHistory.indexOf(searchNodeName), 1)
      }
      searchHistory.unshift(searchNodeName)
      if (searchHistory.length > graphNodes.length) {
        const currentIds = new Set(graphNodes.map(node => node.id))
        const newHistory = searchHistory.filter(name =>
          currentIds.has(Number(name.split('：')[0]))
        )
        setSearchHistory(userId, projectId, newHistory)
      } else {
        setSearchHistory(userId, projectId, searchHistory)
      }
    }
  },
  mounted() {
    const projectId = Number(this.$route.params.projectId)
    const { userId } = this
    this.searchHistory = getSearchHistory(userId, projectId) || []
    console.log(
      `search history, userId:${userId}, projectId:${projectId}`,
      this.searchHistory
    )
  }
}
</script>
