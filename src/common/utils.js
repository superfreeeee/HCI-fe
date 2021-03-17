export const consoleGroup = function (name, cb) {
  console.group(name)
  cb()
  console.groupEnd(name)
}

export const deepCopy = (obj) => {
  if (obj !== null && typeof obj === 'object') {
    const newObj = obj.constructor()
    for(const prop in obj) {
      newObj[prop] = deepCopy(obj[prop])
    }
    return newObj
  } else {
    return obj
  }
}

export const svgToPng = (svg, pngWidth, pngHeight, projectId) => {
  const serializer = new XMLSerializer()
  const source = `<?xml version="1.0" standalone="no"?>${serializer.serializeToString(
    svg.node()
  )}`
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    source
  )}`
  const canvas = document.createElement('canvas')
  canvas.width = pngWidth
  canvas.height = pngHeight
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff' //设置保存后的PNG 是白色的
  context.fillRect(0, 0, 10000, 10000)
  image.onload = function() {
    context.drawImage(image, 0, 0)
    const a = document.createElement('a')
    a.download = `知识图谱-${projectId}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }
}
