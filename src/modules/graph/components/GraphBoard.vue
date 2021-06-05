<template>
  <svg id="graph"></svg>
</template>

<script>
import config from '../utils/config'
import { calcScale } from '../utils/layout'

export default {
  name: 'GraphBoard',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      config: { ...config },
      nodes: [],
      links: [],
      svgElements: {
        simulation: null,
        view: null,
        root: null,
        focusGroup: null,
        svgLinks: null,
        svgLinksText: null,
        svgNodes: null,
        svgNodesText: null,
        boundDrag: null,
        boundZoom: null,
        scale: null
      }
    }
  },
  methods: {
    /***** 重新挂载图谱 *****/
    mountGraphData(data) {
      const { nodes, links } = data
      this.nodes = nodes
      this.links = links
      this.init()
    },
    /***** 图谱绘制 *****/
    init() {
      const {
        // 全局变量 & 配置
        $d3,
        $el,
        config: { width, height },
        // 子例程
        reset,
        setSimulation,
        setView,
        setRoot,
        setFocusGroup,
        setLinks,
        setLinksText,
        setNodes,
        setNodesText,
        // 力导图绑定事件
        setDrag,
        setZoom,
        tick,
        // 图谱操作
        resetZoom
      } = this
      // 清除图谱
      reset()

      const simulation = setSimulation()

      const svg = $d3
        .select($el)
        .attr('viewBox', [-width / 2, -height / 2, width, height])

      // 设置透明操作板
      const view = setView(svg)
      const root = setRoot(svg)

      const boundZoom = setZoom(root)
      view.call(boundZoom)

      // 设置高亮组
      setFocusGroup(root)

      // 设置关系、关系文字
      setLinks(root)
      setLinksText(root)

      const boundDrag = setDrag(simulation)
      const scale = $d3.scaleOrdinal($d3.schemeCategory10)
      this.svgElements.scale = scale

      // 设置节点、节点文字
      setNodes(root, boundDrag, scale)
      setNodesText(root, boundDrag)

      simulation.on('tick', tick)

      setTimeout(() => {
        resetZoom()
      }, 0)
    },
    reset() {
      const { view, root } = this.svgElements
      if (view) view.remove()
      if (root) root.remove()
    },
    setSimulation() {
      const {
        $d3,
        nodes,
        links,
        config: { baseRadius }
      } = this
      const simulation = $d3
        .forceSimulation(nodes)
        .force(
          'link',
          $d3
            .forceLink(links)
            .id(d => d.id)
            .distance(
              d => (d.source.radius + d.target.radius) * 20 + baseRadius * 5
            )
        )
        .force(
          'charge',
          $d3.forceManyBody().strength(d => -1000 - d.radius * 300)
        )
        .force('x', $d3.forceX())
        .force('y', $d3.forceY())
      this.svgElements.simulation = simulation
      return simulation
    },
    setView(svg) {
      const { width, height } = this.config
      const view = svg
        .append('rect')
        .attr('class', 'view')
        .style('fill', 'transparent')
        .attr('x', -width / 2)
        .attr('y', -height / 2)
        .attr('width', width)
        .attr('height', height)
      this.svgElements.view = view
      return view
    },
    setRoot(svg) {
      const root = svg.append('g').attr('class', 'root')
      this.svgElements.root = root
      return root
    },
    setFocusGroup(root) {
      const focusGroup = root
        .append('g')
        .attr('class', 'focus')
        .attr('stroke', 'skyblue')
        .attr('stroke-width', 10)
      this.svgElements.focusGroup = focusGroup
    },
    setLinks(root) {
      const svgLinks = root
        .append('g')
        .attr('class', 'links')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(this.links)
        .join('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        .on('click', e => {
          console.log('click link', e)
        })
      svgLinks.append('title').text(d => d.name)
      this.svgElements.svgLinks = svgLinks
      return svgLinks
    },
    setLinksText(root) {
      const { font, fontSize } = this.config
      const svgLinksText = root
        .append('g')
        .attr('class', 'links_text')
        .selectAll('text')
        .data(this.links)
        .join('text')
        .style('fill', '#000000')
        .style('font', `${fontSize}px ${font}`)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .on('click', e => {
          console.log('click link', e)
        })
      this.svgElements.svgLinksText = svgLinksText
      return svgLinksText
    },
    setNodes(root, boundDrag, scale) {
      const {
        config: { baseRadius },
        nodes,
        focus,
        unfocus
      } = this
      const svgNodes = root
        .append('g')
        .attr('class', 'nodes')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', d => baseRadius + d.radius * 10)
        .attr('fill', d => (d.color ? d.color : scale(d.group)))
        .attr('data-id', d => d.id)
        .call(boundDrag)
        .on('click', e => {
          console.log('click node', e)
        })
        .on('mouseover', focus)
        .on('mouseout', unfocus)
      svgNodes.append('title').text(d => d.name)
      this.svgElements.svgNodes = svgNodes
      return svgNodes
    },
    setNodesText(root, boundDrag) {
      const {
        config: { font },
        nodes,
        focus,
        unfocus
      } = this
      const svgNodesText = root
        .append('g')
        .attr('class', 'nodes_text')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .style('fill', '#ffffff')
        .style('font', d => `${d.textSize}px ${font}`)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .call(boundDrag)
        .on('click', e => {
          console.log('click node', e)
        })
        .on('mouseover', focus)
        .on('mouseout', unfocus)
      this.svgElements.svgNodesText = svgNodesText
      return svgNodesText
    },
    /***** 图谱操作 *****/
    resetZoom() {
      const {
        $d3,
        config,
        nodes,
        svgElements: { view, boundZoom }
      } = this
      const scale = calcScale(nodes, config)
      view
        .transition()
        .duration(750)
        .call(boundZoom.transform, $d3.zoomIdentity.scale(scale))
    },
    /***** 力导图绑定事件 *****/
    setDrag(simulation) {
      const start = (e, d) => {
        if (!e.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      const drag = (e, d) => {
        d.fx = e.x
        d.fy = e.y
      }

      const end = (e, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      const boundDrag = this.$d3
        .drag()
        .on('start', start)
        .on('drag', drag)
        .on('end', end)
      this.svgElements.boundDrag = boundDrag
      return boundDrag
    },
    setZoom(root) {
      const boundZoom = this.$d3.zoom().on('zoom', e => {
        root.attr('transform', e.transform)
      })
      this.svgElements.boundZoom = boundZoom
      return boundZoom
    },
    tick() {
      const {
        svgLinks,
        svgLinksText,
        svgNodes,
        svgNodesText
      } = this.svgElements

      svgLinks
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      svgLinksText
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      svgNodes.attr('cx', d => d.x).attr('cy', d => d.y)

      svgNodesText.attr('x', d => d.x).attr('y', d => d.y)
    },
    focus(e) {
      const id = e.target.attributes['data-id'].value
      console.log(`focus node: ${id}, `, e)
    },
    unfocus(e) {
      console.log('unfocus', e)
    }
  }
}
</script>

<style scoped>
#graph {
  width: 100%;
  height: 100%;
}
</style>
