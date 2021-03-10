<template>
  <div class="home">
    <div class="graph">
      <d-3-sample/>
    </div>
    <div class="panel" :style="{ width: showPanel ? '300px' : '0' }">
      <!-- <div class="arrow" @click="showPanel = !showPanel"></div> -->
    </div>
    <button @click="showPanel = !showPanel">toggle</button>
  </div>
</template>

<script>
import D3Sample from './components/D3Sample'

export default {
  components: {
    D3Sample
  },
  data () {
    return {
      showPanel: false
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.home {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

.home > .graph {
  flex: 1;
}

.home > .panel {
  border-left: 2px solid #bbbbbb;
  position: relative;
  width: 0;
  box-sizing: border-box;
  transition: width 1s ease-in-out;
}

.panel > .arrow{
  height: 30px;
  width: 10px;
  display: grid;
  place-content: center;
  cursor: pointer;
  border: 1px solid black;
  box-sizing: border-box;
  position: absolute;
  left: -10px;
  top: calc(50vh - 15px);
}

.panel > .arrow::after {
  content: "<";
  font-weight: 600;
  transform: scaleY(2);
  top: 0;
}
</style>