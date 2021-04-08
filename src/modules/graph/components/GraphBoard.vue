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
      nodes: null,
      linksText: null,
      nodesText: null,
      boundDrag: null,
      boundZoom: null,
      pinned: false
    }
  },
  computed: {
    ...mapGetters([
      'graphNodes',
      'graphLinks',
      'graphBoardSvg',
      'graphBoardFocus'
    ])
  },
  watch: {
    graphNodes() {
      if (this.initialized) {
        this.reload()
      }
    },
    graphLinks() {
      if (this.initialized) {
        this.reload()
      }
    },
    graphBoardFocus(focus) {
      if (!focus) {
        this.unfocus()
      }
    }
  },
  methods: {
    ...mapMutations(['setGraphBoardSvg']),
    ...mapActions(['graphInit', 'editorSelect']),
    /********** d3 graph init **********/
    init() {
      console.log('[GraphBoard] init')
      this.initialized = false
      const {
        config: { width, height, baseRadius, font },
        graphNodes,
        graphLinks,
        drag,
        zoom,
        focus,
        unfocus,
        selectItemHandler,
        $d3: d3,
        $el
      } = this
      let simulation,
        boundDrag,
        svg,
        root,
        boundZoom,
        focusNode,
        links,
        linksText,
        scale,
        nodes,
        nodesText

      /**
       * init simulation
       */
      simulation = d3
        .forceSimulation(graphNodes)
        .force(
          'link',
          d3
            .forceLink(graphLinks)
            .id(d => d.id)
            .distance(
              d => (d.source.radius + d.target.radius) * 20 + baseRadius * 5
            )
        )
        .force(
          'charge',
          d3.forceManyBody().strength(d => -1000 - d.radius * 300)
        )
        .force('x', d3.forceX())
        .force('y', d3.forceY())
      // drag for simulation
      boundDrag = drag(simulation)

      /**
       * init svg & root
       */
      svg = d3
        .select($el)
        .attr('viewBox', [-width / 2, -height / 2, width, height])

      if (root) root.remove()
      root = svg.append('g').attr('class', 'root')
      // zoom for root
      boundZoom = zoom(root)
      root.call(boundZoom)

      /**
       * focus Node
       */
      focusNode = root
        .append('g')
        .attr('class', 'focus')
        .attr('stroke', 'skyblue')
        .attr('stroke-width', 10)
        .selectAll('circle')
      focusNode.exit().remove()
      focusNode = null

      /**
       * init links
       */
      links = root
        .append('g')
        .attr('class', 'links')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(graphLinks)
        .join('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        .on('click', selectItemHandler('link'))
      links.append('title').text(d => d.name)

      /**
       * init linksText
       */
      linksText = root
        .append('g')
        .attr('class', 'links_text')
        .selectAll('text')
        .data(graphLinks)
        .join('text')
        .style('fill', '#000000')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        // .attr('x', d => (d.source.x + d.target.x) / 2)
        // .attr('y', d => (d.source.y + d.target.y) / 2)
        .on('click', selectItemHandler('link'))

      /**
       * init nodes
       */
      scale = d3.scaleOrdinal(d3.schemeCategory10)
      nodes = root
        .append('g')
        .attr('class', 'nodes')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(graphNodes)
        .join('circle')
        .attr('class', 'pointer')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => scale(d.group))
        .attr('data-id', d => d.id)
        .call(boundDrag)
        .on('click', selectItemHandler('node'))
        .on('mouseover', focus)
        .on('mouseout', () => unfocus())
      nodes.append('title').text(d => d.name)

      /**
       * init nodesText
       */
      nodesText = root
        .append('g')
        .attr('class', 'nodes_text')
        .selectAll('text')
        .data(graphNodes)
        .join('text')
        .style('fill', '#ffffff')
        .style('font', font)
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .call(boundDrag)
        .on('click', selectItemHandler('node'))

      /**
       * store selection
       */
      this.setGraphBoardSvg(svg)

      /**
       * bind simulation tick
       */
      simulation.on('tick', this.tick)
      this.initialized = true

      this.simulation = simulation
      this.boundDrag = boundDrag
      this.svg = svg
      this.root = root
      this.boundZoom = boundZoom
      this.focusNode = focusNode
      this.links = links
      this.linksText = linksText
      this.scale = scale
      this.nodes = nodes
      this.nodesText = nodesText
    },
    /********** d3 graph update **********/
    reload() {
      console.log('[GraphBoard] reload')
      const { baseRadius, font } = this.config
      const d3 = this.$d3

      this.simulation.stop()
      this.links.remove()
      this.linksText.remove()
      this.nodes.remove()
      this.nodesText.remove()

      for (const link of this.graphLinks) {
        link.source = link.from
        link.target = link.to
      }

      this.links = d3
        .select('.links')
        .selectAll('line')
        .data(this.graphLinks)
        .join('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        // .merge(this.links)
        .on('click', this.selectItemHandler('link'))
      this.links.append('title').text(d => d.name)

      this.linksText = d3
        .select('.links_text')
        .selectAll('text')
        .data(this.graphLinks)
        .join('text')
        .style('fill', '#000000')
        .style('font', font)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        // .merge(this.linksText)
        .on('click', this.selectItemHandler('link'))

      this.nodes = d3
        .select('.nodes')
        .selectAll('circle')
        .data(this.graphNodes)
        .enter()
        .append('circle')
        .attr('class', 'pointer')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => this.scale(d.group))
        .attr('data-id', d => d.id)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        // .merge(this.nodes)
        .call(this.boundDrag)
        .on('click', this.selectItemHandler('node'))
      this.nodes.append('title').text(d => d.name)

      this.nodesText = d3
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
        // .merge(this.nodesText)
        .call(this.boundDrag)
        .on('click', this.selectItemHandler('node'))

      this.simulation.nodes(this.graphNodes)
      this.simulation.force('link').links(this.graphLinks)
      this.simulation.on('tick', this.tick)
      this.simulation.alpha(1).restart()
    },
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
    setFocus(nodeId) {
      const {
        config: { baseRadius },
        graphNodes
      } = this
      let { focusNode } = this
      const node = graphNodes.filter(node => node.id === nodeId)[0]
      focusNode = this.root
        .select('.focus')
        .selectAll('circle')
        .data([node])
        .join('circle')
        .attr('r', d => baseRadius + d.radius * 10 + 5)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      this.focusNode = focusNode
    },
    focus(e) {
      this.setFocus(Number(e.target.attributes['data-id'].value))
    },
    unfocus() {
      const { focusNode, graphBoardFocus, setFocus } = this
      focusNode.remove()
      if (graphBoardFocus) {
        setFocus(graphBoardFocus)
      }
    },
    tick() {
      const { links, linksText, nodes, nodesText, focusNode } = this

      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      linksText
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      nodes.attr('cx', d => d.x).attr('cy', d => d.y)
      nodesText.attr('x', d => d.x).attr('y', d => d.y)
      if (focusNode) {
        focusNode.attr('cx', d => d.x).attr('cy', d => d.y)
      }
    },
    selectItemHandler(type) {
      return e => {
        const id = Number(e.target.attributes['data-id'].value)
        this.editorSelect({ type, id })
        this.$emit('editor-open')
      }
    },
    /********** GraphOptions **********/
    backCenter() {
      this.graphBoardSvg.select('g').remove()
      this.pinned = false
      for (const node of this.graphNodes) {
        node.x = node.y = 0
        node.vx = node.vy = 0
        node.fx = node.fy = null
      }
      for (const link of this.graphLinks) {
        link.source = link.from
        link.target = link.to
      }
      this.init()
    },
    zoomReset() {
      const { root, boundZoom, $d3 } = this
      root
        .transition()
        .duration(500)
        .call(boundZoom.transform, $d3.zoomIdentity)
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
    console.log('graph mounted')
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
