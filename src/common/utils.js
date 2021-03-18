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
