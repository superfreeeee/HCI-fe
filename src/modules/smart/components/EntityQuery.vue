<template>
  <div class="entityq">
    <div class="ask">
      <span class="header">
        <i class="el-icon-share" style="font-size: large; margin-right: 10px" />
        实体查询
      </span>
      <div class="input">
        <el-input
          placeholder="请输入实体名称"
          v-model="entityQueryinput"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="entityQuerySearch()"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="graph">
      <span class="title">关系图</span>
      <div class="show">
        <GraphBoard ref="entityQueryBoard" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import GraphBoard from '../../graph/components/GraphBoard'

export default {
  name: 'EntityQuery',
  components: {
    GraphBoard,
  },
  data() {
    return {
      entityQueryinput: '',
    }
  },
  methods: {
    ...mapActions(['getProjectInfo']),
    entityQuerySearch() {
      console.log('entityQuerySearch')
    },
  },
  async mounted() {
    const projectId = Number(this.$route.params.projectId)
    console.log(`[Graph] mounted, projectId = ${projectId}`)

    console.log(`[Graph] getProjectInfo`)
    if (!(await this.getProjectInfo(projectId))) return

    console.log(`[Graph] graphInit`)
    const board = this.$refs.entityQueryBoard
    if (!(await board.graphInit(projectId))) return
    board.init()
  },
}
</script>

<style>
.entityq {
  width: 100%;
  height: 100%;
}
.entityq > .ask {
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
.entityq > .ask > .input {
  padding: 10px;
  height: calc(65% - 20px);
}
.entityq > .graph {
  width: 100%;
  height: 75%;
  box-shadow: 1px 1px 1px 1px slategray;
}
.entityq > .graph > .show {
  height: calc(100% - 35px);
}
</style>
