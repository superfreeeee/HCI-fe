<template>
  <div class="graphd">
    <div class="ask">
      <span class="title">
        <i
          class="el-icon-question"
          style="font-size: large; margin-right: 10px"
        />
        图谱问答
      </span>
      <div class="input">
        <el-input
          placeholder="请输入问题"
          v-model="graphDialogueinput"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="graphDialogueSearch()"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="answer">
      <span class="title">答案</span>
    </div>
    <div class="graph">
      <span class="title">图谱演示</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GraphDialogue',
  data() {
    return {
      graphDialogueinput: '',
    }
  },
  methods: {
    graphDialogueSearch() {
      console.log('graphDialogueSearch')
    },
  },
}
</script>

<style>
.graphd {
  width: 100%;
  height: 100%;
}
.graphd > .ask {
  height: 18%;
  box-shadow: 1px 1px 1px 1px slategray;
  margin-bottom: 25px;
}
.title {
  display: flex;
  align-items: center;
  height: 35px;
  background-color: #f6f8fa;
  font-size: small;
  padding: 0 10px;
}
.graphd > .ask > .input {
  padding: 10px;
  height: calc(65% - 20px);
}
.graphd > .answer {
  width: 30%;
  height: 75%;
  float: left;
  box-shadow: 1px 1px 1px 1px slategray;
  margin-right: 30px;
}
.graphd > .graph {
  width: calc(70% - 30px);
  height: 75%;
  float: left;
  box-shadow: 1px 1px 1px 1px slategray;
}
.el-input-group {
  height: 100%;
}
.el-input__inner {
  height: 100%;
}
</style>
