<template>
  <el-card class="project-card" shadow="hover">
    <div slot="header" class="project-card-header" @click="clickCard">
      <span>{{ project.name }}</span>
    </div>
    <div @click="clickCard">
      <img v-if="project.snapshot" :src="project.snapshot" alt="" />
      <span v-else>
        {{ project }}
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
</style>
