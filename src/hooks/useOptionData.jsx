// // src/hooks/useOptionData.js
// import { useQuery } from '@tanstack/react-query'

// const API_URL = 'http://your-backend-url' // replace with your URL

// // Fetch historical data for selected option
// export const useOptionHistory = (strike, expiry, range = '1D') => {
//   return useQuery({
//     queryKey: ['optionHistory', strike, expiry, range],
//     queryFn: async () => {
//       const res = await fetch(
//         `${API_URL}/history?strike=${strike}&expiry=${expiry}&range=${range}`
//       )
//       return res.json()
//     },
//     enabled: !!strike && !!expiry,
//     staleTime: 60000, // 1 minute
//   })
// }

// // Fetch alerts history
// export const useAlertHistory = (expiry) => {
//   return useQuery({
//     queryKey: ['alerts', expiry],
//     queryFn: async () => {
//       const res = await fetch(`${API_URL}/alerts?expiry=${expiry}`)
//       return res.json()
//     },
//     enabled: !!expiry,
//     staleTime: 60000,
//   })
// }

// src/pages/OptionDetail.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useWebSocketStore from '../store/websocketStore'
import { useMockOptionHistory } from './useMockOptionData'  // ← Mock
import RiskChart from '../components/RiskChart'
import PriceChart from '../components/PriceChart'
import GreeksChart from '../components/GreeksChart'
import { getRiskColor } from '../utils/colors'
import { formatExpiry } from '../utils/formatters'

const RANGES = ['1D', '1W', '2W', '1M']

const OptionDetail = () => {
  const { strike, expiry } = useParams()
  const navigate = useNavigate()
  const [selectedRange, setSelectedRange] = useState('1D')
  const [activeChart, setActiveChart] = useState('risk')

  const { liveData } = useWebSocketStore()
  const currentOption = liveData[expiry]?.find(o => o.strike === strike)

  // Use mock historical data
  const { data: history, isLoading } = useMockOptionHistory(strike, expiry, selectedRange)

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4">

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-[#737373] hover:text-white transition-colors"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-white text-xl font-semibold">{strike}</h1>
          <p className="text-[#737373] text-sm">Expiry: {formatExpiry(expiry)}</p>
        </div>
        {currentOption && (
          <div className="ml-auto text-right">
            <p
              className="text-2xl font-bold"
              style={{ color: getRiskColor(currentOption.risk) }}
            >
              {currentOption.risk}
            </p>
            <p className="text-[#737373] text-sm">Risk Score</p>
          </div>
        )}
      </div>

      {currentOption && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'LTP', value: currentOption.ltp.toFixed(2) },
            { label: 'Delta', value: currentOption.delta.toFixed(3) },
            { label: 'Theta', value: currentOption.theta.toFixed(3) },
            { label: 'IV', value: currentOption.iv.toFixed(2) },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#141414] rounded-lg p-3 border border-[#2a2a2a]">
              <p className="text-[#737373] text-xs mb-1">{stat.label}</p>
              <p className="text-white font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRange(r)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedRange === r
                ? 'bg-[#3b82f6] text-white'
                : 'bg-[#141414] text-[#737373] border border-[#2a2a2a]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4 border-b border-[#2a2a2a]">
        {['risk', 'price', 'greeks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveChart(tab)}
            className={`pb-2 text-sm capitalize transition-colors ${
              activeChart === tab
                ? 'text-white border-b-2 border-[#3b82f6]'
                : 'text-[#737373]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-[#737373]">Loading...</p>
        </div>
      ) : (
        <div className="bg-[#141414] rounded-lg p-4 border border-[#2a2a2a]">
          {activeChart === 'risk' && <RiskChart data={history} />}
          {activeChart === 'price' && <PriceChart data={history} />}
          {activeChart === 'greeks' && <GreeksChart data={history} />}
        </div>
      )}

    </div>
  )
}

export default OptionDetail