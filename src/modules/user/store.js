import api from '@/api/dispatcher'

const user = {
  state: {
    userInfo: {
      id: 1 // fake userId
    },
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setLoginMsg(state, data) {
      state.loginMsg = data
    }
  },
  actions: {
    userLogin: async ({ commit, dispatch }, data) => {
      function payload2Formdata(data) {
        let ret = ''
        for (let item in data) {
          ret +=
            encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'))
        return ret
      }
      const res = await api.login(payload2Formdata(data))
      // console.log('userLogin res', res)
      commit('setLoginMsg', res.data.msg)
      if (res.status === 200) {
        dispatch('getUserInfo')
        return Promise.resolve(res.data.msg)
      } else {
        return Promise.reject(res.data.msg)
      }
    },
    getUserInfo: async ({ commit }) => {
      const res = await api.userInfo()
      // console.log('getUserInfo res', res)
      commit('setUserInfo', res.data)
    },
    logout: async () => {},
    register: async ({ commit }, data) => {
      const res = await api.register(data)
      // console.log('register res', res)
      if(res.status === 200) {
        return Promise.resolve(res.data.msg)
      } else {
        return Promise.reject(res.data.msg)
      }
    }
  },
  getters: {
    userInfo: state => state.userInfo
  }
}

export default user
