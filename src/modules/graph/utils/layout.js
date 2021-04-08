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

export const restoreLayout = (nodes, layout) => {
  const pos = {}
  layout.forEach(node => {
    pos[node.nodeId] = [node.xaxis, node.yaxis]
  })
  return nodes.map(node => {
    const [x, y] = Reflect.has(pos, node.id) ? pos[node.id] : Array(2)
    return {
      ...node,
      x,
      y,
      // vx: 0,
      // vy: 0
    }
  })
}
