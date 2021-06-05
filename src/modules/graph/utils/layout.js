import { consoleGroup } from '@/common/utils'
import config from './config'
/**
 * 布局操作选项
 */
// 布局模式
export const layoutModes = [
  {
    type: 'primary',
    label: '力导图模式',
    mode: 'FORCE'
  },
  {
    type: 'danger',
    label: '排版模式',
    mode: 'GRID'
  },
  {
    type: 'warning',
    label: '定点模式',
    mode: 'FIXED'
  }
]

/**
 * 图谱布局相关
 */

/**
 * 计算布局占用宽高
 * @param {*} layoutNodes
 * @param {*} radiusMapper
 * @returns { width, height }
 */
export const getNodesSize = nodes => {
  let [x1, y1, x2, y2] = Array(4).fill(0)
  nodes.forEach(({ x, y, radius }) => {
    x1 = Math.min(x1, x - radius)
    y1 = Math.min(y1, y - radius)
    x2 = Math.max(x2, x + radius)
    y2 = Math.max(y2, y + radius)
  })
  const width = x2 - x1
  const height = y2 - y1
  return { width, height }
}

/**
 * 保存图谱布局(nodes 数据 -> layout 格式)
 * @param {*} nodes
 * @returns { nodes, width, height }
 */
export const saveLayout = nodes => {
  const layoutNodes = []
  nodes.forEach(({ id, x, y }) => {
    layoutNodes.push({
      nodeId: id,
      xaxis: x,
      yaxis: y
    })
  })
  const { width, height } = getNodesSize(nodes)
  return { nodes: layoutNodes, width, height }
}

/**
 * 恢复布局(nodes 数据 <- layout 格式)
 * @param {*} mode
 * @param {*} nodes
 * @param {*} { nodes }
 * @returns newNodes
 */
export const restoreLayout = (mode, nodes, { nodes: layoutNodes }) => {
  const pos = {}
  layoutNodes.forEach(({ nodeId, xaxis, yaxis }) => {
    pos[nodeId] = [xaxis, yaxis]
  })
  return nodes.map(node => {
    const [x, y] = Reflect.has(pos, node.id) ? pos[node.id] : [node.x, node.y]
    return mode === 'FORCE'
      ? { ...node, x, y, fx: null, fy: null }
      : { ...node, fx: x, fy: y, x, y }
  })
}

/**
 * 清理节点固定坐标 fx, fy
 * @param {*} nodes
 * @returns
 */
export const clearFixed = nodes => {
  return nodes.map(node => ({ ...node, fx: null, fy: null }))
}

const ascOrder = (x, y) => x - y

// 计算排版模式布局
export const getGridLayout = nodes => {
  // 节点分组
  const groupsObj = {}
  nodes.forEach(({ group, id, radius }) => {
    const node = { id, radius }
    if (!Reflect.has(groupsObj, group)) {
      groupsObj[group] = { d: 0, nodes: [] }
    }
    groupsObj[group].nodes.push(node)
  })

  // 按分组名排序
  const groups = Reflect.ownKeys(groupsObj)
  groups.sort()

  // 总宽度、高度
  let [width, height] = [0, 0]
  const [gap, baseRadius] = [40, config.baseRadius]
  groups.forEach(name => {
    const group = groupsObj[name]

    // 节点按 id 排序
    const nodes = group.nodes
    nodes.sort(({ id: x }, { id: y }) => ascOrder(x, y))

    // 计算组内最大半径
    let d = 0
    let sumHeight = 0
    nodes.forEach(({ radius }) => {
      d = Math.max(d, (baseRadius + radius * 10) * 2)
      sumHeight += radius * 2 + gap
    })

    // 高度/宽度更新
    group.d = d
    width += d + gap
    height = Math.max(height, sumHeight - gap)
  })
  width -= gap

  consoleGroup('[getGridLayout]', () => {
    console.log('groups', groups)
    console.log('groupsObj', groupsObj)
    console.log('width', width)
    console.log('height', height)
  })

  // 计算实际坐标
  let [x, y] = [-width / 2, 0]
  const layoutNodes = []
  groups.forEach(name => {
    const { d, nodes } = groupsObj[name]
    x += d / 2
    const len = nodes.length
    const mid = (len - 1) / 2
    for (let i = 0; i < len; i++) {
      const node = nodes[i]
      layoutNodes.push({
        nodeId: node.id,
        xaxis: x,
        yaxis: y + (i - mid) * (d + gap)
      })
    }
    x += gap + d / 2
  })

  return { nodes: layoutNodes, width, height }
}

export const getScale = layout => {
  if (!layout) return 1
  const { width, height } = layout
  const { width: boardWidth, height: boardHeight } = config
  const zoom = 0.7
  return Math.min(1, (boardWidth / width) * zoom, (boardHeight / height) * zoom)
}

export const calcScale = (nodes, config) => {
  if (nodes.length === 0) return 1
  const node0 = nodes[0]
  // console.log('nodes', nodes)

  let [x1, y1, x2, y2] = [node0.x, node0.y, node0.x, node0.y]
  nodes.forEach(({ x, y }) => {
    x1 = Math.min(x1, x)
    y1 = Math.min(y1, y)
    x2 = Math.max(x2, x)
    y2 = Math.max(y2, y)
  })

  const { width, height, zoomAlpha } = config
  const [realWidth, realHeight] = [x2 - x1, y2 - y1]

  // console.log(`width = ${width}, height = ${height}`)
  // console.log(`realWidth = ${realWidth}, realHeight = ${realHeight}`)

  return Math.min(
    (realWidth * zoomAlpha) / width,
    (realHeight * zoomAlpha) / height
  )
}
