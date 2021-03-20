<template>
  <svg id="graph"></svg>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'GraphBoard',
  data() {
    return {
      config: {
        width: 1000,
        height: 750,
        baseRadius: 25,
        font: '20px Arial'
      },
      initialized: false,
      simulation: null,
      root: null,
      links: null,
      recentLinks: 0,
      nodes: null,
      recentNodes: 0,
      linksText: null,
      nodesText: null,
      boundDrag: null,
      boundZoom: null,
      pinned: false
    }
  },
  computed: {
    ...mapGetters(['graphNodes', 'graphLinks', 'graphSvg'])
  },
  watch: {
    graphNodes(nodes) {
      if (this.initialized) {
        if (nodes.length > this.recentNodes) {
          this.updateNodes()
        } else {
          this.deleteNodes()
        }
        this.recentNodes = nodes.length
      }
    },
    graphLinks(links) {
      if (this.initialized) {
        if (links.length > this.recentLinks) {
          this.updateLinks()
        } else {
          this.deleteLinks()
        }
        this.recentLinks = links.length
      }
    }
  },
  methods: {
    ...mapMutations(['setGraphSvg']),
    ...mapActions(['graphInit', 'editorSelect']),
    /********** d3 graph init **********/
    init() {
      this.initialized = false
      const d3 = this.$d3
      const { width, height, baseRadius, font } = this.config
      const nodesData = this.graphNodes
      const linksData = this.graphLinks

      /**
       * init simulation
       */
      const simulation = d3
        .forceSimulation(nodesData)
        .force(
          'link',
          d3
            .forceLink(linksData)
            .id(d => d.id)
            .distance(200)
        )
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
      // drag for simulation
      const boundDrag = this.drag(simulation)

      /**
       * init svg & root
       */
      const svg = d3
        .select(this.$el)
        // .create('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height])

      const root = svg.append('g').attr('class', 'root')
      // zoom for root
      const boundZoom = this.zoom(root)
      root.call(boundZoom)

      /**
       * init links
       */
      const links = root
        .append('g')
        .attr('class', 'links')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(linksData)
        .join('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        .on('click', this.selectItemHandler('link'))
      links.append('title').text(d => d.name)

      /**
       * init linksText
       */
      const linksText = root
        .append('g')
        .attr('class', 'links_text')
        .selectAll('text')
        .data(linksData)
        .join('text')
        .style('fill', '#000000')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)
        .on('click', this.selectItemHandler('link'))

      /**
       * init nodes
       */
      const scale = d3.scaleOrdinal(d3.schemeCategory10)
      const nodes = root
        .append('g')
        .attr('class', 'nodes')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodesData)
        .join('circle')
        .attr('class', 'pointer')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => scale(d.group))
        .attr('data-id', d => d.id)
        .call(boundDrag)
        .on('click', this.selectItemHandler('node'))
      nodes.append('title').text(d => d.name)

      /**
       * init nodesText
       */
      const nodesText = root
        .append('g')
        .attr('class', 'nodes_text')
        .selectAll('text')
        .data(nodesData)
        .join('text')
        .style('fill', '#ffffff')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .call(boundDrag)
        .on('click', this.selectItemHandler('node'))

      /**
       * store selection
       */
      this.simulation = simulation
      this.setGraphSvg(svg)
      this.root = root
      this.links = links
      this.recentLinks = links.length
      this.nodes = nodes
      this.recentNodes = nodes.length
      this.linksText = linksText
      this.nodesText = nodesText
      this.boundDrag = boundDrag
      this.boundZoom = boundZoom
      this.scale = scale

      /**
       * bind simulation tick
       */
      simulation.on('tick', this.tick)
      this.initialized = true
    },
    /********** d3 graph update **********/
    updateNodes() {
      // console.log('graphNodes update')
      const { baseRadius, font } = this.config
      /**
       * update nodes
       */
      this.nodes = this.nodes
        .data(this.graphNodes)
        .enter()
        .append('circle')
        .attr('class', 'pointer')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => this.scale(d.group))
        .attr('data-id', d => d.id)
        .merge(this.nodes)
        .call(this.boundDrag)
        .on('click', this.selectItemHandler('node'))

      /**
       * update nodesText
       */
      this.nodesText = this.nodesText
        .data(this.graphNodes)
        .enter()
        .append('text')
        .style('fill', '#ffffff')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .merge(this.nodesText)
        .call(this.boundDrag)
        .on('click', this.selectItemHandler('node'))
      /**
       * update simulation
       */
      this.simulation.nodes(this.graphNodes).on('tick', this.tick)
      this.simulation.alpha(1).restart()
    },
    updateLinks() {
      // console.log('graphLinks update')
      const { font } = this.config
      /**
       * update links
       */
      this.links = this.links
        .data(this.graphLinks)
        .enter()
        .append('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        .merge(this.links)
        .on('click', this.selectItemHandler('link'))
      /**
       * update linksText
       */
      this.linksText = this.linksText
        .data(this.graphLinks)
        .enter()
        .append('text')
        .style('fill', '#000000')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)
        .merge(this.linksText)
        .on('click', this.selectItemHandler('link'))
      /**
       * update simulation
       */
      this.simulation.force('link').links(this.graphLinks)
      this.simulation.alpha(1).restart()
    },
    deleteNodes() {
      this.simulation.stop()
      const { baseRadius, font } = this.config

      /**
       * remove nodes
       */
      this.nodes.remove()
      /**
       * remove nodesTetxt
       */
      this.nodesText.remove()

      /**
       * redraw nodes
       */
      this.nodes = this.$d3
        .select('.nodes')
        .selectAll('circle')
        .data(this.graphNodes)
        .join('circle')
        .attr('class', 'pointer')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => this.scale(d.group))
        .attr('data-id', d => d.id)
        .call(this.boundDrag)
        .on('click', this.selectItemHandler('node'))
      this.nodes.append('title').text(d => d.name)

      /**
       * redraw nodesText
       */
      this.nodesText = this.$d3
        .select('.nodes_text')
        .selectAll('text')
        .data(this.graphNodes)
        .join('text')
        .style('fill', '#ffffff')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .call(this.boundDrag)
        .on('click', this.selectItemHandler('node'))
      /**
       * reset simulation
       */
      this.simulation.on('tick', this.tick)
      this.simulation.alpha(1).restart()
    },
    deleteLinks() {},
    /********** d3 gesture **********/
    drag(simulation) {
      const d3 = this.$d3

      const dragstarted = (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      const dragged = (event, d) => {
        d.fx = event.x
        d.fy = event.y
      }

      const dragended = (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        if (this.pinned) {
          simulation.stop()
        } else {
          d.fx = null
          d.fy = null
        }
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
    },
    tick() {
      this.links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      this.linksText
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      this.nodes.attr('cx', d => d.x).attr('cy', d => d.y)
      this.nodesText.attr('x', d => d.x).attr('y', d => d.y)
    },
    selectItemHandler(type) {
      return e => {
        const id = Number(e.target.attributes['data-id'].value)
        this.editorSelect({ type, id })
      }
    },
    /********** GraphOptions **********/
    backCenter() {
      this.graphSvg.select('g').remove()
      this.pinned = false
      for (const node of this.graphNodes) {
        node.x = node.y = 0
        node.vx = node.vy = 0
        node.fx = node.fy = null
      }
      this.init()
    },
    zoomReset() {
      this.root
        .transition()
        .duration(500)
        .call(this.boundZoom.transform, this.$d3.zoomIdentity)
    },
    pinNodes() {
      if (!this.pinned) {
        this.pinned = true
        this.simulation.stop()
        for (const node of this.graphNodes) {
          node.fx = node.x
          node.fy = node.y
        }
      }
    },
    unPinNodes() {
      if (this.pinned) {
        this.pinned = false
        for (const node of this.graphNodes) {
          node.fx = null
          node.fy = null
        }
        const simulation = this.simulation
        simulation.alpha(1).restart()
      }
    }
  },
  mounted() {
    const projectId = this.$route.params.projectId
    console.log(`[GraphBoard] mounted, projectId = ${projectId}`)
    this.graphInit(projectId).then(() => this.init())
  }
}
</script>

<style scoped>
#graph {
  width: 100%;
  height: 100%;
}
</style>
