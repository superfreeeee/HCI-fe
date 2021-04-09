<template>
  <div class="box">
    <div class="login">
      <div class="login-title">Register</div>
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
        <el-form-item label="邮箱" prop="email">
          <el-input 
          type="email" 
          v-model="ruleForm.email" 
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
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input 
          type="password" 
          v-model="ruleForm.checkPassword" 
          autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submit()">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      function emailFormat(email) {
        if(email != "") {
          let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
          let isok = reg.test(email);
          if(!isok) {
            return false;
          } else  {
            return true
          }
        }
      }
      if(value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!emailFormat(value)) {
        callback(new Error('邮箱格式有误'))
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
    const validatePasswordEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      ruleForm: {
        username: '',
        email: '',
        password: '',
        checkPassword: '',
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur'}
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePasswordEmpty, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    submit() {
      console.log('submit register')
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
  height: 60vh;
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