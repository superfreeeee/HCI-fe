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