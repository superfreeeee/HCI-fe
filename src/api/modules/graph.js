export default {
  prefix: '/graph',
  configs: {
    /* 获取图谱 */
    getGraphByProjectId(projectId) {
      return { path: `/${projectId}` }
    },

    /* 插入实体 */
    graphInsertNode(node) {
      return { path: '/insertNode', method: 'POST', data: node }
    },
    /* 插入关系 */
    graphInsertRel(relation) {
      return { path: '/insertRel', method: 'POST', data: relation }
    },

    /* 删除实体 */
    graphDeleteNode(node) {
      return { path: '/deleteNode', method: 'POST', data: node }
    },
    /* 删除关系 */
    graphDeleteRel(relation) {
      return { path: '/deleteRel', method: 'POST', data: relation }
    },
    /* 级联删除实体 */
    graphDeleteNodeCascade(node) {
      return { path: '/cascadeDeleteNode', method: 'POST', data: node }
    },

    /* 更新实体 */
    graphUpdateNode(node) {
      return { path: '/updateNode', method: 'POST', data: node }
    },
    /* 更新关系 */
    graphUpdateRel(relation) {
      return { path: '/updateRel', method: 'POST', data: relation }
    },

    /* 保存布局 */
    updateLayout(projectId, layout) {
      return {
        path: '/updateLayout',
        medhot: 'POST',
        data: {
          projectId,
          nodes: layout
        }
      }
    }
  }
}
