import {
  responseItemTranformer,
  itemTransformer
} from '@/modules/graph/utils/item'

export default {
  prefix: '/graph',
  configs: {
    /* 获取图谱 */
    getGraphByProjectId(projectId) {
      return {
        path: `/${projectId}`,
        mapper(data) {
          const { projectId, nodes, relations, layout } = data
          return {
            projectId,
            nodes: nodes.map(n => responseItemTranformer('node', n)),
            links: relations.map(r => responseItemTranformer('link', r)),
            layouts: layout
          }
        }
      }
    },

    /* 插入实体 */
    graphInsertNode(data) {
      return {
        path: '/insertNode',
        method: 'POST',
        data
      }
    },
    /* 插入关系 */
    graphInsertRel(data) {
      return {
        path: '/insertRel',
        method: 'POST',
        data
      }
    },

    /* 删除实体 */
    graphDeleteNode(nodeId, projectId) {
      return {
        path: '/deleteNode',
        method: 'POST',
        data: { nodeId, projectId }
      }
    },
    /* 删除关系 */
    graphDeleteRel(relationId, projectId) {
      return {
        path: '/deleteRel',
        method: 'POST',
        data: { relationId, projectId }
      }
    },
    /* 级联删除实体 */
    graphDeleteNodeCascade(nodeId, projectId) {
      return {
        path: '/cascadeDeleteNode',
        method: 'POST',
        data: { nodeId, projectId }
      }
    },

    /* 更新实体 */
    graphUpdateNode(data) {
      return {
        path: '/updateNode',
        method: 'POST',
        data
      }
    },
    /* 更新关系 */
    graphUpdateRel(data) {
      return {
        path: '/updateRel',
        method: 'POST',
        data
      }
    },

    /* 保存布局 */
    updateLayout(type, layout, projectId) {
      return {
        path: '/updateLayout',
        method: 'POST',
        data: {
          ...layout, // nodes, width, height
          projectId,
          type
        }
      }
    }
  }
}
