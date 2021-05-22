<template>
  <div class="box">
    <el-row type="flex" justify="center">
      <el-col>
        <JwChat
          :taleList="taleList"
          @enter="bindEnter"
          v-model="text"
          :toolConfig="tool"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import voiceRecognition from '../common/utils/voiceRecognition'
const recorder = new voiceRecognition('en_us', 'mandarin', '5f27b6a9')

export default {
  name: 'Chat',
  data() {
    return {
      text: '',
      taleList: [
        {
          date: '2020/04/25 21:19:07',
          text: { text: '起床不' },
          mine: false,
          name: 'coin小助手',
          img: '../assets/coin.png',
        },
        {
          date: '2020/04/16 21:19:07',
          text: { text: '我不饿' },
          mine: true,
          name: 'cclin',
          img: '../assets/logo.png'
        },
      ],
      tool: {
        // file img video 现在只配置了三个图标
        show: ['file', 'img'],
        callback: this.toolEvent,
      },
    }
  },
  mounted() {},
  methods: {
    toolEvent(type /* 当前点击的按钮类型 */) {
      alert(type)
    },
    bindEnter() {
      console.log('bind press enter')
    },
    // onVoiceStart() {
    //   recorder.start()
    // },
    // onVoiceStop() {
    //   recorder.stop()
    // },
  },
}
</script>

<style>
.box {
  width: 100%;
  height: 100%;
  background-color: rgb(163, 177, 189);
}

.box .chat-box {
  margin: 6% auto;
  border-radius: 20px;
  padding: 10px;
}
</style>
