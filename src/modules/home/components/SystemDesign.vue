<template>
  <iframe :src="src" frameborder="0" class="iframeSystemDesign"></iframe>
</template>

<script>
export default {
  name: 'SystemDesign',
  data() {
    return {
      src: '../../static/systemdesign.html',
    }
  },
}
</script>

<style>
.iframeSystemDesign {
  width: 100%;
  height: 100%;
}
</style>
