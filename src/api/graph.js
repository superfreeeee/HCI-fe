import axios from 'axios';

axios.defaults.baseURL = 'http://39.97.124.144:8001';

const api = {
    graphPre: '/graph'
}

export function getGraphByProjectIdAPI(projectId) {
    return axios({
        url: `${api.graphPre}/${projectId}`,
        method: 'GET',
    })
}
