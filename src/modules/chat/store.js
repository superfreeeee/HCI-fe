import api from '@/api/dispatcher'
import coinPng from '../../assets/coin.png'
import logoPng from '../../assets/logo.png'

const chat = {
  state: {
    taleList: [
      {
        // date: '2020/04/25 21:19:07',
        text: { text: '有什么需要帮忙的？' },
        mine: false,
        name: 'coin小助手',
        img: coinPng
      },
    //   {
    //     // date: '2020/04/16 21:19:07',
    //     text: { text: '我不饿' },
    //     mine: true,
    //     name: 'cclin',
    //     img: logoPng
    //   }
    ]
  },
  mutations: {
    setTaleList(state, data) {
      state.taleList = data
    }
  },
  actions: {
    sendMessage: ({ commit }, data) => {
      console.log('sendMessage', data)
    }
  },
  getters: {
    taleList: state => state.taleList
  }
}

export default chat
