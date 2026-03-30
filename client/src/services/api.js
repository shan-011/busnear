import axios from 'axios'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export const fetchAllRoutes = async () => {
  try {
    const res = await axios.get(`${BASE}/api/routes`)
    return res.data
  } catch (err) {
    console.error('Failed to fetch routes:', err.message)
    return { routes: [] }
  }
}

export const fetchRouteByNumber = async (routeNo) => {
  try {
    const res = await axios.get(`${BASE}/api/routes/${routeNo}`)
    return res.data
  } catch (err) {
    console.error('Failed to fetch route:', err.message)
    return null
  }
}

export const searchRoutes = async (query) => {
  try {
    const res = await axios.get(`${BASE}/api/routes/search`, {
      params: { q: query }
    })
    return res.data
  } catch (err) {
    console.error('Search failed:', err.message)
    return { routes: [] }
  }
}

export const sendSOS = async (data) => {
  try {
    const res = await axios.post(`${BASE}/api/sms/sos`, data)
    return res.data
  } catch (err) {
    console.error('SOS failed:', err.message)
    throw err
  }
}

export const requestScheduleSMS = async (phone, routeNo) => {
  try {
    const res = await axios.post(`${BASE}/api/sms/schedule`, { phone, routeNo })
    return res.data
  } catch (err) {
    console.error('Schedule SMS failed:', err.message)
    throw err
  }
}
