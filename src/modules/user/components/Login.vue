<template>
  <div class="login-box">
    <div class="project-text">
      <div style="font-size: 50px; color: black">co$in</div>
      <div style="font-size: 25px; color: black">
        System for Constructing and <br />Visualizing Knowledge Graph
      </div>
      <div style="color: gray">
        This project aims to build a system platform, through visualized
        measures to provide an online editor to edit graph tuples, create an
        airtight complete structure, a comprehensive service coverage, and the
        ability to reason knowledge graphs in fundamental aspects.
      </div>
    </div>
    <div class="login">
      <div class="login-title">Sign in</div>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-width="80px"
        style="margin-top: 40px; text-align: center"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="username"
            v-model="loginForm.username"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-button type="success" @click="login()" class="login-btn">
          登录
        </el-button>
        <a type="warning" @click="gotoRegister()" class="register-btn">
          还没注册？
        </a>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { $message } from '@/common/utils'

const validateUsername = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validateLoginPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  }
}

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validateLoginPassword, trigger: 'blur' }],
      },
    }
  },
  methods: {
    ...mapActions(['userLogin']),
    login() {
      const userInfo = { ...this.loginForm }
      this.userLogin(userInfo).then((success) => {
        if (success) {
          this.$router.push('/')
        }
      })
    },
    gotoRegister() {
      this.$router.push('/user/register')
    },
  },
}
</script>

<style>
.login-box {
  width: 100vw;
  height: 90vh;
}

.login-box > .project-text {
  width: 30%;
  position: fixed;
  left: 15%;
  top: 30%;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
}

.login-box > .project-text > div {
  margin-bottom: 10px;
}

.login-box > .login {
  width: 30vw;
  position: fixed;
  right: 15%;
  top: 30%;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px slategray;
  background-color: #ffffff;
  padding: 10px;
}

.login-box > .login > .login-title {
  text-align: center;
  font-size: 25px;
  font-family: cursive;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px outset royalblue;
}

.el-input {
  width: 90%;
}

.login-btn {
  width: 90%;
  margin-bottom: 10px;
}

.register-btn {
  display: block;
  font-size: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  color: royalblue;
}
</style>
