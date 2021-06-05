import api from '@/api/dispatcher'
import coinPng from '../../assets/coin.png'
import logoPng from '../../assets/logo.png'

const smart = {
  state: {
    taleList: [
      {
        // date: '2020/04/25 21:19:07',
        text: { text: 'Hi~有什么需要帮忙的？' },
        mine: false,
        name: 'coin小助手',
        img: coinPng
      }
    ],
    graphDialogueQues: '',
    entityQueryQues: '',
    relationQueryQues: {
      source: '',
      target: '',
      relation: ''
    }
  },
  mutations: {
    setTaleList(state, data) {
      state.taleList = data
    },
    pushTaleList(state, data) {
      state.taleList.push(data.reqTale)
      setTimeout(() => state.taleList.push(data.resTale), 2000)
    },
    setGraphDialogueQues(state, data) {
      state.graphDialogueQues = data
    },
    setEntityQueryQues(state, data) {
      state.entityQueryQues = data
    },
    setRelationQueryQues(state, data) {
      state.relationQueryQues = data
    }
  },
  actions: {
    initiateGraph: async ({ commit }, projectId) => {
      const res = await api.initGraph(projectId)
      console.log('initiateGraph', res)
    },
    sendQuestion: async ({ commit }, data) => {
      const { question, username } = data
      const res = await api.askQuestion(question)
      const { answer } = res.data
      const reqTale = {
        text: { text: data.question.text },
        mine: true,
        name: username,
        img: logoPng
      }
      const resTale = {
        text: { text: answer },
        mine: false,
        name: 'coin小助手',
        img: coinPng
      }
      const newTales = { reqTale, resTale }
      commit('pushTaleList', newTales)
    }
  },
  getters: {
    taleList: state => state.taleList,
    graphDialogueQues: state => state.graphDialogueQues,
    entityQueryQues: state => state.entityQueryQues,
    relationQueryQues: state => state.relationQueryQues
  }
}

export default smart