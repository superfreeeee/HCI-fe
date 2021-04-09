import api from '@/api/dispatcher'
import { dispatch } from 'd3-dispatch'

const user = {
    state: {
        userInfo: {}
    },
    mutations: {
        setUserInfo(state, data) {
            state.userInfo = data
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
            // console.log('userLogin res', res)
            if(res.status === 200) {
                dispatch('getUserInfo')
                return Promise.resolve(res.data.msg)
            } else {
                return Promise.reject(res.data.msg)
            }
        },
        getUserInfo: async({ commit }) => {
            const res = await api.userInfo()
            // 這邊有問題，拿得到 res 可是裡面的 data 很怪
            // console.log('getUserInfo res', res)
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
