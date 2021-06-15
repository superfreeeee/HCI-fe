<template>
  <div class="entitynlp">
    <div class="ask">
      <span class="header">
        <i class="el-icon-view" style="font-size: large; margin-right: 10px" />
        实体识别
      </span>
      <div class="input">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入自然语言文本"
          v-model="entityIdentifyinput"
          clearable
          style="width: 100; margin-bottom: 10px"
        >
        </el-input>
        <el-button
          type="primary"
          @click="entityIdentifySearch()"
          style="width: 100%"
        >
          分析文本
        </el-button>
      </div>
    </div>
    <div class="answer">
      <span class="header">答案</span>
      <div class="text">
        <!-- {{ this.dialogueAnswer }} -->
      </div>
    </div>
    <div class="graph">
      <span class="header">图谱演示</span>
      <div class="show">
        <GraphBoard ref="entityIdentifyBoard" />
      </div>
    </div>
  </div>
</template>

<script>
import GraphBoard from '../../graph/components/GraphBoard'

export default {
  name: 'EntityIdentify',
  components: {
    GraphBoard,
  },
  data() {
    return {
      entityIdentifyinput: '',
      graphData: null,
    }
  },
  methods: {
    renderGraph() {
      //   this.graphData = this.dialogueQueryGraphData
      //   const graphDialogueBoard = this.$refs.graphDialogueBoard
      //   graphDialogueBoard.mountGraphData(this.graphData)
    },
    entityIdentifySearch() {
      console.log('entityIdentify')
    },
  },
}
</script>

<style>
.entitynlp {
  width: 100%;
  height: 100%;
}
.entitynlp > .ask {
  height: 40%;
  box-shadow: 1px 1px 1px 1px slategray;
  margin-bottom: 20px;
}
.header {
  display: flex;
  align-items: center;
  height: 35px;
  background-color: #f6f8fa;
  font-size: small;
  padding: 0 10px;
}
.entitynlp > .ask > .input {
  padding: 10px;
  height: calc(77% - 20px);
}
.entitynlp > .answer {
  width: 35%;
  height: calc(60% - 25px);
  float: left;
  box-shadow: 1px 1px 1px 1px slategray;
  margin-right: 30px;
}
.entitynlp > .graph {
  width: calc(65% - 30px);
  height: calc(60% - 25px);
  float: left;
  box-shadow: 1px 1px 1px 1px slategray;
}
.entitynlp > .graph > .show {
  height: calc(100% - 35px);
}
.entitynlp > .answer > .text {
  width: calc(100% - 20px);
  height: calc(100% - 55px);
  padding: 10px;
  font-family: serif;
  font-size: 15px;
  overflow: scroll;
}
.el-textarea__inner {
  max-height: 117px;
}
</style>
