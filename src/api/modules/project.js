export default {
  prefix: '/project',
  configs: {
    getProjectInfo(projectId) {
      return { path: `/${projectId}` }
    },
    getListByUserId(userId) {
      return { path: `/listByUserId/${userId}` }
    },
    createProject(projectInfo) {
      return { path: '/create', method: 'POST', data: projectInfo }
    },
    exportProjectXml(projectId) {
      return { path: `/export/${projectId}` }
    }
  }
}
