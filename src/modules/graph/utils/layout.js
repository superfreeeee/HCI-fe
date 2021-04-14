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
    return mode === 'FORCE' ? { ...node, x, y } : { ...node, fx: x, fy: y }
  })
}

// 计算排版模式布局
export const getGridLayout = nodes => {
  const groupsObj = {}
  nodes.forEach(({ group, id, radius }) => {
    const node = { id, radius }
    if (!Reflect.has(groupsObj, group)) {
      groupsObj[group] = []
    }
    groupsObj[group].push(node)
  })
  const groups = Reflect.ownKeys(groupsObj).length
  

  return saveLayout(nodes)
}
