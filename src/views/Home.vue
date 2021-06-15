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
        <el-menu-item index="3">co$in手册</el-menu-item>
      </el-menu>
      <h1 v-if="this.activeIndex !== '3'">欢迎使用 co$in</h1>
      <h1 v-else>co$in 使用说明手册</h1>
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
      <el-pagination
        layout="prev, pager, next"
        :total="ownListCount"
        @current-change="switchPageOwn"
        :current-page="ownPageNo"
      >
      </el-pagination>
    </div>
    <div class="list" v-if="this.activeIndex === '2'">
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
        :total="allListCount"
        @current-change="switchPageAll"
        :current-page="allPageNo"
      >
      </el-pagination>
    </div>
    <div class="tutorial" v-if="this.activeIndex === '3'">
      <Tutorial />
    </div>
    <NewProjectPanel />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import NewProjectPanel from '../modules/home/components/NewProjectPanel'
import Tutorial from '../modules/home/components/Tutorial'

export default {
  name: 'Home',
  components: {
    NewProjectPanel,
    Tutorial,
  },
  data() {
    return {
      activeIndex: '1',
      userId: null,
    }
  },
  computed: {
    ...mapGetters([
      'ownProjects',
      'projectId',
      'userInfo',
      'showCreatePanel',
      'allProjects',
      'allPageNo',
      'allListCount',
      'ownProjects',
      'ownPageNo',
      'ownListCount',
    ]),
  },
  methods: {
    ...mapMutations([
      'setGraphProjectId',
      'setShowCreatePanel',
      'setAllPageNo',
      'setOwnPageNo',
    ]),
    ...mapActions([
      // 'getListByUserId',
      'userLogout',
      'getUserInfo',
      'getAllListByPageNo',
      'getOwnListByPageNo',
      'getAllListAmount',
      'getOwnListAmount',
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
    switchPageOwn(currPageNo) {
      this.setOwnPageNo(currPageNo)
      this.getOwnListByPageNo({
        userId: this.userId,
        pageNo: this.ownPageNo,
      })
    },
    switchPageAll(currPageNo) {
      // console.log('switchPage', currPageNo)
      this.setAllPageNo(currPageNo)
      this.getAllListByPageNo(currPageNo)
    },
  },
  mounted() {
    this.getUserInfo().then((success) => {
      if (success) {
        this.userId = this.userInfo.id
        this.getOwnListAmount(this.userId)
        this.getAllListAmount()
        this.getOwnListByPageNo({
          userId: this.userId,
          pageNo: this.ownPageNo,
        })
        this.getAllListByPageNo(this.allPageNo)
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

.box > .tutorial {
  width: 100%;
  height: 100%;
}
</style>
