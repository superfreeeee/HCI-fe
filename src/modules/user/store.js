import api from '@/api/dispatcher'
import { $message } from '@/common/utils'
import { objectToHttpQuery } from './utils/transformer'

const user = {
  state: {
    userInfo: {},
    userId: ''
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setUserId(state, data) {
      state.userId = data
    }
  },
  actions: {
    userLogin: async (_, data) => {
      const {
        headers,
        status,
        data: { msg }
      } = await api.login(objectToHttpQuery(data))
      const token = headers['coin-token']
      localStorage.setItem('coin-token', token)

      $message(msg, status === 200 ? 'success' : 'error')
      return status === 200
    },
    userRegister: async (_, data) => {
      const {
        status,
        data: { msg }
      } = await api.register(data)
      $message(msg, status === 200 ? 'success' : 'error')
      return status === 200
    },
    getUserInfo: async ({ commit }) => {
      const res = await api.userInfo()
      if (res.status === 200) {
        commit('setUserInfo', res.data)
        commit('setUserId', res.data.id)
        return true
      }
      return false
    }
  },
  getters: {
    userInfo: state => state.userInfo,
    userId: state => state.userId
  }
}

export default user
