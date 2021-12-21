<template>
  <div class="list">
    <div class="cards">
      <HomeSquareCard
        v-for="project in allProjects"
        :key="project.projectId"
        :project="project"
        @click="gotoSmarthelper(project.projectId)"
      />
    </div>
    <el-pagination
      layout="prev, pager, next"
      :total="allListCount"
      @current-change="switchPageAll"
      :current-page="allPageNo"
    >
    </el-pagination>
    <!-- invisible snapshot builder -->
    <SnapshotLoader ref="snapshot_loader" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { ROUTE_PATH } from '../../../router/config';
import HomeSquareCard from './HomeSquareCard.vue';
import SnapshotLoader from './SnapshotLoader.vue';
import { SnapshotCache } from '../utils/snapshot';

export default {
  components: { HomeSquareCard, SnapshotLoader },
  name: 'HomeSquare',
  computed: {
    ...mapGetters(['allProjects', 'allPageNo', 'allListCount']),
  },
  methods: {
    ...mapMutations(['setAllPageNo', 'setAllProjectsSnapshot']),
    ...mapActions(['getAllListByPageNo']),
    gotoSmarthelper(id) {
      console.log('go smart helper');
      this.$router.push(ROUTE_PATH.Smarthelper(id));
    },
    switchPageAll(currPageNo) {
      // console.log('switchPage', currPageNo)
      this.setAllPageNo(currPageNo);
      this.getAllListByPageNo(currPageNo);
    },
  },
  watch: {
    async allProjects(projects) {
      console.log('watch projects', projects);
      const loader = this.$refs.snapshot_loader;

      for (const project of projects) {
        if (project.snapshot) {
          return;
        }
        const projectId = project.projectId;
        let snapshot;
        // 加载缓存快照
        snapshot = SnapshotCache.get(projectId);
        if (snapshot) {
          project.snapshot = snapshot;
          return;
        }

        // 生成快照
        try {
          snapshot = await loader.load(projectId);
          if (snapshot) {
            SnapshotCache.set(projectId, snapshot);
            this.setAllProjectsSnapshot({
              ...project,
              snapshot,
            });
          } else {
            console.log('[watch.allProjects] empty snapshot');
          }
        } catch (e) {
          console.log('[watch.allProjects] load snapshot fail', e);
        }
      }
    },
  },
};
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}
</style>
