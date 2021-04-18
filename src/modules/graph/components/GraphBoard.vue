<template>
  <svg id="graph"></svg>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import config from '../utils/config'

export default {
  name: 'GraphBoard',
  data() {
    return {
      config,
      initialized: false,
      simulation: null,
      root: null,
      links: null,
      nodes: null,
      linksText: null,
      nodesText: null,
      boundDrag: null,
      boundZoom: null,
      pinned: false,
      locked: false
    }
  },
  computed: {
    ...mapGetters([
      'graphNodes',
      'graphLinks',
      'graphBoardSvg',
      'graphBoardFocus',
      'graphBoardMode',
      'graphBoardScale',
      'graphBoardGroups'
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
    graphBoardFocus() {
      this.unfocus(true)
    },
    graphBoardMode(mode) {
      console.log(`[GraphBoard] switch mode: ${mode}`)
      const { restoreLayout, zoomReset } = this
      this.locked = mode === 'GRID'
      this.pinned = mode !== 'FORCE'
      restoreLayout().then(() => {
        zoomReset()
      })
    },
    graphBoardGroups(groups) {
      if (this.initialized) {
        console.log('[GraphBoard] groups changed', [...groups])
        this.reload()
      }
    }
  },
  methods: {
    ...mapMutations(['setGraphBoardSvg', 'setGraphBoardFocus']),
    ...mapActions(['graphInit', 'editorSelect', 'restoreLayout']),
    /********** d3 graph init **********/
    //
    init() {
      console.log('[GraphBoard] init')
      this.initialized = false
      const {
        config: { width, height, baseRadius, font, fontSize },
        graphNodes,
        graphLinks,
        drag,
        zoom,
        zoomReset,
        focus,
        tick,
        unfocus,
        selectItemHandler,
        $d3: d3,
        $el,
        setGraphBoardSvg,
        restoreLayout
      } = this
      let simulation,
        boundDrag,
        svg,
        root,
        view,
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

      view = svg
        .append('rect')
        .attr('class', 'view')
        .style('fill', 'transparent')
        .attr('x', -width / 2)
        .attr('y', -height / 2)
        .attr('width', width)
        .attr('height', height)

      if (root) root.remove()
      root = svg.append('g').attr('class', 'root')

      // zoom for root
      boundZoom = zoom(root)
      view.call(boundZoom)

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
        .style('font', `${fontSize}px ${font}`)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
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
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => (d.color ? d.color : scale(d.group)))
        .attr('data-id', d => d.id)
        .call(boundDrag)
        .on('click', selectItemHandler('node'))
        .on('mouseover', focus)
        .on('mouseout', () => unfocus(true))
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
        .style('font', d => `${d.textSize}px ${font}`)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .call(boundDrag)
        .on('click', selectItemHandler('node'))
        .on('mouseover', focus)
        .on('mouseout', () => unfocus(true))

      /**
       * store selection
       */
      setGraphBoardSvg(svg)

      /**
       * bind simulation tick
       */
      simulation.on('tick', tick)
      restoreLayout().then(() => {
        zoomReset()
      })
      this.initialized = true

      this.simulation = simulation
      this.boundDrag = boundDrag
      this.svg = svg
      this.root = root
      this.view = view
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
      const {
        config: { baseRadius, font, fontSize, opacity },
        $d3: d3,
        selectItemHandler,
        graphNodes,
        graphLinks,
        graphBoardFocus,
        graphBoardGroups,
        simulation,
        scale,
        boundDrag,
        focus,
        unfocus,
        setFocus,
        tick
      } = this
      let { links, linksText, nodes, nodesText } = this
      const groupMapper = {}
      graphNodes.forEach(({ id, group }) => {
        groupMapper[id] = group
      })

      unfocus(false)
      simulation.stop()
      links.remove()
      linksText.remove()
      nodes.remove()
      nodesText.remove()

      for (const link of graphLinks) {
        link.source = link.from
        link.target = link.to
      }

      links = d3
        .select('.links')
        .selectAll('line')
        .data(graphLinks)
        .join('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('opacity', d =>
          graphBoardGroups.includes(groupMapper[d.from]) &&
          graphBoardGroups.includes(groupMapper[d.to])
            ? 1
            : opacity
        )
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        .on('click', selectItemHandler('link'))
      links.append('title').text(d => d.name)

      linksText = d3
        .select('.links_text')
        .selectAll('text')
        .data(graphLinks)
        .join('text')
        .style('fill', '#000000')
        .style('font', `${fontSize}px ${font}`)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .on('click', selectItemHandler('link'))

      nodes = d3
        .select('.nodes')
        .selectAll('circle')
        .data(graphNodes)
        .enter()
        .append('circle')
        .attr('class', 'pointer')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => (d.color ? d.color : scale(d.group)))
        .attr('opacity', d =>
          graphBoardGroups.includes(d.group) ? 1 : opacity
        )
        .attr('data-id', d => d.id)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .call(boundDrag)
        .on('click', selectItemHandler('node'))
        .on('mouseover', focus)
        .on('mouseout', () => unfocus(true))
      nodes.append('title').text(d => d.name)

      nodesText = d3
        .select('.nodes_text')
        .selectAll('text')
        .data(graphNodes)
        .join('text')
        .style('fill', '#ffffff')
        .style('font', d => `${d.textSize}px ${font}`)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .call(boundDrag)
        .on('click', selectItemHandler('node'))
        .on('mouseover', focus)
        .on('mouseout', () => unfocus(true))

      simulation.nodes(graphNodes)
      simulation.force('link').links(graphLinks)
      simulation.on('tick', tick)
      simulation.alpha(1).restart()
      setFocus(graphBoardFocus)

      this.links = links
      this.linksText = linksText
      this.nodes = nodes
      this.nodesText = nodesText
    },
    /********** d3 gesture **********/
    // d3 拖曳
    drag(simulation) {
      const d3 = this.$d3

      const dragstarted = (event, d) => {
        if (this.locked) return
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      const dragged = (event, d) => {
        if (this.locked) return
        d.fx = event.x
        d.fy = event.y
      }

      const dragended = (event, d) => {
        if (this.locked) return
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
    // d3 缩放
    zoom(root) {
      const d3 = this.$d3
      return d3.zoom().on('zoom', e => {
        // view.attr('transform', e.transform)
        root.attr('transform', e.transform)
      })
    },
    // 设置焦点
    setFocus(nodeId) {
      const {
        config: { baseRadius },
        graphNodes,
        root,
        setGraphBoardFocus,
        unfocus
      } = this
      let { focusNode } = this
      unfocus(false)
      if (nodeId) {
        const node = graphNodes.filter(node => node.id === nodeId)[0]
        if (!node) {
          setGraphBoardFocus(false) // nodeId notfound
          return
        }
        focusNode = root
          .select('.focus')
          .selectAll('circle')
          .data([node])
          .join('circle')
          .attr('r', d => baseRadius + d.radius * 10 + 5)
          .attr('fill', 'none')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
        this.focusNode = focusNode
      }
    },
    // 实体焦点
    focus(e) {
      const nodeId = Number(e.target.attributes['data-id'].value)
      this.setFocus(nodeId)
    },
    // 取消实体焦点
    unfocus(refocus) {
      const { focusNode, graphBoardFocus, setFocus } = this
      if (focusNode) {
        focusNode.remove()
        this.focusNode = null
      }
      if (refocus) {
        setFocus(graphBoardFocus)
      }
    },
    // 每帧刷新
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
    // 选中实体/关系
    selectItemHandler(type) {
      return e => {
        e.stopPropagation()
        const id = Number(e.target.attributes['data-id'].value)
        this.editorSelect({ type, id })
        this.$emit('editor-open')
      }
    },
    // 取消选取
    selectItemCanel() {
      this.editorSelect({ type: 'cancel' })
    },
    /********** GraphOptions **********/
    // 全局刷新
    backCenter() {
      const { graphNodes, reload, graphBoardMode } = this
      if (graphBoardMode === 'FORCE') {
        for (const node of graphNodes) {
          node.x = node.y = 0
          node.vx = node.vy = 0
          node.fx = node.fy = null
        }
        reload()
      }
    },
    // 重置缩放
    zoomReset() {
      const { view, boundZoom, $d3, graphBoardScale } = this
      view
        .transition()
        .duration(750)
        .call(boundZoom.transform, $d3.zoomIdentity.scale(graphBoardScale))
    }
    // 定点模式
    // pinNodes() {
    //   const { simulation, graphNodes, pinned } = this
    //   if (!pinned) {
    //     this.pinned = true
    //     simulation.stop()
    //     for (const node of graphNodes) {
    //       node.fx = node.x
    //       node.fy = node.y
    //     }
    //   }
    // },
    // 取消固定实体
    // unPinNodes() {
    //   const { simulation, graphNodes, pinned } = this
    //   if (pinned) {
    //     this.pinned = false
    //     for (const node of graphNodes) {
    //       node.fx = null
    //       node.fy = null
    //     }
    //     simulation.alpha(1).restart()
    //   }
    // }
  },
  mounted() {
    this.$el.addEventListener('click', this.selectItemCanel)
  },
  destroyed() {
    this.$el.removeEventListener('click', this.selectItemCanel)
  }
}
</script>

<style scoped>
#graph {
  width: 100%;
  height: 100%;
}
</style>
