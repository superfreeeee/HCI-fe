import { fakeProjects } from '../../common/sample'

const project = {
  state: {
    ownProjects: fakeProjects
    // ownProjects: []
  },
  mutations: {},
  actions: {},
  getters: {
    ownProjects: state => state.ownProjects
  }
}

export default project
