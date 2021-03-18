<template>
  <div class="box">
    <div style="height: 20vh; width: 100vw; text-align: center">
      <h1>欢迎使用 co$in</h1>
    </div>
    <el-button
      v-for="id in mockProjectId"
      :key="id"
      type="primary"
      style="width: 30%; margin: 0 0 15px 0"
      round
      @click="gotoProject(id)"
    >
      项目 {{ id }}
    </el-button>
    <el-button style="margin: 0" @click="createNewGraph()">
      新建项目
    </el-button>
    <el-dialog
      title="新建知识图谱项目"
      :visible.sync="showCreatePanel"
      width="45%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            type="textarea"
            placeholder="请输入项目描述"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="知识图谱 xml">
          <el-input
            type="textarea"
            placeholder="请输入知识图谱 xml"
            :autosize="{ minRows: 5, maxRows: 12 }"
            v-model="form.xml"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCreatePanel = false">取 消</el-button>
        <el-button type="primary" @click="doneCreate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      form: {
        name: '',
        description: '',
        xml: ''
      },
      showCreatePanel: false,
      mockProjectId: [1, 2, 3, 4] // fake data
    }
  },
  methods: {
    ...mapMutations(['setProjectId']),
    ...mapActions(['createNewGraph']),
    jumpTo(path) {
      this.$router.push({ path: path })
    },
    gotoProject(id) {
      this.setProjectId(id)
      this.jumpTo('/graph')
    },
    createNewGraph() {
      this.showCreatePanel = true
    },
    doneCreate() {
      // 把数据传向后端
      // this.createNewGraph()
      // this.jumpTo('/graph')
    }
  }
}
</script>

<style>
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}
</style>
