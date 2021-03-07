<template>
  <div id="test">
    <ForceMap :id="id" :option="option"></ForceMap>
  </div>
</template>

<script>
import ForceMap from '../components/ForceMap';
import options from '../ForceMapOptions/options';

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
  }
}
</script>

<style>
#test {
	min-width: 350px;
	max-width: 530px;
	margin: 0 auto;
}
</style>