<template>
  <iframe :src="src" frameborder="0" class="iframe"></iframe>
</template>

<script>
export default {
  name: 'Tutorial',
  data() {
    return {
      src: '../../static/docs.html',
    }
  },
}
</script>

<style>
.iframe {
  width: 100%;
  height: 100%;
}
</style>
