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
        <el-menu-item index="3">Helper</el-menu-item>
        <el-menu-item index="4">文档</el-menu-item>
        <el-menu-item index="5">系统设计</el-menu-item>
      </el-menu>
      <h1 v-if="activeIndex === '1' || activeIndex === '2'">
        欢迎使用 co$in
      </h1>
      <h1 v-if="activeIndex === '4'">co$in 文档</h1>
      <h1 v-if="activeIndex === '5'">co$in 系统设计</h1>
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
    <HomeProjects v-if="activeIndex === '1'" />
    <HomeSquare v-else-if="activeIndex === '2'" />
    <Chat v-else-if="activeIndex === '3'" />
    <Tutorial v-else-if="activeIndex === '4'" />
    <SystemDesign v-else-if="activeIndex === '5'" />
    <NewProjectPanel />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import HomeProjects from '../modules/home/components/HomeProjects'
import HomeSquare from '../modules/home/components/HomeSquare'
import Tutorial from '../modules/home/components/Tutorial'
import Chat from '../modules/home/components/Chat'
import SystemDesign from '../modules/home/components/SystemDesign'
import NewProjectPanel from '../modules/home/components/NewProjectPanel'

export default {
  name: 'Home',
  components: {
    HomeProjects,
    HomeSquare,
    Tutorial,
    Chat,
    SystemDesign,
    NewProjectPanel
  },
  data() {
    return {
      activeIndex: '1',
      userId: null
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
      'ownPageNo',
      'ownListCount'
    ])
  },
  methods: {
    ...mapMutations([
      'setGraphProjectId',
      'setShowCreatePanel',
      'setAllPageNo',
      'setOwnPageNo'
    ]),
    ...mapActions([
      // 'getListByUserId',
      'userLogout',
      'getUserInfo',
      'getAllListByPageNo',
      'getOwnListByPageNo',
      'getAllListAmount',
      'getOwnListAmount'
    ]),
    createNewGraph() {
      this.setShowCreatePanel(true)
    },
    logout() {
      localStorage.removeItem('coin-token')
      this.$router.push('/user')
    },
    handleSelect(key) {
      this.activeIndex = key
    }
  },
  mounted() {
    this.getUserInfo().then(success => {
      if (success) {
        this.userId = this.userInfo.id
        this.getOwnListAmount(this.userId)
        this.getAllListAmount()
        this.getOwnListByPageNo({
          userId: this.userId,
          pageNo: this.ownPageNo
        })
        this.getAllListByPageNo(this.allPageNo)
      }
    })
  }
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
</style>
