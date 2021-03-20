import axios from 'axios'

axios.defaults.baseURL = 'http://39.97.124.144:8001'

const api = {
  graphPre: '/graph'
}

export function getGraphByProjectIdAPI(projectId) {
  return axios({
    url: `${api.graphPre}/${projectId}`,
    method: 'GET'
  })
}

export function graphInsertNodeAPI(data) {
  return axios({
    url: `${api.graphPre}/insertNode`,
    method: 'POST',
    data
  })
}

export function graphInsertRelAPI(data) {
  return axios({
    url: `${api.graphPre}/insertRel`,
    method: 'POST',
    data
  })
}

export function graphDeleteNodeAPI(nodeId) {
  return axios({
    url: `${api.graphPre}/deleteNode`,
    method: 'POST',
    data: { nodeId }
  })
}

export function graphDeleteRelAPI(relationId) {
  return axios({
    url: `${api.graphPre}/deleteRel`,
    method: 'POST',
    data: { relationId }
  })
}
