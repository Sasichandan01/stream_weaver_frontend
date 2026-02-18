// src/pages/Alerts.jsx
import { useNavigate } from 'react-router-dom'
import useWebSocketStore from '../store/websocketStore'
import { getRiskColor } from '../utils/colors'
import { formatTime, formatExpiry } from '../utils/formatters'

const Alerts = () => {
  const navigate = useNavigate()
  const { alerts, lastUpdated } = useWebSocketStore()

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-[#737373] hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-white text-xl font-semibold">High Risk Alerts</h1>
        <span className="ml-auto text-[#737373] text-sm">
          {lastUpdated ? formatTime(lastUpdated) : '--'}
        </span>
      </div>

      {/* Alert List */}
      {alerts.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-[#737373]">No high risk options currently</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <div
              key={`${alert.strike}-${alert.expiry}`}
              onClick={() => navigate(`/option/${alert.strike}/${alert.expiry}`)}
              className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 
                         flex items-center justify-between cursor-pointer 
                         hover:border-[#3b82f6] transition-colors"
            >
              <div>
                <p className="text-white font-semibold">{alert.strike}</p>
                <p className="text-[#737373] text-sm">
                  Expiry: {formatExpiry(alert.expiry)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-xl font-bold"
                  style={{ color: getRiskColor(alert.risk) }}
                >
                  {alert.risk}
                </p>
                <p className="text-[#737373] text-xs">{alert.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Alerts