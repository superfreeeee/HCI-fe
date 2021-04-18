const buildSearchHistoryKey = (userId, projectId) => {
  return `searchHistory:${userId}:${projectId}`
}

export const getSearchHistory = (userId, projectId) => {
  const key = buildSearchHistoryKey(userId, projectId)
  return JSON.parse(localStorage.getItem(key))
}

export const setSearchHistory = (userId, projectId, history) => {
  const key = buildSearchHistoryKey(userId, projectId)
  localStorage.setItem(key, JSON.stringify(history))
}
