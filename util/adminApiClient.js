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

  const response = await axiosAdminClient.get('v1/users/all?type=Users::Student', {
    headers,
  });

  return response.data;
}

async function getAllCourses() {
  const token = await getToken();
  const headers = getHeaders(token);

  const response = await axiosAdminClient.get('v1/courses/all', {
    headers,
  });

  return response.data
}


async function getAllPeriods() {
  const token = await getToken();
  const headers = getHeaders(token);

  const response = await axiosAdminClient.get('v1/school_cycles/index', {
    headers,
  });

  return response.data
}

async function getUserGroups(cycle_id, user_ivd_id) {
  const token = await getToken()
  const headers = getHeaders(token)

  const response = await axiosAdminClient.get(
    'v1/school_cycles/user_groups_index', {
      headers,
      params: {
        id: cycle_id,
        user_ivd_id: user_ivd_id,
      },
    },
  )
  return response.data
}

async function getUser(ivd_id) {
  const token = await getToken()
  const headers = getHeaders(token)

  const response = await axiosAdminClient.get(
    'v1/users/find_one', {
      headers,
      params: {
        ivd_id: ivd_id,
      },
    },
  )
  return response.data
}

async function getAllAdmins() {
  const token = await getToken();
  const headers = getHeaders(token);

  const response = await axiosAdminClient.get('v1/users/all?type=Users::Administrator', {
    headers,
  });

  return response.data;
}


module.exports = {
  getAllUsers,
  getAllCourses,
  getAllPeriods,
  getUserGroups,
  getUser,
  getAllAdmins
}