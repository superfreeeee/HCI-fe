<template>
  <div class="home">
    <div class="test">
      <ForceMap :id="id" :option="option"></ForceMap>
    </div>
    <OperationPanel />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import ForceMap from '../components/ForceMap';
import options from '../ForceMapOptions/options';
import OperationPanel from '../components/OperationPanel';

export default {
  name: 'Home',
  data() {
    let option = options.force;
    return {
      id: 'test',
      option: option
    }
  },
  components: {
    ForceMap,
    OperationPanel,
  },
  methods: {
    ...mapMutations([
			'set_showPanel'
		]),
		...mapActions([
			
		]),
		set_showPanel_visible() {
			this.set_showPanel(true);
		},
  }
}
</script>

<style>
.home {
  width: 100%;
  height: 100%;
}

.test {
	min-width: 350px;
	max-width: 530px;
  margin-left: 30px;
}

#select-btn {
  position: absolute;
  left: 45%;
  bottom: 5%;
  width: 70px;
}
</style>
