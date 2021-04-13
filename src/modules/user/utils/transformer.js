export const objectToHttpQuery = data => {
  let ret = ''
  for (const key in data) {
    const value = data[key]
    ret += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
  }
  return ret.substring(0, ret.length - 1)
}
