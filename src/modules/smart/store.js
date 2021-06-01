import api from '@/api/dispatcher'
import coinPng from '../../assets/coin.png'
import logoPng from '../../assets/logo.png'

const smart = {
  state: {
    taleList: [
      {
        // date: '2020/04/25 21:19:07',
        text: { text: '有什么需要帮忙的？' },
        mine: false,
        name: 'coin小助手',
        img: coinPng
      }
    ]
  },
  mutations: {
    setTaleList(state, data) {
      state.taleList = data
    }
  },
  actions: {
    sendQuestion: async ({ commit }, data) => {
      const res = await api.askQuestion(data)
      console.log(res)
    }
  },
  getters: {
    taleList: state => state.taleList
  }
}

export default smart
