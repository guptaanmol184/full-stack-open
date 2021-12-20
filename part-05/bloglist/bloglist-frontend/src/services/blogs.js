import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { AUthorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const blogService = { getAll, setToken, create }

export default blogService