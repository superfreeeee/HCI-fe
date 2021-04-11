import api from '@/api/dispatcher'

const user = {
  state: {
    userInfo: {},
    showLogin: true,
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setShowLogin(state, data) {
      state.showLogin = data
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
      const token = res.headers['coin-token']
      localStorage.setItem('token', token)
      if (res.status === 200) {
        return Promise.resolve(res.data.msg)
      } else {
        return Promise.reject(res.data.msg)
      }
    },
    getUserInfo: async ({ commit }) => {
      const res = await api.userInfo()
      commit('setUserInfo', res.data)
    },
    userRegister: async ({ commit }, data) => {
      const res = await api.register(data)
      if(res.status === 200) {
        return Promise.resolve(res.data.msg)
      } else {
        return Promise.reject(res.data.msg)
      }
    }
  },
  getters: {
    userInfo: state => state.userInfo,
    showLogin: state => state.showLogin
  }
}

export default user
