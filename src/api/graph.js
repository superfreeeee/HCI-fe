import { requestWrapper } from './utils'

const baseURL = 'http://39.97.124.144:8001'
const graphPrefix = '/graph'

const graphRequest = requestWrapper(`${baseURL}${graphPrefix}`)

/* 获取图数据 */
export const getGraphByProjectIdAPI = projectId => graphRequest(`/${projectId}`)

/* 插入实体 */
export const graphInsertNodeAPI = node =>
  graphRequest('/insertNode', 'POST', node)
/* 插入关系 */
export const graphInsertRelAPI = relation =>
  graphRequest('/insertRel', 'POST', relation)

/* 删除实体 */
export const graphDeleteNodeAPI = node =>
  graphRequest('/deleteNode', 'POST', node)
/* 删除关系 */
export const graphDeleteRelAPI = relation =>
  graphRequest('/deleteRel', 'POST', relation)

/* 更新实体 */
export const graphUpdateNodeAPI = node =>
  graphRequest('/updateNode', 'POST', node)
/* 更新关系 */
export const graphUpdateRelAPI = relation =>
  graphRequest('/updateRel', 'POST', relation)
