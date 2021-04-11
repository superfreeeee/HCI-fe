<template>
  <div class="box">
    <div class="logo">
      <img 
        src="../assets/coin.jpg" 
        alt="coin logo" 
        width="100px" 
        height="100%"
      >
    </div>
    <Login v-show="showLogin"/>
    <Register v-show="!showLogin"/>
  </div>
</template>

<script>
import  { mapGetters } from 'vuex'
import Login from '../modules/user/components/Login'
import Register from '../modules/user/components/Register'

export default {
  name: 'User',
  components: {
    Login,
    Register
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['showLogin'])
  }
}
</script>

<style>
.logo {
  height: 10vh;
  width: 100%;
  text-align: center;
  border-bottom: 2px groove;
}

.box {
  display: flex;
  justify-content: center;
  height: 100vh;
}
</style>
