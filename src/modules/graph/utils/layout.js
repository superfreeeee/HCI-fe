/**
 * 布局操作选项
 */

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

// 保存图谱布局
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

export const restoreLayout = (mode, nodes, layout) => {
  const pos = {}
  layout.forEach(node => {
    pos[node.nodeId] = [node.xaxis, node.yaxis]
  })
  return nodes.map(node => {
    const [x, y] = Reflect.has(pos, node.id) ? pos[node.id] : Array(2)
    return mode === 'FORCE' ? { ...node, x, y } : { ...node, fx: x, fy: y }
  })
}
