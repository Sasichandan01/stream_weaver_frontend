// src/hooks/useMockWebSocket.js
import { useEffect } from 'react'
import useWebSocketStore from '../store/websocketStore'
import { generateMockPayload } from '../utils/mockWebSocket'

const useMockWebSocket = () => {
  const { setConnected, updateLiveData } = useWebSocketStore()

  useEffect(() => {
    setConnected(true)

    // Initial data
    updateLiveData(generateMockPayload())

    // Update every 3 seconds (simulate 60s in dev)
    const interval = setInterval(() => {
      updateLiveData(generateMockPayload())
    }, 3000)

    return () => clearInterval(interval)
  }, [])
}

export default useMockWebSocket