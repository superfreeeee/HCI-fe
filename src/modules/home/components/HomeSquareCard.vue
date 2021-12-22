<template>
  <el-card class="project-card" shadow="hover">
    <div slot="header" class="project-card-header" @click="clickCard">
      <span>{{ project.name }}</span>
    </div>
    <div class="project-card-body" @click="clickCard">
      <img v-if="project.snapshot != null" :src="project.snapshot" alt="" />
      <span v-else-if="project.snapshot === undefined">
        <!-- {{ project }} -->
        缩略图加载中
        <span class="loading"></span>
      </span>
      <span v-else-if="project.snapshot === false">
        预览加载失败
      </span>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'HomeSquareCard',
  props: ['project'],
  methods: {
    clickCard(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style scoped>
.project-card {
  width: 400px;
  cursor: pointer;
}

.project-card-header {
  padding: 18px 20px;
}

.project-card >>> .el-card__header,
.project-card >>> .el-card__body {
  padding: 0;
}

.project-card >>> .el-card__body {
  height: 400px;
}

.project-card-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.loading::after {
  content: '';
  display: inline-block;
  width: 25px;
  text-align: left;
  animation: loading infinite 2s;
}

@keyframes loading {
  0% {
    content: '.';
  }
  20% {
    content: '..';
  }
  40% {
    content: '...';
  }
  60% {
    content: '....';
  }
  80% {
    content: '.....';
  }
}
</style>
