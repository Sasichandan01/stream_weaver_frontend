// src/pages/Overview.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useWebSocketStore from '../store/websocketStore'
import Heatmap from '../components/Heatmap'
import AlertBanner from '../components/AlertBanner'
import ExpirySelector from '../components/ExpirySelector'
import { formatTime } from '../utils/formatters'

const Overview = () => {
  const navigate = useNavigate()
  const { liveData, selectedExpiry, alerts, lastUpdated, isConnected } = useWebSocketStore()

  const currentOptions = liveData[selectedExpiry] ?? []

  const handleOptionClick = (strike, expiry) => {
    navigate(`/option/${strike}/${expiry}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 flex justify-center">
      
      {/* Center Container with max width and side borders */}
      <div className="w-full max-w-7xl border-l-2 border-r-2 border-[#2a2a2a] px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 pt-4">
          <div>
            <h1 className="text-white text-xl font-semibold">Options Risk Monitor</h1>
            <p className="text-[#737373] text-sm">
              Last updated: {lastUpdated ? formatTime(lastUpdated) : '--'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} />
            <span className="text-[#737373] text-sm">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && <AlertBanner alerts={alerts} />}

        {/* Expiry Selector */}
        <ExpirySelector />

        {/* Heatmap */}
        <Heatmap
          options={currentOptions}
          onOptionClick={handleOptionClick}
          expiry={selectedExpiry}
        />

      </div>
    </div>
  )
}

export default Overview