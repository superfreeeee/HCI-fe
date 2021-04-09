<template>
  <div class="box">
    <div class="login">
      <div class="login-title">Sign in</div>
      <el-form :model="ruleForm" 
                status-icon :rules="rules" 
                ref="ruleForm" 
                label-width="80px"
                style="margin-top: 40px;"
                class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input 
          type="username" 
          v-model="ruleForm.username" 
          auto-complete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
          type="password" 
          v-model="ruleForm.password" 
          autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="login()">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="warning" @click="register()">还没注册？</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur'}
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    login() {
      console.log('login')
    },
    register() {
      this.$router.push('/register')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px outset royalblue;
}
</style>
