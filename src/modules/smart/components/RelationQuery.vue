<template>
  <div class="relationq">
    <div class="ask">
      <span class="header">
        <i
          class="el-icon-refresh"
          style="font-size: large; margin-right: 10px"
        />
        关系查询
      </span>
      <div class="input">
        <el-input
          placeholder="source 实体名称"
          v-model="source"
          clearable
          style="width: 30%"
        />
        <el-select
          v-model="relation"
          placeholder="关系"
          clearable=""
          style="margin: 0 20px; width: 20%"
        >
          <el-option
            v-for="item in options"
            :key="item.relation"
            :label="item.label"
            :value="item.relation"
          >
          </el-option>
        </el-select>
        <el-input
          placeholder="target 实体名称"
          v-model="target"
          clearable
          style="width: 30%; margin-right: 20px"
        />
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="relationQuerySearch()"
          size="medium"
        ></el-button>
      </div>
    </div>
    <div class="graph">
      <span class="header">关系图</span>
      <div class="show">
        <GraphBoard ref="relationQueryBoard" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import GraphBoard from '../../graph/components/GraphBoard'

export default {
  name: 'RelationQuery',
  components: {
    GraphBoard,
  },
  data() {
    return {
      source: '',
      target: '',
      relation: '',
      options: [
        {
          label: '主食材',
          relation: 'main',
        },
        {
          label: '辅料',
          relation: 'role',
        },
        {
          label: '所属',
          relation: 'group',
        },
      ],
    }
  },
  mounted() {
    this.source = this.relationQueryQues.source
    this.target = this.relationQueryQues.target
    this.relation = this.relationQueryQues.relation
  },
  computed: {
    ...mapGetters(['relationQueryQues']),
  },
  methods: {
    ...mapMutations(['setRelationQueryQues']),
    ...mapActions(['getProjectInfo']),
    relationQuerySearch() {
      console.log('relationQuerySearch')
      const relationQueryQues = {
        source: this.source,
        target: this.target,
        relation: this.relation,
      }
      this.setRelationQueryQues(relationQueryQues)
    },
  },
  // async mounted() {
  //   const projectId = Number(this.$route.params.projectId)
  //   console.log(`[Graph] mounted, projectId = ${projectId}`)

  //   console.log(`[Graph] getProjectInfo`)
  //   if (!(await this.getProjectInfo(projectId))) return

  //   console.log(`[Graph] graphInit`)
  //   const board = this.$refs.relationQueryBoard
  //   if (!(await board.graphInit(projectId))) return
  //   board.init()
  // },
}
</script>

<style>
.relationq {
  width: 100%;
  height: 100%;
}
.relationq > .ask {
  height: 18%;
  box-shadow: 1px 1px 1px 1px slategray;
  margin-bottom: 25px;
}
.header {
  display: flex;
  align-items: center;
  height: 35px;
  background-color: #f6f8fa;
  font-size: small;
  padding: 0 10px;
}
.relationq > .ask > .input {
  text-align: center;
  padding: 10px;
  height: calc(65% - 20px);
}
/* .el-input {
  height: 100%;
} */
.el-select {
  height: 100%;
}
.relationq > .graph {
  width: 100%;
  height: 75%;
  box-shadow: 1px 1px 1px 1px slategray;
}
.relationq > .graph > .show {
  height: calc(100% - 35px);
}
</style>
