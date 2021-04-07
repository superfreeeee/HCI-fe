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
