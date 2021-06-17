<template>
  <iframe :src="src" frameborder="0" class="iframeTutorial"></iframe>
</template>

<script>
export default {
  name: 'Tutorial',
  data() {
    return {
      src: '../../static/guide.html',
    }
  },
}
</script>

<style>
.iframeTutorial {
  width: 100%;
  height: 100%;
}
</style>
