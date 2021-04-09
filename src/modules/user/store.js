import api from '@/api/dispatcher'

const user = {
    state: {
        userInfo: {},
        loginMsg: '',
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
                for (let it in data) {
                   ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                ret = ret.substring(0, ret.lastIndexOf('&'));
                return ret
            }
            const res = await api.login(payload2Formdata(data))
            commit('setLoginMsg', res.data.msg)
            if(res.status === 200) {
                dispatch('getUserInfo')
                return Promise.resolve(this.loginMsg)
            } else {
                return Promise.reject(this.loginMsg)
            }
        },
        getUserInfo: async({ commit }) => {
            const res = await api.userInfo()
            // console.log('getUserInfo res', res)
            commit('setUserInfo', res.data)
        },
        logout: async () => {

        },
        register: async () => {

        }
    },
    getters: {
        userInfo: state => state.userInfo,
    }
}

export default user
