export default {
  prefix: '/app',
  configs: {
    askQuestion(question) {
      return {
        path: '/question',
        method: 'POST',
        data: question,
      }
    }
  }
}
