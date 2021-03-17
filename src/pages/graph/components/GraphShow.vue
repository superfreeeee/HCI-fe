<template>
  <svg class="graph"></svg>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'D3Sample',
  data() {
    return {
      config: {
        width: 1000,
        height: 750,
        baseRadius: 25,
        font: '20px Arial'
      }
    }
  },
  mounted() {
    this.getGraphData().then(() => {
      this.init()
    })
  },
  computed: {
    ...mapGetters(['graphData', 'graph'])
  },
  methods: {
    ...mapActions(['getGraphData', 'panelSelect', 'graphInit']),
    init() {
      const d3 = this.$d3
      const { width, height, baseRadius, font } = this.config
      const data = this.graphData
      console.log({ ...data })
      const links = data.relations.map(d => Object.create(d))
      const nodes = data.nodes.map(d => Object.create(d))

      // init simulation
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink(links)
            .id(d => d.id)
            .distance(200)
        )
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX())
        .force('y', d3.forceY())

      const drag = this.drag(simulation)

      // init svg
      const svg = d3
        .select(this.$el)
        // .create('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height])

      const root = svg
        .append('g')

      const zoom = this.zoom(root)
      root.call(zoom)

      const panelSelection = type => e => {
        const id = Number(e.target.attributes['data-id'].value)
        this.panelSelect({ type, id })
      }

      // init links
      const svg_links = root
        .append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        .on('click', panelSelection('relation'))

      svg_links.append('title').text(d => d.name)

      // init nodes
      const scale = d3.scaleOrdinal(d3.schemeCategory10)
      const svg_nodes = root
        .append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => scale(d.group))
        .attr('data-id', d => d.id)
        .call(drag)
        .on('click', panelSelection('node'))

      svg_nodes.append('title').text(d => d.name)

      const svg_nodes_text = root
        .append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .style('fill', '#ffffff')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .call(drag)
        .on('click', panelSelection('node'))

      const svg_links_text = root
        .append('g')
        .selectAll('path.link')
        .data(links)
      // add path
      svg_links_text
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('stroke', 'white')
        .style('stroke-width', 0.5)
        .style('fill', 'white')
        .style('fill-opacity', 1)
        .attr('id', d => `link-${d.id}`)

      simulation.on('tick', () => {
        svg_links
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

        svg_nodes.attr('cx', d => d.x).attr('cy', d => d.y)
        svg_nodes_text.attr('x', d => d.x).attr('y', d => d.y)
      })

      this.graphInit({
        simulation,
        svg,
        root,
        svg_links,
        svg_nodes,
        links,
        nodes,
        svg_nodes_text,
        drag,
        zoom
      })

      // d3.timeout(() => {
      //   nodes.push({
      //     id: 4,
      //     group: 'other',
      //     name: 'blablabla',
      //     radius: 4
      //   })
      //   this.svg_nodes = svg_nodes
      //     .data(nodes)
      //     .enter()
      //     .append('circle')
      //     .attr('r', d => 10 + d.radius * 5)
      //     .attr('fill', d => scale(d.group))
      //     .merge(svg_nodes)
      //     .call(this.drag(simulation))
      //     .on('click', e => {
      //       console.log(e)
      //     })

      //   simulation.nodes(nodes)
      //   simulation.force('link').links(links)
      //   simulation.alpha(1).restart()
      // }, 1000)
    },
    drag(simulation) {
      const d3 = this.$d3

      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(event, d) {
        d.fx = event.x
        d.fy = event.y
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    zoom(selection) {
      const d3 = this.$d3
      return d3.zoom().on('zoom', e => {
        selection.attr('transform', e.transform)
      })
    }
  }
}
</script>

<style scoped>
.graph {
  height: 100%;
  width: 100%;
}
</style>
