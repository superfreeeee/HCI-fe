// d3 item 转 后端 item
export const itemTransformer = (type, item, projectId) => {
  if (type === 'node') {
    const { id: nodeId, name, group, radius: val } = item
    return { projectId, nodeId, name, group, val }
  } else {
    const { id: relationId, name, from: source, to: target, value: val } = item
    return { projectId, relationId, name, source, target, val }
  }
}

// 后端 item 转 d3 item
export const responseItemTranformer = (type, item) => {
  if (type === 'node') {
    const { nodeId: id, name, group, val: radius } = item
    return { id, name, group, radius: Number(radius) }
  } else {
    const { relationId: id, name, source, target, val: value } = item
    const [from, to] = [source, target]
    return { id, name, source, target, from, to, value: Number(value) }
  }
}
