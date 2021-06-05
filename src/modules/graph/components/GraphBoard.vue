<template>
  <svg id="graph"></svg>
</template>

<script>
import { deepCopy } from '../../../common/utils/object'
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
      origin: null,
      config: { ...config },
      nodes: [],
      links: [],
      focusNodes: [],
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
      },
      flags: {
        singleFocus: true,
        enableFocus: true,
        pinned: false
      }
    }
  },
  methods: {
    /***** 重新挂载图谱 *****/
    mountGraphData(data) {
      this.origin = deepCopy(data)
      const { nodes, links } = data
      this.nodes = nodes
      this.links = links
      this.init()
    },
    /***** 图谱绘制 *****/
    // 初始化图谱
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
        resetZoom,
        setEnableFocus
      } = this
      // 清除图谱
      reset()
      setEnableFocus(false)

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
      this.$emit('init-property', 'nodeScale', scale)

      // 设置节点、节点文字
      setNodes(root, boundDrag, scale)
      setNodesText(root, boundDrag)

      simulation.on('tick', tick)

      setTimeout(() => {
        resetZoom()
        // this.setFocus([1, 2, 3, 4, 5], true)
        // this.setFocus([6, 7, 8, 9, 10], true)
      }, 300)
      setEnableFocus(true)
      // this.pin()
    },
    // 重置图谱节点
    reset() {
      const { view, root } = this.svgElements
      if (view) view.remove()
      if (root) root.remove()
    },
    // 设置力导图初始化
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
    // 设置拖曳背景图
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
        .on('click', this.clearFocus)
      this.svgElements.view = view
      return view
    },
    // 设置图谱根节点
    setRoot(svg) {
      const root = svg.append('g').attr('class', 'root')
      this.svgElements.root = root
      return root
    },
    // 设置图谱高亮组
    setFocusGroup(root) {
      const focusGroup = root
        .append('g')
        .attr('class', 'focus')
        .attr('stroke', 'skyblue')
        .attr('stroke-width', 10)
      this.svgElements.focusGroup = focusGroup
    },
    setLinks(root) {
      const { links, clickLink } = this
      const svgLinks = root
        .append('g')
        .attr('class', 'links')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => d.value * 5)
        .attr('id', d => `link-${d.id}`)
        .attr('data-id', d => d.id)
        .on('click', clickLink)
      svgLinks.append('title').text(d => d.name)
      this.svgElements.svgLinks = svgLinks
      return svgLinks
    },
    setLinksText(root) {
      const {
        config: { font, fontSize },
        links,
        clickLink
      } = this
      const svgLinksText = root
        .append('g')
        .attr('class', 'links_text')
        .selectAll('text')
        .data(links)
        .join('text')
        .style('fill', '#000000')
        .style('font', `${fontSize}px ${font}`)
        .style('user-select', 'none')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('data-id', d => d.id)
        .text(d => d.name)
        .on('click', clickLink)
      this.svgElements.svgLinksText = svgLinksText
      return svgLinksText
    },
    setNodes(root, boundDrag, scale) {
      const {
        config: { baseRadius },
        nodes,
        focus,
        unfocus,
        clickNode
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
        .on('click', clickNode)
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
        clickNode,
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
        .on('click', clickNode)
        .on('mouseover', focus)
        .on('mouseout', unfocus)
      this.svgElements.svgNodesText = svgNodesText
      return svgNodesText
    },
    // 设置 focus 节点
    setFocus(node) {
      const {
        config: { baseRadius },
        svgElements: { focusGroup: fg },
        flags: { singleFocus, enableFocus },
        clearFocus
      } = this
      if (!enableFocus) return

      if (fg.select(`#focus-node-${node.id}`).empty()) {
        fg.append('circle')
          .data([node])
          .join('circle')
          .attr('r', d => baseRadius + d.radius * 10 + 5)
          .attr('fill', 'none')
          .attr('id', d => `focus-node-${d.id}`)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .join(fg.selectAll('circle'))
      }
    },
    // 力导图更新
    tick() {
      const {
        focusGroup,
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

      focusGroup
        .selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    },
    /********** 图谱操作 **********/
    // 重置缩放
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
    randomDisorder() {
      this.mountGraphData(this.origin)
    },
    // 设置高亮组
    setFocusNodes(nodeIds) {
      const {
        config: { baseRadius },
        focusNodes,
        svgElements: { focusGroup: fg },
        getNodesByIds,
        setNodeFocus
      } = this
      const targetNodes = getNodesByIds(nodeIds)
      targetNodes.forEach(node => setNodeFocus(node))

      fg.selectAll('circle')
        .data(focusNodes)
        .enter()
        .insert('circle')
        .attr('r', d => baseRadius + d.radius * 10 + 5)
        .attr('fill', 'none')
        .attr('id', d => `focus-node-${d.id}`)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    },
    // 清除高亮
    clearFocus() {
      this.svgElements.focusGroup.selectAll('circle').remove()
    },
    // 固定节点
    pin() {
      const {
        svgElements: { simulation },
        nodes,
        flags: { pinned }
      } = this
      if (!pinned) {
        this.flags.pinned = true
        simulation.stop()
        nodes.forEach(node => {
          node.fx = node.x
          node.fy = node.y
        })
      }
    },
    // 取消固定
    unPin() {
      const {
        svgElements: { simulation },
        nodes,
        flags: { pinned }
      } = this
      if (pinned) {
        this.flags.pinned = false
        nodes.forEach(node => {
          node.fx = null
          node.fy = null
        })
        simulation.alpha(1).restart()
      }
    },
    /********** 节点/关系操作事件 **********/
    // 点击节点
    clickNode(e) {
      const id = Number(e.target.attributes['data-id'].value)
      const node = this.getNodeById(id)
      console.log(`click node: id=${id}, `, node)
      this.setNodeFocus(node)
    },
    // 点击关系
    clickLink(e) {
      const id = Number(e.target.attributes['data-id'].value)
      const link = this.getLinkById(id)
      console.log(`click link: id=${id}, `, link)
    },
    // 聚焦(高亮显示)
    focus(e) {
      const {
        getNodeById,
        setFocus,
        flags: { enableFocus }
      } = this
      if (!enableFocus) return

      const id = Number(e.target.attributes['data-id'].value)
      const targetNode = getNodeById(id)
      if (!targetNode) return

      setFocus(targetNode)
    },
    // 取消聚焦
    unfocus(e) {
      const {
        flags: { enableFocus },
        _unfocus
      } = this
      if (!enableFocus) return

      const id = Number(e.target.attributes['data-id'].value)
      _unfocus(id)
    },
    _unfocus(id) {
      const {
        svgElements: { focusGroup: fg },
        getNodeById
      } = this
      const focusNode = fg.select(`#focus-node-${id}`)
      if (!focusNode.empty()) {
        const targetNode = getNodeById(id)
        if (targetNode && targetNode.focus) return

        focusNode.remove()
      }
    },
    /********** 力导图绑定事件 **********/
    // 拖曳设置
    setDrag(simulation) {
      const { setEnableFocus, flags } = this

      const start = (e, d) => {
        if (!e.active) simulation.alphaTarget(0.3).restart()
        setEnableFocus(false)
        d.fx = d.x
        d.fy = d.y
      }

      const drag = (e, d) => {
        d.fx = e.x
        d.fy = e.y
      }

      const end = (e, d) => {
        if (!e.active) simulation.alphaTarget(0)
        setEnableFocus(true)
        if (!flags.pinned) {
          d.fx = null
          d.fy = null
        }
      }

      const boundDrag = this.$d3
        .drag()
        .on('start', start)
        .on('drag', drag)
        .on('end', end)
      this.svgElements.boundDrag = boundDrag
      return boundDrag
    },
    // 缩放&平移设置
    setZoom(root) {
      const boundZoom = this.$d3.zoom().on('zoom', e => {
        root.attr('transform', e.transform)
      })
      this.svgElements.boundZoom = boundZoom
      return boundZoom
    },
    /********** 数据属性操作 **********/
    // 根据 id 查找节点
    getNodeById(id) {
      return this.nodes.filter(node => node.id === id)[0]
    },
    // 根据 id 查找关系
    getLinkById(id) {
      return this.links.filter(link => link.id === id)[0]
    },
    // 设置节点高亮标志
    setNodeFocus(nodeOrId) {
      const {
        nodes,
        flags: { singleFocus },
        _unfocus,
        getNodeById
      } = this
      const node =
        typeof nodeOrId === 'object' ? nodeOrId : getNodeById(nodeOrId)
      if (singleFocus) {
        nodes
          .filter(n => n !== node)
          .forEach(node => {
            if (node.focus) {
              node.focus = false
              _unfocus(node.id)
            }
          })
      }
      node.focus = true
    },
    clearNodeFocus() {},
    getNodesByIds(ids) {
      return this.nodes.filter(node => ids.includes(node.id))
    },
    /********** 图谱标志 **********/
    setEnableFocus(bool = true) {
      this.flags.enableFocus = bool
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
