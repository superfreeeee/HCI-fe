import axios from 'axios'

axios.defaults.baseURL = 'http://39.97.124.144:8001'

const api = {
  projectPre: '/project'
}

export function getProjectInfoAPI(projectId) {
    return axios({
        url: `${api.projectPre}/${projectId}`,
        method: 'GET'
    })
}

export function getListByUserIdAPI(userId) {
    return axios({
        url: `${api.projectPre}/listByUserId/${userId}`,
        method: 'GET'
    })
}

export function createProjectAPI(data) {
    return axios({
        url: `${api.projectPre}/create`,
        method: 'POST',
        data
    })
}

export function exportProjectXmlAPI(projectId) {
    return axios({
        url: `${api.projectPre}/export/${projectId}`,
        method: 'GET'
    })
}
