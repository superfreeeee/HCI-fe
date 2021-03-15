<template>
  <svg class="graph"></svg>  
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

// const graphData = {
//     nodes: [
//     {
//       id: '1',
//       name: '皮卡丘',
//       radius: 2,
//       group: '宠物',
//     },
//     {
//       id: '2',
//       name: '小智',
//       radius: 2,
//       group: '人物',
//     },
//     {
//       id: '3',
//       name: '杰尼龟',
//       radius: 2,
//       group: '宠物',
//     }
//   ],
//   links: [
//     {
//       source: '1',
//       target: '2',
//       name: '主人',
//       value: 2,
//     },
//     {
//       source: '1',
//       target: '3',
//       name: '朋友',
//       value: 2,
//     }
//   ],
// }

export default {
  name: 'D3Sample',
  data () {
    return {
      config: {
        width: 1000,
        height: 750
      },
      // graphData,
      chart: null
    }
  },
  mounted () {
    this.getGraphData().then(() => {
      this.putCharts()
    })
  },
  computed: {
    ...mapGetters([
      'graphData',
    ])
  },
  methods: {
    ...mapActions([
      'getGraphData',
    ]),
    drag (simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event,d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event,d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return this.$d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    },
    putCharts () {
      const d3 = this.$d3
      const { width, height } = this.config
      const data = this.graphData
      // console.log("data:" , data)
      const links = data.relations.map(d => Object.create(d));
      const nodes = data.nodes.map(d => Object.create(d));

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(() => 50))
        .force('charge', d3.forceManyBody())
        .force('x', d3.forceX())
        .force('y', d3.forceY());

      const svg = d3.select(this.$el)
        // .create('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        
      const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value));

      link.append('relation')
        .text(d => d.name)

      const scale = d3.scaleOrdinal(d3.schemeCategory10)

      const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 10)
        .attr('fill', d => scale(d.group))
        .call(this.drag(simulation))
        .on('click', (e) => {
          console.log(e)
        })

      node.append('title')
        .text(d => d.name)

      simulation.on('tick', () => {
        link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node.attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

      // invalidation.then(() => simulation.stop());

      this.chart = svg.node();
      console.log(this.chart)
    }
  }
}
</script>

<style scoped>
.graph {
  height: 100vh;
  width: 100%;
}
</style>
