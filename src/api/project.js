import { requestWrapper } from './utils'

const baseURL = 'http://39.97.124.144:8001'
const projectPrefix = '/project'

const projectRequest = requestWrapper(`${baseURL}${projectPrefix}`)

export const getProjectInfoAPI = projectId => projectRequest(`/${projectId}`)

export const getListByUserIdAPI = userId =>
  projectRequest(`/listByUserId/${userId}`)

export const createProjectAPI = projectInfo =>
  projectRequest('/create', 'POST', projectInfo)

export const exportProjectXmlAPI = projectId =>
  projectRequest(`/export/${projectId}`)
