// import { fakeAllProjects } from '@/common/entity'
import api from '@/api/dispatcher'

const home = {
  state: {
    ownProjects: [],
    allProjects: [],
    projectInfo: {},
    showCreatePanel: false
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
    getAllListByPageNo: async ({ commit }, pageNo) => {
      const res = await api.getAllListByPageNo(pageNo)
      if (res.status === 200) {
        const projects = res.data
        commit('setAllProjects', projects)
      } else {
        console.log('getAllListByPageNo error')
      }
    },
    getProjectInfo: async ({ commit, state }, projectId) => {
      if (projectId === state.projectId) return true
      const res = await api.getProjectInfo(projectId)
      if (res.status === 200) {
        commit('setProjectInfo', res.data)
      } else {
        console.log('getProjectInfo error')
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
    },
    getAllProjects: () => {}
  },
  getters: {
    ownProjects: state => state.ownProjects,
    projectInfo: state => state.projectInfo,
    showCreatePanel: state => state.showCreatePanel,
    allProjects: state => state.allProjects
  }
}

export default home
