// src/store/websocketStore.js
import { create } from 'zustand'

const useWebSocketStore = create((set) => ({
  // Connection state
  isConnected: false,
  lastUpdated: null,

  // Expiry
  availableExpiries: [],
  selectedExpiry: null,

  // Live data per expiry
  // { "2025-02-20": [ ...40 options ] }
  liveData: {},

  // Alerts (risk > 75)
  alerts: [],

  // Actions
  setConnected: (status) => set({ isConnected: status }),

  setSelectedExpiry: (expiry) => set({ selectedExpiry: expiry }),

  updateLiveData: (payload) => set((state) => {
    const expiries = Object.keys(payload.expiries)

    // Extract alerts across all expiries
    const alerts = []
    expiries.forEach((expiry) => {
      payload.expiries[expiry].forEach((option) => {
        if (option.risk > 75) {
          alerts.push({ ...option, expiry })
        }
      })
    })

    return {
      liveData: payload.expiries,
      availableExpiries: expiries,
      selectedExpiry: state.selectedExpiry ?? expiries[0],
      lastUpdated: payload.timestamp,
      alerts,
    }
  }),

  // Clear on disconnect
  reset: () => set({
    isConnected: false,
    liveData: {},
    alerts: [],
    availableExpiries: [],
    selectedExpiry: null,
    lastUpdated: null,
  }),
}))

export default useWebSocketStore