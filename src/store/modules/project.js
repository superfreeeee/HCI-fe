import { fakeProjects } from '../../common/sample'
import { getProjectInfoAPI, getListByUserIdAPI, createProjectAPI } from '../../api/project'

const project = {
  state: {
    ownProjects: [],
    projectId: 0,
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
    getProjectInfo: async({ commit, state }, projectId) => {
      const res = await getProjectInfoAPI(projectId)
      console.log('res', res)
      if(res.status === 200) {
        commit('setProjectInfo', res.data)
      }else {
        console.log('getProjectInfo error')
      }
    },
    getListByUserId: async({ commit, state }, userId) => {
      const res = await getListByUserIdAPI(userId)
      if(res.status === 200) {
        commit('setOwnProjects', res.data)
      }else {
        console.log('getListByUserId error')
      }
    },
    createProject: async({ commit, state }, data) => {
      const res = await createProjectAPI(data)
      console.log('createProject res', res)
      if(res.status === 200) {
        commit('setProjectInfo', res.data)
        commit('setProjectId', res.data.projectID)
      }else if(res.status === 500) {
        return Promise.reject('xml 格式错误')
      }else {
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
