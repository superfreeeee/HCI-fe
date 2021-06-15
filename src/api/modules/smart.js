import {
  responseItemTranformer,
} from '@/modules/graph/utils/item'
import { linebreakFormat } from '../../modules/smart/utils/function'

export default {
  prefix: '/app',
  configs: {
    initGraph(projectId) {
      return {
        path: `/qaInitial/${projectId}`,
        method: 'GET'
      }
    },
    askQuestion(question) {
      return {
        path: '/question',
        method: 'POST',
        data: question,
        mapper(data) {
          const { projectId, nodes, relations, layout } = data.graph
          const text = data.text
          return {
            graph: {
              projectId,
              nodes: nodes.map(n => responseItemTranformer('node', n)),
              links: relations.map(r => responseItemTranformer('link', r)),
              layouts: layout
            },
            text: linebreakFormat(text)
          }
        }
      }
    },
    verifyInitiate(projectId) {
      return {
        path: `/verifyInitial/${projectId}`,
        method: 'GET'
      }
    },
    entityQuery(question) {
      return {
        path: '/entityQuery',
        method: 'POST',
        data: question,
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
    relationQuery(question) {
      return {
        path: '/relQuery',
        method: 'POST',
        data: question,
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
    getRelations(projectId) {
      return {
        path: `/relationNames/${projectId}`,
        method: 'GET'
      }
    }
  }
}
