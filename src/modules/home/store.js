// import { fakeProjectInfo, fakeProjects } from '../../common/sample'
import api from '@/api/dispatcher'
console.log(api)

const home = {
  state: {
    ownProjects: [],
    projectInfo: {}
  },
  mutations: {
    setOwnProjects(state, data) {
      state.ownProjects = data
    },
    setProjectInfo(state, data) {
      state.projectInfo = data
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
        commit('setGraphProjectId', projectInfo.projectId)
      } else if (res.status === 500) {
        return Promise.reject(res.data.msg)
      } else {
        console.log('createProject error')
      }
    }
  },
  getters: {
    ownProjects: state => state.ownProjects,
    projectInfo: state => state.projectInfo
  }
}

export default home
