<template>
  <div class="entityq">
    <div class="ask">
      <span class="title">
        <i
          class="el-icon-share"
          style="font-size: large; margin-right: 10px"
        />
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'EntityQuery',
  data() {
    return {
      entityQueryinput: '',
    }
  },
  methods: {
    entityQuerySearch() {
      console.log('entityQuerySearch')
    },
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
.title {
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
</style>
