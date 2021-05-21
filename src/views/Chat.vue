<template>
  <div class="box">
    <el-row type="flex" justify="center" style="height: 75%">
      <el-col :xs="20" :sm="18" :md="20" :lg="16">
        <div class="chat-box">
          <div class="chat"></div>
          <div class="text">
            <div class="options">
              <i
                class="el-icon-microphone icon-click"
                @click="onVoiceStart()"
              />
            </div>
            <el-input v-model="text" type="textarea" :rows="4"></el-input>
          </div>
        </div>
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
    }
  },
  mounted() {},
  methods: {
    onVoiceStart() {
      recorder.start()
    },
  },
}
</script>

<style>
.box {
  width: 100%;
  height: 100%;
  background-color: #fdfcf8;
}

.box .chat-box {
  background-color: aliceblue;
  height: 100%;
  margin: 6% 8%;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px slategray;
  padding: 10px;
}

.box .chat-box .chat {
  height: 70%;
  border-bottom: 1px whitesmoke;
  border-bottom-style: groove;
  margin-bottom: 5px;
}

.box .chat-box .text {
  height: 25%;
  margin-top: 5px;
}

.box .chat-box .text .options {
  padding: 0 10px;
  height: 23%;
  font-size: larger;
}

.box .chat-box .text .input {
  height: 70%;
}

.icon-click:hover {
  cursor: pointer;
  color: #409eff;
}
</style>
