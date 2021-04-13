<template>
  <div class="box">
    <div class="logo">
      <img
        src="../assets/coin.jpg"
        alt="coin logo"
        width="90px"
        height="100%"
      />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'User'
}
</script>

<style>
.logo {
  height: 10vh;
  width: 100vw;
  text-align: center;
  border-bottom: 2px groove;
}

.box {
  width: 100vw;
  height: 100vh;
}
</style>
