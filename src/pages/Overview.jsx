// src/pages/Overview.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useWebSocketStore from '../store/websocketStore'
import Heatmap from '../components/Heatmap'
import ExpirySelector from '../components/ExpirySelector'
import EmailAlerts from '../components/EmailAlerts'
import { formatTime } from '../utils/formatters'
import '../styles/layout.css'

const Overview = () => {
  const navigate = useNavigate()
  const [riskFilter, setRiskFilter] = useState('all')
  
  const { liveData, selectedExpiry, alerts, lastUpdated, isConnected } = useWebSocketStore()
  const currentOptions = liveData[selectedExpiry] ?? []

  const filteredOptions = currentOptions.filter(option => {
    if (riskFilter === 'safe') return option.risk <= 50
    if (riskFilter === 'high') return option.risk > 75
    return true
  })

  const handleOptionClick = (strike, expiry) => {
    navigate(`/option/${strike}/${expiry}`)
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">

        {/* Header Section */}
        <header className="page-header">
          <div className="header-top">
            <h1 className="header-title">Options Risk Monitor</h1>
            
            <div className="header-controls">
              <div className="status-badge">
                {lastUpdated ? formatTime(lastUpdated) : '--:--'}
              </div>
              
              <div className="status-badge">
                <span className={`status-indicator ${isConnected ? 'live' : 'offline'}`} />
                {isConnected ? 'Live' : 'Disconnected'}
              </div>
            </div>
          </div>
          <div className="header-controls">
            <EmailAlerts />
            <div className="status-badge">
              {lastUpdated ? formatTime(lastUpdated) : '--:--'}
            </div>
            <div className="status-badge">
              <span className={`status-indicator ${isConnected ? 'live' : 'offline'}`} />
              {isConnected ? 'Live' : 'Disconnected'}
            </div>
          </div>
          {/* Alert Banner */}
          {alerts.length > 0 && (
            <div className="alert-banner" onClick={() => navigate('/alerts')}>
              <div className="alert-content">
                <span className="status-indicator live" />
                <span className="alert-text">
                  {alerts.length} option{alerts.length > 1 ? 's' : ''} in high risk zone
                </span>
              </div>
              <span className="alert-link">View All →</span>
            </div>
          )}
        </header>

        {/* Expiry Selector */}
        <div className="expiry-selector">
          <ExpirySelector />
        </div>

        {/* Risk Filter */}
        <div className="filter-container">
          <div className="filter-group">
            <button
              onClick={() => setRiskFilter('all')}
              className={`filter-button ${riskFilter === 'all' ? 'active' : ''}`}
            >
              All Options
            </button>
            <button
              onClick={() => setRiskFilter('safe')}
              className={`filter-button ${riskFilter === 'safe' ? 'active' : ''}`}
            >
              Safe (≤50)
            </button>
            <button
              onClick={() => setRiskFilter('high')}
              className={`filter-button ${riskFilter === 'high' ? 'active' : ''}`}
            >
              High Risk (>75)
            </button>
          </div>
        </div>

        {/* Heatmap */}
        <section className="section-gap-lg">
          <Heatmap
            options={filteredOptions}
            onOptionClick={handleOptionClick}
            expiry={selectedExpiry}
          />
        </section>


      </div>
    </div>
  )
}

export default Overview