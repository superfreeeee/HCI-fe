<template>
  <div class="box">
    <div class="title">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">我的项目</el-menu-item>
        <el-menu-item index="2">广场</el-menu-item>
      </el-menu>
      <h1>欢迎使用 co$in</h1>
      <el-button
        icon="el-icon-plus"
        class="add"
        @click="createNewGraph()"
        v-if="activeIndex === '1'"
      >
        新建项目
      </el-button>
      <el-popover placement="bottom" trigger="click" class="user">
        <div style="font-size: 20px">{{ userInfo.username }}</div>
        <div class="userinfo-email">{{ userInfo.email }}</div>
        <el-button style="width: 100%; border: none" @click="logout()">
          登出
        </el-button>
        <el-button
          icon="el-icon-user-solid"
          circle
          slot="reference"
        ></el-button>
      </el-popover>
    </div>
    <div class="list" v-if="this.activeIndex === '1'">
      <el-button
        v-for="project in ownProjects"
        :key="project.projectId"
        type="primary"
        style="width: 100%; margin: 0 0 15px 0"
        round
        @click="gotoProject(project.projectId)"
      >
        项目：{{ project.name }}
      </el-button>
    </div>
    <div class="list" v-else>
      <el-button
        v-for="project in allProjects"
        :key="project.projectId"
        type="primary"
        style="width: 100%; margin: 0 0 15px 0"
        round
        @click="gotoProject(project.projectId)"
      >
        项目：{{ project.name }}
      </el-button>
      <el-pagination
        layout="prev, pager, next"
        :total="1000"
        @current-change="switchPage"
        :current-page="pageNo"
      >
      </el-pagination>
    </div>
    <NewProjectPanel />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import NewProjectPanel from '../modules/home/components/NewProjectPanel'

export default {
  name: 'Home',
  components: {
    NewProjectPanel,
  },
  data() {
    return {
      activeIndex: '1',
    }
  },
  computed: {
    ...mapGetters([
      'ownProjects',
      'projectId',
      'userInfo',
      'showCreatePanel',
      'allProjects',
      'pageNo',
    ]),
  },
  methods: {
    ...mapMutations(['setGraphProjectId', 'setShowCreatePanel', 'setPageNo']),
    ...mapActions([
      'getListByUserId',
      'userLogout',
      'getUserInfo',
      'getAllListByPageNo',
    ]),
    gotoProject(id) {
      this.$router.push(`/graph/${id}`)
    },
    createNewGraph() {
      this.setShowCreatePanel(true)
    },
    logout() {
      localStorage.removeItem('coin-token')
      this.$router.push('/user')
    },
    handleSelect(key) {
      this.activeIndex = key
    },
    switchPage(currPageNo) {
      // console.log('switchPage', currPageNo)
      this.setPageNo(currPageNo)
      this.getAllListByPageNo(currPageNo)
    },
  },
  mounted() {
    this.getUserInfo().then((success) => {
      if (success) {
        const userId = this.userInfo.id
        this.getListByUserId(userId)
        this.getAllListByPageNo(this.pageNo)
      }
    })
  },
}
</script>

<style>
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
  height: 23%;
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
  top: 15px;
  right: 50px;
}

.userinfo-email {
  font-size: 15px;
  border-bottom: 1px solid black;
  padding-bottom: 5px;
  margin-bottom: 5px;
}

.box > .list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
}
</style>
