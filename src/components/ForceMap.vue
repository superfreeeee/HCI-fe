<template>
  <div :id="id" :option="option"></div>
</template>

<script>
import Highcharts from 'highcharts';
import networkgraph from 'highcharts/modules/networkgraph';

networkgraph(Highcharts);

export default {
    name: 'ForceMap',
    props: {
        id: {
            type: String
        },
        option: {
            type: Object
        }
    },
    data() {
        return {

        }
    },
    mounted() {
        Highcharts.chart(this.id, this.option)
    },
	methods: {

	},
    created() {
		Highcharts.addEvent(
			Highcharts.seriesTypes.networkgraph,
			'afterSetOptions',
			function (e) {
				var colors = Highcharts.getOptions().colors,
					i = 0,
					nodes = {};
				e.options.data.forEach(function (link) {
					if (link[0] === 'Proto Indo-European') {
						nodes['Proto Indo-European'] = {
							id: 'Proto Indo-European',
							marker: {
								radius: 20
							}
						};
						nodes[link[1]] = {
							id: link[1],
							marker: {
								radius: 10
							},
							color: colors[i++]
						};
					} else if (nodes[link[0]] && nodes[link[0]].color) {
						nodes[link[1]] = {
							id: link[1],
							color: nodes[link[0]].color
						};
					}
				});
				e.options.nodes = Object.keys(nodes).map(function (id) {
					return nodes[id];
				});
			}
		);
    }
}
</script>

<style>

</style>
