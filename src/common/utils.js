// 组输出
export const consoleGroup = function(name, cb) {
  console.group(name)
  cb()
  console.groupEnd(name)
}

// 深拷贝
export const deepCopy = obj => {
  if (obj !== null && typeof obj === 'object') {
    const newObj = obj.constructor()
    for (const prop in obj) {
      newObj[prop] = deepCopy(obj[prop])
    }
    return newObj
  } else {
    return obj
  }
}

// svg 元素转为 png 图像
export const svgToPng = (svg, pngWidth, pngHeight) => {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer()
    const source = `<?xml version="1.0" standalone="no"?>${serializer.serializeToString(
      svg.node()
    )}`
    const image = new Image()
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`
    const canvas = document.createElement('canvas')
    canvas.width = pngWidth
    canvas.height = pngHeight
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff' //设置保存后的PNG 是白色的
    context.fillRect(0, 0, 10000, 10000)
    image.onload = () => {
      context.drawImage(image, 0, 0)
      const dataUrl = canvas.toDataURL('image/png')
      resolve(dataUrl)
    }
    image.onerror = err => {
      reject(err)
    }
  })
}

export const download = (name, dataUrl) => {
  const a = document.createElement('a')
  a.download = name
  a.href = dataUrl
  a.click()
}

// 首字母大写
export const capitalize = s => {
  if (!s) return ''
  const c = s.charAt(0).toUpperCase()
  return `${c}${s.substring(1)}`
}

// d3 item 转 后端 item
export const itemTransformer = (type, item) => {
  if (type === 'node') {
    const { id: nodeId, name, group, radius: val } = item
    return { nodeId, name, group, val }
  } else {
    const { id: relationId, name, from: source, to: target, value: val } = item
    return { relationId, name, source, target, val }
  }
}

// 后端 item 转 d3 item
export const responseItemTranformer = (type, item) => {
  if (type === 'node') {
    const { nodeId: id, name, group, val: radius } = item
    return { id, name, group, radius }
  } else {
    const { relationId: id, name, source, target, val: value } = item
    const [from, to] = [source, target]
    return { id, name, source, target, from, to, value }
  }
}
