import axios from 'axios'

export const requestWrapper = prefix => (
  path,
  method = 'GET',
  data = undefined
) => {
  return axios({ url: `${prefix}${path}`, method, data })
}
