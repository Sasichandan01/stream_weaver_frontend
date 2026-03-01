// src/utils/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Change timeout from 10s to 5s:
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,  // 5 seconds instead of 10
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request ID counter
let requestIdCounter = 0

export const generateReqId = () => {
  requestIdCounter += 1
  return requestIdCounter
}

export const fetchSnapshot = async () => {
  const response = await api.get('/api/snapshot')
  return response.data
}

export const fetchLatest = async (symbol, expiry, reqId) => {
  const response = await api.get('/api/latest', {
    params: { symbol, expiry, reqId }
  })
  return response.data
}

export const fetchHistory = async (symbol, expiry, range, reqId) => {
  const response = await api.get('/api/history', {
    params: { symbol, expiry, range, reqId }
  })
  return response.data
}

export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api