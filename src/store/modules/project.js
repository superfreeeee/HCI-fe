import { fakeProjectInfo, fakeProjects } from '../../common/sample'
import {
  getProjectInfoAPI,
  getListByUserIdAPI,
  createProjectAPI
} from '../../api/project'

const project = {
  state: {
    ownProjects: [],
    projectId: 1,
    projectInfo: {}
  },
  mutations: {
    setOwnProjects: function(state, data) {
      state.ownProjects = data
    },
    setProjectId: function(state, data) {
      state.projectId = data
    },
    setProjectInfo: function(state, data) {
      state.projectInfo = data
    }
  },
  actions: {
    getProjectInfo: async ({ commit }, projectId) => {
      const res = await getProjectInfoAPI(projectId)
      if (res.status === 200) {
        commit('setProjectInfo', res.data)
      } else {
        console.log('getProjectInfo error')
      }
    },
    getListByUserId: async ({ commit }, userId) => {
      const res = await getListByUserIdAPI(userId)
      if (res.status === 200) {
        commit('setOwnProjects', res.data)
      } else {
        console.log('getListByUserId error')
      }
    },
    createProject: async ({ commit }, data) => {
      const res = await createProjectAPI(data)
      if (res.status === 200) {
        commit('setProjectInfo', res.data)
        commit('setProjectId', res.data.projectId)
      } else if (res.status === 500) {
        return Promise.reject(res.data.msg)
      } else {
        console.log('createProject error')
      }
    }
  },
  getters: {
    ownProjects: state => state.ownProjects,
    projectId: state => state.projectId,
    projectInfo: state => state.projectInfo
  }
}

export default project
