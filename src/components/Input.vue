<template>
  <el-input
    class="search-input"
    ref="search_input"
    :style="{ width }"
    @focus="onInputFocus"
    @blur="onInputBlur"
    v-model="value"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  >
    <el-button
      slot="append"
      icon="el-icon-search"
      @click="submitSearch(value)"
    ></el-button>
  </el-input>
</template>

<script>
export default {
  name: 'Input',
  props: ['width', 'submitSearch'],
  data() {
    return {
      value: '',
    };
  },
  methods: {
    focusInput() {
      this.$refs.search_input.focus();
    },
    onInputFocus() {
      document.addEventListener('keydown', this.keydownSubmit);
    },
    onInputBlur() {
      document.removeEventListener('keydown', this.keydownSubmit);
    },
    keydownSubmit(e) {
      if (e.key === 'Enter' && !e.isComposing) {
        this.submitSearch(this.value);
      }
    },
  },
  mounted() {
    this.focusInput();
  },
};
</script>

<style scoped>
.search-input {
  width: 500px;
  flex: 1;
}
</style>
