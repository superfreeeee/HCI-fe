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

const headersCache = {
  [ROUTE_PATH.Tutorial]: null,
  [ROUTE_PATH.SystemDesign]: null,
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
      const targetH = e.target;
      const id = targetH.id;
      if (id) {
        const a = this.innerLink;
        a.href = `#${id}`;
        a.click();
      }
    },
    initAnchor(_document) {
      if (this.innerLink) {
        this.innerLink.remove();
      }
      const a = _document.createElement('a');
      a.style.display = 'none';
      this.innerLink = a;
      _document.appendChild(a);
    },
    loadHeaders(_document, path) {
      if (!this.headers) {
        const headers = getInnerFrameHeaders(_document);
        headersCache[path] = this.headers = headers;
      }
    },
    onRouteChange() {
      const path = this.$route.path;
      const newSrc = `${DOCUMENT_PREFIX}${srcMap[path]}`;

      if (this.src !== newSrc) {
        this.headers = headersCache[path];
        const frame = this.$refs.document_iframe_ref;
        frame.onload = () => {
          const _document = frame.contentWindow.document;
          this.loadHeaders(_document, path);
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
