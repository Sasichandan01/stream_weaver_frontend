// src/store/websocketStore.js
import { create } from 'zustand'

const useWebSocketStore = create((set, get) => ({
  // Connection
  isConnected: false,
  ws: null,

  // Snapshot data (from WebSocket)
  expiries: {},
  timestamp: null,
  availableExpiries: [],
  selectedExpiry: null,
  alerts: [],

  // Active selection
  activeSymbol: null,
  activeExpiry: null,
  activeRange: '1D',

  // Chart data (from /api/history)
  chartData: [],

  // Live Greeks (from WebSocket greeks updates)
  liveGreeks: null,

  // Request ID for stale response handling
  reqId: 0,

  // Actions
  setWebSocket: (ws) => set({ ws }),
  
  setConnected: (status) => set({ isConnected: status }),

  setSelectedExpiry: (expiry) => set({ selectedExpiry: expiry }),

  incrementReqId: () => set((state) => ({ reqId: state.reqId + 1 })),

  // Handle snapshot from WebSocket
  handleSnapshot: (data) => set((state) => {
    const expiryKeys = Object.keys(data.expiries)
    
    // Transform data
    const transformedExpiries = {}
    const alerts = []

    expiryKeys.forEach((expiry) => {
      transformedExpiries[expiry] = data.expiries[expiry].map(option => ({
        symbol: option.symbol,
        strike: option.strike,
        type: option.type,
        ltp: option.price,
        risk: option.risk_score,
        recommendation: option.recommendation,
      }))

      // Extract alerts
      data.expiries[expiry].forEach((option) => {
        if (option.risk_score > 75) {
          alerts.push({
            symbol: option.symbol,
            strike: option.strike,
            expiry,
            risk: option.risk_score,
            recommendation: option.recommendation
          })
        }
      })
    })

    return {
      expiries: transformedExpiries,
      timestamp: data.timestamp,
      availableExpiries: expiryKeys,
      selectedExpiry: state.selectedExpiry || expiryKeys[0],
      alerts
    }
  }),

  // Handle live Greeks update from WebSocket
  handleGreeks: (data) => set({ liveGreeks: data }),

  // Set chart data from API
  setChartData: (data) => set({ chartData: data }),

  // Set active selection
  setActiveOption: (symbol, expiry, range = '1D') => set({
    activeSymbol: symbol,
    activeExpiry: expiry,
    activeRange: range
  }),

  // Subscribe to option
  subscribeToOption: (symbol, expiry) => {
    const { ws } = get()
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ subscribe: symbol, expiry }))
      console.log('📡 Subscribed to:', symbol, expiry)
    }
  },

  // Unsubscribe
  unsubscribe: () => {
    const { ws } = get()
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ unsubscribe: true }))
      console.log('📡 Unsubscribed from live updates')
    }
  },

  // Reset
  reset: () => set({
    isConnected: false,
    expiries: {},
    timestamp: null,
    availableExpiries: [],
    selectedExpiry: null,
    alerts: [],
    activeSymbol: null,
    activeExpiry: null,
    chartData: [],
    liveGreeks: null,
  }),
}))

export default useWebSocketStore