// import { fakeAllProjects } from '@/common/entity'
import api from '@/api/dispatcher'

const home = {
  state: {
    ownProjects: [],
    allProjects: [],
    projectInfo: {},
    showCreatePanel: false,
    allPageNo: 1,
    ownPageNo: 1,
  },
  mutations: {
    setOwnProjects(state, data) {
      state.ownProjects = data
    },
    setAllProjects(state, data) {
      state.allProjects = data
    },
    setProjectInfo(state, data) {
      state.projectInfo = data
    },
    setShowCreatePanel(state, data) {
      state.showCreatePanel = data
    },
    setAllPageNo(state, data) {
      state.allPageNo = data
    },
    setOwnPageNo(state, data) {
      state.ownPageNo = data
    }
  },
  actions: {
    getListByUserId: async ({ commit }, userId) => {
      const res = await api.getListByUserId(userId)
      if (res.status === 200) {
        const projects = res.data
        commit('setOwnProjects', projects)
      } else {
        console.error('getListByUserId error')
      }
    },
    getAllListByPageNo: async ({ commit }, pageNo) => {
      const res = await api.getAllListByPageNo(pageNo)
      if (res.status === 200) {
        const projects = res.data
        commit('setAllProjects', projects)
      } else {
        console.error('getAllListByPageNo error')
      }
    },
    getOwnListByPageNo: async ({ commit }, data) => {
      const res = await api.getOwnListByPageNo(data)
      if (res.status === 200) {
        const projects = res.data
        commit('setOwnProjects', projects)
      } else {
        console.error('getOwnListByPageNo error')
      }
    },
    getProjectInfo: async ({ commit, state }, projectId) => {
      if (projectId === state.projectId) return true
      const res = await api.getProjectInfo(projectId)
      if (res.status === 200) {
        commit('setProjectInfo', res.data)
        return res.data
      } else {
        console.error('getProjectInfo error')
        return null
      }
    },
    createProject: async ({ commit }, data) => {
      const res = await api.createProject(data)
      if (res.status === 200) {
        const projectInfo = res.data
        commit('setProjectInfo', projectInfo)
        return projectInfo.projectId
      } else if (res.status === 500) {
        return Promise.reject(res.data.msg)
      } else {
        console.error('[home/store/createProject] createProject error')
        return Promise.reject('unknown error')
      }
    }
  },
  getters: {
    ownProjects: state => state.ownProjects,
    projectInfo: state => state.projectInfo,
    showCreatePanel: state => state.showCreatePanel,
    allProjects: state => state.allProjects,
    allPageNo: state => state.allPageNo,
    ownProjects: state => state.ownProjects,
    ownPageNo: state => state.ownPageNo
  }
}

export default home
