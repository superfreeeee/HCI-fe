<template>
  <div class="chatbox">
    <div class="chat-header">co$in 小助手</div>
    <el-button
      circle
      icon="el-icon-arrow-left"
      class="back"
      @click="goback()"
    ></el-button>
    <JwChat
      :taleList="taleList"
      @enter="bindEnter"
      v-model="text"
      :toolConfig="tool"
      class="jwchat"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Chat',
  data() {
    return {
      height: '80vh',
      text: '',
      tool: {
        // file img video 现在只配置了三个图标
        show: ['file', 'img', 'video'],
        callback: this.toolEvent,
      },
    }
  },
  mounted() {
    console.log(this.taleList)
    console.log(this.userInfo)
  },
  computed: {
    ...mapGetters(['taleList', 'userInfo']),
  },
  methods: {
    ...mapMutations(['pushTaleList']),
    ...mapActions(['sendQuestion']),
    toolEvent(type /* 当前点击的按钮类型 */) {
      alert(type)
    },
    bindEnter() {
      const projectId = Number(this.$route.params.projectId)
      const question = {
        projectId,
        text: this.text,
      }
      const data = {
        question,
        username: this.userInfo.username,
      }
      this.sendQuestion(data)
    },
    goback() {
      this.$router.back()
    },
  },
}
</script>

<style>
.chatbox {
  width: 100%;
  height: 100%;
  background-color: hsl(207, 100%, 91%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.chatbox .jwchat {
  width: 70vw !important;
  height: 80vh !important;
}
.chatbox .chat-header {
  position: fixed;
  top: 5%;
  font-size: larger;
  width: 200px;
  text-align: center;
  color: rgb(244, 153, 146);
  background-color: #fdfcf8;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px slategrey;
  margin-bottom: 50px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.chatbox .back {
  position: fixed;
  top: 3vh;
  left: 5vw;
}
.wrapper {
  width: 100% !important;
}
.chatPage[style] {
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px #454948;
  margin: 5px;
  background-color: #fdfcf8;
}
.web__msg-input[placeholder] {
  background-color: #fffafa;
}
.wrapper .scroller .web__main-user img[data-v-422b11e3] {
  border-radius: 0;
}
/* 超小型设备（电话，600px 及以下） */
@media only screen and (max-width: 600px) {
  .wrapper .scroller[style] {
    width: 95vw;
  }
  .chatbox {
    width: 100%;
    height: 100%;
    background-color: hsl(207, 100%, 91%);
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .chatbox .jwchat {
    height: 88vh !important;
    width: 100vw !important;
    border-radius: 0;
    margin: 0;
  }
}

/* 小型设备（纵向平板电脑和大型手机，600 像素及以上）
@media only screen and (min-width: 600px) {
} */

/* 中型设备（横向平板电脑，768 像素及以上） */
@media only screen and (min-width: 768px) {
  .wrapper .scroller[style] {
    width: calc(100% - 2rem);
    padding: 1rem;
  }
  .chatbox {
    width: 100%;
    height: 100%;
    background-color: hsl(207, 100%, 91%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .chatbox .jwchat {
    height: 80vh !important;
  }
}

/* 大型设备（笔记本电脑/台式机，992px 及以上）
@media only screen and (min-width: 992px) {
}

/* 超大型设备（大型笔记本电脑和台式机，1200px 及以上） 
@media only screen and (min-width: 1200px) {
} */
</style>
