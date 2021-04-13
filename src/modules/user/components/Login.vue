<template>
  <div class="login">
    <div class="login-title">Sign in</div>
    <el-form
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-width="80px"
      style="margin-top: 40px"
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
      <el-form-item>
        <el-button type="success" @click="login()">登录</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
        <el-button type="warning" @click="gotoRegister()">还没注册？</el-button>
      </el-form-item>
    </el-form>
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
        password: ''
      },
      loginRules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validateLoginPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['userLogin']),
    login() {
      const userInfo = { ...this.loginForm }
      this.userLogin(userInfo).then(success => {
        if (success) {
          this.$router.push('/')
        }
      })
    },
    gotoRegister() {
      this.$router.push('/user/register')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.login {
  width: 40vw;
  position: fixed;
  top: 20%;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px slategray;
  background-color: #ffffff;
  padding: 10px;
}

.login > .login-title {
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
</style>
