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

// 生成所有路由
export const makeAllRoute = routes => {
  let allRoute = []
  for(let i=0; i<routes.length; i++) {
    if(routes[i].children) {
      for(let j=0; j<routes[i].children.length; j++) {
        if(routes[i]['children'][j].path === '') {
          allRoute.push(routes[i].path)
        } 
        else{
          allRoute.push(routes[i].path + `/${routes[i]['children'][j].path}`)
        }
      }
    } else {
      allRoute.push(routes[i].path)
    }
  }
  return allRoute
}
