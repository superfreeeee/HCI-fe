// import { fakeProjectInfo, fakeProjects } from '../../common/sample'
import { getListByUserIdAPI, createProjectAPI } from '@/api/project'

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
      const res = await getListByUserIdAPI(userId)
      if (res.status === 200) {
        const projects = res.data
        commit('setOwnProjects', projects)
      } else {
        console.log('getListByUserId error')
      }
    },
    createProject: async ({ commit }, data) => {
      const res = await createProjectAPI(data)
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
