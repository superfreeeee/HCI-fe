<template>
  <div class="box">
    <div class="title">
      <h1>欢迎使用 co$in</h1>
      <el-button icon="el-icon-plus" class="add" @click="createNewGraph()">
        新建项目
      </el-button>
      <el-popover
        placement="bottom"
        trigger="click"
        class="user" 
      >
      <div style="font-size: 20px">{{ userInfo.username }}</div>
      <div class="userinfo-email">{{ userInfo.email }}</div>
      <el-button style="width: 100%; border: none" @click="logout()">
        登出
      </el-button>
      <el-button icon="el-icon-user-solid" circle slot="reference"></el-button>
      </el-popover>
    </div>
    <el-button
      v-for="project in ownProjects"
      :key="project.projectId"
      type="primary"
      style="width: 30%; margin: 0 0 15px 0"
      round
      @click="gotoProject(project.projectId)"
    >
      项目：{{ project.name }}
    </el-button>
    <el-dialog
      title="新建知识图谱项目"
      :visible.sync="showCreatePanel"
      width="45%"
    >
      <el-form 
          ref="form" 
          :model="form" 
          label-width="150px" 
          :rules="`${xmlInput}`? rulesWithXml : rulesWithoutXml"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入项目描述"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="知识图谱xml" prop="xml">
          <el-radio-group size="mini" v-model="xmlRadio">
            <el-radio label="空项目" @change="disableXmlInput()"></el-radio>
            <el-radio label="xml导入" @change="visibleXmlInput()"></el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            placeholder="请输入知识图谱 xml"
            :autosize="{ minRows: 5, maxRows: 12 }"
            v-if="xmlInput"
            v-model="form.xml"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">重 置</el-button>
        <el-button type="primary" @click="doneCreate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {  mapGetters, mapMutations, mapActions } from 'vuex'
import { message } from '../common/utils/message.js'

export default {
  name: 'Home',
  data() {
    return {
      form: {
        name: '',
        description: '',
        xml: ''
      },
      xmlInput: false,
      xmlRadio: '空项目',
      rulesWithXml: {
        name: [{ required: true, message: '项目名称不能为空!' }],
        description: [{ required: true, message: '项目描述不能为空!' }],
        xml: [{ required: true, message: '知识图谱 xml 不能为空!' }]
      },
      rulesWithoutXml: {
        name: [{ required: true, message: '项目名称不能为空!' }],
        description: [{ required: true, message: '项目描述不能为空!' }],
      },
      showCreatePanel: false
    }
  },
  computed: {
    ...mapGetters(['ownProjects', 'projectId', 'userInfo'])
  },
  methods: {
    ...mapMutations(['setGraphProjectId']),
    ...mapActions(['createProject', 'getListByUserId', 'userLogout', 'getUserInfo']),
    gotoProject(id) {
      this.setGraphProjectId(id)
      this.$router.push(`/graph/${id}`)
    },
    createNewGraph() {
      this.showCreatePanel = true
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    doneCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 把数据传向后端
          const projectParam = {
            name: this.form.name,
            description: this.form.description,
            userId: 1
          }
          if(this.form.xml === '空项目') {
            projectParam.xml = ''
          }else {
            projectParam.xml = this.form.xml
          }
          // console.log('projectParam', projectParam)
          this.createProject(projectParam)
            .then(() => {
              this.$router.push(`/graph/${this.projectId}`)
            })
            .catch(msg => {
              message(msg, 'error')
            })
        } else {
          console.log('error')
        }
      })
    },
    disableXmlInput() {
      this.xmlInput = false
    },
    visibleXmlInput() {
      this.xmlInput = true
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/user')
    }
  },
  mounted() {
    this.getUserInfo().then(() => {
      this.getListByUserId(this.userInfo.id)
    })
  },
}
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  height: 100vh;
  padding: 0 32px 32px 32px;
  box-sizing: border-box;
  overflow: auto;
}

.box > .title {
  position: sticky;
  width: 100%;
  top: 0;
  background-color: #ffffff;
}

.box > .title > .add {
  position: relative;
  top: -60px;
  right: -200px;
}

.box > .title > .user {
  position: fixed;
  top: 25px;
  right: 50px;
}

.userinfo-email {
  font-size: 15px; 
  border-bottom: 1px solid black; 
  padding-bottom: 5px; 
  margin-bottom: 5px
}
</style>
