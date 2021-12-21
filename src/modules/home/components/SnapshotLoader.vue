<template>
  <div class="loader-container">
    <GraphBoard ref="graph_board" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import GraphBoard from '../../graph/components/GraphBoard.vue';

export default {
  components: { GraphBoard },
  name: 'SnapshotLoader',
  methods: {
    ...mapActions(['getProjectInfo', 'getProjectGraphData']),
    async load(projectId) {
      console.info(`[SnapshotLoader] load snapshot for ${projectId}`);
      const projectInfo = await this.getProjectInfo(projectId);
      const graphData = await this.getProjectGraphData(projectId);
      console.log(
        `[SnapshotLoader] (projectId = ${projectId}).graphData`,
        graphData,
      );

      if (graphData) {
        const board = this.$refs.graph_board;
        await board.mountGraphData(graphData, projectInfo);
        console.log(
          `[SnapshotLoader] board.flags.loaded = ${board.flags.loaded}`,
        );
        const snapshot = await board.getSnapshot();
        console.log(`[SnapshotLoader] snapshot.length = ${snapshot.length}`);
        return snapshot;
      }
    },
  },
};
</script>

<style scoped>
.loader-container {
  position: absolute;
  left: 100vw;
  width: 600px;
  height: 400px;
}
</style>
