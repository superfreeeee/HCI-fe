<template>
  <div class="document">
    <DocumentSidebar :headers="headers" :setAnchor="setAnchor" />
    <iframe
      ref="document_iframe_ref"
      :src="src"
      frameborder="0"
      class="iframeClass"
    ></iframe>
  </div>
</template>

<script>
import DocumentSidebar from './DocumentSidebar.vue';
import { getInnerFrameHeaders } from '../utils/innerFrame';
import { ROUTE_PATH } from '../../../router/config';

const DOCUMENT_PREFIX = '../../static/';

const srcMap = {
  [ROUTE_PATH.Tutorial]: 'guide.html',
  [ROUTE_PATH.SystemDesign]: 'systemdesign.html',
};

export default {
  components: { DocumentSidebar },
  name: 'Document',
  data() {
    return {
      src: '',
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
    initAnchor(_document) {
      const a = _document.createElement('a');
      a.style.display = 'none';
      this.innerLink = a;
    },
    loadHeaders(_document) {
      const headers = getInnerFrameHeaders(_document);
      this.headers = headers;
    },
    onRouteChange() {
      const path = this.$route.path;
      const newSrc = `${DOCUMENT_PREFIX}${srcMap[path]}`;

      if (this.src !== newSrc) {
        console.log(`update src = ${this.src}, newSrc =  ${newSrc}`);
        const frame = this.$refs.document_iframe_ref;
        frame.onload = () => {
          console.log('innerWindow onload');
          const _document = frame.contentWindow.document;
          this.loadHeaders(_document);
          this.initAnchor(_document);
          frame.onload = null;
        };
        this.src = newSrc;
      }
    },
  },
  watch: {
    ['$route']() {
      this.onRouteChange();
    },
  },
  mounted() {
    this.onRouteChange();
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

.iframeClass {
  width: 100%;
  height: 100%;
}
</style>
