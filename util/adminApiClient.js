const axios = require('axios')
const NodeCache = require('node-cache')
const dotenv = require('dotenv')

dotenv.config()
const cache = new NodeCache()

const axiosAdminClient = axios.create({
  baseURL: process.env.ADMIN_API_URL,
})

async function getToken() {
  let token = cache.get('token')
  if (!token) {
    console.log('Fetching new token')
    const m2m_credentials = {
      client_id: process.env.ADMIN_API_M2M_CLIENT_ID,
      client_secret: process.env.ADMIN_API_M2M_CLIENT_SECRET,
    }
    const response = await axiosAdminClient.post(
      '/m2m/authenticate',
      m2m_credentials,
    )
    token = response.data.token
    cache.set('token', token)
  }
  return token
}

function getHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

async function getAllUsers() {
  const token = await getToken();
  const headers = getHeaders(token);

  const response = await axiosAdminClient.get('v1/users/all', {
    headers,
  });

  return response.data;
}



async function getAllCourses() {
  const token = await getToken();
  const headers = getHeaders(token);

  const response = await axiosAdminClient.get('v1/courses/all',{
      headers,
    });
    
  return response.data
}


module.exports = {getAllUsers, getAllCourses}
