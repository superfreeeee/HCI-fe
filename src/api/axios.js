import axios from 'axios'
import { baseURL } from './config'
import { consoleGroup } from '@/common/utils/'
import router, { setRecentRoute } from '@/router'

const instance = axios.create({ baseURL, withCredentials: true })

const expiredToken =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImNyZWF0ZWQiOjE2MTgxMzIyOTk4NTAsInJvbGVzIjpudWxsLCJpZCI6MSwiZXhwIjoxNjE4NjMyOTUzfQ.IjcQFU-9Kf6CcLXS69wa9Id4jFQrwYmCfW6FiXvJHg_XT17Z9XJzLOC5IXVRStLCbl0fH57Bkq3bwAnozEXvOw'

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('coin-token')
    if (token) {
      // config.headers['coin-token'] = token
    }
    config.headers['coin-token'] = expiredToken
    consoleGroup(`[axios.request] ${config.url}`, () => {
      console.log(config)
    })
    return config
  },
  err => {
    return err
  }
)

instance.interceptors.response.use(
  response => {
    const config = response.config
    consoleGroup(`[axios.response] ${config.url}`, () => {
      console.log(response)
    })
    return response
  },
  err => {
    const response = err.response
    consoleGroup(`[axios.response.error] ${response.config.url}`, () => {
      console.log(response)
    })
    if (response.status === 403) {
      // 未登入 or token 过期
      setRecentRoute()
      router.push('/user')
    }
    return response
  }
)

export default instance
