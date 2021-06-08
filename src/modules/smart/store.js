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
      sourceName: '',
      targetName: '',
      relName: ''
    },
    entityQueryGraphData: null,
    relationQueryGraphData: null
  },
  mutations: {
    setTaleList(state, data) {
      state.taleList = data
    },
    pushTaleList(state, data) {
      state.taleList.push(data.reqTale)
      setTimeout(() => state.taleList.push(data.resTale), 1000)
    },
    setGraphDialogueQues(state, data) {
      state.graphDialogueQues = data
    },
    setEntityQueryQues(state, data) {
      state.entityQueryQues = data
    },
    setRelationQueryQues(state, data) {
      state.relationQueryQues = data
    },
    setEntityQueryGraphData(state, data) {
      state.entityQueryGraphData = data
    },
    setRelationQueryGraphData(state, data) {
      state.relationQueryGraphData = data
    }
  },
  actions: {
    verifyInitiate: async ({ commit }, projectId) => {
      const res = await api.verifyInitiate(projectId)
      return Promise.resolve(res.data)
    },
    initiateGraph: async ({ commit }, projectId) => {
      const res = await api.initGraph(projectId)
      return Promise.resolve(res)
    },
    sendQuestionChat: async ({ commit }, data) => {
      const { question, username } = data
      const res = await api.askQuestion(question)
      const { text } = res.data
      const reqTale = {
        text: { text: data.question.text },
        mine: true,
        name: username,
        img: logoPng
      }
      const resTale = {
        text: { text },
        mine: false,
        name: 'coin小助手',
        img: coinPng
      }
      const newTales = { reqTale, resTale }
      commit('pushTaleList', newTales)
    },
    smartEntityQuery: async ({ commit }, data) => {
      const res = await api.entityQuery(data)
      // console.log('smartEntityQuery', res.data)
      const graphData = res.data
      commit('setEntityQueryGraphData', graphData)
      return Promise.resolve(graphData)
    },
    smartRelationQuery: async ({ commit }, data) => {
      const res = await api.relationQuery(data)
      // console.log('smartRelationQuery', res.data)
      const graphData = res.data
      commit('setRelationQueryGraphData', graphData)
      return Promise.resolve(graphData)
    }
  },
  getters: {
    taleList: state => state.taleList,
    graphDialogueQues: state => state.graphDialogueQues,
    entityQueryQues: state => state.entityQueryQues,
    relationQueryQues: state => state.relationQueryQues,
    entityQueryGraphData: state => state.entityQueryGraphData,
    relationQueryGraphData: state => state.relationQueryGraphData,
  }
}

export default smart
