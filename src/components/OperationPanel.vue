<template>
  <el-card class="box-card" v-if="showPanel">

  </el-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'OperationPanel',
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters([
            'showPanel',
        ])
    },
}
</script>

<style>
.box-card {
    float: left;
    width: 450px;
    height: 90%;
    position: fixed;
    top: 25px;
    right: 5%;
}

.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}
</style>
