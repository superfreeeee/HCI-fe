import api from '@/api/dispatcher'
import coinPng from '../../assets/coin.png'
import logoPng from '../../assets/logo.png'
import { adapter } from './utils/function'

const smart = {
  state: {
    taleList: [
      {
        // date: '2020/04/25 21:19:07',
        text: { text: '您好~我是 co$in helper，今天想找什么菜呢？' },
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
    relationQueryGraphData: null,
    dialogueQueryGraphData: null,
    relationNames: [],
    dialogueAnswer: '',
    hotQuestions: [],
    centralityTableData: []
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
    },
    setRelationNames(state, data) {
      state.relationNames = data
    },
    setDialogueQueryGraphData(state, data) {
      state.dialogueQueryGraphData = data
    },
    setDialogueAnswer(state, data) {
      state.dialogueAnswer = data
    },
    setHotQuestions(state, data) {
      state.hotQuestions = data
    },
    setCentralityTableData(state, data) {
      state.centralityTableData = data
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
      console.log('chattext', text)
      const reqTale = {
        text: { text: data.question.text },
        mine: true,
        name: username,
        img: logoPng
      }
      const resTale = {
        text: { text: text },
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
    },
    smartDialogueQuery: async ({ commit }, data) => {
      const res = await api.askQuestion(data)
      console.log('smartDialogueQuery', res)
      const { graph, text } = res.data
      commit('setDialogueQueryGraphData', graph)
      commit('setDialogueAnswer', text)
      return Promise.resolve(graph)
    },
    getRelationNames: async ({ commit }, projectId) => {
      const res = await api.getRelations(projectId)
      // console.log('getRelationNames', res)
      commit('setRelationNames', res.data)
    },
    getHotQuestionList: async ({ commit }, projectId) => {
      const res = await api.getHotQuestions(projectId)
      // console.log('getHotQuestionList', res)
      const hotListTarget = adapter(res.data)
      commit('setHotQuestions', hotListTarget)
    },
    getCentralityData: async ({ commit }, projectId) => {
      const res = await api.getCentrality(projectId)
      // console.log('getCentralityData', res.data)
      commit('setCentralityTableData', res.data)
    }
  },
  getters: {
    taleList: state => state.taleList,
    graphDialogueQues: state => state.graphDialogueQues,
    entityQueryQues: state => state.entityQueryQues,
    relationQueryQues: state => state.relationQueryQues,
    entityQueryGraphData: state => state.entityQueryGraphData,
    relationQueryGraphData: state => state.relationQueryGraphData,
    relationNames: state => state.relationNames,
    dialogueQueryGraphData: state => state.dialogueQueryGraphData,
    dialogueAnswer: state => state.dialogueAnswer,
    hotQuestions: state => state.hotQuestions,
    centralityTableData: state => state.centralityTableData
  }
}

export default smart
