<template>
  <div class="box">
    <div class="login" v-show="showLogin">
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
    <div class="register" v-show="!showLogin">
      <div class="register-title">
        <span class="backLogin">
          <el-button
            icon="el-icon-arrow-left"
            style="border: none"
            circle
            @click="gotoLogin()"
          >
          </el-button>
        </span>
        Register
      </div>
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        label-width="80px"
        style="margin-top: 40px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="username"
            v-model="registerForm.username"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="email"
            v-model="registerForm.email"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="registerForm.password"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            type="password"
            v-model="registerForm.checkPassword"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="register()">注册</el-button>
          <el-button @click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'User',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      function emailFormat(email) {
        if (email != '') {
          let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
          let isok = reg.test(email)
          if(isok) {
              return true
          } else {
              return false
          }
        }
      }
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!emailFormat(value)) {
        callback(new Error('邮箱格式有误'))
      } else {
        callback()
      }
    }
    const validateLoginPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
    }
    const validateRegisterPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.checkPassword !== '') {
          this.$refs.registerForm.validateField('password')
        }
        callback()
      }
    }
    const validatePasswordSame = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showLogin: true,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validateLoginPassword, trigger: 'blur' }],
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        checkPassword: '',
      },
      registerRules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        password: [{ validator: validateRegisterPassword, trigger: 'blur' }],
        checkPassword: [{ validator: validatePasswordSame, trigger: 'blur' }],
      },
    }
  },
  methods: {
    ...mapActions(['userLogin', 'register']),
    login() {
      const userInfo = {
        username: this.loginForm.username,
        password: this.loginForm.password,
      }
      console.log(userInfo)
      this.userLogin(userInfo)
        .then((res) => {
          this.$message({
            message: res,
            type: 'success',
          })
          this.$router.push('/home')
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error',
          })
        })
    },
    register() {
        const userInfo = {
            email: this.registerForm.email,
            username: this.registerForm.username,
            password: this.registerForm.password
        }
        console.log(userInfo)
        this.register(userInfo)
          .then((res) => {
            this.$message({
              message: res,
              type: 'success',
            })
            this.gotoLogin()
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'error',
            })
          })
    },
    toggle_showLogin() {
      this.showLogin = !this.showLogin
    },
    gotoRegister() {
      this.toggle_showLogin()
    },
    gotoLogin() {
      this.toggle_showLogin()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style>
.box {
  display: flex;
  justify-content: center;
}

.box > .login {
  width: 40vw;
  height: 40vh;
  position: fixed;
  top: 10%;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px slategray;
  background-color: #ffffff;
  padding: 10px;
}

.box > .login > .login-title {
  text-align: center;
  font-size: 25px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px outset royalblue;
}

.box > .register {
  position: relative;
  width: 40vw;
  height: 60vh;
  position: fixed;
  top: 10%;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px slategray;
  background-color: #ffffff;
  padding: 10px;
}

.box > .register > .register-title {
  text-align: center;
  font-size: 25px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px outset royalblue;
}

.box > .register > .register-title > .backLogin {
  position: absolute;
  left: 10px;
}

.el-input {
  width: 90%;
}
</style>
