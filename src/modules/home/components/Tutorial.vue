<template>
  <keep-alive>
    <div class="document">
      <DocumentSidebar :headers="headers" :setAnchor="setAnchor" />
      <iframe
        ref="tutorial_iframe_ref"
        :src="src"
        frameborder="0"
        class="iframeTutorial"
      ></iframe>
    </div>
  </keep-alive>
</template>

<script>
import DocumentSidebar from './DocumentSidebar.vue';
import { getInnerFrameHeaders } from '../utils/innerFrame';

export default {
  components: { DocumentSidebar },
  name: 'Tutorial',
  data() {
    return {
      src: '../../static/guide.html',
      headers: [],
      innerLink: null,
    };
  },
  methods: {
    setAnchor(e) {
      e.preventDefault();
      console.log(`setAnchor(${id})`);
      console.log(`setAnchor(${id}) e`, e);
      console.log(`setAnchor(${id}) target`, e.target);
      const targetH = e.target;
      const id = targetH.id;
      if (id) {
        const a = this.innerLink;
        a.href = `#${id}`;
        a.click();
      }
    },
  },
  mounted() {
    const innerWindow = this.$refs.tutorial_iframe_ref.contentWindow;
    console.log('innerWindow', innerWindow);
    console.log('innerWindow', innerWindow.document);
    innerWindow.onload = () => {
      // get headers
      console.log('innerWindow onload', innerWindow.document);
      const headers = getInnerFrameHeaders(innerWindow.document);
      this.headers = headers;

      // create anchor link
      const _document = innerWindow.document;
      const a = _document.createElement('a');
      a.style.display = 'none';
      this.innerLink = a;
    };
  },
};
</script>

<style scoped>
.document {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.iframeTutorial {
  width: 100%;
  height: 100%;
}
</style>
