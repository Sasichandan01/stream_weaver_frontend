// src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react'
import useWebSocketStore from '../store/websocketStore'

const WS_URL = 'ws://your-backend-url/ws' // replace with your URL

const useWebSocket = () => {
  const wsRef = useRef(null)
  const { setConnected, updateLiveData, reset } = useWebSocketStore()

  useEffect(() => {
    const connect = () => {
      wsRef.current = new WebSocket(WS_URL)

      wsRef.current.onopen = () => {
        console.log('WebSocket connected')
        setConnected(true)
      }

      wsRef.current.onmessage = (event) => {
        const payload = JSON.parse(event.data)
        updateLiveData(payload)
      }

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected, retrying...')
        setConnected(false)
        // Auto reconnect after 3 seconds
        setTimeout(connect, 3000)
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        wsRef.current.close()
      }
    }

    connect()

    return () => {
      wsRef.current?.close()
      reset()
    }
  }, [])
}

export default useWebSocket