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
    graphInsertNode(node, projectId) {
      return {
        path: '/insertNode',
        method: 'POST',
        data: itemTransformer('node', node, projectId)
      }
    },
    /* 插入关系 */
    graphInsertRel(relation, projectId) {
      return {
        path: '/insertRel',
        method: 'POST',
        data: itemTransformer('link', relation, projectId)
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
    graphUpdateNode(node, projectId) {
      return {
        path: '/updateNode',
        method: 'POST',
        data: itemTransformer('node', node, projectId)
      }
    },
    /* 更新关系 */
    graphUpdateRel(relation, projectId) {
      return {
        path: '/updateRel',
        method: 'POST',
        data: itemTransformer('link', relation, projectId)
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
