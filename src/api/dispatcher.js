import axios from './axios'
import graph from './modules/graph'
import project from './modules/project'
import user from './modules/user'

class APIDispatcher {
  register({ prefix, configs = {} }) {
    for (const name of Reflect.ownKeys(configs)) {
      const fn = configs[name]
      const request = (...args) => {
        const { path, method = 'GET', data, mapper } = fn(...args)
        const promise = axios({
          url: prefix ? `${prefix}${path}` : path ? path : '/',
          method,
          data
        })
        return promise.then(res => {
          const status = res.status
          if (mapper && status >= 200 && status < 300) {
            res.data = mapper(res.data)
          }
          return res
        })
      }
      this[name] = request
    }
  }

  remove(method) {
    const res = delete this[method]
    console.log(`[APIDispatcher] remove ${method} ${res ? 'success' : 'fail'}`)
  }
}

const dispatcher = new APIDispatcher()
dispatcher.register(graph)
dispatcher.register(project)
dispatcher.register(user)

export default dispatcher
