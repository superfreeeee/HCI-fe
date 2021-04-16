import { consoleGroup } from '@/common/utils'
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

// 保存图谱布局(nodes 数据 -> layout 格式)
export const saveLayout = nodes => {
  const layout = []
  nodes.forEach(({ id, x, y }) => {
    layout.push({
      nodeId: id,
      xaxis: x,
      yaxis: y
    })
  })
  return layout
}

// 恢复布局(nodes 数据 <- layout 格式)
export const restoreLayout = (mode, nodes, layout) => {
  const pos = {}
  layout.forEach(({ nodeId, xaxis, yaxis }) => {
    pos[nodeId] = [xaxis, yaxis]
  })
  return nodes.map(node => {
    const [x, y] = Reflect.has(pos, node.id) ? pos[node.id] : Array(2)
    return mode === 'FORCE'
      ? { ...node, x, y, fx: null, fy: null }
      : { ...node, fx: x, fy: y }
  })
}

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
  const [gap, baseRadius] = [40, 25]
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
  const layout = []
  groups.forEach(name => {
    const { d, nodes } = groupsObj[name]
    x += d / 2
    const len = nodes.length
    const mid = (len - 1) / 2
    for (let i = 0; i < len; i++) {
      const node = nodes[i]
      layout.push({
        nodeId: node.id,
        xaxis: x,
        yaxis: y + (i - mid) * (d + gap)
      })
    }
    x += gap + d / 2
  })

  return layout
  // return saveLayout(nodes)
}
