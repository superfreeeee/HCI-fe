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
        data: question
      }
    }
  }
}
