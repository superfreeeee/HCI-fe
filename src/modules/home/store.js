// import { fakeProjectInfo, fakeProjects } from '@/common/entity'
import api from '@/api/dispatcher'

const home = {
  state: {
    ownProjects: [],
    projectInfo: {},
    showCreatePanel: false
  },
  mutations: {
    setOwnProjects(state, data) {
      state.ownProjects = data
    },
    setProjectInfo(state, data) {
      state.projectInfo = data
    },
    setShowCreatePanel(state, data) {
      state.showCreatePanel = data
    }
  },
  actions: {
    getListByUserId: async ({ commit }, userId) => {
      const res = await api.getListByUserId(userId)
      if (res.status === 200) {
        const projects = res.data
        commit('setOwnProjects', projects)
      } else {
        console.log('getListByUserId error')
      }
    },
    getProjectInfo: async ({ commit, state }, projectId) => {
      if (projectId === state.projectId) return true
      const res = await api.getProjectInfo(projectId)
      if (res.status === 200) {
        commit('setProjectInfo', res.data)
        return true
      } else {
        console.log('getProjectInfo error')
        return false
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
        console.log('[home/store/createProject] createProject error')
        return Promise.reject('unknown error')
      }
    }
  },
  getters: {
    ownProjects: state => state.ownProjects,
    projectInfo: state => state.projectInfo,
    showCreatePanel: state => state.showCreatePanel
  }
}

export default home
