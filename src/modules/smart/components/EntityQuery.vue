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
          style="width: 100%"
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
      <span class="header">关系图</span>
      <div class="show">
        <GraphBoard ref="entityQueryBoard" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import GraphBoard from '../../graph/components/GraphBoard'
import { _graphData } from '../../graph/utils/data'
import { deepCopy } from '../../../common/utils/object'

export default {
  name: 'EntityQuery',
  components: {
    GraphBoard,
  },
  data() {
    return {
      entityQueryinput: '',
      graphData: null,
    }
  },
  async mounted() {
    this.entityQueryinput = this.entityQueryQues
    const graphData = deepCopy(_graphData)
    this.graphData = graphData
    const entityQueryBoard = this.$refs.entityQueryBoard
    entityQueryBoard.mountGraphData(graphData)
  },
  computed: {
    ...mapGetters(['entityQueryQues']),
  },
  methods: {
    ...mapMutations(['setEntityQueryQues']),
    ...mapActions(['getProjectInfo']),
    entityQuerySearch() {
      console.log('entityQuerySearch')
      this.setEntityQueryQues(this.entityQueryinput)
    },
  },
  // async mounted() {
  //   const projectId = Number(this.$route.params.projectId)
  //   console.log(`[Graph] mounted, projectId = ${projectId}`)

  //   console.log(`[Graph] getProjectInfo`)
  //   if (!(await this.getProjectInfo(projectId))) return

  //   console.log(`[Graph] graphInit`)
  //   const board = this.$refs.entityQueryBoard
  //   if (!(await board.graphInit(projectId))) return
  //   board.init()
  // },
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
