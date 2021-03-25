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

// 首字母大写
export const capitalize = s => {
  if (!s) return ''
  const c = s.charAt(0).toUpperCase()
  return `${c}${s.substring(1)}`
}
