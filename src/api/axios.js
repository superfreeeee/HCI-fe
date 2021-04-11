import axios from 'axios'
import { baseURL } from './config'
import { consoleGroup } from '@/common/utils/'

const instance = axios.create({ baseURL, withCredentials: true })

instance.interceptors.request.use(
  config => {
    if(localStorage.token) {
      config.headers['coin-token'] = localStorage.token
    }
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
    return err.response
  }
)

export default instance
