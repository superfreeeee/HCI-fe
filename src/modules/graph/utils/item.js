// d3 item 转 后端 item
export const itemTransformer = (type, item, projectId) => {
  return {
    node({ id: nodeId, ...rest }) {
      return { projectId, nodeId, ...rest }
    },
    link({ name, id: relationId, from: source, to: target, value: width }) {
      return { projectId, relationId, name, source, target, width }
    }
  }[type](item)
}

// 后端 item 转 d3 item
export const responseItemTranformer = (type, item) => {
  return {
    node({ nodeId: id, projectId, ...rest }) {
      return { id, ...rest }
    },
    link({ name, relationId: id, source, target, width: value }) {
      return { name, id, source, target, value, from: source, to: target }
    }
  }[type](item)
}

export const itemVarify = (type, item) => {
  return {
    node({ radius, ...rest }) {
      radius = +radius
      return { radius, ...rest, properties: {} }
    },
    link({ width, from, to, ...rest }) {
      width = +width
      from = +from
      to = +to
      return { width, from, to, ...rest }
    }
  }[type](item)
}
